import React, { useState } from "react";
import { 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Vote
} from "lucide-react";
import { syncLeadToGoogleSheet } from "../utils/exportUtils";

export default function ContactSection({ onCallbackSubmitted }) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !mobile) {
      alert("Please provide your full name and mobile number.");
      return;
    }
    setLoading(true);

    const callbackRecord = {
      id: "CB-" + Date.now(),
      type: "callback",
      title: "Callback Request: " + (service || "General Advisory"),
      fullName,
      mobile,
      email,
      service,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Assigned to Relationship Manager",
    };

    const existing = JSON.parse(localStorage.getItem("gsp_enquiries") || "[]");
    existing.unshift(callbackRecord);
    localStorage.setItem("gsp_enquiries", JSON.stringify(existing));

    // Automatically forward to Google Sheet if configured
    syncLeadToGoogleSheet(callbackRecord);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onCallbackSubmitted && onCallbackSubmitted(callbackRecord);
      setTimeout(() => {
        setSuccess(false);
        setFullName("");
        setMobile("");
        setEmail("");
        setService("");
        setMessage("");
      }, 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-[#f8faf9] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Page 9 */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Contact &{" "}
            <span className="font-serif-accent italic font-normal text-[#d97706] text-3xl sm:text-4xl">
              Branch Network
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Connect with our investment experts or request a callback from our relationship managers.
          </p>
        </div>

        {/* 2-Column Layout matching Page 9 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* 2x2 Grid for Phone & Emails */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Investor Helpline */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-start gap-4 hover:border-emerald-500/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Investor Helpline</div>
                  <a href="tel:18001234567" className="text-sm sm:text-base font-bold text-gray-900 hover:text-emerald-800 transition-colors block">
                    1800-123-4567
                  </a>
                  <div className="text-[11px] text-gray-400 mt-0.5">Mon-Fri, 9 AM - 6 PM</div>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-start gap-4 hover:border-emerald-500/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">WhatsApp Support</div>
                  <a href="https://wa.me/919323986654" target="_blank" rel="noreferrer" className="text-sm sm:text-base font-bold text-gray-900 hover:text-emerald-800 transition-colors block">
                    9323986654
                  </a>
                  <div className="text-[11px] text-gray-400 mt-0.5">For immediate assistance</div>
                </div>
              </div>

              {/* Email Support */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-start gap-4 hover:border-emerald-500/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Email Support</div>
                  <a href="mailto:support@shreetisai.com" className="text-xs sm:text-sm font-bold text-gray-900 hover:text-emerald-800 transition-colors block truncate">
                    support@shreetisai.com
                  </a>
                  <div className="text-[11px] text-gray-400 mt-0.5">Response within 24 hours</div>
                </div>
              </div>

              {/* Grievance Cell */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-start gap-4 hover:border-emerald-500/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Grievance Cell</div>
                  <a href="mailto:ig@shreetisai.com" className="text-xs sm:text-sm font-bold text-gray-900 hover:text-emerald-800 transition-colors block truncate">
                    ig@shreetisai.com
                  </a>
                  <div className="text-[11px] text-gray-400 mt-0.5">For any grievances</div>
                </div>
              </div>

            </div>

            {/* Head Office Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-start gap-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-500 font-medium">Head Office</div>
                <div className="text-sm font-bold text-gray-900 leading-snug">
                  Regd. Off. : A-109, Everest Tower, Santoshi Mata Road, Opp. Maxi Ground, Kalyan (West) 421 301
                </div>
                <div className="text-[11px] text-gray-400">Registered & Corporate Office</div>
              </div>
            </div>

            {/* E-Voting Buttons matching Page 9 bottom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a
                href="https://www.evotingindia.com/"
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex items-center justify-between hover:bg-emerald-50/50 hover:border-emerald-400 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
                    <Vote className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">E-Voting - CDSL</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href="https://www.eservices.nsdl.com/"
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex items-center justify-between hover:bg-emerald-50/50 hover:border-emerald-400 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
                    <Vote className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">E-Voting - NSDL</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </a>
            </div>

          </div>

          {/* Right Column: "Request a Callback" Form matching Page 9 */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              
              {/* Dark Emerald Header Banner matching Page 9 */}
              <div className="bg-gradient-to-r from-[#0a482e] to-[#052d1c] p-6 text-white">
                <h3 className="text-2xl font-bold tracking-tight">
                  Request a Callback
                </h3>
                <p className="text-xs text-emerald-200/80 mt-1 font-normal">
                  Our certified wealth managers will get in touch with you within 2 hours.
                </p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
                
                {success && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      Thank you! Your callback request has been registered. Our advisor will contact you shortly.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Rajesh Kumar"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Service Dropdown matching Page 9 */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    I am interested in
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white cursor-pointer"
                  >
                    <option value="">Select Service</option>
                    <option value="Equity & Derivatives Trading">Equity & Derivatives Trading</option>
                    <option value="Unlisted & Pre-IPO Shares">Unlisted & Pre-IPO Shares</option>
                    <option value="Mutual Funds & SIP">Mutual Funds & SIP</option>
                    <option value="IPO Applications & ASBA">IPO Applications & ASBA</option>
                    <option value="Wealth Management & PMS">Wealth Management & PMS</option>
                    <option value="Loan Solutions">Loan Solutions</option>
                    <option value="Demat Account Opening">Demat Account Opening</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none resize-none"
                  ></textarea>
                </div>

                {/* Submit Button matching Page 9 */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold bg-[#0f4b32] hover:bg-[#093523] text-white shadow-lg shadow-emerald-950/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Registering Callback..." : "Request Callback"}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
