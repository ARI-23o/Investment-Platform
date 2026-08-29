import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Info, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  FileText, 
  Share2, 
  Heart,
  ChevronDown
} from "lucide-react";
import { UNLISTED_SHARES } from "../data/sharesData";
import { syncLeadToGoogleSheet } from "../utils/exportUtils";

export default function ShareDetailsView({ selectedShareId, onBack, onEnquirySuccess }) {
  const currentShare = UNLISTED_SHARES.find((s) => s.id === selectedShareId) || UNLISTED_SHARES[4]; // Default to SRIT India
  const [selectedShare, setSelectedShare] = useState(currentShare);
  const [enquiryType, setEnquiryType] = useState("buy"); // 'buy' or 'sell'
  const [quantity, setQuantity] = useState(250);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const found = UNLISTED_SHARES.find((s) => s.id === selectedShareId);
    if (found) {
      setSelectedShare(found);
    }
  }, [selectedShareId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !mobile) {
      alert("Please provide your Name and Mobile number.");
      return;
    }
    setSubmitted(true);

    const enquiryRecord = {
      id: "ENQ-" + Date.now(),
      type: enquiryType,
      title: `${selectedShare.name} (${enquiryType.toUpperCase()})`,
      share: selectedShare.name,
      quantity,
      fullName,
      mobile,
      email,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Submitted to Dealing Desk",
    };

    const existing = JSON.parse(localStorage.getItem("gsp_enquiries") || "[]");
    existing.unshift(enquiryRecord);
    localStorage.setItem("gsp_enquiries", JSON.stringify(existing));

    // Automatically sync to Google Sheet if configured
    syncLeadToGoogleSheet(enquiryRecord);

    setTimeout(() => {
      onEnquirySuccess && onEnquirySuccess(enquiryRecord);
      setSubmitted(false);
      setMessage("");
    }, 1000);
  };

  return (
    <div className="bg-[#fbfcfb] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & Stock Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-6 border-b border-gray-200">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-emerald-900 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Shares & Home</span>
          </button>

          {/* Quick Select another unlisted share */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Switch Share:</span>
            <select 
              value={selectedShare.id} 
              onChange={(e) => {
                const found = UNLISTED_SHARES.find((s) => s.id === e.target.value);
                if (found) setSelectedShare(found);
              }}
              className="bg-white border border-gray-200 text-sm font-semibold rounded-xl px-3 py-1.5 outline-none focus:border-emerald-600 cursor-pointer shadow-xs"
            >
              {UNLISTED_SHARES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Grid: Left Details matching Page 8 & Right Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Share Details & Company Overview */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header with Square Logo, Name and Badges */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#083b25] text-emerald-100 flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
                  {selectedShare.code || "SI"}
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {selectedShare.name}
                  </h1>

                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-gray-100 text-gray-700">
                      {selectedShare.category}
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-lg bg-gray-100 text-gray-600">
                      ISIN: {selectedShare.isin}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                      {selectedShare.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Indicative Price Row */}
              <div className="pt-4 border-t border-gray-100 flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-gray-900">
                  ₹{selectedShare.price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-bold tracking-wider text-amber-700 uppercase">
                  INDICATIVE PRICE • FOR INFORMATION
                </span>
              </div>

              {/* Info Notice Box matching Page 8 */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs sm:text-sm">
                <Info className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Indicative price history is not available for this share yet. Contact our desk for live volume quotes.
                </span>
              </div>

              {/* 4 Metrics Grid matching Page 8 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium">Lot size</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">
                    {selectedShare.lotSize}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium">52-wk high</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">
                    {selectedShare.high52}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium">52-wk low</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">
                    {selectedShare.low52}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium">Market cap</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">
                    {selectedShare.marketCap}
                  </div>
                </div>
              </div>
            </div>

            {/* About The Company Section matching Page 8 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
              <div className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-1">
                ABOUT THE COMPANY
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedShare.name} — Company Overview
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-8">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {selectedShare.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                    GSP Investment Pvt. Ltd. facilitates transparent price discovery and secure escrow settlement for unlisted equity transactions directly into your CDSL/NSDL Demat account.
                  </p>
                </div>

                {/* Real Corporate Building Architecture Image Matching Page 8 */}
                <div className="sm:col-span-4 flex items-center justify-center p-2 bg-gradient-to-b from-emerald-50/50 to-white rounded-2xl border border-emerald-100 shadow-sm">
                  <img 
                    src="/assets/corporate_building.jpg" 
                    alt="Corporate Headquarters Building" 
                    className="w-full h-48 object-contain drop-shadow-lg rounded-xl hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Enquiry Card matching Page 8 */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl">
              
              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setEnquiryType("buy")}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    enquiryType === "buy"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Enquire to buy
                </button>
                <button
                  type="button"
                  onClick={() => setEnquiryType("sell")}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    enquiryType === "sell"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Enquire to sell
                </button>
              </div>

              {/* Card Title & Indicative Price */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {selectedShare.name}
                  </h4>
                  <div className="text-xs text-gray-500">
                    {enquiryType === "buy" ? "Express Buy Request" : "Offer to Sell Shares"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-gray-900">
                    ₹{selectedShare.price.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[10px] font-bold text-amber-700 uppercase">
                    INDICATIVE
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Quantity (shares)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="e.g. 250"
                    min={1}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Message (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Anything our team should know"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none resize-none"
                  ></textarea>
                </div>

                {/* Submit Button matching Page 8 */}
                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-bold bg-[#093523] hover:bg-[#062417] text-white shadow-lg shadow-emerald-950/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitted ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Submit Enquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-400 font-medium pt-1">
                  🔒 Your information is secure with GSP Investment. No spam guarantee.
                </p>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
