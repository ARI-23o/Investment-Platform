import React from "react";
import { ShieldCheck, Award, Users, Target, CheckCircle2, TrendingUp } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-black uppercase tracking-widest text-emerald-800">
              ABOUT GSP INVESTMENT
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              1+ Year of Guiding Investors to{" "}
              <span className="font-serif-accent italic font-normal text-amber-600">
                Financial Freedom
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              GSP Investment Pvt. Ltd. is committed to democratizing access to Indian capital markets. From primary market IPO allotments to private unlisted equities and institutional-grade portfolio advisory, we bridge retail and HNI investors with superior market opportunities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#f8faf9] border border-gray-200/80">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Institutional Escrow</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Strict security standards and client asset protection protocols.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#f8faf9] border border-gray-200/80">
                <Target className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Unlisted Market Leader</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Direct CDSL/NSDL transfer with escrow-backed transparency.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dedicated Relationship Managers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ISO 27001 Security</span>
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
                  <span className="font-bold text-amber-300">U67120MH2008PTC182940</span>
                </div>
                <div className="flex justify-between py-2 border-b border-emerald-800/60">
                  <span className="text-emerald-200/80">NSE Member ID:</span>
                  <span className="font-bold text-white">14238</span>
                </div>
                <div className="flex justify-between py-2 border-b border-emerald-800/60">
                  <span className="text-emerald-200/80">BSE Member ID:</span>
                  <span className="font-bold text-white">6521</span>
                </div>
                <div className="flex justify-between py-2 border-b border-emerald-800/60">
                  <span className="text-emerald-200/80">CDSL DP ID:</span>
                  <span className="font-bold text-white">12081600</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-emerald-200/80">Active Assets Advisory:</span>
                  <span className="font-bold text-emerald-400">₹2,400+ Crores</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
