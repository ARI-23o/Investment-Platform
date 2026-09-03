import React, { useState, useEffect } from "react";
import { 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  Building2, 
  ShieldCheck, 
  Vote, 
  Send,
  Lock,
  X,
  RotateCw,
  Sparkles
} from "lucide-react";
import { syncLeadToGoogleSheet } from "../utils/exportUtils";
import { saveEnquiryToBackend } from "../services/api";

export default function ContactSection({ onCallbackSubmitted }) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [interestedIn, setInterestedIn] = useState("Equity Trading");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // 10-second Countdown Success Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [countdown, setCountdown] = useState(10);

  // 10s Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (isSuccessModalOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSuccessModalOpen && countdown === 0) {
      // 10 seconds expired: gracefully refresh the page
      window.location.reload();
    }
    return () => clearInterval(timer);
  }, [isSuccessModalOpen, countdown]);

  const handleManualRefresh = () => {
    window.location.reload();
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    setFullName("");
    setMobile("");
    setEmail("");
    setMessage("");
    setErrors({});
    setCountdown(10);
  };

  // Strict Phone Handler - Digits Only, Max 10 digits
  const handleMobileChange = (e) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 10);
    setMobile(digitsOnly);
    if (errors.mobile) {
      setErrors((prev) => ({ ...prev, mobile: null }));
    }
  };

  const handleNameChange = (e) => {
    setFullName(e.target.value);
    if (errors.fullName) {
      setErrors((prev) => ({ ...prev, fullName: null }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Validation
    const validationErrors = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      validationErrors.fullName = "Please enter your full name (minimum 2 characters)";
    }

    if (!mobile.trim()) {
      validationErrors.mobile = "Mobile number is required";
    } else if (mobile.length !== 10) {
      validationErrors.mobile = `Please enter complete 10-digit mobile number (${mobile.length}/10 digits entered)`;
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      validationErrors.mobile = "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const ticketId = "CB-" + Math.floor(100000 + Math.random() * 900000);
      const callbackRecord = {
        id: ticketId,
        type: "callback",
        title: `Callback Request: ${interestedIn}`,
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        service: interestedIn,
        message: message.trim() || "Requested priority callback during market hours",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-IN'),
        status: "Assigned to Senior Wealth Manager",
      };

      // 1. Save to Local Storage safely
      try {
        const existing = JSON.parse(localStorage.getItem("gsp_enquiries") || "[]");
        existing.unshift(callbackRecord);
        localStorage.setItem("gsp_enquiries", JSON.stringify(existing));
      } catch (err) {
        console.warn("Storage write error", err);
      }

      // 2. Central API save
      try {
        await saveEnquiryToBackend(callbackRecord);
      } catch (err) {
        console.warn("Backend save error", err);
      }

      // 3. Google Sheet Webhook sync (permanent)
      try {
        syncLeadToGoogleSheet(callbackRecord);
      } catch (err) {
        console.warn("Google Sheet sync error", err);
      }

      setIsSubmitting(false);
      setSubmittedLead(callbackRecord);
      setCountdown(10);
      setIsSuccessModalOpen(true);

      if (onCallbackSubmitted) {
        try {
          onCallbackSubmitted(callbackRecord);
        } catch (e) {
          console.warn("Parent callback handler error:", e);
        }
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#fafcfb] border-t border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">
            HELP & CLIENT ASSISTANCE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Contact &{" "}
            <span className="font-serif-accent italic font-normal text-amber-600">
              Branch Network
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-normal">
            Whether you need trade assistance, account onboarding help, or grievance resolution — our team is here for you.
          </p>
        </div>

        {/* 2-Column High-Hierarchy Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: CONTACT & BRANCH NETWORK
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Helpline & WhatsApp in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* ☎ Investor Helpline */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">Investor Helpline</h3>
                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Toll-Free Support</span>
                    </div>
                  </div>
                </div>
                <a 
                  href="tel:18002094500" 
                  className="text-lg sm:text-xl font-extrabold text-gray-900 hover:text-emerald-800 transition-colors block"
                >
                  1800 209 4500
                </a>
                <div className="text-xs text-gray-500 mt-1">
                  Desk: <a href="tel:+912269824500" className="hover:underline text-gray-700 font-medium">+91 22 6982 4500</a>
                </div>
                <div className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Mon - Fri: 9:00 AM - 6:00 PM IST</span>
                </div>
              </div>

              {/* 💬 WhatsApp Support */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">WhatsApp Support</h3>
                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Avg reply &lt; 5 mins</span>
                    </div>
                  </div>
                </div>
                <a 
                  href="https://wa.me/919323986654?text=Hi%20GSP%20Investment%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-lg sm:text-xl font-extrabold text-gray-900 hover:text-emerald-800 transition-colors block"
                >
                  +91 93239 86654
                </a>
                <div className="text-xs text-gray-500 mt-1">
                  Instant portfolio quotes & queries
                </div>
                <div className="mt-2">
                  <a 
                    href="https://wa.me/919323986654" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline"
                  >
                    <span>Click to chat on WhatsApp</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>

            {/* ✉ Official Email Desk */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">Official Email Desk</h3>
                  <div className="text-xs text-gray-700 font-semibold">Support, Dealing & Compliance</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Customer Support</span>
                  <a href="mailto:support@gspinvestment.com" className="font-bold text-gray-900 hover:text-emerald-800 transition-colors break-all">
                    support@gspinvestment.com
                  </a>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Dealing Desk</span>
                  <a href="mailto:dealing@gspinvestment.com" className="font-bold text-gray-900 hover:text-emerald-800 transition-colors break-all">
                    dealing@gspinvestment.com
                  </a>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Compliance Desk</span>
                  <a href="mailto:compliance@gspinvestment.com" className="font-bold text-gray-900 hover:text-emerald-800 transition-colors break-all">
                    compliance@gspinvestment.com
                  </a>
                </div>
              </div>
            </div>

            {/* ⚠ Grievance & Escalation Officer */}
            <div className="bg-amber-50/70 rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-2xs space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-900">
                    Grievance Redressal & Escalation
                  </h3>
                  <div className="text-xs text-amber-800 font-medium">
                    Designated Grievance Officer: Mr. Amit Deshmukh
                  </div>
                </div>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed pt-1">
                Direct Escalation: <strong>+91 22 6982 4599</strong> • Email: <a href="mailto:grievance@gspinvestment.com" className="underline font-bold">grievance@gspinvestment.com</a>. For unaddressed concerns, connect with our designated Grievance Redressal desk.
              </p>
            </div>

            {/* 📍 Head Office & Registered Address */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">Corporate & Registered Office</h3>
                  <div className="font-extrabold text-gray-900 text-sm sm:text-base">
                    GSP Investment Pvt. Ltd.
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    A-302 Aparna Niwas, Behind Tungareshwar sweet, Near Vasai road station, Vasai West, Vasai-Virar City, Maharashtra 401202.
                  </p>
                </div>
              </div>
            </div>

            {/* E-Voting & Regulatory Quick Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a 
                href="https://www.evotingindia.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-emerald-800 hover:border-emerald-500/50 transition-colors shadow-2xs"
              >
                <Vote className="w-4 h-4 text-emerald-700" />
                <span>CDSL E-Voting</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>

              <a 
                href="https://www.eservices.nsdl.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-emerald-800 hover:border-emerald-500/50 transition-colors shadow-2xs"
              >
                <Vote className="w-4 h-4 text-amber-700" />
                <span>NSDL E-Voting</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>

              <a 
                href="#about"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-emerald-800 hover:border-emerald-500/50 transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Investor Protection Charter</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: REQUEST A CALLBACK FORM
          ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xl space-y-6">
              
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-1">
                  EXPRESS SERVICE
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Request a Callback
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Fill in your details and our senior investment advisor will call you directly.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Vikramaditya Singhania"
                    value={fullName}
                    onChange={handleNameChange}
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none transition-all ${
                      errors.fullName 
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-600 focus:ring-1 focus:ring-rose-500" 
                        : "border-gray-200 focus:border-[#0f4b32] focus:ring-1 focus:ring-[#0f4b32]"
                    }`}
                    required
                  />
                  {errors.fullName && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                      <span>⚠</span>
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Mobile - Only 10 Digits Allowed */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-gray-400 tabular-nums">
                      {mobile.length}/10 digits
                    </span>
                  </div>
                  <div className={`flex items-center rounded-xl border overflow-hidden transition-all ${
                    errors.mobile 
                      ? "border-rose-400 bg-rose-50/30 focus-within:border-rose-600 focus-within:ring-1 focus-within:ring-rose-500" 
                      : "border-gray-200 focus-within:border-[#0f4b32] focus-within:ring-1 focus-within:ring-[#0f4b32]"
                  }`}>
                    <span className="px-3 py-3 bg-gray-100 text-xs font-bold text-gray-600 border-r border-gray-200 select-none">
                      🇮🇳 +91
                    </span>
                    <input 
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      placeholder="9876543210"
                      value={mobile}
                      onChange={handleMobileChange}
                      className="w-full px-3 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none bg-transparent font-mono"
                      required
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                      <span>⚠</span>
                      <span>{errors.mobile}</span>
                    </p>
                  )}
                </div>

                {/* Interested In */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Interested In
                  </label>
                  <select
                    value={interestedIn}
                    onChange={(e) => setInterestedIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 outline-none focus:border-[#0f4b32] cursor-pointer bg-white"
                  >
                    <option value="Equity Trading">Equity & Derivative Trading</option>
                    <option value="Demat Account">Free Demat Account Opening</option>
                    <option value="Mutual Funds & SIP">Mutual Funds & Systematic Investment Plan (SIP)</option>
                    <option value="Unlisted Shares">Pre-IPO & Unlisted Shares</option>
                    <option value="Wealth Management">HNIs Wealth Management & Advisory</option>
                    <option value="Loan Solutions">Loan Solutions & Financing</option>
                    <option value="Other Assistance">Other General Query</option>
                  </select>
                </div>

                {/* Optional Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Email Address (Optional)
                  </label>
                  <input 
                    type="email"
                    placeholder="vikram@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32]"
                  />
                </div>

                {/* Message / Preferred Time */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Message / Best Time to Call
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="e.g. Please call between 2 PM and 5 PM"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full text-sm font-black bg-[#0f4b32] hover:bg-[#093523] text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <span>Scheduling Callback...</span>
                  ) : (
                    <>
                      <span>Request Callback</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  <span>Your privacy is protected • Zero spam guarantee</span>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          CELEBRATORY SUCCESS MODAL WITH 10-SECOND COUNTDOWN & AUTO-REFRESH
      ───────────────────────────────────────────────────────────── */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden animate-scale-up text-center space-y-5">
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-100/70 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-amber-100/60 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close Button */}
            <button 
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close & Stay on Page"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Success Icon */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#063321] to-[#10b981] text-white flex items-center justify-center shadow-xl shadow-emerald-900/20">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Request Confirmed
              </span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight pt-1">
                Callback Scheduled!
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                Thank you, <strong className="text-gray-900">{submittedLead?.fullName}</strong>! Your inquiry has been securely routed to our senior wealth advisor.
              </p>
            </div>

            {/* Ticket & Details Card */}
            <div className="p-4 rounded-2xl bg-[#f8faf9] border border-gray-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/80">
                <span className="text-gray-500 font-semibold">Ticket Ref:</span>
                <span className="font-mono font-black text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {submittedLead?.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Mobile Number:</span>
                <span className="font-bold text-gray-900 font-mono">+91 {submittedLead?.mobile}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Service Type:</span>
                <span className="font-bold text-gray-900">{submittedLead?.service}</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-emerald-800 font-semibold text-[11px]">
                <span>Response Time:</span>
                <span>Within 15 mins (Market Hours)</span>
              </div>
            </div>

            {/* 10-Second Countdown Banner with Animated Bar */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Auto-refreshing page in:</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-amber-200/90 text-amber-950 font-black font-mono text-sm flex items-center justify-center shadow-xs">
                  {countdown}s
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-600 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleManualRefresh}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-black bg-[#0f4b32] hover:bg-[#093523] text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Refresh Now</span>
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer"
              >
                Close & Stay
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
