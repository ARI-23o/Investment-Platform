import React, { useState } from "react";
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
  Lock
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
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) {
      alert("Please provide your name and mobile number.");
      return;
    }
    setIsSubmitting(true);

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
    await saveEnquiryToBackend(callbackRecord);

    // 3. Webhook sync
    syncLeadToGoogleSheet(callbackRecord);

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedTicket(ticketId);
      onCallbackSubmitted && onCallbackSubmitted(callbackRecord);
    }, 700);
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
                Direct Escalation: <strong>+91 22 6982 4599</strong> • Email: <a href="mailto:grievance@gspinvestment.com" className="underline font-bold">grievance@gspinvestment.com</a>. For unaddressed concerns, file directly on SEBI SCORES portal (<a href="https://scores.sebi.gov.in" target="_blank" rel="noreferrer" className="underline font-bold">scores.sebi.gov.in</a>).
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
                  <p className="text-gray-600 leading-relaxed">
                    Suite 402-404, Dalal Street Commercial Centre, Fort, Mumbai - 400 001, Maharashtra, India.
                  </p>
                  <div className="text-xs text-emerald-800 font-semibold pt-1">
                    Branch Offices: New Delhi • Bengaluru • Ahmedabad • Kolkata
                  </div>
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
                href="https://www.sebi.gov.in" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-emerald-800 hover:border-emerald-500/50 transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>SEBI Investor Charter</span>
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

              {/* Confirmation state */}
              {confirmedTicket ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-gray-900">Callback Scheduled!</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Ticket Ref: <strong className="font-mono text-emerald-900">{confirmedTicket}</strong>
                    </p>
                    <p className="text-xs text-emerald-800 mt-2 font-medium">
                      Our Wealth Relationship Manager will call your registered number within 15 minutes during trading hours.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setConfirmedTicket(null);
                      setFullName("");
                      setMobile("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="text-xs font-bold text-emerald-800 underline cursor-pointer pt-1"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Vikramaditya Singhania"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32] focus:ring-1 focus:ring-[#0f4b32]"
                      required
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Mobile Number
                    </label>
                    <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden focus-within:border-[#0f4b32] focus-within:ring-1 focus-within:ring-[#0f4b32]">
                      <span className="px-3 py-3 bg-gray-100 text-xs font-bold text-gray-600 border-r border-gray-200">
                        🇮🇳 +91
                      </span>
                      <input 
                        type="tel"
                        placeholder="98765 43210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full px-3 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none"
                        required
                      />
                    </div>
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
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
