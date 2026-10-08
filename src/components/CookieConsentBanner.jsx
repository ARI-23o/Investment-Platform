import React, { useState, useEffect } from "react";
import { ShieldCheck, Cookie, X, Check, ArrowRight } from "lucide-react";

export default function CookieConsentBanner({ onNavigatePrivacy }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("gsp_cookie_consent");
      if (!consent) {
        // Show after a slight delay for better UX
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage access fallback
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("gsp_cookie_consent", "accepted");
    } catch (e) {
      console.warn("Storage error", e);
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("gsp_cookie_consent", "declined");
    } catch (e) {
      console.warn("Storage error", e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-gradient-to-br from-[#06241b] via-[#093327] to-[#041a13] text-white p-5 rounded-2xl shadow-2xl border border-emerald-500/30 backdrop-blur-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-emerald-400/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-amber-400">
            <Cookie className="w-5 h-5" />
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>Cookie & Privacy Policy</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </h4>
              <button 
                onClick={handleDecline}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              We use essential cookies to enhance site navigation, analyze traffic, and ensure SEBI/RBI compliance. No third-party ad tracking.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-800/40 flex items-center justify-between gap-3">
          <button
            onClick={onNavigatePrivacy}
            className="text-xs font-semibold text-emerald-300 hover:text-white hover:underline flex items-center gap-1 transition-colors"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 text-xs font-bold text-gray-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept All</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
