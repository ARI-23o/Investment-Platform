import { UNLISTED_SHARES } from "../data/sharesData";
import { getSavedWebhookUrl } from "../utils/exportUtils";

const CACHE_KEY = "gsp_dynamic_unlisted_shares";
const LAST_FETCH_KEY = "gsp_dynamic_unlisted_last_sync";

export function normalizeProductFromSheet(row, index = 0) {
  if (!row) return null;

  const rawName = row.name || row["share name"] || row["share_name"] || row.title || row.product || row["company name"] || row["company_name"] || "";
  if (!rawName || !rawName.toString().trim()) return null;

  const name = rawName.toString().trim();
  const shortName = (row.shortName || row["short name"] || row["short_name"] || row.shortname || row.code || name.split(" ")[0]).toString().trim();
  const rawId = (row.id || row.code || shortName || ("share_" + (index + 1))).toString().trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const code = (row.code || row.ticker || shortName).toString().trim().toUpperCase();

  const rawPrice = row.price || row["share price"] || row["share_price"] || row.rate || 0;
  const price = typeof rawPrice === "number" ? rawPrice : parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;

  const rawLot = row.lotSize || row["lot size"] || row["lot_size"] || row.lot || row["min qty"] || row["min_qty"] || 1;
  const lotSize = typeof rawLot === "number" ? rawLot : parseInt(String(rawLot).replace(/[^0-9]/g, ""), 10) || 1;
  
  const availableQty = (row.availableQty || row["available quantity"] || row["available_quantity"] || row["available qty"] || row["available_qty"] || row.qty || row["total shares"] || "").toString().trim();

  const image = (row.image || row["image url"] || row["image_url"] || row.imageurl || row.logo || row.photo || "").toString().trim();

  const category = (row.category || row.sector || "Unlisted Shares").toString().trim();
  const sector = (row.sector || row.category || "Financial Services").toString().trim();

  const isin = (row.isin || row["isin code"] || row["isin_code"] || "").toString().trim();
  const status = (row.status || "ACTIVE").toString().trim().toUpperCase();

  const rawHigh52 = (row.high52 || row["52w high"] || row["52w_high"] || row["52 high"] || "").toString().trim();
  const high52 = rawHigh52 ? (rawHigh52.startsWith("₹") ? rawHigh52 : "₹" + rawHigh52) : "";

  const rawLow52 = (row.low52 || row["52w low"] || row["52w_low"] || row["52 low"] || "").toString().trim();
  const low52 = rawLow52 ? (rawLow52.startsWith("₹") ? rawLow52 : "₹" + rawLow52) : "";

  const rawMarketCap = (row.marketCap || row["market cap"] || row["market_cap"] || row.mcap || "").toString().trim();
  const marketCap = rawMarketCap ? (rawMarketCap.startsWith("₹") ? rawMarketCap : "₹" + rawMarketCap) : "";

  const description = (row.description || row.about || (name + " is an emerging unlisted growth opportunity available for private secondary trading.")).toString().trim();
  
  const rawPopular = row.popular || row.featured || row.hot || false;
  const popular = typeof rawPopular === "boolean" 
    ? rawPopular 
    : ["true", "yes", "1", "popular"].includes(String(rawPopular).trim().toLowerCase());

  return {
    id: rawId,
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
    color: "emerald"
  };
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
  const webhookUrl = customUrl || getSavedWebhookUrl();
  
  if (!webhookUrl || !webhookUrl.trim()) {
    return {
      success: false,
      reason: "No Google Sheet Webhook configured yet.",
      products: getLocalUnlistedShares(),
      isDefault: true
    };
  }

  try {
    const separator = webhookUrl.includes("?") ? "&" : "?";
    const fetchUrl = webhookUrl + separator + "action=products&t=" + Date.now();

    const res = await fetch(fetchUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!res.ok) {
      throw new Error("HTTP Error " + res.status);
    }

    const data = await res.json();
    let rawList = [];

    if (Array.isArray(data)) {
      rawList = data;
    } else if (data && Array.isArray(data.products)) {
      rawList = data.products;
    } else if (data && Array.isArray(data.data)) {
      rawList = data.data;
    }

    if (rawList.length > 0) {
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
      message: "No rows found in Unlisted product sheet tab. Displaying catalog.",
      isDefault: true
    };

  } catch (err) {
    console.warn("Error fetching dynamic products from Google Sheet:", err);
    return {
      success: false,
      error: err.message,
      products: getLocalUnlistedShares(),
      isDefault: true
    };
  }
}
