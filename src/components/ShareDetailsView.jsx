import React, { useState, useEffect, useMemo } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Info, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  FileText, 
  Share2, 
  Heart,
  ChevronDown,
  Calendar,
  Layers,
  Lock,
  Clock,
  Send,
  Sparkles,
  Zap,
  BarChart2
} from "lucide-react";
import { UNLISTED_SHARES } from "../data/sharesData";
import { syncLeadToGoogleSheet } from "../utils/exportUtils";
import { saveEnquiryToBackend } from "../services/api";

export default function ShareDetailsView({ selectedShareId, onBack, onEnquirySuccess }) {
  const currentShare = UNLISTED_SHARES.find((s) => s.id === selectedShareId) || UNLISTED_SHARES[0];
  const [selectedShare, setSelectedShare] = useState(currentShare);
  const [timeframe, setTimeframe] = useState("1M"); // '1D', '1W', '1M', '1Y', '5Y'
  const [enquiryType, setEnquiryType] = useState("buy"); // 'buy' or 'sell'
  const [quantity, setQuantity] = useState(currentShare.lotSize || 100);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  useEffect(() => {
    const found = UNLISTED_SHARES.find((s) => s.id === selectedShareId);
    if (found) {
      setSelectedShare(found);
      setQuantity(found.lotSize || 100);
    }
  }, [selectedShareId]);

  // Dynamic Chart Paths based on Timeframe
  const chartConfig = useMemo(() => {
    switch (timeframe) {
      case "1D":
        return {
          path: "M 0,55 Q 35,48 70,52 T 140,40 T 210,46 T 280,30 T 350,22",
          area: "M 0,55 Q 35,48 70,52 T 140,40 T 210,46 T 280,30 T 350,22 L 350,80 L 0,80 Z",
          change: "+1.2%",
          isPositive: true,
          low: `₹${(selectedShare.price * 0.98).toFixed(1)}`,
          high: `₹${(selectedShare.price * 1.02).toFixed(1)}`,
          volume: "12,450 shares",
        };
      case "1W":
        return {
          path: "M 0,62 Q 40,58 90,48 T 180,42 T 260,32 T 350,18",
          area: "M 0,62 Q 40,58 90,48 T 180,42 T 260,32 T 350,18 L 350,80 L 0,80 Z",
          change: "+4.8%",
          isPositive: true,
          low: `₹${(selectedShare.price * 0.95).toFixed(1)}`,
          high: `₹${(selectedShare.price * 1.05).toFixed(1)}`,
          volume: "48,200 shares",
        };
      case "1M":
        return {
          path: "M 0,68 Q 50,60 100,52 T 200,38 T 280,24 T 350,12",
          area: "M 0,68 Q 50,60 100,52 T 200,38 T 280,24 T 350,12 L 350,80 L 0,80 Z",
          change: "+14.6%",
          isPositive: true,
          low: `₹${(selectedShare.price * 0.88).toFixed(1)}`,
          high: `₹${(selectedShare.price * 1.15).toFixed(1)}`,
          volume: "1,85,000 shares",
        };
      case "1Y":
        return {
          path: "M 0,72 Q 60,65 120,45 T 220,30 T 290,18 T 350,8",
          area: "M 0,72 Q 60,65 120,45 T 220,30 T 290,18 T 350,8 L 350,80 L 0,80 Z",
          change: "+38.2%",
          isPositive: true,
          low: selectedShare.low52,
          high: selectedShare.high52,
          volume: "12,40,000 shares",
        };
      case "5Y":
      default:
        return {
          path: "M 0,76 Q 70,70 140,48 T 230,28 T 300,14 T 350,6",
          area: "M 0,76 Q 70,70 140,48 T 230,28 T 300,14 T 350,6 L 350,80 L 0,80 Z",
          change: "+124.5%",
          isPositive: true,
          low: `₹${(selectedShare.price * 0.4).toFixed(1)}`,
          high: selectedShare.high52,
          volume: "45,80,000 shares",
        };
    }
  }, [timeframe, selectedShare]);

  const estimatedOrderValue = useMemo(() => {
    return (Number(quantity) || 0) * (Number(selectedShare.price) || 0);
  }, [quantity, selectedShare]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) {
      alert("Please provide your full name and mobile number.");
      return;
    }
    setIsSubmitting(true);

    const refId = "UNQ-" + Math.floor(100000 + Math.random() * 900000);
    const enquiryRecord = {
      id: refId,
      type: enquiryType,
      title: `${selectedShare.name} (${enquiryType.toUpperCase()})`,
      share: selectedShare.name,
      shareCode: selectedShare.code,
      quantity: Number(quantity),
      price: selectedShare.price,
      estimatedValue: estimatedOrderValue,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      message: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN'),
      status: "Submitted to Dealing Desk",
    };

    // 1. Save to local storage safely
    try {
      const existing = JSON.parse(localStorage.getItem("gsp_enquiries") || "[]");
      existing.unshift(enquiryRecord);
      localStorage.setItem("gsp_enquiries", JSON.stringify(existing));
    } catch (err) {
      console.warn("Storage write error", err);
    }

    // 2. Central API save
    await saveEnquiryToBackend(enquiryRecord);

    // 3. Webhook sync
    syncLeadToGoogleSheet(enquiryRecord);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedRef(refId);
      onEnquirySuccess && onEnquirySuccess(enquiryRecord);
    }, 600);
  };

  return (
    <div className="bg-[#fafcfb] py-8 sm:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & Company Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-emerald-900 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-2xs hover:shadow-xs w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-800" />
            <span>← Back to All Unlisted Shares & Home</span>
          </button>

          {/* Quick Switch Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Switch Company:</span>
            <select 
              value={selectedShare.id} 
              onChange={(e) => {
                const found = UNLISTED_SHARES.find((s) => s.id === e.target.value);
                if (found) {
                  setSelectedShare(found);
                  setQuantity(found.lotSize || 100);
                  setSubmittedRef(null);
                }
              }}
              className="bg-white border border-gray-200 text-xs sm:text-sm font-bold rounded-xl px-3.5 py-2 outline-none focus:border-[#0f4b32] cursor-pointer shadow-2xs text-gray-900"
            >
              {UNLISTED_SHARES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName || s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Column Terminal Layout: Terminal on Left, Dealing Enquiry on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: MINI TRADING & RESEARCH TERMINAL
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Terminal Main Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-6">
              
              {/* Company Logo, Ticker, Status */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#083b25] text-emerald-100 flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    {selectedShare.code}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                      {selectedShare.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                      <span className="font-semibold text-gray-500">ISIN: {selectedShare.isin}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                        {selectedShare.category}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black uppercase tracking-wider">
                  {selectedShare.status || "UNLISTED"}
                </span>
              </div>

              {/* Price Display */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                    ₹{selectedShare.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-extrabold tracking-wider text-amber-700 uppercase bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    INDICATIVE
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  <TrendingUp className="w-4 h-4" />
                  <span>{chartConfig.change} ({timeframe})</span>
                </div>
              </div>

              {/* Timeframe Selector [ 1D | 1W | 1M | 1Y | 5Y ] */}
              <div className="pt-2">
                <div className="flex items-center justify-between gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                  {["1D", "1W", "1M", "1Y", "5Y"].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        timeframe === tf
                          ? "bg-white text-[#0f4b32] shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive SVG Price Chart */}
              <div className="bg-gray-950 rounded-2xl p-4 sm:p-5 border border-gray-800 text-white relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2 font-mono">
                  <span>INDICATIVE PRICE TRAJECTORY ({timeframe})</span>
                  <span>Est. Vol: {chartConfig.volume}</span>
                </div>

                <svg viewBox="0 0 350 80" className="w-full h-28 overflow-visible">
                  <defs>
                    <linearGradient id="terminalChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={chartConfig.area} fill="url(#terminalChartGrad)" />
                  <path 
                    d={chartConfig.path} 
                    fill="none" 
                    stroke="#34d399" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    className="transition-all duration-700 ease-out"
                  />
                  <circle cx="350" cy="12" r="4" fill="#34d399" className="animate-ping" />
                  <circle cx="350" cy="12" r="4" fill="#10b981" />
                </svg>

                <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-2 border-t border-gray-800/80">
                  <span>Range Low: <strong className="text-gray-300">{chartConfig.low}</strong></span>
                  <span>Range High: <strong className="text-emerald-400">{chartConfig.high}</strong></span>
                </div>
              </div>

              {/* Key Terminal Market Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase">52W High</div>
                  <div className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
                    {selectedShare.high52}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase">52W Low</div>
                  <div className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
                    {selectedShare.low52}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase">Market Cap</div>
                  <div className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
                    {selectedShare.marketCap}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase">Min Lot Size</div>
                  <div className="text-base sm:text-lg font-black text-emerald-800 mt-0.5">
                    {selectedShare.lotSize} shares
                  </div>
                </div>
              </div>

            </div>

            {/* About Company Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-4">
              <div className="text-xs font-black uppercase tracking-widest text-emerald-800">
                COMPANY RESEARCH & PROFILE
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">
                About {selectedShare.shortName || selectedShare.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {selectedShare.description}
              </p>
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs sm:text-sm text-emerald-900 space-y-1.5">
                <div className="font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Secure Escrow & Demat Transfer Protocol</span>
                </div>
                <p className="text-emerald-800/80 leading-normal">
                  All unlisted share transactions are settled off-market via CDSL/NSDL DIS (Delivery Instruction Slip) or Easiest portal with verified bank escrow protection.
                </p>
              </div>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: DEALING DESK ENQUIRY FORM (STACKS ON MOBILE)
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xl space-y-6">
              
              {/* Buy / Sell Toggle Switch */}
              <div className="grid grid-cols-2 p-1.5 bg-gray-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setEnquiryType("buy")}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    enquiryType === "buy"
                      ? "bg-[#0f4b32] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Enquire to Buy
                </button>
                <button
                  type="button"
                  onClick={() => setEnquiryType("sell")}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    enquiryType === "sell"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Enquire to Sell
                </button>
              </div>

              {/* Confirmation Alert after submit */}
              {submittedRef ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-gray-900">Dealing Enquiry Logged!</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Ref ID: <strong className="font-mono text-emerald-900">{submittedRef}</strong>
                    </p>
                    <p className="text-xs text-emerald-800 mt-2">
                      Our institutional unlisted dealer will reach you within 15 minutes with verified lot prices.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmittedRef(null)}
                    className="text-xs font-bold text-emerald-800 underline cursor-pointer pt-1"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Quantity with Lot Stepper */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Quantity (Lot Size: {selectedShare.lotSize || 100})
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(selectedShare.lotSize || 25, quantity - (selectedShare.lotSize || 25)))}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-lg flex items-center justify-center transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <input 
                        type="number"
                        min={selectedShare.lotSize || 1}
                        step={selectedShare.lotSize || 1}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 0))}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-center font-black text-base text-gray-900 outline-none focus:border-[#0f4b32] focus:bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + (selectedShare.lotSize || 25))}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-lg flex items-center justify-center transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Estimated Total Calculation */}
                    <div className="flex justify-between items-center text-xs mt-2 px-1">
                      <span className="text-gray-500 font-medium">Est. Order Value:</span>
                      <strong className="text-gray-900 font-black text-sm">
                        ₹{estimatedOrderValue.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Your Full Name
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32] focus:ring-1 focus:ring-[#0f4b32]"
                      required
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden focus-within:border-[#0f4b32] focus-within:ring-1 focus-within:ring-[#0f4b32]">
                      <span className="px-3 py-2.5 bg-gray-100 text-xs font-bold text-gray-600 border-r border-gray-200 select-none">
                        🇮🇳 +91
                      </span>
                      <input 
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        placeholder="9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="w-full px-3 py-2.5 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none font-mono bg-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Email Address (Optional)
                    </label>
                    <input 
                      type="email"
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32]"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Notes / Target Price / Demat Info
                    </label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Willing to buy 500 shares at market price"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 px-6 rounded-full text-sm font-black text-white shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                      enquiryType === "buy"
                        ? "bg-[#0f4b32] hover:bg-[#093523] shadow-emerald-950/20"
                        : "bg-amber-600 hover:bg-amber-700 shadow-amber-950/20"
                    }`}
                  >
                    {isSubmitting ? (
                      <span>Connecting Dealing Desk...</span>
                    ) : (
                      <>
                        <span>Submit {enquiryType === "buy" ? "Buy" : "Sell"} Enquiry</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
                    <Lock className="w-3 h-3 text-emerald-700" />
                    <span>Confidential pricing • Direct Demat Settlement</span>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
