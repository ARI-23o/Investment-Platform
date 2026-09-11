import { UNLISTED_SHARES } from "../data/sharesData";
import { getSavedWebhookUrl } from "../utils/exportUtils";

const CACHE_KEY = "gsp_dynamic_unlisted_shares";
const LAST_FETCH_KEY = "gsp_dynamic_unlisted_last_sync";

// Flexible field extractor for any column header naming variation
function getField(obj, ...possibleKeys) {
  if (!obj || typeof obj !== "object") return "";
  const cleanMap = {};
  for (const k of Object.keys(obj)) {
    const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, "");
    cleanMap[cleanKey] = obj[k];
  }
  for (const p of possibleKeys) {
    const cleanP = p.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanMap[cleanP] !== undefined && cleanMap[cleanP] !== null && String(cleanMap[cleanP]).trim() !== "") {
      return cleanMap[cleanP];
    }
  }
  return "";
}

// Find existing logo placeholder from default static shares if available
function findFallbackImage(name, shortName, code) {
  const match = UNLISTED_SHARES.find(
    (s) =>
      (s.name && s.name.toLowerCase() === name.toLowerCase()) ||
      (s.shortName && s.shortName.toLowerCase() === (shortName || "").toLowerCase()) ||
      (s.code && s.code.toLowerCase() === (code || "").toLowerCase())
  );
  if (match && match.image) return match.image;
  return "";
}

export function normalizeProductFromSheet(row, index = 0) {
  if (!row) return null;

  const rawName = getField(row, "name", "share name", "share_name", "company name", "company", "title", "product", "stock");
  if (!rawName || !String(rawName).trim()) return null;

  const name = String(rawName).trim();
  const rawShort = getField(row, "short name", "short_name", "shortname", "code", "ticker", "symbol");
  const shortName = rawShort ? String(rawShort).trim() : name.split(" ")[0];

  const rawId = getField(row, "id", "code", "isin") || shortName || ("share_" + (index + 1));
  const id = String(rawId).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const code = (getField(row, "code", "ticker", "symbol") || shortName).toString().trim().toUpperCase();

  const rawPrice = getField(row, "price", "share price", "share_price", "rate", "cmp", "current price", "price inr", "share price inr");
  const price = typeof rawPrice === "number" ? rawPrice : parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;

  const rawLot = getField(row, "lot size", "lot_size", "lot", "min qty", "min_qty", "min quantity", "minimum quantity");
  const lotSize = typeof rawLot === "number" ? rawLot : parseInt(String(rawLot).replace(/[^0-9]/g, ""), 10) || 100;

  const availableQty = String(getField(row, "available quantity", "available_quantity", "available qty", "available_qty", "available", "qty", "quantity", "total shares") || "Available on Desk").trim();

  let image = String(getField(row, "image url", "image_url", "image", "imageurl", "logo", "logo url", "photo", "icon")).trim();
  if (!image) {
    image = findFallbackImage(name, shortName, code);
  }

  const category = String(getField(row, "category", "sector", "industry", "type") || "Unlisted Shares").trim();
  const sector = String(getField(row, "sector", "category", "industry") || "Financial Services").trim();
  const isin = String(getField(row, "isin", "isin code", "isin_code", "isin number") || "").trim();
  const status = String(getField(row, "status", "active") || "ACTIVE").trim().toUpperCase();

  const rawHigh52 = String(getField(row, "52w high", "52w_high", "52 high", "high52", "high") || "").trim();
  const high52 = rawHigh52 ? (rawHigh52.startsWith("₹") ? rawHigh52 : "₹" + rawHigh52) : "";

  const rawLow52 = String(getField(row, "52w low", "52w_low", "52 low", "low52", "low") || "").trim();
  const low52 = rawLow52 ? (rawLow52.startsWith("₹") ? rawLow52 : "₹" + rawLow52) : "";

  const rawMarketCap = String(getField(row, "market cap", "market_cap", "marketcap", "mcap", "market capitalization") || "").trim();
  const marketCap = rawMarketCap ? (rawMarketCap.startsWith("₹") ? rawMarketCap : "₹" + rawMarketCap) : "";

  const description = String(getField(row, "description", "about", "overview", "details") || `${name} is an unlisted growth opportunity available for private secondary trading.`).trim();

  const rawPopular = getField(row, "popular", "featured", "hot", "trending", "is popular");
  const popular = typeof rawPopular === "boolean"
    ? rawPopular
    : ["true", "yes", "1", "popular", "hot"].includes(String(rawPopular).trim().toLowerCase());

  return {
    id,
    name,
    shortName,
    code,
    category,
    sector,
    price,
    indicative: true,
    lotSize,
    availableQty,
    image,
    isin,
    status,
    high52,
    low52,
    marketCap,
    popular,
    description,
    color: "emerald",
    isFromSheet: true,
    isNew: true,
    createdAt: Date.now()
  };
}

// Parse Google Visualization API output
function parseGVizResponse(text) {
  try {
    const startIdx = text.indexOf("{");
    const endIdx = text.lastIndexOf("}");
    if (startIdx === -1 || endIdx === -1) return [];
    const json = JSON.parse(text.substring(startIdx, endIdx + 1));
    const table = json.table;
    if (!table || !table.cols || !table.rows) return [];

    const headers = table.cols.map((c, i) => (c && c.label ? c.label.trim() : (c && c.id ? c.id.trim() : `Col_${i}`)));
    const items = [];
    for (const row of table.rows) {
      if (!row || !row.c) continue;
      const rowObj = {};
      let hasData = false;
      row.c.forEach((cell, idx) => {
        const header = headers[idx] || `Col_${idx}`;
        const val = cell && cell.v !== null && cell.v !== undefined ? cell.v : (cell && cell.f ? cell.f : "");
        rowObj[header] = val;
        if (val) hasData = true;
      });
      if (hasData) {
        items.push(rowObj);
      }
    }
    return items;
  } catch (e) {
    console.warn("GViz parser error:", e);
    return [];
  }
}

// Parse CSV output
function parseCSVResponse(csvText) {
  if (!csvText || !csvText.trim()) return [];
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parseLine = (text) => {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (!values.some((v) => v.length > 0)) continue;
    const obj = {};
    headers.forEach((h, idx) => {
      if (h) obj[h] = values[idx] || "";
    });
    rows.push(obj);
  }
  return rows;
}

export function getLocalUnlistedShares() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load cached unlisted shares:", err);
  }
  return UNLISTED_SHARES;
}

export async function fetchUnlistedSharesFromSheet(customUrl = null) {
  const webhookUrl = (customUrl || getSavedWebhookUrl() || "").trim();

  if (!webhookUrl) {
    return {
      success: false,
      reason: "No Google Sheet URL or Webhook configured.",
      products: getLocalUnlistedShares(),
      isDefault: true
    };
  }

  try {
    let rawList = [];

    // CASE 1: Direct Google Sheet URL (docs.google.com/spreadsheets/d/...)
    const sheetIdMatch = webhookUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (sheetIdMatch && sheetIdMatch[1]) {
      const sheetId = sheetIdMatch[1];
      const sheetNames = ["Unlisted product", "Unlisted Product", "Products", "Shares", "Sheet1"];
      
      let fetchSuccess = false;
      // Try GViz for common sheet tab names
      for (const tabName of sheetNames) {
        try {
          const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}&t=${Date.now()}`;
          const res = await fetch(gvizUrl, { cache: "no-store" });
          if (res.ok) {
            const text = await res.text();
            const parsed = parseGVizResponse(text);
            if (parsed && parsed.length > 0) {
              rawList = parsed;
              fetchSuccess = true;
              break;
            }
          }
        } catch (e) {
          // continue to next candidate
        }
      }

      // Fallback: Try general CSV export
      if (!fetchSuccess) {
        try {
          const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&t=${Date.now()}`;
          const res = await fetch(csvUrl, { cache: "no-store" });
          if (res.ok) {
            const text = await res.text();
            const parsed = parseCSVResponse(text);
            if (parsed && parsed.length > 0) {
              rawList = parsed;
            }
          }
        } catch (e) {
          console.warn("CSV export fetch failed:", e);
        }
      }
    } 
    // CASE 2: Google Apps Script Web App (script.google.com/macros/s/...)
    else {
      const separator = webhookUrl.includes("?") ? "&" : "?";
      const fetchUrl = webhookUrl + separator + "action=products&t=" + Date.now();

      const res = await fetch(fetchUrl, {
        method: "GET",
        cache: "no-store",
        redirect: "follow"
      });

      if (!res.ok) {
        throw new Error("HTTP Error " + res.status);
      }

      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        // If not JSON, check if it's GViz or CSV text
        data = parseGVizResponse(text);
        if (!data || data.length === 0) {
          data = parseCSVResponse(text);
        }
      }

      if (Array.isArray(data)) {
        rawList = data;
      } else if (data && Array.isArray(data.products)) {
        rawList = data.products;
      } else if (data && Array.isArray(data.data)) {
        rawList = data.data;
      } else if (data && Array.isArray(data.rows)) {
        rawList = data.rows;
      } else if (data && Array.isArray(data.items)) {
        rawList = data.items;
      } else if (data && Array.isArray(data.shares)) {
        rawList = data.shares;
      }
    }

    if (rawList && rawList.length > 0) {
      const normalized = rawList.map((item, idx) => normalizeProductFromSheet(item, idx)).filter(Boolean);

      if (normalized.length > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
        localStorage.setItem(LAST_FETCH_KEY, new Date().toISOString());

        window.dispatchEvent(new CustomEvent("unlisted-shares-updated", { detail: normalized }));

        return {
          success: true,
          count: normalized.length,
          products: normalized,
          lastSync: new Date().toISOString(),
          isDefault: false
        };
      }
    }

    return {
      success: true,
      count: 0,
      products: getLocalUnlistedShares(),
      message: "No valid product rows found in Google Sheet. Showing default catalog.",
      isDefault: true
    };
  } catch (err) {
    console.warn("Dynamic Google Sheet fetch warning:", err);
    return {
      success: false,
      error: err.message,
      products: getLocalUnlistedShares(),
      isDefault: true
    };
  }
}
