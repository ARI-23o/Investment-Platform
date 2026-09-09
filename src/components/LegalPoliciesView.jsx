import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  AlertTriangle, 
  ArrowLeft, 
  Scale, 
  Building2, 
  Mail, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Info,
  RotateCcw
} from "lucide-react";

export default function LegalPoliciesView({ initialTab = "risk", onBack, onNavigateTab }) {
  // Normalize 'disclaimer' to 'risk' if passed
  const getNormalizedTab = (tab) => (tab === "disclaimer" ? "risk" : tab);
  const [activeTab, setActiveTab] = useState(getNormalizedTab(initialTab)); // 'risk', 'terms', 'privacy', 'refund'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(getNormalizedTab(initialTab));
    }
  }, [initialTab]);

  const handleTabChange = (tab) => {
    const normalized = getNormalizedTab(tab);
    setActiveTab(normalized);
    if (onNavigateTab) onNavigateTab(normalized);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-bold text-gray-700 hover:text-emerald-800 hover:border-emerald-500/50 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Home</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <span>Corporate Entity:</span>
            <strong className="text-gray-900">GSP Investment Pvt. Ltd.</strong>
            <span className="text-gray-300">•</span>
            <span className="font-mono text-emerald-800 font-semibold">CIN: U64990MH2025PTC449205</span>
          </div>
        </div>

        {/* Legal Page Header */}
        <div className="rounded-3xl bg-gradient-to-br from-[#063321] via-[#09422b] to-[#031d13] text-white p-8 sm:p-10 shadow-xl border border-emerald-600/30">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-widest border border-white/10">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>LEGAL POLICIES & STATUTORY COMPLIANCE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {(activeTab === "risk" || activeTab === "disclaimer") && "Risk Disclosure & Statutory Notice"}
              {activeTab === "terms" && "Term & Conditions"}
              {activeTab === "privacy" && "Privacy Policy & Data Protection"}
              {activeTab === "refund" && "Refund & Cancellation Policy"}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              Official regulatory disclosures, terms of operation, privacy protocols, and refund guidelines governed by <strong>GSP Investment Pvt. Ltd.</strong>
            </p>

            <div className="pt-2 text-[11px] text-emerald-300/80 flex items-center gap-2">
              <span>Last updated & effective date:</span>
              <strong className="text-white font-mono">1 January 2026</strong>
            </div>
          </div>
        </div>

        {/* Main Grid: Sticky Sidebar on Left, Content on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Tab Navigation */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 pb-2 border-b border-gray-100">
                Legal Documents
              </div>

              <button
                onClick={() => handleTabChange("risk")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  (activeTab === "risk" || activeTab === "disclaimer")
                    ? "bg-[#0f4b32] text-white shadow-md"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className={`w-4 h-4 ${(activeTab === "risk" || activeTab === "disclaimer") ? "text-amber-400" : "text-amber-600"}`} />
                  <span>Risk Disclosure</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => handleTabChange("terms")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === "terms"
                    ? "bg-[#0f4b32] text-white shadow-md"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className={`w-4 h-4 ${activeTab === "terms" ? "text-emerald-300" : "text-emerald-700"}`} />
                  <span>Term & Conditions</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => handleTabChange("privacy")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === "privacy"
                    ? "bg-[#0f4b32] text-white shadow-md"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Lock className={`w-4 h-4 ${activeTab === "privacy" ? "text-emerald-300" : "text-emerald-700"}`} />
                  <span>Privacy</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => handleTabChange("refund")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === "refund"
                    ? "bg-[#0f4b32] text-white shadow-md"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className={`w-4 h-4 ${activeTab === "refund" ? "text-amber-400" : "text-emerald-700"}`} />
                  <span>Refund Policy</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </div>

            {/* Entity Verification Card */}
            <div className="bg-emerald-50/70 rounded-3xl p-5 border border-emerald-200/80 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Corporate Credentials</span>
              </div>
              <div className="space-y-1 text-emerald-950 font-medium">
                <div>Entity: <strong>GSP Investment Pvt. Ltd.</strong></div>
                <div>CIN: <strong>U64990MH2025PTC449205</strong></div>
                <div>Reg. No: <strong>449205</strong> (ROC Mumbai)</div>
                <div>GSTIN: <strong>27AAMCG0815G1ZP</strong></div>
              </div>
              <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800 space-y-1">
                <div>Support: <a href="mailto:gspinvestment6@gmail.com" className="font-bold underline">gspinvestment6@gmail.com</a></div>
                <div>Compliance: <a href="mailto:gspbackoffice6@gmail.com" className="font-bold underline">gspbackoffice6@gmail.com</a></div>
                <div>Helpline: <a href="tel:02503594768" className="font-bold">0250 359 4768</a></div>
              </div>
            </div>

          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm leading-relaxed text-gray-800 space-y-8">
            
            {/* ─────────────────────────────────────────────────────────────
                TAB 1: RISK DISCLOSURE
            ───────────────────────────────────────────────────────────── */}
            {(activeTab === "risk" || activeTab === "disclaimer") && (
              <div className="space-y-6 text-xs sm:text-sm">
                
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Risk Disclosure & Statutory Information Notice
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Please read this statutory risk disclosure carefully before using the services of GSP Investment Pvt. Ltd.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs leading-relaxed space-y-2">
                  <div className="font-extrabold uppercase flex items-center gap-1.5 text-amber-900 text-[11px] tracking-wide">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>General Market Notice & Informational Nature</span>
                  </div>
                  <p>
                    <strong>GSP Investment Pvt. Ltd.</strong> operates an informational wealth and investment advisory platform providing market updates, research analysis, mutual fund advisory, insurance & loan solutions, and unlisted company information.
                  </p>
                  <p>
                    This platform is <strong>NOT</strong> a stock exchange or a secondary market trading floor recognized under the Securities Contracts (Regulation) Act, 1956.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900">1. Not Financial or Investment Advice</h3>
                  <p className="text-gray-600">
                    All content, research reports, price indications, financial valuation metrics, and market commentary published on this website are for <strong>informational and educational purposes only</strong>.
                  </p>
                  <p className="text-gray-600">
                    Nothing contained on this website constitutes personalized investment advice, a guarantee of future appreciation, a solicitation to buy or sell securities, or legal/tax counsel. Investors must evaluate their financial position, tax bracket, and risk profile before investing.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">2. Investment Risks in Capital Markets & Unlisted Shares</h3>
                  <p className="text-gray-600">
                    Investments in securities, equities, and pre-IPO unlisted shares are subject to significant market risks, including:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-gray-700 pl-1">
                    <li><strong>Capital Risk:</strong> Potential fluctuation or total loss of invested capital.</li>
                    <li><strong>Liquidity Risk:</strong> Unlisted securities do not have an active secondary exchange and may involve extended holding periods.</li>
                    <li><strong>Valuation Uncertainty:</strong> Prices for unlisted shares are indicative based on off-market lot transactions and demand-supply parity.</li>
                    <li><strong>Regulatory Changes:</strong> Changes in tax laws, corporate laws, or depository rules may impact transfer times and taxes.</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">3. Past Performance Disclaimer</h3>
                  <p className="text-gray-600">
                    <strong>Past performance is NOT indicative of future results.</strong> Historical returns, CAGR records, previous IPO listings, and past portfolio gains are not guarantees of future performance.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">4. Due Diligence Responsibility of Investors</h3>
                  <p className="text-gray-600">
                    Every investor is solely responsible for conducting independent due diligence, verifying financial statements, reviewing MCA filings, and consulting qualified tax professionals (Chartered Accountants) before participating in private securities transfers or wealth products.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">5. Limitation of Liability</h3>
                  <p className="text-gray-600">
                    To the maximum extent permitted by applicable Indian law, GSP Investment Pvt. Ltd., its directors, officers, associates, and employees shall not be liable for any direct, indirect, incidental, or consequential damages resulting from investment decisions made based on platform content or third-party reports.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">6. Governing Law & Jurisdiction</h3>
                  <p className="text-gray-600">
                    This risk disclosure and any disputes arising out of the use of this website shall be governed by the <strong>Laws of India</strong> and shall be subject to the exclusive jurisdiction of the competent courts in <strong>Maharashtra (Mumbai / Vasai / Thane)</strong>.
                  </p>
                </div>

              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                TAB 2: TERMS OF USE (TERM & CONDITIONS)
            ───────────────────────────────────────────────────────────── */}
            {activeTab === "terms" && (
              <div className="space-y-6 text-xs sm:text-sm">
                
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Term & Conditions
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Electronic Agreement under Information Technology Act, 2000
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900">1. Preamble & Acceptance</h3>
                  <p className="text-gray-600">
                    This document is an electronic record generated by a computer system and does not require physical or digital signatures. It is published in accordance with the provisions of Rule 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011.
                  </p>
                  <p className="text-gray-600">
                    By accessing, browsing, registering, or submitting enquiries on <strong>www.gspinvestment.com</strong>, you agree to be bound by these Term & Conditions, our Privacy policy, Risk Disclosure, and Refund Policy. If you do not agree to these terms, please refrain from using this website.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">2. Corporate Entity Details</h3>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5 text-gray-700">
                    <div><strong>Legal Entity:</strong> GSP Investment Pvt. Ltd.</div>
                    <div><strong>Corporate Identification Number (CIN):</strong> U64990MH2025PTC449205</div>
                    <div><strong>Registration Number:</strong> 449205 (ROC Mumbai)</div>
                    <div><strong>GSTIN:</strong> 27AAMCG0815G1ZP</div>
                    <div><strong>Registered Address:</strong> A-302 Aparna Niwas, Behind Tungareshwar sweet, Near Vasai road station, Vasai West, Vasai-Virar City, Maharashtra 401202.</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">3. Eligibility & User Representation</h3>
                  <p className="text-gray-600">
                    You represent that you are at least 18 years of age, legally competent to enter into binding contracts under the Indian Contract Act, 1872, and authorized to make personal or institutional financial decisions.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">4. Scope of Advisory & Intermediary Services</h3>
                  <p className="text-gray-600">
                    GSP Investment Pvt. Ltd. facilitates:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-gray-700 pl-1">
                    <li>Research, valuation, and off-market institutional coordination for Pre-IPO & Unlisted Shares.</li>
                    <li>Systematic Investment Plan (SIP) and mutual fund portfolio allocation advisory.</li>
                    <li>Insurance solutions (Life, Health, Motor, GMC, Marine) through certified advisory channels.</li>
                    <li>Assistance in Demat account onboarding, KYC verification desk, and portfolio restructuring.</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">5. Prohibited Activities</h3>
                  <p className="text-gray-600">
                    Users of the platform agree NOT to:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-gray-700 pl-1">
                    <li>Engage in market manipulation, circular trading, or spread unverified rumours.</li>
                    <li>Use automated bots, web scrapers, or unauthorized data miners without written consent.</li>
                    <li>Transmit malicious code, viruses, or disruptive electronic files.</li>
                    <li>Impersonate any individual, broker, or institutional entity.</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">6. Intellectual Property</h3>
                  <p className="text-gray-600">
                    All logos, brand assets, calculators, user interface designs, charts, and proprietary research reports belong exclusively to <strong>GSP Investment Pvt. Ltd.</strong> Unauthorized reproduction, mirroring, or commercial exploitation is strictly prohibited under the Copyright Act, 1957.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">7. Account Termination & Dispute Resolution</h3>
                  <p className="text-gray-600">
                    GSP Investment Pvt. Ltd. reserves the right to suspend or terminate access to any user violating these terms. Any disputes shall be governed by Indian law with exclusive jurisdiction in the courts of Maharashtra.
                  </p>
                </div>

              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                TAB 3: PRIVACY
            ───────────────────────────────────────────────────────────── */}
            {activeTab === "privacy" && (
              <div className="space-y-6 text-xs sm:text-sm">
                
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Privacy & Data Protection
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    In compliance with the Information Technology Act, 2000 & SPDI Rules, 2011
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900">1. Commitment to Privacy</h3>
                  <p className="text-gray-600">
                    <strong>GSP Investment Pvt. Ltd.</strong> ("we," "us," or "our") is dedicated to protecting your privacy and ensuring the security of your personal and financial data. This Privacy Policy explains how we collect, store, process, and safeguard your information.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">2. Information We Collect</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                      <strong className="text-gray-900 block font-bold">Personal Identifiers</strong>
                      <p className="text-gray-600">Full Name, Mobile Number, Email Address, PAN Number (for KYC/Demat requests), and Communication Address.</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                      <strong className="text-gray-900 block font-bold">Investment Profile Data</strong>
                      <p className="text-gray-600">Share enquiry preferences, lot sizes, SIP calculator goals, insurance requirements, and consultation notes.</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                      <strong className="text-gray-900 block font-bold">Career & Resume Data</strong>
                      <p className="text-gray-600">Job application submissions, CVs, employment track records, CTC metrics, and LinkedIn links.</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                      <strong className="text-gray-900 block font-bold">Technical Log Data</strong>
                      <p className="text-gray-600">IP address, browser type, device details, and session timestamps for security & fraud prevention.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">3. How We Use Your Information</h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-700 pl-1">
                    <li>To verify identity and assist in Demat account opening & KYC updation.</li>
                    <li>To deliver requested stock quotes, lot confirmations, and callback services.</li>
                    <li>To process job applications and HR recruitment workflows.</li>
                    <li>To comply with statutory obligations under Indian tax and corporate laws.</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">4. No Sale of Personal Information</h3>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
                    <strong>Zero-Spam & Zero-Sale Guarantee:</strong> We <strong>DO NOT SELL</strong>, rent, or lease your personal information, mobile numbers, or email addresses to any third-party marketing companies or unauthorized data brokers.
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">5. Data Security & Encryption</h3>
                  <p className="text-gray-600">
                    We maintain industry-standard physical, electronic, and procedural safeguards (including SSL/TLS 256-bit encryption and restricted access controls) to prevent unauthorized access, loss, or alteration of sensitive data.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">6. Grievance Redressal & Contact Officer</h3>
                  <p className="text-gray-600">
                    For privacy inquiries, data deletion requests, or regulatory queries:
                  </p>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
                    <div><strong>Grievance Desk:</strong> Compliance & Data Security Officer</div>
                    <div><strong>Company:</strong> GSP Investment Pvt. Ltd.</div>
                    <div><strong>Email:</strong> <a href="mailto:gspbackoffice6@gmail.com" className="text-emerald-800 font-bold underline">gspbackoffice6@gmail.com</a></div>
                    <div><strong>Support Email:</strong> <a href="mailto:gspinvestment6@gmail.com" className="text-emerald-800 font-bold underline">gspinvestment6@gmail.com</a></div>
                    <div><strong>Office:</strong> A-302 Aparna Niwas, Behind Tungareshwar sweet, Near Vasai road station, Vasai West, Vasai-Virar City, Maharashtra 401202.</div>
                  </div>
                </div>

              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                TAB 4: REFUND POLICY
            ───────────────────────────────────────────────────────────── */}
            {activeTab === "refund" && (
              <div className="space-y-6 text-xs sm:text-sm">
                
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Refund & Cancellation Policy
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Applicable for investment transactions, advisory services, and off-market processing
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs leading-relaxed space-y-2">
                  <div className="font-extrabold uppercase flex items-center gap-1.5 text-emerald-900 text-[11px] tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Client Protection & Transparent Refund Framework</span>
                  </div>
                  <p>
                    <strong>GSP Investment Pvt. Ltd.</strong> operates with complete transparency and regulatory adherence under Indian financial regulations. This policy outlines clear guidelines regarding order cancellations, settlement finality, and refund eligibility.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900">1. Settlement Finality in Securities & Demat Transfers</h3>
                  <p className="text-gray-600">
                    As per Indian securities laws and Depository Participant (CDSL / NSDL) regulations, once an unlisted share transfer, off-market transaction, or secondary market execution is confirmed and credited to the investor's designated Demat account, <strong>the transaction is considered final, irreversible, and non-refundable</strong>.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">2. 100% Refund on Failed Allocations / Unfulfilled Orders</h3>
                  <p className="text-gray-600">
                    If an investor places a purchase request or advance for pre-IPO / unlisted shares and GSP Investment Pvt. Ltd. is unable to execute the transaction due to corporate unavailability, registry non-allotment, or regulatory compliance rejection, <strong>the client is entitled to a 100% full refund</strong> of the advance funds.
                  </p>
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1">
                    <div><strong>Processing Window:</strong> Refund will be credited within <strong>3 to 7 business working days</strong>.</div>
                    <div><strong>Destination Account:</strong> Transferred directly to the verified originating bank account of the client.</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">3. Excess or Duplicate Debits</h3>
                  <p className="text-gray-600">
                    In case of technical errors, duplicate banking transactions, or excess debits occurring during online payment processing or banking transfers, the excess amount will be refunded automatically or upon verification within <strong>2 to 5 business working days</strong>.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">4. Statutory Taxes & Third-Party Regulatory Fees</h3>
                  <p className="text-gray-600">
                    Any statutory government charges, stamp duty levied by states, GST, or depository transfer fees already remitted to regulatory authorities (SEBI / CDSL / NSDL / ROC) are strictly non-refundable as they are consumed by statutory bodies during document and transfer processing.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">5. Refund Mode & Anti-Money Laundering (PMLA) Protocol</h3>
                  <p className="text-gray-600">
                    In strict accordance with Prevention of Money Laundering Act (PMLA) guidelines:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-gray-700 pl-1">
                    <li>All refunds are issued exclusively via banking electronic channels (NEFT / RTGS / IMPS / UPI) to the investor's verified KYC bank account.</li>
                    <li><strong>No cash refunds or third-party bank transfers are permitted under any circumstances.</strong></li>
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-gray-900">6. How to Request a Refund / Grievance Escalation</h3>
                  <p className="text-gray-600">
                    To initiate a refund request or report a payment discrepancy, please submit your transaction reference number and bank confirmation receipt:
                  </p>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
                    <div><strong>Customer Support Desk:</strong> <a href="mailto:gspinvestment6@gmail.com" className="text-emerald-800 font-bold underline">gspinvestment6@gmail.com</a></div>
                    <div><strong>Compliance & Accounts Desk:</strong> <a href="mailto:gspbackoffice6@gmail.com" className="text-emerald-800 font-bold underline">gspbackoffice6@gmail.com</a></div>
                    <div><strong>Helpline:</strong> <a href="tel:02503594768" className="font-bold">0250 359 4768</a> | <strong>WhatsApp:</strong> <a href="https://wa.me/919096993499" className="font-bold">+91 9096993499</a></div>
                    <div><strong>Registered Address:</strong> A-302 Aparna Niwas, Behind Tungareshwar sweet, Near Vasai road station, Vasai West, Vasai-Virar City, Maharashtra 401202.</div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
