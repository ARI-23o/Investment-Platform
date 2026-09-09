import React from "react";
import { ShieldCheck, Target, CheckCircle2, TrendingUp, Compass, BarChart3 } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-black uppercase tracking-widest text-emerald-800">
              ABOUT GSP INVESTMENT
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              7+ Years of Guiding Investors to{" "}
              <span className="font-serif-accent italic font-normal text-amber-600">
                Financial Freedom
              </span>
            </h2>

            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                A Foundation Built on 7+ Years of Market Mastery
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                While GSP Investment Private Limited was incorporated in 2025, our core expertise is rooted in over 7 years of hands-on equity research and active portfolio management.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Before formalizing our corporate structure, we spent seven years in the trenches of the financial markets—navigating bull and bear cycles, managing diverse client portfolios, and mastering the art of disciplined risk management.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Our incorporation marks the natural evolution of this journey. Today, we bring institutional governance, data-backed strategies, and robust transparency to the same trusted, client-first wealth creation approach that our investors have relied on for years.
              </p>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#f8faf9] border border-gray-200/80">
                <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">7+ Years Active Experience</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Hands-on market research & active portfolio management.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#f8faf9] border border-gray-200/80">
                <Compass className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Market Cycles Navigated</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Proven track record across multiple bull and bear phases.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#f8faf9] border border-gray-200/80">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Institutional Governance</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Transparent, data-backed, client-first fiduciary focus.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#f8faf9] border border-gray-200/80">
                <BarChart3 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Disciplined Risk Control</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Capital preservation and sustainable long-term growth.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#063321] to-[#031d13] text-white shadow-2xl border border-emerald-600/30">
              <div className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-4">
                Corporate Credentials
              </div>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-emerald-800/60">
                  <span className="text-emerald-200/80">Entity Name:</span>
                  <span className="font-bold text-white">GSP Investment Pvt. Ltd.</span>
                </div>
                <div className="flex justify-between py-2 border-b border-emerald-800/60">
                  <span className="text-emerald-200/80">Corporate CIN:</span>
                  <span className="font-bold text-amber-300">U64990MH2025PTC449205</span>
                </div>
                <div className="flex justify-between py-2 border-b border-emerald-800/60">
                  <span className="text-emerald-200/80">Registration Number:</span>
                  <span className="font-bold text-white font-mono">449205</span>
                </div>
                <div className="flex justify-between py-2 border-b border-emerald-800/60">
                  <span className="text-emerald-200/80">ROC:</span>
                  <span className="font-bold text-white">ROC Mumbai</span>
                </div>
                <div className="flex justify-between py-2 border-b border-emerald-800/60">
                  <span className="text-emerald-200/80">GSTIN:</span>
                  <span className="font-bold text-white font-mono">27AAMCG0815G1ZP</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-emerald-200/80">Active Assets Advisory:</span>
                  <span className="font-bold text-emerald-400">₹50+ Crores</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
