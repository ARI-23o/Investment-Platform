import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  Mail, 
  FileText, 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Sparkles,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Check,
  RotateCw,
  X
} from "lucide-react";
import { syncLeadToGoogleSheet } from "../utils/exportUtils";
import { saveEnquiryToBackend } from "../services/api";

export default function CareersPage({ onBack, onApplicationSubmitted }) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [experienceYears, setExperienceYears] = useState("3+ Years");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentCtc, setCurrentCtc] = useState("");
  const [expectedCtc, setExpectedCtc] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("Immediate (0-15 Days)");
  const [resumeLink, setResumeLink] = useState("");
  const [coverNote, setCoverNote] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedApp, setSubmittedApp] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // 10s Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (isSuccessModalOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSuccessModalOpen, countdown]);

  const handleMobileChange = (e) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 10);
    setMobile(digitsOnly);
    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: null }));
  };

  const handleNameChange = (e) => {
    setFullName(e.target.value);
    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
  };

  const scrollToForm = () => {
    const el = document.getElementById("apply-form-card");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const errs = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name (minimum 2 characters)";
    }
    if (!mobile.trim() || mobile.length !== 10) {
      errs.mobile = "Please enter a valid 10-digit mobile number";
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      errs.mobile = "Please enter a valid Indian mobile number starting with 6-9";
    }
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address (e.g. ajayshah@gmail.com)";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      scrollToForm();
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const applicationId = "JOB-" + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const applicationRecord = {
      id: applicationId,
      type: "career",
      title: "Job Application: Sales Executive (B2B & B2C)",
      role: "Sales Executive (B2B & B2C)",
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      experience: experienceYears,
      currentCompany: currentCompany.trim() || "Not specified",
      currentCtc: currentCtc.trim() || "Not specified",
      expectedCtc: expectedCtc.trim() || "₹25,000 - ₹30,000 / month",
      noticePeriod: noticePeriod,
      resumeLink: resumeLink.trim() || "Not provided (Contact via phone/email)",
      coverNote: coverNote.trim() || "Applied for Sales Executive (B2B & B2C)",
      date: dateStr,
      time: timeStr,
      status: "Application Received - Under HR Review"
    };

    // 1. Save to Local Storage
    try {
      const existing = JSON.parse(localStorage.getItem("gsp_enquiries") || "[]");
      existing.unshift(applicationRecord);
      localStorage.setItem("gsp_enquiries", JSON.stringify(existing));
    } catch (err) {
      console.warn("Storage error", err);
    }

    // 2. Central API save
    try {
      await saveEnquiryToBackend(applicationRecord);
    } catch (err) {
      console.warn("Backend save error", err);
    }

    // 3. Sync to Google Sheets if configured
    try {
      syncLeadToGoogleSheet(applicationRecord);
    } catch (err) {
      console.warn("Sheet sync error", err);
    }

    // 4. Trigger callback if passed
    if (onApplicationSubmitted) {
      onApplicationSubmitted(applicationRecord);
    }

    // Format Email content for Gmail and Mailto
    const emailSubject = `Job Application: Sales Executive (B2B & B2C) - ${fullName.trim()} [${applicationId}]`;
    const emailBody = `Dear Hiring Team at GSP Investment Pvt. Ltd.,

I would like to apply for the position of Sales Executive (B2B & B2C).

--- APPLICANT DETAILS ---
• Application Ref ID: ${applicationId}
• Full Name: ${fullName.trim()}
• Mobile Number: +91 ${mobile.trim()}
• Email Address: ${email.trim()}
• Total Experience: ${experienceYears}
• Current / Last Company: ${currentCompany.trim() || "N/A"}
• Current CTC: ${currentCtc.trim() || "N/A"}
• Expected CTC: ${expectedCtc.trim() || "₹25,000 - ₹30,000 / month"}
• Notice Period: ${noticePeriod}
• Resume / LinkedIn Link: ${resumeLink.trim() || "Will share upon request"}

--- COVER NOTE / WHY I AM A GOOD FIT ---
${coverNote.trim() || "I have proven sales experience in the stock market/securities domain and look forward to contributing to GSP Investment's growth."}

Thank you.
Sincerely,
${fullName.trim()}
Phone: +91 ${mobile.trim()}
Email: ${email.trim()}`;

    const mailtoUrl = `mailto:gspinvestment6@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=gspinvestment6@gmail.com&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    setSubmittedApp({
      ...applicationRecord,
      mailtoUrl,
      gmailComposeUrl
    });

    setIsSubmitting(false);
    setIsSuccessModalOpen(true);
    setCountdown(10);
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb / Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-bold text-gray-700 hover:text-emerald-800 hover:border-emerald-500/50 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Home</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>We are Hiring • 1 Position Open</span>
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#063321] via-[#0b482f] to-[#042015] text-white p-8 sm:p-12 shadow-2xl overflow-hidden border border-emerald-600/30">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-widest border border-white/15">
              CAREERS AT GSP INVESTMENT PVT. LTD.
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Join Our Team:{" "}
              <span className="text-amber-400">Sales Executive</span>{" "}
              <span className="text-emerald-200 font-serif-accent italic font-normal text-2xl sm:text-3xl md:text-4xl block sm:inline">
                (B2B & B2C)
              </span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal pt-1">
              Are you a driven sales professional with a passion for the stock market? We are seeking an experienced Sales Executive to expand our client portfolio across both retail (B2C) and corporate/institutional (B2B) segments.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4 text-xs sm:text-sm font-semibold text-emerald-200">
              <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Full-Time</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Vasai West, Mumbai</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>₹25,000 – ₹30,000 / month</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={scrollToForm}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-2 transform active:scale-95"
              >
                <span>Apply for this Role Now</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Job Description Details on Left, Application Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Job Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Role Overview & Details Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  Job Specifications & Overview
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Reference: GSP-CAREER-SE2025 • Department: Institutional & Retail Wealth Sales
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Role</span>
                  <strong className="text-gray-900 text-sm block">Sales Executive (B2B & B2C)</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Employment Type</span>
                  <strong className="text-gray-900 text-sm block">Full-Time</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Location</span>
                  <strong className="text-gray-900 text-sm block">Vasai West, Mumbai</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Compensation</span>
                  <strong className="text-emerald-900 text-sm block">₹25,000 – ₹30,000 / month</strong>
                  <span className="text-[10px] text-gray-500">(Based on experience & track record)</span>
                </div>
              </div>

              {/* What You'll Do */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                  <Target className="w-5 h-5 text-emerald-700" />
                  <h3>What You’ll Do</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Drive business growth by acquiring and managing both individual retail traders (B2C) and high-value corporate/institutional accounts (B2B).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Present and pitch financial services, research insights, and trading solutions to prospective clients.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Build long-term relationships with investors, understanding their investment needs and portfolio goals.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Manage the complete sales pipeline, from lead generation and prospecting to closing and onboarding.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Meet and exceed monthly revenue and client acquisition targets.</span>
                  </li>
                </ul>
              </div>

              {/* What We're Looking For */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                  <Users className="w-5 h-5 text-emerald-700" />
                  <h3>What We’re Looking For</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">1</div>
                    <div>
                      <strong className="text-gray-900">Experience:</strong> Minimum 3+ years of proven sales experience in the stock market or securities domain.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">2</div>
                    <div>
                      <strong className="text-gray-900">Communication:</strong> Exceptional verbal and written fluency in English with outstanding interpersonal skills.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">3</div>
                    <div>
                      <strong className="text-gray-900">Industry Knowledge:</strong> In-depth understanding of equity markets, financial instruments, and trading practices.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">4</div>
                    <div>
                      <strong className="text-gray-900">Track Record:</strong> Demonstrated ability to pitch complex financial products, overcome objections, and close deals.
                    </div>
                  </li>
                </ul>
              </div>

              {/* What We Offer */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3>What We Offer</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                    <strong className="text-gray-900 block font-bold mb-1">Fixed Monthly Salary</strong>
                    <p className="text-gray-600">₹25,000 – ₹30,000 base pay (negotiable based on resume & track record).</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                    <strong className="text-gray-900 block font-bold mb-1">Incentives & Bonus</strong>
                    <p className="text-gray-600">Performance-based high reward incentives and milestone bonuses.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                    <strong className="text-gray-900 block font-bold mb-1">Professional Growth</strong>
                    <p className="text-gray-600">Direct exposure in capital markets, equities, and institutional advisory.</p>
                  </div>
                </div>
              </div>

              {/* Direct Mail Option */}
              <div className="p-4 rounded-2xl bg-[#0f4b32]/5 border border-[#0f4b32]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-gray-900">Prefer applying via direct Email?</div>
                  <div className="text-xs text-gray-600">Send your resume and profile directly to our HR desk.</div>
                </div>
                <a
                  href="mailto:gspinvestment6@gmail.com?subject=Job%20Application%3A%20Sales%20Executive%20(B2B%20%26%20B2C)"
                  className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  <span>gspinvestment6@gmail.com</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Application Form */}
          <div id="apply-form-card" className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-5">
              
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60 mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>DIRECT APPLICATION DESK</span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Apply for this Position
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Fill in your professional details below. Your submission will be routed directly to HR at <strong className="text-emerald-900">gspinvestment6@gmail.com</strong>.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Ajay Shah"
                    value={fullName}
                    onChange={handleNameChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none transition-all ${
                      errors.fullName 
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-600 focus:ring-1 focus:ring-rose-500" 
                        : "border-gray-200 focus:border-[#0f4b32] focus:ring-1 focus:ring-[#0f4b32]"
                    }`}
                    required
                  />
                  {errors.fullName && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1">⚠ {errors.fullName}</p>
                  )}
                </div>

                {/* Mobile Number with IN +91 layout */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-medium text-gray-400 tabular-nums">
                      {mobile.length}/10 digits
                    </span>
                  </div>
                  <div className={`flex items-center rounded-xl border bg-white overflow-hidden transition-all shadow-2xs ${
                    errors.mobile 
                      ? "border-rose-400 bg-rose-50/20 focus-within:border-rose-600 focus-within:ring-1 focus-within:ring-rose-500" 
                      : "border-gray-200 focus-within:border-[#0f4b32] focus-within:ring-1 focus-within:ring-[#0f4b32]"
                  }`}>
                    <div className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 text-gray-700 border-r border-gray-200 shrink-0 select-none">
                      <span className="text-xs font-bold text-gray-700">IN</span>
                      <span className="text-xs font-extrabold text-gray-900">+91</span>
                    </div>
                    <input 
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      placeholder="9096993499"
                      value={mobile}
                      onChange={handleMobileChange}
                      className="w-full px-3 py-2.5 text-sm font-bold text-gray-900 placeholder-gray-400 outline-none bg-transparent font-mono"
                      required
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1">⚠ {errors.mobile}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="email"
                    placeholder="e.g. ajayshah@gmail.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none transition-all ${
                      errors.email 
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-600 focus:ring-1 focus:ring-rose-500" 
                        : "border-gray-200 focus:border-[#0f4b32] focus:ring-1 focus:ring-[#0f4b32]"
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1">⚠ {errors.email}</p>
                  )}
                </div>

                {/* Experience & Notice Period Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Total Experience <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-white outline-none focus:border-[#0f4b32] cursor-pointer"
                    >
                      <option value="3+ Years">3+ Years (Recommended)</option>
                      <option value="4-5 Years">4 - 5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                      <option value="2-3 Years">2 - 3 Years</option>
                      <option value="1-2 Years">1 - 2 Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Notice Period
                    </label>
                    <select
                      value={noticePeriod}
                      onChange={(e) => setNoticePeriod(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-white outline-none focus:border-[#0f4b32] cursor-pointer"
                    >
                      <option value="Immediate (0-15 Days)">Immediate (0-15 Days)</option>
                      <option value="30 Days">30 Days</option>
                      <option value="45-60 Days">45-60 Days</option>
                      <option value="Currently Serving Notice">Serving Notice</option>
                    </select>
                  </div>
                </div>

                {/* Current Company & Designation */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Current / Last Employer & Role
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Sales Executive at ABC Securities"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32]"
                  />
                </div>

                {/* CTC Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Current CTC / Mo
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. ₹25,000 / mo"
                      value={currentCtc}
                      onChange={(e) => setCurrentCtc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Expected CTC / Mo
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. ₹30,000 / mo"
                      value={expectedCtc}
                      onChange={(e) => setExpectedCtc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32]"
                    />
                  </div>
                </div>

                {/* Resume / Portfolio Link */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Resume / Google Drive / LinkedIn URL
                  </label>
                  <input 
                    type="url"
                    placeholder="https://drive.google.com/... or LinkedIn profile"
                    value={resumeLink}
                    onChange={(e) => setResumeLink(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32]"
                  />
                </div>

                {/* Cover Note */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Why are you a good fit? (Brief summary)
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="Mention your stock market sales track record, client network, or trading knowledge..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-extrabold bg-[#0f4b32] hover:bg-[#093523] text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-400" />
                        <span>Submit Job Application →</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Your resume & details will be sent directly to HR at gspinvestment6@gmail.com</span>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          SUCCESS MODAL WITH 10S COUNTDOWN & DIRECT EMAIL OPTIONS
      ───────────────────────────────────────────────────────────── */}
      {isSuccessModalOpen && submittedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative space-y-5 animate-scale-up">
            
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wide">
                Ref ID: {submittedApp.id}
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Application Received!
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                Thank you, <strong>{submittedApp.fullName}</strong>. Your application for <strong>{submittedApp.role}</strong> has been logged in our HR desk.
              </p>
            </div>

            {/* Application Overview Box */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Applicant Name:</span>
                <strong className="text-gray-900">{submittedApp.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mobile:</span>
                <strong className="text-gray-900">+91 {submittedApp.mobile}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <strong className="text-gray-900">{submittedApp.email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Experience:</span>
                <strong className="text-emerald-900">{submittedApp.experience}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Destination HR Inbox:</span>
                <strong className="text-emerald-800 font-mono">gspinvestment6@gmail.com</strong>
              </div>
            </div>

            {/* Send / Open in Gmail Quick Actions */}
            <div className="space-y-2.5 pt-1">
              <a
                href={submittedApp.gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-[#e8a317] hover:bg-[#d49310] text-gray-950 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Open in Gmail with Pre-filled Application →</span>
              </a>

              <a
                href={submittedApp.mailtoUrl}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-gray-600" />
                <span>Open Default Email App</span>
              </a>
            </div>

            {/* Auto Close Footer with countdown */}
            <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>Modal auto-closes in {countdown}s</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
