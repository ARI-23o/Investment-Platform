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
  Info
} from "lucide-react";
import { syncLeadToGoogleSheet } from "../utils/exportUtils";

export function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState("password"); // 'password' or 'otp'
  const [mobileOrEmail, setMobileOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setAuthMode("password");
    setMobileOrEmail("GSP102839");
    setPassword("investor@123");
    setErrorMessage("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      // Check stored users or demo credentials
      const storedUsers = JSON.parse(localStorage.getItem("gsp_users") || "[]");
      const matchedUser = storedUsers.find(
        (u) => u.mobile === mobileOrEmail || u.email === mobileOrEmail || u.name.toLowerCase() === mobileOrEmail.toLowerCase()
      );

      if (authMode === "password") {
        if (
          (mobileOrEmail === "GSP102839" || mobileOrEmail.toLowerCase() === "investor@gsp.com") &&
          password === "investor@123"
        ) {
          onLoginSuccess && onLoginSuccess({ name: "Demo Investor", clientId: "GSP102839", email: "investor@gsp.com" });
          onClose();
          return;
        }

        if (matchedUser) {
          onLoginSuccess && onLoginSuccess(matchedUser);
          onClose();
          return;
        }

        // Allow any valid-looking login for convenience
        if (mobileOrEmail.trim().length >= 3 && password.length >= 4) {
          onLoginSuccess && onLoginSuccess({ name: mobileOrEmail, clientId: "GSP" + Math.floor(100000 + Math.random() * 900000) });
          onClose();
          return;
        }

        setErrorMessage("Invalid credentials. Try using the Demo credentials below!");
      } else {
        // OTP mode
        if (otp === "1234" || otp.length === 4) {
          const userObj = matchedUser || { name: mobileOrEmail || "Verified Investor", clientId: "GSP" + Math.floor(100000 + Math.random() * 900000) };
          onLoginSuccess && onLoginSuccess(userObj);
          onClose();
        } else {
          setErrorMessage("Please enter OTP 1234 or request a fresh OTP.");
        }
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 mb-3 font-black text-lg">
            GSP
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Investor Portal Login
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Access equity, portfolio value, and unlisted holdings
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950">
          <div className="flex items-center justify-between font-bold mb-1 text-emerald-900">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
              Demo Credentials:
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] bg-white hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 font-bold text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Fill Demo
            </button>
          </div>
          <div className="font-mono text-[11px] space-y-0.5 text-emerald-800">
            <div>Client ID: <strong className="text-gray-900">GSP102839</strong></div>
            <div>Password: <strong className="text-gray-900">investor@123</strong> (or OTP: <strong>1234</strong>)</div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode("password"); setErrorMessage(""); }}
            className={`py-2 rounded-lg transition-all ${authMode === "password" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500"}`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("otp"); setErrorMessage(""); }}
            className={`py-2 rounded-lg transition-all ${authMode === "otp" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500"}`}
          >
            Fast OTP (1234)
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Client ID / Mobile / Registered Name
            </label>
            <input
              type="text"
              required
              value={mobileOrEmail}
              onChange={(e) => setMobileOrEmail(e.target.value)}
              placeholder="e.g. GSP102839 or your registered mobile"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
          </div>

          {authMode === "password" ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={() => alert("Demo Password is: investor@123")} 
                  className="text-xs text-emerald-700 hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                4-Digit OTP (Use: 1234)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 1234"
                  maxLength={4}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => { setOtp("1234"); setOtpSent(true); }}
                  className="px-3.5 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                >
                  {otpSent ? "OTP: 1234" : "Get OTP"}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#0f4b32] hover:bg-[#093523] text-white shadow-md transition-all cursor-pointer mt-4 disabled:opacity-50"
          >
            {loading ? "Verifying Credentials..." : "Secure Login →"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          New to GSP Investment?{" "}
          <button 
            onClick={() => { onClose(); }} 
            className="text-emerald-800 font-bold hover:underline"
          >
            Open Account with Zero Brokerage
          </button>
        </div>
      </div>
    </div>
  );
}

export function OpenAccountModal({ isOpen, onClose, onRegisterSuccess }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pan, setPan] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !mobile || !pan) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: "USER-" + Date.now(),
        name,
        mobile,
        pan: pan.toUpperCase(),
        email: email || `${mobile}@gspinvestor.com`,
        clientId: "GSP" + Math.floor(100000 + Math.random() * 900000),
        registeredAt: new Date().toLocaleString(),
      };

      // Save user in localStorage
      const existing = JSON.parse(localStorage.getItem("gsp_users") || "[]");
      existing.push(newUser);
      localStorage.setItem("gsp_users", JSON.stringify(existing));

      // Also record in enquiries desk
      const accountLead = {
        id: "ACC-" + Date.now(),
        type: "account",
        title: "Demat & Trading Account Opening",
        fullName: name,
        mobile,
        pan: pan.toUpperCase(),
        email,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "Approved",
      };
      existingEnquiries.unshift(accountLead);
      localStorage.setItem("gsp_enquiries", JSON.stringify(existingEnquiries));

      // Sync to Google Sheet if configured
      syncLeadToGoogleSheet(accountLead);

      setLoading(false);
      setStep(2);

      setTimeout(() => {
        onRegisterSuccess && onRegisterSuccess(newUser);
        setStep(1);
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                ⚡ Paperless & 100% Free
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                Open Demat & Trading Account
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Zero AMC for 1st Year • Instant Activation with Aadhaar eKYC
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name (as per PAN) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Number (Aadhaar linked) *
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    PAN Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm uppercase focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 flex items-start gap-2 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  By registering, your account is immediately created and saved. You will be automatically logged in!
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-[#e8a317] hover:bg-[#d49310] text-gray-950 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? "Registering & Opening Account..." : "Create Free Demat Account →"}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Account Created & Registered!
            </h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Welcome, <strong>{name}</strong>! Your Demat account has been registered and you are now logged in.
            </p>
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

    // Sync to Google Sheet if configured
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
                  placeholder="Your Name"
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
                  placeholder="9876543210"
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
