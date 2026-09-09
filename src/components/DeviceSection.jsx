import React, { useState } from "react";
import { 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  PieChart
} from "lucide-react";

export default function DeviceSection({ onOpenPlatform }) {
  const [activeDevice, setActiveDevice] = useState("mobile");

  const devices = [
    {
      id: "mobile",
      label: "Mobile App",
      icon: Smartphone,
      badge: "Future Release • iOS & Android",
      title: "GSP Portfolio & Advisory App",
      subtitle: "Comprehensive portfolio tracking & expert wealth consultation on mobile.",
      description: "Stay connected with your dedicated Wealth Relationship Manager. Monitor equity advisory allocations, track unlisted share holdings, review curated research reports, and supervise SIPs anytime, anywhere.",
      features: [
        "Dedicated Wealth Manager direct advisory & call connect",
        "Live portfolio valuation & private unlisted holdings tracker",
        "Curated institutional research reports & market insights",
        "Automated capital gains & tax-ready portfolio statements",
      ],
      primaryCta: "Future Upcoming",
      primaryIcon: Clock,
      stat: "In Active Development",
    },
    {
      id: "desktop",
      label: "Desktop Workstation",
      icon: Monitor,
      badge: "Future Release • Web & Desktop",
      title: "GSP Wealth Advisory Portal",
      subtitle: "Institutional-grade portfolio analytics for HNIs & Family Offices.",
      description: "Advanced portfolio health monitoring, macro risk analysis, and comprehensive asset allocation views across listed equities, pre-IPO unlisted shares, and fixed-income assets with institutional governance.",
      features: [
        "Multi-asset portfolio heatmaps & allocation rebalancing guides",
        "Deep fundamental research & private equity valuation metrics",
        "Quarterly performance reviews & advisory consultation logs",
        "Direct family office multi-account consolidated dashboard",
      ],
      primaryCta: "Future Upcoming",
      primaryIcon: Clock,
      stat: "Upcoming Beta",
    },
  ];

  const current = devices.find((d) => d.id === activeDevice) || devices[0];

  return (
    <section id="platforms" className="py-20 bg-[#fafcfb] border-t border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">
            DIGITAL ADVISORY SUITE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Consult & Supervise on{" "}
            <span className="font-serif-accent italic font-normal text-amber-600">
              Every Device
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-normal">
            Stay in complete control of your wealth creation journey. Review portfolio analytics and consult with your advisor seamlessly across devices.
          </p>
        </div>

        {/* Device Switcher Horizontal Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-gray-100/90 border border-gray-200/80 shadow-inner max-w-full overflow-x-auto">
            {devices.map((device) => {
              const Icon = device.icon;
              const isActive = activeDevice === device.id;
              return (
                <button
                  key={device.id}
                  onClick={() => setActiveDevice(device.id)}
                  className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#0f4b32] text-white shadow-md shadow-emerald-950/20"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-gray-500"}`} />
                  <span>{device.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Device Showcase Area */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Details Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{current.badge}</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {current.title}
                </h3>
                <p className="text-base font-semibold text-[#c28414] mt-1">
                  {current.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                {current.description}
              </p>

              {/* 4 Feature Checkpoints */}
              <div className="space-y-3 pt-2">
                {current.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTA & Stat Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-gray-100">
                <button
                  disabled
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed shadow-xs select-none"
                >
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Future Upcoming</span>
                </button>

                <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                  ✨ {current.stat}
                </div>
              </div>
            </div>

            {/* Right Mockup Column */}
            <div className="lg:col-span-6 flex justify-center items-center">
              
              {/* MOCKUP 1: MOBILE APP */}
              {activeDevice === "mobile" && (
                <div className="w-72 sm:w-80 bg-gray-950 rounded-[44px] p-3.5 shadow-2xl border-4 border-gray-800 relative transform hover:scale-[1.01] transition-transform duration-300">
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-gray-900 rounded-full z-20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-950 mr-2"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
                  </div>
                  <div className="bg-[#031d13] rounded-[36px] overflow-hidden pt-8 pb-4 px-4 text-white text-xs font-sans space-y-4">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 px-1 pt-1">
                      <span>9:41 AM</span>
                      <span className="font-semibold text-emerald-400">5G 100%</span>
                    </div>
                    <div className="bg-[#063321] rounded-2xl p-4 border border-emerald-500/30 space-y-2">
                      <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">TOTAL PORTFOLIO VALUE</div>
                      <div className="text-2xl font-black text-white tracking-tight">₹14,82,350</div>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold"><span>↗ +₹1,24,210 (+8.37%) Total Gain</span></div>
                    </div>
                    <div className="bg-[#02130c] rounded-xl p-3 border border-emerald-950 space-y-2">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Portfolio Performance</span>
                        <span className="text-emerald-400 font-bold">+12.4% Annualized</span>
                      </div>
                      <svg className="w-full h-10 stroke-emerald-400 fill-none" viewBox="0 0 100 30">
                        <path d="M0,25 Q20,20 40,22 T80,8 T100,5" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#063321]/60 border border-emerald-900/60">
                        <div><div className="font-bold text-white text-xs">RELIANCE (NSE)</div><div className="text-[10px] text-gray-400">50 Shares • Equity</div></div>
                        <div className="text-right"><div className="font-bold text-white text-xs">₹3,14,200</div><div className="text-[10px] text-emerald-400 font-semibold">+2.4%</div></div>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#063321]/60 border border-emerald-900/60">
                        <div><div className="font-bold text-white text-xs">HDFC BANK (NSE)</div><div className="text-[10px] text-gray-400">30 Shares • Equity</div></div>
                        <div className="text-right"><div className="font-bold text-white text-xs">₹4,38,000</div><div className="text-[10px] text-emerald-400 font-semibold">+1.8%</div></div>
                      </div>
                    </div>
                    <div className="flex justify-around items-center pt-2 border-t border-emerald-900/60 text-[9px] text-gray-400">
                      <span className="text-amber-400 font-bold">● Portfolio</span>
                      <span>Advisory</span>
                      <span>Unlisted</span>
                      <span>Advisor</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MOCKUP 2: DESKTOP WORKSTATION */}
              {activeDevice === "desktop" && (
                <div className="w-full max-w-lg bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                  <div className="bg-gray-800/90 px-4 py-2.5 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400">GSP Wealth Advisor Station v2.0</div>
                    <div className="text-[10px] text-gray-400 font-mono">Advisory Sync: Live</div>
                  </div>
                  <div className="p-5 bg-gray-950 text-white space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="bg-gray-900 p-2 rounded-lg border border-gray-800"><div className="text-gray-400">EQUITY ADVISORY</div><div className="text-emerald-400 font-bold text-xs mt-0.5">₹38,50,000</div></div>
                      <div className="bg-gray-900 p-2 rounded-lg border border-gray-800"><div className="text-gray-400">UNLISTED SHARES</div><div className="text-amber-400 font-bold text-xs mt-0.5">₹12,20,000</div></div>
                      <div className="bg-gray-900 p-2 rounded-lg border border-gray-800"><div className="text-gray-400">MUTUAL FUNDS</div><div className="text-blue-400 font-bold text-xs mt-0.5">₹8,45,000</div></div>
                    </div>
                    <div className="bg-gray-900/90 rounded-xl p-3.5 border border-gray-800 space-y-2">
                      <div className="flex justify-between items-center text-[10px]"><span className="text-gray-400 font-semibold">Consolidated Portfolio Growth</span><span className="text-emerald-400 font-mono font-bold">+18.2% Total XIRR</span></div>
                      <svg className="w-full h-14 stroke-emerald-400 fill-none" viewBox="0 0 200 40">
                        <path d="M0,35 Q30,28 60,30 T120,15 T160,18 T200,6" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1">
                      <span>Assigned Wealth Manager: Vikram Singhania</span>
                      <span className="text-emerald-400 font-semibold">● Consultation Active</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
