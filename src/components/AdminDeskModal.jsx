import React, { useState, useEffect } from "react";
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Lock, 
  KeyRound, 
  Settings, 
  Send, 
  ExternalLink,
  ShieldAlert,
  Copy,
  Check,
  RotateCw,
  Package,
  Layers,
  Sparkles,
  ArrowUpDown
} from "lucide-react";
import { exportToCSV, syncLeadToGoogleSheet, getSavedWebhookUrl } from "../utils/exportUtils";
import { fetchSettingsFromBackend, saveSettingsToBackend } from "../services/api";
import { getLocalUnlistedShares, fetchUnlistedSharesFromSheet } from "../services/unlistedSharesService";

export default function AdminDeskModal({ isOpen, onClose, enquiries, onClearAll, onDeleteOne, onRefresh }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [activeTab, setActiveTab] = useState("leads"); // 'leads', 'products', or 'google-sheets'
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Google Sheet Webhook URL state with persistent multi-layer load
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return getSavedWebhookUrl();
  });
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [testStatus, setTestStatus] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHeaders, setCopiedHeaders] = useState(false);

  // Products sync state
  const [syncedProducts, setSyncedProducts] = useState(getLocalUnlistedShares);
  const [isSyncingProducts, setIsSyncingProducts] = useState(false);
  const [productSyncMsg, setProductSyncMsg] = useState("");

  // Sync settings whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSyncedProducts(getLocalUnlistedShares());
      fetchSettingsFromBackend().then((settings) => {
        if (settings && settings.googleSheetWebhook) {
          setWebhookUrl(settings.googleSheetWebhook);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminPin === "admin123" || adminPin === "1234" || adminPin.toLowerCase() === "admin") {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Invalid Admin PIN. Please check and try again.");
    }
  };

  const handleSaveWebhook = async (e) => {
    e.preventDefault();
    const cleanUrl = webhookUrl.trim();
    localStorage.setItem("gsp_google_sheet_webhook", cleanUrl);
    await saveSettingsToBackend({ googleSheetWebhook: cleanUrl });
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3500);
  };

  const handleSendTestLead = async () => {
    if (!webhookUrl) {
      alert("Please paste your Google Sheet Webhook URL first.");
      return;
    }
    setTestStatus("Sending test row to your Google Sheet...");
    const res = await syncLeadToGoogleSheet({
      type: "TEST LEAD",
      title: "Hindustan Power Exchange Limited (HPX)",
      quantity: 500,
      fullName: "Test Investor (Via Admin Desk)",
      mobile: "+91 9876543210",
      email: "test@example.com",
      service: "Unlisted Shares",
      message: "Testing real-time Google Sheet sync from GSP Investment Portal",
    });
    setTestStatus("✅ Row dispatched to Google Sheet! Check your sheet.");
    setTimeout(() => setTestStatus(""), 4000);
  };

  const handleSyncProductsNow = async () => {
    setIsSyncingProducts(true);
    setProductSyncMsg("Connecting to your Google Sheet...");
    try {
      const items = await fetchUnlistedSharesFromSheet(webhookUrl);
      setSyncedProducts(items);
      setProductSyncMsg(`✅ Successfully synced ${items.length} unlisted shares from Google Sheet!`);
    } catch (err) {
      setProductSyncMsg("⚠️ Could not load from sheet. Fallback default products are active.");
    } finally {
      setIsSyncingProducts(false);
      setTimeout(() => setProductSyncMsg(""), 5000);
    }
  };

  const sheetHeadersList = [
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

  const sheetHeadersString = sheetHeadersList.join("\t");

  // Filtered Leads
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesSearch = 
      (item.fullName || item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.mobile || "").includes(searchQuery) ||
      (item.title || item.share || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const sampleAppsScriptCode = `// ─────────────────────────────────────────────────────────────
// 2-WAY SYNC GOOGLE APPS SCRIPT FOR GSP INVESTMENT PLATFORM
// 1. doGet: Reads Unlisted Products from tab "Unlisted product"
// 2. doPost: Appends customer leads to tab "Enquiries"
// ─────────────────────────────────────────────────────────────

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Locate the Unlisted product sheet tab
    var sheet = ss.getSheetByName("Unlisted product") || 
                ss.getSheetByName("Unlisted Product") || 
                ss.getSheetByName("Products") || 
                ss.getSheets()[1] || 
                ss.getSheets()[0];
                
    var data = sheet.getDataRange().getValues();
    if (!data || data.length < 2) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        count: 0,
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = data[0].map(function(h) {
      return String(h || "").trim();
    });
    
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      // Skip empty row if name is blank
      if (!row[0] && !row[1]) continue;
      
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        var headerKey = headers[j];
        if (headerKey) {
          obj[headerKey] = row[j] !== undefined && row[j] !== null ? row[j] : "";
        }
      }
      rows.push(obj);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: rows.length,
      data: rows
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Appends enquiry leads to "Enquiries" tab or first sheet
    var sheet = ss.getSheetByName("Enquiries") || 
                ss.getSheetByName("enquiries") || 
                ss.getSheets()[0];
    
    var params = e.parameter || {};
    if (e.postData && e.postData.contents) {
      try {
        var body = JSON.parse(e.postData.contents);
        for (var k in body) {
          params[k] = body[k];
        }
      } catch (e2) {}
    }
    
    sheet.appendRow([
      new Date(),
      params.type || "Enquiry",
      params.share || "",
      params.quantity || "",
      params.fullName || "",
      params.mobile || "",
      params.email || "",
      params.service || "",
      params.message || "",
      params.pan || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 relative overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#031d13] via-[#063321] to-[#0a482e] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 font-bold border border-white/10">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  Central Admin Desk & Enquiries
                </h3>
                <span className="bg-amber-400 text-gray-950 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Central Server Database • Synced Real-Time Across All Browsers & Devices</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                Staff / Admin Authentication
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                To protect customer privacy, inquiries are hidden from regular website users. Enter admin PIN to access the Excel export & Google Sheet tools.
              </p>
            </div>

            <form onSubmit={handleAdminAuth} className="space-y-3">
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Enter Admin PIN
                </label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder=""
                  autoFocus
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none font-mono"
                />
              </div>

              {pinError && (
                <div className="text-xs text-rose-600 font-semibold text-left">
                  {pinError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold bg-[#0a482e] hover:bg-[#063321] text-white transition-all cursor-pointer shadow-md"
              >
                Unlock Admin Desk →
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Desk */
          <>
            {/* Top Toolbar Tabs */}
            <div className="px-6 pt-4 pb-3 border-b border-gray-100 bg-gray-50/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("leads")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "leads"
                      ? "bg-white text-emerald-950 shadow-xs border border-gray-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  📋 All Enquiries ({enquiries.length})
                </button>

                <button
                  onClick={() => setActiveTab("products")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "products"
                      ? "bg-white text-emerald-950 shadow-xs border border-gray-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Unlisted Products ({syncedProducts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("google-sheets")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "google-sheets"
                      ? "bg-white text-emerald-950 shadow-xs border border-gray-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Google Sheet 2-Way Sync</span>
                </button>
              </div>

              {/* Actions Button Group */}
              {activeTab === "leads" && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onRefresh}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-gray-700 hover:text-emerald-900 border border-gray-200 hover:bg-emerald-50 transition-all cursor-pointer shadow-xs"
                    title="Reload latest enquiries from central server"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Refresh Server Data</span>
                  </button>

                  <button
                    onClick={() => exportToCSV(enquiries)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#107c41] hover:bg-[#0c6233] text-white shadow-sm transition-all cursor-pointer hover:shadow-md"
                    title="Download full inquiries table as Excel compatible CSV"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Excel (.CSV)</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: ALL LEADS LIST */}
            {activeTab === "leads" && (
              <div className="p-6 flex-1 overflow-hidden flex flex-col">
                
                {/* Search & Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by customer name, mobile, stock..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">Type:</span>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="bg-white border border-gray-200 text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer"
                    >
                      <option value="all">All Enquiries</option>
                      <option value="buy">Buy Requests</option>
                      <option value="sell">Sell Offers</option>
                      <option value="callback">Callback Requests</option>
                      <option value="account">Demat Accounts</option>
                    </select>
                  </div>
                </div>

                {/* Enquiries Table/Cards */}
                <div className="overflow-y-auto flex-1 space-y-3 pr-1">
                  {filteredEnquiries.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-30 text-emerald-800" />
                      <p className="text-sm font-semibold text-gray-600">No matching inquiries found.</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Submit a test enquiry from the home page or click "Download Excel" when entries arrive!
                      </p>
                    </div>
                  ) : (
                    filteredEnquiries.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col gap-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              item.type === "sell" 
                                ? "bg-rose-100 text-rose-800" 
                                : item.type === "callback" 
                                ? "bg-blue-100 text-blue-800"
                                : item.type === "account"
                                ? "bg-purple-100 text-purple-800"
                                : item.type === "career"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-emerald-100 text-emerald-800"
                            }`}>
                              {item.type === "career" ? "JOB APPLICATION" : (item.type ? item.type.toUpperCase() : "BUY")}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {item.title || item.share || "General Enquiry"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.time || "Just now"}
                            </span>
                            <button
                              onClick={() => onDeleteOne(idx)}
                              className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Customer Details Columns */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Customer</span>
                            <strong className="text-gray-900">{item.fullName || item.name || "N/A"}</strong>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Contact</span>
                            <a href={`tel:${item.mobile}`} className="text-emerald-800 font-bold hover:underline">
                              {item.mobile || "N/A"}
                            </a>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Email</span>
                            <span className="text-gray-700 truncate block">{item.email || "—"}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">
                              {item.quantity ? "Quantity" : item.service ? "Service" : item.pan ? "PAN" : "Detail"}
                            </span>
                            <strong className="text-gray-900">
                              {item.quantity ? `${item.quantity} shares` : item.service || item.pan || "Standard"}
                            </strong>
                          </div>
                        </div>

                        {item.message && (
                          <div className="text-xs text-gray-600 bg-emerald-50/40 px-3 py-2 rounded-lg border border-emerald-100/60">
                            <strong className="text-emerald-900 font-semibold">Message:</strong> “{item.message}”
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Footer Actions */}
                <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  {enquiries.length > 0 && (
                    <button
                      onClick={onClearAll}
                      className="text-rose-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Leads</span>
                    </button>
                  )}
                  <span className="text-gray-400 ml-auto font-medium">
                    Showing {filteredEnquiries.length} of {enquiries.length} leads
                  </span>
                </div>

              </div>
            )}

            {/* TAB 2: UNLISTED PRODUCTS SYNC & CATALOG */}
            {activeTab === "products" && (
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                
                {/* Header Actions Card */}
                <div className="bg-gradient-to-r from-[#031d13] to-[#0a482e] text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-amber-400" />
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        Live Unlisted Products from Google Sheet
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-200/80 mt-1">
                      {syncedProducts.length} unlisted shares currently loaded in your website catalog.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(sheetHeadersString);
                        setCopiedHeaders(true);
                        setTimeout(() => setCopiedHeaders(false), 2500);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Copy standard column headers to paste into row 1 of your 'Unlisted product' sheet tab"
                    >
                      {copiedHeaders ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedHeaders ? "Headers Copied!" : "Copy Sheet Headers (Row 1)"}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSyncingProducts}
                      onClick={handleSyncProductsNow}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-gray-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isSyncingProducts ? "animate-spin" : ""}`} />
                      <span>{isSyncingProducts ? "Syncing..." : "Sync from Sheet Now"}</span>
                    </button>
                  </div>
                </div>

                {/* Status Message */}
                {productSyncMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold animate-fade-in flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>{productSyncMsg}</span>
                  </div>
                )}

                {/* Guide Box on How to Add/Edit */}
                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 space-y-2">
                  <strong className="block font-bold text-amber-900 text-[13px]">
                    💡 How to Add / Edit Unlisted Shares in your Google Sheet:
                  </strong>
                  <ol className="list-decimal list-inside space-y-1 text-amber-900/90 leading-relaxed">
                    <li>In your Google Spreadsheet, create/select the tab named <strong>"Unlisted product"</strong>.</li>
                    <li>Click <strong>"Copy Sheet Headers"</strong> above and paste directly into row 1 (columns A to N).</li>
                    <li>Add your stocks in each row: <strong>Name, Short Name, Price, Lot Size, Available Quantity, Image URL, Category, ISIN, Status, 52W High, 52W Low, Market Cap, Description, Popular</strong>.</li>
                    <li>Whenever you edit prices, quantity, or add new shares in Google Sheets, your website automatically updates!</li>
                  </ol>
                </div>

                {/* Live Products Table */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Loaded Catalog ({syncedProducts.length} Stocks)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Live sync active
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-[350px]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100/70 text-gray-700 sticky top-0 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                        <tr>
                          <th className="py-2.5 px-3">Company</th>
                          <th className="py-2.5 px-3">ISIN / Category</th>
                          <th className="py-2.5 px-3">Price</th>
                          <th className="py-2.5 px-3">Lot Size</th>
                          <th className="py-2.5 px-3">Available Qty</th>
                          <th className="py-2.5 px-3">52W Range</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {syncedProducts.map((p, idx) => (
                          <tr key={p.id || idx} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                {p.image ? (
                                  <img 
                                    src={p.image} 
                                    alt={p.name} 
                                    className="w-8 h-8 rounded-lg object-contain border border-gray-200 bg-white p-0.5 shrink-0"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-[#083b25] text-emerald-100 font-bold text-[10px] flex items-center justify-center shrink-0">
                                    {p.code || "STK"}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-gray-900">{p.name}</div>
                                  <div className="text-[10px] text-gray-400">{p.shortName || p.code}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-mono text-gray-700">{p.isin || "—"}</div>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                                {p.category || "Unlisted"}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-extrabold text-emerald-950 text-sm">
                              ₹{typeof p.price === "number" ? p.price.toLocaleString("en-IN") : p.price}
                            </td>
                            <td className="py-3 px-3 font-semibold text-gray-700">
                              {p.lotSize || 100} shares
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px]">
                                {p.availableQty || "Available on Desk"}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[11px] text-gray-600">
                              <span>{p.low52 || "—"}</span> / <span>{p.high52 || "—"}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                                {p.status || "UNLISTED"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: GOOGLE SHEETS 2-WAY SYNC INTEGRATION */}
            {activeTab === "google-sheets" && (
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                
                {/* Intro Box */}
                <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#107c41] text-white flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        2-Way Google Sheet Integration (Enquiries + Unlisted Products)
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        With a single Google Sheet Webhook URL, your website does 2 things automatically:
                        <br />
                        1. <strong>Enquiries Sync</strong>: All customer leads, demat requests, and orders are saved directly to your <em>"Enquiries"</em> tab.
                        <br />
                        2. <strong>Product Management</strong>: Add, edit prices, update images, and change available stock directly in your <em>"Unlisted product"</em> tab.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 1: Webhook URL Input */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Google Sheet Webhook URL (Permanent 2-Way Sync)
                      </label>
                      {webhookUrl ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Active & Saved Permanently</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-gray-400">
                          Not configured yet
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mb-2.5">
                      Save once — both enquiries recording and unlisted shares sync will work in real-time.
                    </p>
                    <form onSubmit={handleSaveWebhook} className="flex gap-2">
                      <input
                        type="url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/s/AKfycby.../exec"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-emerald-600 outline-none font-mono text-gray-900 bg-gray-50/50 focus:bg-white"
                        required
                      />
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0a482e] hover:bg-[#063321] text-white transition-all cursor-pointer shrink-0 shadow-sm"
                      >
                        {webhookSaved ? "Saved Permanently! ✅" : "Save Webhook Link"}
                      </button>
                    </form>
                  </div>

                  {/* Test Connection Button */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleSendTestLead}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-gray-950 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Row to My Google Sheet</span>
                    </button>
                    {testStatus && (
                      <span className="text-xs text-emerald-800 font-bold animate-pulse">
                        {testStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Step 2: 2-Minute Google Apps Script Guide */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Step 2: 2-Way Google Apps Script (Handles Enquiries & Products)
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(sampleAppsScriptCode);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="text-xs font-bold text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Copied to Clipboard!" : "Copy Script Code"}</span>
                    </button>
                  </div>

                  <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>In your Google Sheet with tabs <strong>"Enquiries"</strong> and <strong>"Unlisted product"</strong>.</li>
                    <li>Click <strong>Extensions</strong> → <strong>Apps Script</strong>.</li>
                    <li>Replace the contents of <code className="text-emerald-800 font-mono">Code.gs</code> with the code below and click <strong>Save</strong> (💾).</li>
                    <li>Click <strong>Deploy</strong> → <strong>New deployment</strong> (or Manage deployments → Edit → New version) → Select <strong>Web app</strong>.</li>
                    <li>Set <em>Execute as:</em> <strong>"Me"</strong> and <em>Who has access:</em> <strong>"Anyone"</strong>, then click <strong>Deploy</strong>.</li>
                    <li>Copy the resulting Web App URL and paste it into Step 1 above!</li>
                  </ol>

                  <div className="relative">
                    <pre className="bg-[#1e293b] text-emerald-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[300px]">
                      {sampleAppsScriptCode}
                    </pre>
                  </div>
                </div>

              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
}
