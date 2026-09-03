import React, { useState } from "react";
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  ArrowRight,
  Download,
  ExternalLink,
  TrendingUp,
  ArrowUpRight,
  Sliders,
  Shield,
  Zap,
  Layers,
  BarChart2,
  Cpu
} from "lucide-react";

export default function DeviceSection({ onOpenPlatform }) {
  const [activeDevice, setActiveDevice] = useState("web");

  const devices = [
    {
      id: "web",
      label: "Web Trading",
      icon: Globe,
      badge: "No Install Needed",
      title: "Web Trading Platform",
      subtitle: "Lightning-fast browser trading engineered for modern investors.",
      description: "Trade equities, F&O, commodities and IPOs directly in Google Chrome, Safari, Edge or Firefox without downloading any software. Featuring real-time WebSocket tick-by-tick market feeds and instant order execution.",
      features: [
        "Real-time WebSocket streaming market data",
        "Multi-timeframe charts with 100+ technical indicators",
        "Customisable multi-market watchlists with drag-and-drop",
        "Instant one-click order placement with bracket & stop-loss",
      ],
      primaryCta: "Launch Web Platform",
      primaryIcon: ExternalLink,
      stat: "100+ Indicators",
    },
    {
      id: "mobile",
      label: "Mobile App",
      icon: Smartphone,
      badge: "iOS & Android",
      title: "GSP Mobile Trader",
      subtitle: "Power-packed investment application in the palm of your hand.",
      description: "Experience the fastest mobile trading app. Track your net worth, set smart price alerts, execute trades with biometric authentication, and manage mutual fund SIPs anytime, anywhere.",
      features: [
        "Biometric fingerprint & FaceID instant login",
        "Smart price alerts & trigger notifications",
        "Live portfolio tracking with intraday P&L analytics",
        "1-click SIP pause, edit, and step-up management",
      ],
      primaryCta: "Download Mobile App",
      primaryIcon: Download,
      stat: "4.8★ App Store Rating",
    },
    {
      id: "desktop",
      label: "Desktop App",
      icon: Monitor,
      badge: "Windows & Mac",
      title: "Desktop Pro Application",
      subtitle: "Heavy-duty multi-monitor setup designed for active day traders.",
      description: "Built with native high-performance C++ rendering for ultra-low latency execution. Supports multi-monitor charting grids, custom hotkey mapping, advanced DOM ladder, and institutional-grade analytics.",
      features: [
        "Sub-millisecond order routing with low latency",
        "Multi-monitor docking grids (up to 4 screens)",
        "Depth of Market (DOM) ladder & volume profile",
        "Customizable hotkeys for rapid scalping execution",
      ],
      primaryCta: "Download Desktop App",
      primaryIcon: Download,
      stat: "0.2ms Latency",
    },
  ];

  const current = devices.find((d) => d.id === activeDevice) || devices[0];

  return (
    <section id="platforms" className="py-20 bg-[#fafcfb] border-t border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">
            CROSS-PLATFORM ECOSYSTEM
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Work Seamlessly on{" "}
            <span className="font-serif-accent italic font-normal text-amber-600">
              Every Device
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-normal">
            Switch effortlessly between web browser, mobile phone, and desktop workstation. Your portfolio, watchlists, and orders synchronize in real time.
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
                  className={`flex items-center gap-2.5 px-5 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
                  onClick={() => onOpenPlatform(current.id)}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold bg-[#0f4b32] hover:bg-[#093523] text-white shadow-lg shadow-emerald-950/20 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                >
                  <span>{current.primaryCta}</span>
                  <current.primaryIcon className="w-4 h-4" />
                </button>

                <div className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700">
                  ⚡ {current.stat}
                </div>
              </div>
            </div>

            {/* Right Mockup Column (Authentic Device Mockup Frame) */}
            <div className="lg:col-span-6 flex justify-center items-center">
              
              {/* MOCKUP 1: WEB TRADING (Browser Frame) */}
              {activeDevice === "web" && (
                <div className="w-full max-w-lg bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                  {/* Browser Bar */}
                  <div className="bg-gray-800/90 px-4 py-2.5 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="bg-gray-950/70 text-[11px] font-mono text-gray-300 px-4 py-1 rounded-md border border-gray-700 flex items-center gap-1.5">
                      <span className="text-emerald-400">🔒</span>
                      <span>trade.gspinvestment.com/web</span>
                    </div>
                    <div className="w-10"></div>
                  </div>

                  {/* Browser Content */}
                  <div className="p-5 bg-gray-950 text-white space-y-4 text-xs font-sans">
                    {/* Live Market Header */}
                    <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Live Market Overview</div>
                        <div className="text-base font-extrabold text-white flex items-center gap-2">
                          <span>NIFTY 50</span>
                          <span className="text-xs text-emerald-400 font-bold">24,835.40 (+1.15%)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Account Value</div>
                        <div className="text-base font-extrabold text-amber-400">₹14,82,350</div>
                      </div>
                    </div>

                    {/* Chart Wireframe with Candlesticks */}
                    <div className="bg-gray-900/90 rounded-xl p-3 border border-gray-800">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2">
                        <span className="text-emerald-300 font-bold">RELIANCE 1D Candlestick</span>
                        <div className="flex gap-1.5 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-gray-800 text-white">1D</span>
                          <span className="px-1.5 py-0.5 rounded bg-gray-800/50">1W</span>
                          <span className="px-1.5 py-0.5 rounded bg-gray-800/50">1M</span>
                        </div>
                      </div>

                      {/* SVG Chart Graphic */}
                      <svg viewBox="0 0 300 70" className="w-full h-20">
                        <defs>
                          <linearGradient id="webChartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M 0,55 Q 50,45 100,50 T 180,30 T 250,20 T 300,10 L 300,70 L 0,70 Z" fill="url(#webChartGrad)" />
                        <path d="M 0,55 Q 50,45 100,50 T 180,30 T 250,20 T 300,10" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="300" cy="10" r="3.5" fill="#34d399" className="animate-ping" />
                        <circle cx="300" cy="10" r="3.5" fill="#10b981" />
                      </svg>
                    </div>

                    {/* Quick Order Strip */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-emerald-900/30 border border-emerald-600/40 rounded-xl p-2.5 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-emerald-300 font-bold uppercase">Quick Buy</div>
                          <div className="text-xs font-black text-white">Market Order</div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-black text-[11px]">BUY</span>
                      </div>

                      <div className="bg-rose-900/30 border border-rose-600/40 rounded-xl p-2.5 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-rose-300 font-bold uppercase">Quick Sell</div>
                          <div className="text-xs font-black text-white">Limit Order</div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-black text-[11px]">SELL</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MOCKUP 2: MOBILE TRADING (Smartphone Frame) */}
              {activeDevice === "mobile" && (
                <div className="w-[280px] sm:w-[300px] bg-gray-950 rounded-[40px] p-3 shadow-2xl border-4 border-gray-800 relative transform hover:scale-[1.01] transition-transform duration-300">
                  {/* Speaker / Dynamic Island */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-800"></div>
                  </div>

                  {/* Mobile Screen */}
                  <div className="bg-[#062c1b] rounded-[32px] overflow-hidden pt-8 pb-4 px-4 text-white text-xs">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-[10px] text-emerald-200 mb-3 px-1">
                      <span>9:41 AM</span>
                      <div className="flex items-center gap-1">
                        <span>5G</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Portfolio Hero Card */}
                    <div className="bg-gradient-to-br from-emerald-900 to-[#094027] p-3.5 rounded-2xl border border-emerald-600/30 shadow-md mb-3">
                      <div className="text-[10px] uppercase text-emerald-300 font-bold">Total Portfolio Value</div>
                      <div className="text-2xl font-black text-white tracking-tight mt-0.5">
                        ₹14,82,350
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-semibold mt-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+₹1,24,210 (+8.37%) Today</span>
                      </div>
                    </div>

                    {/* Mini Sparkline Chart */}
                    <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-800/40 mb-3">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span className="font-bold text-white">Daily Performance</span>
                        <span className="text-emerald-400 font-bold">+12.4%</span>
                      </div>
                      <svg viewBox="0 0 200 40" className="w-full h-10">
                        <path d="M 0,30 Q 30,25 70,28 T 130,15 T 200,8" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="200" cy="8" r="3" fill="#34d399" className="animate-ping" />
                        <circle cx="200" cy="8" r="3" fill="#10b981" />
                      </svg>
                    </div>

                    {/* 2 Holdings */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5 text-[11px]">
                        <div>
                          <span className="font-bold">RELIANCE</span>
                          <span className="text-[9px] text-emerald-300/80 block">50 Shares</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">₹3,14,200</span>
                          <span className="text-[9px] text-emerald-400 font-semibold block">+2.4%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5 text-[11px]">
                        <div>
                          <span className="font-bold">HDFC BANK</span>
                          <span className="text-[9px] text-emerald-300/80 block">30 Shares</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">₹4,38,000</span>
                          <span className="text-[9px] text-emerald-400 font-semibold block">+1.8%</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav Simulation */}
                    <div className="pt-2 border-t border-emerald-900/60 flex justify-around text-[9px] text-emerald-300/70 font-semibold">
                      <span className="text-amber-400 font-bold">● Home</span>
                      <span>Watchlist</span>
                      <span>Orders</span>
                      <span>Portfolio</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MOCKUP 3: DESKTOP WORKSTATION (Pro Monitor Frame) */}
              {activeDevice === "desktop" && (
                <div className="w-full max-w-lg bg-gray-950 rounded-2xl p-3 shadow-2xl border-2 border-gray-800 transform hover:scale-[1.01] transition-transform duration-300">
                  {/* Monitor Bezel Header */}
                  <div className="bg-gray-900 px-3 py-1.5 rounded-t-xl border-b border-gray-800 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-white font-bold">GSP Pro Station v4.2</span>
                    </div>
                    <span>NSE Tick Latency: 0.2ms</span>
                  </div>

                  {/* Multi-Grid Trading Screen */}
                  <div className="bg-black p-3 space-y-2.5 text-white text-xs">
                    {/* Top Ticker Tape */}
                    <div className="flex justify-between items-center text-[10px] font-mono bg-gray-900/80 p-1.5 rounded border border-gray-800">
                      <span>NIFTY: <b className="text-emerald-400">24,835 ▲</b></span>
                      <span>BANKNIFTY: <b className="text-emerald-400">52,140 ▲</b></span>
                      <span>INDIA VIX: <b className="text-amber-400">12.8</b></span>
                    </div>

                    {/* 2-Grid Charts */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-900/90 p-2 rounded-lg border border-gray-800">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                          <span className="font-bold text-emerald-300">NSE Index 5m</span>
                          <span className="text-emerald-400 font-mono">+1.4%</span>
                        </div>
                        <svg viewBox="0 0 140 45" className="w-full h-12">
                          <path d="M 0,35 Q 35,20 70,30 T 140,10" fill="none" stroke="#34d399" strokeWidth="2" />
                        </svg>
                      </div>

                      <div className="bg-gray-900/90 p-2 rounded-lg border border-gray-800">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                          <span className="font-bold text-amber-300">Order Depth Ladder</span>
                          <span className="text-gray-400 font-mono">DOM</span>
                        </div>
                        <div className="space-y-0.5 text-[9px] font-mono">
                          <div className="flex justify-between text-emerald-400">
                            <span>2,980.50</span>
                            <span>4,250</span>
                          </div>
                          <div className="flex justify-between text-emerald-400">
                            <span>2,980.00</span>
                            <span>8,900</span>
                          </div>
                          <div className="flex justify-between text-rose-400">
                            <span>2,981.00</span>
                            <span>3,100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pro Execution Panel */}
                    <div className="bg-gray-900/70 p-2 rounded-lg border border-gray-800 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-300">F1: Buy</span>
                        <span className="font-bold text-gray-300">F2: Sell</span>
                        <span className="font-bold text-gray-300">Shift+C: Cancel All</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">READY</span>
                    </div>
                  </div>

                  {/* Monitor Stand Base */}
                  <div className="w-20 h-2 bg-gray-700 mx-auto mt-2 rounded-b-md"></div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
