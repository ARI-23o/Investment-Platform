import React, { useState, useEffect, useMemo } from "react";
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Landmark, 
  Calculator, 
  User, 
  PhoneCall, 
  Mail, 
  Building2, 
  BadgePercent, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  Sparkles, 
  FileText, 
  Check, 
  MessageCircle, 
  Home, 
  Car, 
  GraduationCap, 
  Briefcase, 
  Layers, 
  Coins, 
  HelpCircle,
  TrendingUp,
  CreditCard,
  MapPin
} from "lucide-react";
import { saveEnquiryToBackend } from "../services/api";
import { syncLeadToGoogleSheet } from "../utils/exportUtils";

export const LOAN_CATEGORIES = [
  {
    id: "home-loan",
    title: "Home Loans & Mortgages",
    rate: "8.40%",
    rateNum: 8.40,
    maxTenure: 30,
    defaultTenure: 20,
    minAmount: 500000,
    defaultAmount: 3500000,
    maxAmount: 100000000,
    icon: Home,
    tag: "Lowest Interest Rate",
    description: "New home purchases, balance transfers, construction, and plot loans with up to 30 years repayment."
  },
  {
    id: "personal-loan",
    title: "Personal Loan (Instant)",
    rate: "10.49%",
    rateNum: 10.49,
    maxTenure: 7,
    defaultTenure: 5,
    minAmount: 50000,
    defaultAmount: 500000,
    maxAmount: 5000000,
    icon: User,
    tag: "No Collateral Required",
    description: "Multi-purpose liquidity for emergencies, medical, travel, wedding, or high-interest debt payoff."
  },
  {
    id: "business-loan",
    title: "Business & MSME Loan",
    rate: "11.25%",
    rateNum: 11.25,
    maxTenure: 10,
    defaultTenure: 5,
    minAmount: 200000,
    defaultAmount: 2500000,
    maxAmount: 150000000,
    icon: Briefcase,
    tag: "Fast Working Capital",
    description: "Collateral-free and secured business expansion capital, machinery loans, and CGTMSE schemes."
  },
  {
    id: "lap-loan",
    title: "Loan Against Property (LAP)",
    rate: "8.75%",
    rateNum: 8.75,
    maxTenure: 20,
    defaultTenure: 15,
    minAmount: 1000000,
    defaultAmount: 5000000,
    maxAmount: 200000000,
    icon: Landmark,
    tag: "High Value Liquidity",
    description: "Unlock up to 75% market value of residential, commercial, or industrial real estate."
  },
  {
    id: "las-loan",
    title: "Loan Against Shares & MFs",
    rate: "9.50%",
    rateNum: 9.50,
    maxTenure: 5,
    defaultTenure: 3,
    minAmount: 100000,
    defaultAmount: 1000000,
    maxAmount: 50000000,
    icon: Coins,
    tag: "Keep Earning Returns",
    description: "Instant overdraft against listed/unlisted shares, mutual funds, and bonds without selling your portfolio."
  },
  {
    id: "auto-loan",
    title: "Auto & Vehicle Loan",
    rate: "8.90%",
    rateNum: 8.90,
    maxTenure: 8,
    defaultTenure: 5,
    minAmount: 200000,
    defaultAmount: 1200000,
    maxAmount: 15000000,
    icon: Car,
    tag: "Up to 100% On-Road",
    description: "New and pre-owned luxury cars, EVs, commercial fleet, and heavy vehicle financing."
  },
  {
    id: "education-loan",
    title: "Education & Study Loan",
    rate: "9.15%",
    rateNum: 9.15,
    maxTenure: 15,
    defaultTenure: 10,
    minAmount: 500000,
    defaultAmount: 2000000,
    maxAmount: 10000000,
    icon: GraduationCap,
    tag: "India & Overseas",
    description: "100% tuition and living expenses cover with moratorium period until course completion."
  },
  {
    id: "debt-consolidation",
    title: "Debt Consolidation Loan",
    rate: "10.25%",
    rateNum: 10.25,
    maxTenure: 7,
    defaultTenure: 5,
    minAmount: 200000,
    defaultAmount: 1500000,
    maxAmount: 20000000,
    icon: Layers,
    tag: "Save up to 40% EMI",
    description: "Combine expensive credit cards and multiple high-rate loans into one structured, lower monthly EMI."
  },
];

export default function LoanApplicationModal({ isOpen, onClose, selectedLoan = null, onSubmitted }) {
  // Active loan selection
  const [selectedLoanId, setSelectedLoanId] = useState("home-loan");
  
  // Financial inputs
  const [loanAmount, setLoanAmount] = useState(3500000);
  const [tenureYears, setTenureYears] = useState(20);
  const [employmentType, setEmploymentType] = useState("Salaried");
  const [monthlyIncome, setMonthlyIncome] = useState("₹50,000 - ₹1,00,000");
  
  // Applicant details
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [pan, setPan] = useState("");
  const [existingEmi, setExistingEmi] = useState("");
  const [notes, setNotes] = useState("");
  
  // UI & status state
  const [step, setStep] = useState(1); // 1 = Loan details & calculator, 2 = Personal & verification details
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationToken, setApplicationToken] = useState("");
  const [activeTab, setActiveTab] = useState("calculator"); // 'calculator', 'eligibility'

  // Preselect loan if passed via props
  useEffect(() => {
    if (selectedLoan) {
      const match = LOAN_CATEGORIES.find(
        (l) => l.id === selectedLoan.id || l.title.toLowerCase().includes((selectedLoan.title || "").toLowerCase().slice(0, 5))
      );
      if (match) {
        setSelectedLoanId(match.id);
        setLoanAmount(match.defaultAmount);
        setTenureYears(match.defaultTenure);
      }
    }
  }, [selectedLoan, isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const currentCategory = useMemo(() => {
    return LOAN_CATEGORIES.find((l) => l.id === selectedLoanId) || LOAN_CATEGORIES[0];
  }, [selectedLoanId]);

  // Calculate live EMI in real-time: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emiCalculations = useMemo(() => {
    const P = Number(loanAmount) || 0;
    const annualRate = currentCategory.rateNum;
    const r = annualRate / (12 * 100);
    const n = (Number(tenureYears) || 1) * 12;

    if (P <= 0 || n <= 0 || r <= 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayable: 0 };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
    };
  }, [loanAmount, tenureYears, currentCategory]);

  if (!isOpen) return null;

  const handleSelectCategory = (cat) => {
    setSelectedLoanId(cat.id);
    setLoanAmount(cat.defaultAmount);
    setTenureYears(cat.defaultTenure);
  };

  const formatAmountIndian = (num) => {
    if (!num) return "₹0";
    if (num >= 10000000) {
      const cr = (num / 10000000).toFixed(2);
      return `₹${cr.replace(/\.00$/, "")} Cr`;
    }
    if (num >= 100000) {
      const lakh = (num / 100000).toFixed(2);
      return `₹${lakh.replace(/\.00$/, "")} Lakhs`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !mobile || !email) {
      alert("Please fill in your name, mobile number and email address.");
      return;
    }

    setLoading(true);
    const generatedToken = "GSP-LOAN-" + Math.floor(10000 + Math.random() * 90000);
    setApplicationToken(generatedToken);

    const loanLeadRecord = {
      id: "LOAN-" + Date.now(),
      type: "loan",
      title: `${currentCategory.title}`,
      loanType: currentCategory.title,
      loanAmount: loanAmount,
      tenure: `${tenureYears} Years (${tenureYears * 12} Months)`,
      employmentType: employmentType,
      monthlyIncome: monthlyIncome,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      pan: pan.trim().toUpperCase(),
      existingEmi: existingEmi ? `₹${Number(existingEmi).toLocaleString("en-IN")}/mo` : "None",
      estimatedEmi: `₹${emiCalculations.monthlyEmi.toLocaleString("en-IN")}/mo`,
      service: "Credit & Loan Services",
      message: `[Loan Token: ${generatedToken}] Requested ${formatAmountIndian(loanAmount)} for ${tenureYears} yrs. Employment: ${employmentType} (${monthlyIncome}). City: ${city}. ${notes ? `Remarks: ${notes}` : ""}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "New Application"
    };

    try {
      // 1. Save locally to browser cache
      const cached = JSON.parse(localStorage.getItem("gsp_enquiries") || "[]");
      cached.unshift(loanLeadRecord);
      localStorage.setItem("gsp_enquiries", JSON.stringify(cached));

      // 2. Save to Central Server Backend (with automated email alert to gspbackoffice6@gmail.com)
      await saveEnquiryToBackend(loanLeadRecord);

      // 3. Dispatch to Google Sheet Webhook
      await syncLeadToGoogleSheet(loanLeadRecord);

      if (onSubmitted) {
        onSubmitted(loanLeadRecord);
      }
    } catch (err) {
      console.warn("Loan application sync notice:", err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setStep(1);
    setFullName("");
    setMobile("");
    setEmail("");
    setCity("");
    setPincode("");
    setPan("");
    setExistingEmi("");
    setNotes("");
    setApplicationToken("");
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b1419] text-white rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-amber-500/30 relative my-auto overflow-hidden"
      >
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Sticky Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0b1419]/95 backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-gray-950 flex items-center justify-center font-black shadow-md">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  GSP Credit & Loan Solutions
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Paperless • Low Interest
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Instant Online Eligibility, Lowest Bank Rates & Priority Processing
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-2 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-rose-600 border border-white/10 transition-all cursor-pointer shadow-md"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5">
          
          {!submitted ? (
            <div>
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step === 1 ? "bg-amber-400 text-gray-950" : "bg-emerald-600 text-white"
                  }`}>
                    {step > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
                  </span>
                  <span className={`font-semibold ${step === 1 ? "text-amber-300" : "text-gray-400"}`}>
                    Loan & EMI Calculator
                  </span>
                </div>

                <div className="w-8 h-[1px] bg-white/20" />

                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step === 2 ? "bg-amber-400 text-gray-950" : "bg-white/10 text-gray-400"
                  }`}>
                    2
                  </span>
                  <span className={`font-semibold ${step === 2 ? "text-amber-300" : "text-gray-400"}`}>
                    Applicant & Sanction Details
                  </span>
                </div>
              </div>

              {step === 1 ? (
                /* ========================================================================= */
                /* STEP 1: SELECT LOAN TYPE, AMOUNT, TENURE & LIVE EMI PREVIEW */
                /* ========================================================================= */
                <div className="space-y-5">
                  
                  {/* Category Selection Grid */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                      1. Select Loan Vertical
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {LOAN_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = cat.id === selectedLoanId;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleSelectCategory(cat)}
                            className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "bg-gradient-to-br from-[#12281d] to-[#0c1f17] border-amber-400 shadow-md shadow-amber-500/10 text-white"
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                isSelected ? "bg-amber-400 text-gray-950" : "bg-white/10 text-emerald-400"
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                                {cat.rate}
                              </span>
                            </div>
                            <div className="font-bold text-xs leading-tight line-clamp-1">
                              {cat.title}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Loan Details Highlight */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{currentCategory.title}</span>
                        <span className="text-gray-400 font-normal">({currentCategory.tag})</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {currentCategory.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="text-[10px] uppercase text-gray-400 font-mono">Benchmark Rate</div>
                      <div className="text-base font-black text-amber-400">{currentCategory.rate} p.a.</div>
                    </div>
                  </div>

                  {/* Loan Amount Slider & Quick Presets */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        2. Required Loan Amount
                      </label>
                      <div className="text-right">
                        <span className="text-xl font-black text-amber-300 font-mono">
                          {formatAmountIndian(loanAmount)}
                        </span>
                      </div>
                    </div>

                    <input 
                      type="range"
                      min={currentCategory.minAmount}
                      max={currentCategory.maxAmount}
                      step={50000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer h-2 bg-white/20 rounded-lg appearance-none"
                    />

                    {/* Quick Amount Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[500000, 1000000, 2500000, 5000000, 10000000, 25000000].map((amt) => {
                        if (amt < currentCategory.minAmount || amt > currentCategory.maxAmount) return null;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setLoanAmount(amt)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              loanAmount === amt
                                ? "bg-amber-400 text-gray-950 border-amber-400"
                                : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                            }`}
                          >
                            {formatAmountIndian(amt)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Loan Tenure Selector */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                        3. Repayment Tenure
                      </label>
                      <div className="text-right">
                        <span className="text-lg font-black text-white font-mono">
                          {tenureYears} Years <span className="text-xs text-gray-400 font-normal">({tenureYears * 12} Months)</span>
                        </span>
                      </div>
                    </div>

                    <input 
                      type="range"
                      min={1}
                      max={currentCategory.maxTenure}
                      step={1}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/20 rounded-lg appearance-none"
                    />

                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>1 Year</span>
                      <span>{Math.round(currentCategory.maxTenure / 2)} Years</span>
                      <span>{currentCategory.maxTenure} Years (Max)</span>
                    </div>
                  </div>

                  {/* ========================================================================= */}
                  {/* REAL-TIME LIVE EMI SUMMARY CARD */}
                  {/* ========================================================================= */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e291e] via-[#071d13] to-[#04120b] border border-emerald-500/40 shadow-xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <Calculator className="w-4 h-4" />
                        <span>Estimated Monthly EMI Preview</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        @ {currentCategory.rate} p.a.
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Monthly EMI</div>
                        <div className="text-base sm:text-lg font-black text-amber-300 font-mono mt-0.5">
                          ₹{emiCalculations.monthlyEmi.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Total Interest</div>
                        <div className="text-xs sm:text-sm font-bold text-gray-200 font-mono mt-1">
                          ₹{emiCalculations.totalInterest.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Total Payable</div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-300 font-mono mt-1">
                          ₹{emiCalculations.totalPayable.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Applicant & Verification Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              ) : (
                /* ========================================================================= */
                /* STEP 2: APPLICANT DETAILS, INCOME, CITY & FINAL SUBMISSION */
                /* ========================================================================= */
                <form onSubmit={handleLoanSubmit} className="space-y-4">
                  
                  {/* Selected Loan Summary Pill */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-400">Applying for: </span>
                      <strong className="text-amber-300">{currentCategory.title}</strong>
                      <span className="text-gray-400"> ({formatAmountIndian(loanAmount)}, {tenureYears} yrs)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-amber-400 hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Modify
                    </button>
                  </div>

                  {/* Row 1: Name & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Full Name (As per PAN/Aadhaar) *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rajesh Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-gray-500 focus:border-amber-400 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Mobile Number (10 Digits) *
                      </label>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="9096993499"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs placeholder-gray-500 focus:border-amber-400 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rajesh@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-gray-500 focus:border-amber-400 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        City / Location & Pincode *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Mumbai / Vasai"
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-gray-500 focus:border-amber-400 outline-none"
                        />
                        <input
                          type="text"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="Pincode"
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs placeholder-gray-500 focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Employment Type & Monthly Income */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Employment / Occupation *
                      </label>
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1d27] border border-white/15 text-white text-xs focus:border-amber-400 outline-none cursor-pointer"
                      >
                        <option value="Salaried (MNC / Corporate)">Salaried (MNC / Corporate)</option>
                        <option value="Salaried (Govt / PSU)">Salaried (Govt / PSU)</option>
                        <option value="Self-Employed Business / MSME">Self-Employed Business / MSME</option>
                        <option value="Self-Employed Professional (Doctor/CA/Lawyer)">Self-Employed Professional (Doctor/CA/Lawyer)</option>
                        <option value="Trader / Investor">Trader / Investor</option>
                        <option value="Retired / Others">Retired / Others</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Monthly Net Income / Turnover *
                      </label>
                      <select
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1d27] border border-white/15 text-white text-xs focus:border-amber-400 outline-none cursor-pointer"
                      >
                        <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000 / month</option>
                        <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 / month</option>
                        <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000 / month</option>
                        <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000 / month</option>
                        <option value="₹5,00,000+ / month">₹5,00,000+ / month</option>
                        <option value="₹50 Lakhs+ Annual Turnover">₹50 Lakhs+ Annual Turnover</option>
                        <option value="₹1 Crore+ Annual Turnover">₹1 Crore+ Annual Turnover</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: PAN (Optional) & Existing EMIs (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        PAN Number (Optional for CIBIL check)
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs uppercase placeholder-gray-500 focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Current Ongoing Monthly EMI (Optional)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={existingEmi}
                        onChange={(e) => setExistingEmi(e.target.value)}
                        placeholder="e.g. ₹15,000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-gray-500 focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Remarks / Message */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Additional Notes / Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific bank preference, collateral details, or urgent disbursement requirement..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-gray-500 focus:border-amber-400 outline-none resize-none"
                    />
                  </div>

                  {/* Security & Confidentiality Notice */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-gray-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Your data is 256-bit encrypted and shared solely with authorized banking credit underwriters.</span>
                  </div>

                  {/* Button Group */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-gray-300 transition-all cursor-pointer"
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#e8a317] hover:bg-[#d9940d] text-gray-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span>Processing & Dispatching Application...</span>
                      ) : (
                        <>
                          <Landmark className="w-4 h-4" />
                          <span>Submit Loan Application →</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          ) : (
            /* ========================================================================= */
            /* VIP LOAN SUBMISSION SUCCESS CONFIRMATION */
            /* ========================================================================= */
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-gray-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold mb-2">
                  LOAN REFERENCE ID: {applicationToken}
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  Loan Application Received!
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mt-1">
                  Thank you <strong>{fullName}</strong>. Your loan application for <strong>{currentCategory.title} ({formatAmountIndian(loanAmount)})</strong> has been logged in our central credit underwriting desk.
                </p>
              </div>

              {/* Action Steps Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs max-w-md mx-auto space-y-2 text-gray-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Next Steps & Sanction Workflow:</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  1. A dedicated <strong>Senior Credit Relationship Manager</strong> will call you at <strong className="text-white">{mobile}</strong> within 2 to 4 working hours.
                </p>
                <p className="text-[11px] text-gray-400">
                  2. A detailed pre-sanction offer letter and document checklist has been forwarded to <strong className="text-white">{email}</strong>.
                </p>
                <p className="text-[11px] text-gray-400">
                  3. For instant expedited processing, you can directly connect with our central loan desk via WhatsApp below.
                </p>
              </div>

              {/* Direct WhatsApp / Call Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2 max-w-md mx-auto">
                <a
                  href={`https://wa.me/919096993499?text=Hello%20GSP%20Investment%20Credit%20Desk%2C%20I%20have%20submitted%20my%20Loan%20Application%20(Token%3A%20${applicationToken})%20for%20${currentCategory.title}%20of%20amount%20${formatAmountIndian(loanAmount)}.%20Please%20expedite%20my%20sanction.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (Expedite)</span>
                </a>

                <a
                  href="tel:+919096993499"
                  className="py-3 px-4 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Call Desk</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
