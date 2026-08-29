import React from "react";
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  ArrowRight,
  Download,
  ExternalLink
} from "lucide-react";

export default function DeviceSection({ onOpenPlatform }) {
  return (
    <section id="platforms" className="py-16 bg-[#fbfdfc] border-t border-gray-100 relative overflow-hidden">
      {/* Background Growth Graphic Matching Page 4 */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-15 select-none overflow-hidden">
        <img 
          src="/assets/growth_chart.jpg" 
          alt="" 
          className="w-full h-full object-cover object-right-top"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Trade Across{" "}
            <span className="font-serif-accent italic font-normal text-[#d97706] text-3xl sm:text-4xl">
              Every Device
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Switch seamlessly between web, mobile, and desktop — your portfolio travels with you.
          </p>
        </div>

        {/* 3 Column Feature Cards matching Page 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Web Trading */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Web Trading
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Trade directly from your browser with a powerful, intuitive interface.
              </p>

              <div className="space-y-3.5 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time market monitoring</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Customisable watchlists</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Portfolio overview</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => onOpenPlatform("web")}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border border-emerald-600/50 text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <span>Launch Web Terminal</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Mobile Trading (Featured Dark Emerald Card) */}
          <div className="bg-gradient-to-b from-[#0a482e] via-[#083b25] to-[#042417] text-white rounded-3xl p-8 shadow-2xl border border-emerald-500/40 relative flex flex-col justify-between lg:-translate-y-2 hover:-translate-y-3 transition-all duration-300">
            {/* Top highlight glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-emerald-400 rounded-full blur-xs"></div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-500/40 text-white flex items-center justify-center mb-6 shadow-inner">
                <Smartphone className="w-7 h-7" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                Award-Winning App
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Mobile Trading
              </h3>
              <p className="text-sm text-emerald-100/80 leading-relaxed mb-6">
                Invest on the go with our award-winning mobile application.
              </p>

              <div className="space-y-3.5 pt-2 border-t border-emerald-800/60">
                <div className="flex items-center gap-2.5 text-sm text-emerald-100 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>On-the-go investing</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-emerald-100 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Smart price alerts</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-emerald-100 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Live holdings tracking</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => onOpenPlatform("mobile")}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-[#e8a317] hover:bg-[#d49310] text-gray-900 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download for iOS & Android</span>
              </button>
            </div>
          </div>

          {/* Card 3: Desktop Terminal */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center mb-6">
                <Monitor className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Desktop Terminal
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Professional-grade tools for serious market participants.
              </p>

              <div className="space-y-3.5 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Advanced charting tools</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Multi-asset analytics</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Professional trading suite</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => onOpenPlatform("desktop")}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border border-gray-300 hover:border-gray-400 text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>Download Windows / Mac</span>
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
