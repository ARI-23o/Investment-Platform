import React, { useState } from "react";
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Mail, 
  FileText, 
  User, 
  KeyRound,
  Sparkles,
  Info,
  Clock,
  Rocket,
  Zap,
  Award,
  Layers,
  PhoneCall,
  MessageCircle,
  Check,
  ExternalLink,
  ShieldAlert,
  BadgeCheck,
  Cpu,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import { syncLeadToGoogleSheet } from "../utils/exportUtils";
import { saveEnquiryToBackend, registerUserInBackend, loginAdminServer } from "../services/api";

export function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const entered = password.trim();
    if (!entered) return;

    setLoading(true);
    const result = await loginAdminServer(entered);
    setLoading(false);

    if (result.success) {
      setPassword("");
      setErrorMessage("");
      onLoginSuccess && onLoginSuccess({ name: "Administrator", role: "admin", clientId: "ADMIN" });
      onClose();
    } else {
      setErrorMessage(result.error || "Authentication failed. Invalid password.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b131b] text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-500/20 relative overflow-hidden">
        
        {/* Ambient Lighting */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Security Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/30 text-emerald-400 mb-3 shadow-inner">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Secure Portal Login
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Enter your authorized access password
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-gray-500 focus:border-emerald-400 focus:bg-white/10 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-[#e8a317] hover:bg-[#d9940d] text-gray-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Authenticate & Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function OpenAccountModal({ isOpen, onClose, onRegisterSuccess }) {
  const [activeTab, setActiveTab] = useState("waitlist"); // 'waitlist' or 'assisted'
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [segment, setSegment] = useState("Unlisted Shares");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [vipId, setVipId] = useState("");
  
  // Interactive 3D Card Tilt State
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  if (!isOpen) return null;

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt angles (-12 to +12 deg)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setCardRotate({ x: rotateX, y: rotateY });
    setMousePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    setCardRotate({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!name || !mobile) {
      alert("Please fill in your name and mobile number.");
      return;
    }

    setLoading(true);
    const generatedVipId = "GSP-VIP-" + Math.floor(1000 + Math.random() * 9000);
    setVipId(generatedVipId);

    const waitlistLead = {
      id: "WAITLIST-" + Date.now(),
      type: "WAITLIST",
      title: `VIP Early Access: ${segment}`,
      fullName: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || `${mobile.trim()}@gspwaitlist.com`,
      service: segment,
      message: `Requested VIP Early Access for Digital Account Opening (Token: ${generatedVipId})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "VIP Reserved",
    };

    try {
      // Save locally & to backend
      const existingEnquiries = JSON.parse(localStorage.getItem("gsp_enquiries") || "[]");
      existingEnquiries.unshift(waitlistLead);
      localStorage.setItem("gsp_enquiries", JSON.stringify(existingEnquiries));
      await saveEnquiryToBackend(waitlistLead);
      syncLeadToGoogleSheet(waitlistLead);
    } catch (err) {
      console.warn("Waitlist sync warning:", err);
    }

    setLoading(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setName("");
    setMobile("");
    setEmail("");
    setVipId("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#0b131b] text-white rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-2xl border border-emerald-500/20 relative my-6 overflow-hidden">
        
        {/* Glowing Background Orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TOP STATUS BADGE */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Rocket className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Upcoming Feature • Beta Phase 2.0</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            Digital Account Opening
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-1">
            100% Paperless e-KYC & Instant Trading Desk is under active regulatory development.
          </p>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE 3D HOLOGRAPHIC ACCESS CARD */}
        {/* ============================================================ */}
        <div className="relative py-2 flex justify-center [perspective:1200px]">
          <div 
            onMouseMove={handleCardMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleCardMouseLeave}
            style={{
              transform: `rotateX(${cardRotate.x}deg) rotateY(${cardRotate.y}deg) ${isHovered ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"}`,
              transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
              transformStyle: "preserve-3d"
            }}
            className="w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/15 cursor-pointer relative overflow-hidden bg-gradient-to-br from-[#063323] via-[#0b241c] to-[#041310] select-none"
          >
            {/* Dynamic 3D Radial Light Sheen */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-60 mix-blend-overlay transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(232, 163, 23, 0.45), transparent 70%)`
              }}
            />

            {/* Subtle Metallic Grid Texture */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e8a317_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Card Header Layer */}
            <div className="flex items-center justify-between relative z-10 [transform:translateZ(30px)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-gray-950 font-black shadow-md">
                  G
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider text-amber-300 uppercase">GSP INVESTMENT</div>
                  <div className="text-[9px] text-gray-400 tracking-widest uppercase">Investor Access Pass</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-bold text-emerald-300 tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                SOON LIVE
              </span>
            </div>

            {/* 3D Smart EMV Chip & Hologram */}
            <div className="my-5 flex items-center justify-between relative z-10 [transform:translateZ(40px)]">
              <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-inner flex items-center justify-center border border-amber-300/40 relative">
                <div className="w-full h-full border border-amber-900/30 rounded flex flex-col justify-between p-1 opacity-70">
                  <div className="w-full h-[1px] bg-amber-950/40" />
                  <div className="flex justify-between">
                    <div className="w-2 h-2 rounded-full border border-amber-950/40" />
                    <div className="w-2 h-2 rounded-full border border-amber-950/40" />
                  </div>
                  <div className="w-full h-[1px] bg-amber-950/40" />
                </div>
                <Cpu className="w-4 h-4 text-amber-950 absolute opacity-50" />
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Secured By</div>
                <div className="text-xs font-bold text-gray-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  256-Bit e-KYC Vault
                </div>
              </div>
            </div>

            {/* Card Card Number & Holder */}
            <div className="relative z-10 [transform:translateZ(35px)]">
              <div className="font-mono text-sm sm:text-base font-bold tracking-[0.22em] text-amber-100/90 drop-shadow">
                •••• •••• •••• 2026
              </div>
              <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/10 text-[10px]">
                <div>
                  <div className="text-gray-400 uppercase tracking-widest">Cardholder Status</div>
                  <div className="font-bold text-amber-300 uppercase">VIP Early Adopter</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 uppercase tracking-widest">Zero Brokerage</div>
                  <div className="font-bold text-emerald-400">Lifetime Delivery</div>
                </div>
              </div>
            </div>

            {/* Floating 3D Feature Badges */}
            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] relative z-10 [transform:translateZ(25px)]">
              <div className="flex items-center gap-1.5 text-gray-300">
                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Instant Aadhaar OTP</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-300">
                <Layers className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>CDSL / NSDL Linking</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-300">
                <Award className="w-3 h-3 text-amber-400 shrink-0" />
                <span>₹0 Demat AMC 1st Year</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-300">
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Unlisted Shares Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NOTICE / STATUS INFORMATION */}
        {/* ============================================================ */}
        <div className="my-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Info className="w-4 h-4 shrink-0" />
            <span>Self-Service Digital Account Opening is Coming Soon!</span>
          </div>
          <p className="text-gray-300 text-[11px] leading-relaxed">
            Direct online registration is currently paused while we complete automated biometric Aadhaar & CDSL depository gateway integration. In the meantime, you can join the <strong>VIP Priority Waitlist</strong> or get <strong>Assisted Offline Onboarding</strong> via our dedicated team today.
          </p>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE TABS & ACTION CONTENT */}
        {/* ============================================================ */}
        {!submitted ? (
          <div>
            {/* Tab Selector */}
            <div className="flex rounded-xl bg-white/5 p-1 mb-4 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("waitlist")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "waitlist"
                    ? "bg-[#e8a317] text-gray-950 shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                Join VIP Waitlist
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("assisted")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "assisted"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Assisted Desk (Open Today)
              </button>
            </div>

            {/* TAB 1: VIP WAITLIST FORM */}
            {activeTab === "waitlist" ? (
              <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ajay Shah"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-gray-500 focus:border-amber-400 focus:bg-white/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9096993499"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-gray-500 focus:border-amber-400 focus:bg-white/10 outline-none font-mono transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ajay@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-gray-500 focus:border-amber-400 focus:bg-white/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Primary Interest
                    </label>
                    <select
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0e1b24] border border-white/15 text-white text-xs focus:border-amber-400 outline-none transition-all cursor-pointer"
                    >
                      <option value="Unlisted Shares">Unlisted & Pre-IPO Shares</option>
                      <option value="Demat & Trading">Zero Brokerage Demat</option>
                      <option value="Mutual Funds & SIP">Mutual Funds & SIP</option>
                      <option value="Corporate Fixed Deposits">Corporate FDs & Bonds</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Reserving Your VIP Access...</span>
                  ) : (
                    <>
                      <span>Reserve My VIP Early Access Pass</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* TAB 2: ASSISTED ONBOARDING DESK */
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Instant Assisted Account Opening Available
                  </div>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    Our dedicated Relationship Managers will help you complete Demat opening, unlisted share allocation, and KYC documentation offline or over phone/WhatsApp within 24 hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href="https://wa.me/919096993499?text=Hello%20GSP%20Investment%2C%20I%20want%20to%20open%20a%20Demat%20%26%20Trading%20Account%20via%20Assisted%20Onboarding."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp (Instant)
                  </a>

                  <a
                    href="tel:+919096993499"
                    className="py-3 px-4 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    Call Desk: +91 9096993499
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* 3D VIP CONFIRMATION SUCCESS VIEW */
          /* ============================================================ */
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-gray-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
              <BadgeCheck className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold mb-2">
                PRIORITY TOKEN: {vipId}
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                VIP Early Access Confirmed!
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 max-w-sm mx-auto mt-1">
                Thank you <strong>{name}</strong>! You are #{Math.floor(100 + Math.random() * 400)} on the priority rollout list for <strong>{segment}</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left text-xs max-w-sm mx-auto space-y-1.5 text-gray-300">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Check className="w-4 h-4 shrink-0" />
                <span>What Happens Next?</span>
              </div>
              <p className="text-[11px] text-gray-400">
                1. You will receive an SMS & WhatsApp invite as soon as digital onboarding goes live.
              </p>
              <p className="text-[11px] text-gray-400">
                2. Our senior relationship desk will contact you at <strong>{mobile}</strong> if you need immediate assisted portfolio setup.
              </p>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-300 cursor-pointer"
              >
                Submit Another
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-xs font-bold text-gray-950 cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export function QuickEnquiryModal({ isOpen, onClose, share, onSubmitted }) {
  const [qty, setQty] = useState(100);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!isOpen || !share) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const enquiryRecord = {
      id: "ENQ-" + Date.now(),
      type: "buy",
      title: share.name,
      share: share.name,
      quantity: qty,
      fullName: name,
      mobile,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Desk Assigned",
    };

    const existingEnquiries = JSON.parse(localStorage.getItem("gsp_enquiries") || "[]");
    existingEnquiries.unshift(enquiryRecord);
    localStorage.setItem("gsp_enquiries", JSON.stringify(existingEnquiries));

    // Save to Backend and sync to Google Sheet
    saveEnquiryToBackend(enquiryRecord);
    syncLeadToGoogleSheet(enquiryRecord);

    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        onSubmitted && onSubmitted(share.name);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!done ? (
          <div>
            <div className="mb-6">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Quick Enquiry
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-1">
                {share.name}
              </h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-gray-900">
                  ₹{share.price.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] font-bold text-amber-700 uppercase">
                  INDICATIVE
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Quantity (shares)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ajay Shah"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9096993499"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#0f4b32] hover:bg-[#093523] text-white shadow-md transition-all cursor-pointer mt-2"
              >
                {loading ? "Recording Enquiry..." : "Send Enquiry Now →"}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-bold text-gray-900">Enquiry Recorded!</h4>
            <p className="text-xs text-gray-600">
              Saved to your Enquiries Desk. Our dealer will contact you with current lot pricing and transfer settlement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ConsultAdvisorModal({ isOpen, onClose, service, onSubmitted }) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen || !service) return null;

  const handleMobileChange = (e) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 10);
    setMobile(digitsOnly);
    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "Please enter your name";
    }
    if (!mobile.trim() || mobile.length !== 10) {
      errs.mobile = "Please enter a valid 10-digit mobile number";
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    const enquiryRecord = {
      id: "ENQ-" + Date.now(),
      type: "consultation",
      title: `Consultation: ${service.title || service.name}`,
      service: service.title || service.name,
      tag: service.tag || service.badge || "Insurance",
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      message: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Desk Assigned",
      source: "Insurance Advisor Desk"
    };

    const existingEnquiries = JSON.parse(localStorage.getItem("gsp_enquiries") || "[]");
    existingEnquiries.unshift(enquiryRecord);
    localStorage.setItem("gsp_enquiries", JSON.stringify(existingEnquiries));

    saveEnquiryToBackend(enquiryRecord);
    syncLeadToGoogleSheet(enquiryRecord);

    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        onSubmitted && onSubmitted(enquiryRecord);
        onClose();
        setFullName("");
        setMobile("");
        setEmail("");
        setMessage("");
      }, 1600);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!done ? (
          <div>
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-[11px] font-bold tracking-wide mb-2 uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>{service.tag || service.badge || "Advisor Consultation"}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {service.title || service.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Connect with our certified insurance & portfolio specialists for customized quotes, policy comparison, and tax-saving advisory.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
                  }}
                  placeholder="e.g. Ajay Shah"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 outline-none font-medium"
                />
                {errors.fullName && (
                  <p className="text-rose-600 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number (10 Digits) *
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden bg-white focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600">
                  <div className="flex items-center gap-1 px-3 py-2.5 bg-gray-50 text-gray-700 border-r border-gray-200 shrink-0 select-none">
                    <span className="text-xs font-bold text-gray-600">IN</span>
                    <span className="text-xs font-extrabold text-gray-900">+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="9096993499"
                    className="w-full px-3 py-2.5 text-sm outline-none font-bold text-gray-900 placeholder-gray-400 bg-transparent font-mono"
                  />
                </div>
                {errors.mobile && (
                  <p className="text-rose-600 text-xs mt-1">{errors.mobile}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ajayshah@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Message / Preferred Callback Time (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Please call between 2 PM and 5 PM"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 flex items-center gap-2 border border-emerald-200/80">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>100% Confidential. Instant advisor callback within 15 minutes.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-[#0f4b32] hover:bg-[#093523] text-white shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Booking Consultation...</span>
                ) : (
                  <>
                    <span>Request Free Advisor Callback</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Consultation Booked!</h4>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              Thank you, <strong>{fullName}</strong>. Our dedicated {service.title} specialist will connect with you shortly on <strong>+91 {mobile}</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
