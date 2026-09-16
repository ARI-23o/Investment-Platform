// Export Enquiries to Excel compatible CSV
export function exportToCSV(data, filename = `gsp_leads_${new Date().toISOString().slice(0,10)}.csv`) {
  if (!data || !data.length) {
    alert("No enquiries to export yet!");
    return;
  }

  const headers = [
    "Enquiry ID",
    "Timestamp",
    "Type",
    "Stock / Product",
    "Quantity",
    "Customer Name",
    "Mobile Number",
    "Email Address",
    "PAN Number",
    "Service Requested",
    "Message / Notes",
    "Status"
  ];

  const rows = data.map((item) => {
    return [
      `"${item.id || ""}"`,
      `"${item.time || new Date().toLocaleString()}"`,
      `"${(item.type || "BUY").toUpperCase()}"`,
      `"${(item.title || item.share || "General Enquiry").replace(/"/g, '""')}"`,
      `"${item.quantity || 1}"`,
      `"${(item.fullName || item.name || "").replace(/"/g, '""')}"`,
      `"${item.mobile || ""}"`,
      `"${item.email || ""}"`,
      `"${item.pan || ""}"`,
      `"${(item.service || "").replace(/"/g, '""')}"`,
      `"${(item.message || "").replace(/"/g, '""')}"`,
      `"${item.status || "Received"}"`
    ];
  });

  const csvString = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  
  // Use UTF-8 BOM so Excel opens it with proper encoding
  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export Unlisted Shares Catalog to CSV (ready to upload to Google Sheets)
export function exportSharesToCSV(shares, filename = `gsp_unlisted_shares_catalog.csv`) {
  if (!shares || !shares.length) return;
  const headers = [
    "Name",
    "Short Name",
    "Price",
    "Lot Size",
    "Available Quantity",
    "Image URL",
    "Category",
    "ISIN",
    "Status",
    "52W High",
    "52W Low",
    "Market Cap",
    "Description",
    "Popular"
  ];

  const rows = shares.map((s) => [
    `"${(s.name || "").replace(/"/g, '""')}"`,
    `"${(s.shortName || "").replace(/"/g, '""')}"`,
    `"${s.price !== undefined ? s.price : 0}"`,
    `"${s.lotSize || 100}"`,
    `"${(s.availableQty || "Available on Desk").replace(/"/g, '""')}"`,
    `"${(s.image || "").replace(/"/g, '""')}"`,
    `"${(s.category || "Unlisted Shares").replace(/"/g, '""')}"`,
    `"${(s.isin || "").replace(/"/g, '""')}"`,
    `"${(s.status || "UNLISTED").replace(/"/g, '""')}"`,
    `"${(s.high52 || "").replace(/"/g, '""')}"`,
    `"${(s.low52 || "").replace(/"/g, '""')}"`,
    `"${(s.marketCap || "").replace(/"/g, '""')}"`,
    `"${(s.description || "").replace(/"/g, '""').replace(/\r?\n|\r/g, " ")}"`,
    `"${s.popular ? "true" : "false"}"`
  ]);

  const csvString = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Rock-solid clipboard copy helper with fallback for all browsers and HTTP contexts
export async function copyToClipboardSafe(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // Fall back to document.execCommand
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return !!successful;
  } catch (err) {
    console.warn("Fallback clipboard copy failed:", err);
    return false;
  }
}

// Retrieve Saved Google Sheet Webhook with multiple persistent layers
export function getSavedWebhookUrl() {
  const local = localStorage.getItem("gsp_google_sheet_webhook");
  if (local && local.trim()) return local.trim();

  try {
    const settings = JSON.parse(localStorage.getItem("gsp_settings") || "{}");
    if (settings.googleSheetWebhook && settings.googleSheetWebhook.trim()) {
      localStorage.setItem("gsp_google_sheet_webhook", settings.googleSheetWebhook.trim());
      return settings.googleSheetWebhook.trim();
    }
  } catch (e) {}

  return "";
}

// Send Lead to Google Form or Google Sheet Webhook via Secure Gateway (Server-Side Proxy)
export async function syncLeadToGoogleSheet(leadData) {
  // 1. PRIMARY: Route via Secure Server-Side PHP Gateway (hides Google URL from browser)
  try {
    const gatewayRes = await fetch("/api/sheets-gateway.php?action=sync_lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead: leadData }),
    });
    if (gatewayRes.ok) {
      const result = await gatewayRes.json();
      if (result && result.success) {
        return { synced: true, message: result.message };
      }
    }
  } catch (gatewayErr) {
    // Gateway endpoint unreachable (e.g., local dev), proceed to client-side fallback
  }

  // 2. FALLBACK: Direct Client-Side Sync
  let webhookUrl = getSavedWebhookUrl();

  // If not found in cache, attempt a fast background fetch from central settings
  if (!webhookUrl) {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.googleSheetWebhook) {
          webhookUrl = data.googleSheetWebhook.trim();
          localStorage.setItem("gsp_google_sheet_webhook", webhookUrl);
          localStorage.setItem("gsp_settings", JSON.stringify(data));
        }
      }
    } catch (e) {}
  }

  if (!webhookUrl || !webhookUrl.trim()) {
    console.log("No Google Sheet Webhook configured. Saved locally & to backend only.");
    return { synced: false, reason: "No webhook configured" };
  }

  try {
    // Standard Google Apps Script Web App or Google Form format
    const formData = new URLSearchParams();
    formData.append("timestamp", new Date().toLocaleString());
    formData.append("type", leadData.type || "Enquiry");
    formData.append("share", leadData.title || leadData.share || "General Enquiry");
    formData.append("quantity", leadData.quantity || "1");
    formData.append("fullName", leadData.fullName || leadData.name || "");
    formData.append("mobile", leadData.mobile || "");
    formData.append("email", leadData.email || "");
    formData.append("message", leadData.message || "");
    formData.append("pan", leadData.pan || "");
    formData.append("service", leadData.service || "");

    // Mode no-cors avoids browser CORS preflight blocking Google servers
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    console.log("Successfully dispatched lead row to Google Sheet:", webhookUrl);
    return { synced: true };
  } catch (err) {
    console.error("Failed to sync lead to Google:", err);
    return { synced: false, error: err };
  }
}
