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

// Send Lead to Google Form or Google Sheet Webhook in Background (Permanent Sync)
export async function syncLeadToGoogleSheet(leadData) {
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
