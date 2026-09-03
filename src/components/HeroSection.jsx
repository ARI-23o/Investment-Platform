import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Coins, 
  BarChart2, 
  ArrowUp, 
  ArrowDown, 
  ChevronRight,
  Sparkles,
  PieChart,
  Layers,
  Award
} from "lucide-react";

// Clean, high-performance count-up animation helper
function useCountUp(target, duration = 1500, delay = 250) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let timer = setTimeout(() => {
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Smooth easeOutQuart curve
        const ease = 1 - Math.pow(1 - progress, 4);
        setValue(Math.floor(ease * target));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setValue(target);
        }
      };
      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return value;
}

export default function HeroSection({ onOpenRegister, onBookConsultation, onGetStarted }) {
  const [activeTab, setActiveTab] = useState("all");
  const [isMounted, setIsMounted] = useState(false);
  const [chartDrawn, setChartDrawn] = useState(false);

  // Statistics Count-Up
  const portfolioVal = useCountUp(1482350, 1600, 300);
  const dailyGainVal = useCountUp(124210, 1600, 300);
  const yearsTrust = useCountUp(15, 1200, 450);
  const investors = useCountUp(5, 1200, 550);
  const assets = useCountUp(50, 1400, 650);

  useEffect(() => {
    setIsMounted(true);
    const chartTimer = setTimeout(() => setChartDrawn(true), 350);
    return () => clearTimeout(chartTimer);
  }, []);

  return (
    <section id="home" className="relative pt-6 pb-12 overflow-hidden bg-[#fafcfb]">
      {/* Official Full Section Background Image - Pure Static for Clean Stability */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <img 
          src="/assets/hero_bg_official.jpg" 
          alt="Investment Market Background" 
          className="w-full h-full object-cover object-right lg:object-center"
        />
        {/* Soft responsive gradient overlay ensuring left-side text has contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:from-white/85 sm:via-white/40 lg:via-transparent pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4 pb-12">
          
          {/* Left Column (Content) with Headline Fade / Slide */}
          <div className={`lg:col-span-7 space-y-6 transition-all duration-700 ease-out ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            
            {/* Growth Priority Badge: Smart Money, Start Here */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
              <span className="text-emerald-600">🌱</span>
              <span>Smart Money, Start Here</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.12]">
              Invest Smarter.<br />
              Trade Faster.<br />
              <span className="text-[#c28414] font-serif-accent italic font-normal tracking-normal text-4xl sm:text-5xl lg:text-[4rem]">
                Grow Wealth
              </span>{" "}
              with Confidence.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed font-normal">
              GSP Investment Pvt. Ltd. is a SEBI Registered Sub Broker offering Equities, IPOs, Mutual Funds and Wealth Management Services across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={onOpenRegister}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-base font-semibold bg-[#0f4b32] hover:bg-[#093523] text-white shadow-lg shadow-emerald-950/20 hover:shadow-emerald-950/30 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Open Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={onBookConsultation}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-base font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Book Consultation</span>
              </button>
            </div>

            {/* Stats Row matching Notes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200/80">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 leading-tight">SEBI Registered</div>
                  <div className="text-xs text-gray-500 font-medium">Sub Broker</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-gray-900 leading-tight tabular-nums">
                    {yearsTrust}+
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Years of Trust</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-gray-900 leading-tight tabular-nums">
                    {investors}K+
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Active Clients</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Coins className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-base font-black text-gray-900 leading-tight tabular-nums">
                    ₹{assets}Cr+
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Assets Advisory</div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Portfolio Card with Slight Upward Motion */}
          <div className="lg:col-span-5 relative">

            {/* Dark Emerald Portfolio Glass Card */}
            <div className={`relative rounded-3xl bg-gradient-to-br from-[#063321] via-[#09422b] to-[#042416] p-6 text-white shadow-2xl border border-emerald-600/30 overflow-hidden transition-all duration-800 ease-out delay-150 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              
              {/* Card Header with Statistics Count-Up */}
              <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60">
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                    Portfolio Value
                  </span>
                  <div className="text-3xl font-extrabold tracking-tight text-white mt-1 tabular-nums">
                    ₹{portfolioVal.toLocaleString("en-IN")}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 mt-0.5 tabular-nums">
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>+₹{dailyGainVal.toLocaleString("en-IN")} (+8.37%) Today</span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-emerald-800/70 border border-emerald-600/40 flex items-center justify-center text-emerald-300">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              {/* Sparkline Graphic SVG with Draw Animation */}
              <div className="py-4">
                <svg viewBox="0 0 320 60" className="w-full h-14 overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,45 Q 40,35 80,38 T 160,25 T 240,15 T 320,8 L 320,60 L 0,60 Z"
                    fill="url(#chartGradient)"
                    className={`transition-opacity duration-1000 delay-500 ${chartDrawn ? "opacity-100" : "opacity-0"}`}
                  />
                  <path
                    d="M 0,45 Q 40,35 80,38 T 160,25 T 240,15 T 320,8"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 340,
                      strokeDashoffset: chartDrawn ? 0 : 340,
                      transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                  <circle 
                    cx="320" 
                    cy="8" 
                    r="4" 
                    fill="#34d399" 
                    className={`animate-ping transition-opacity duration-500 delay-1000 ${chartDrawn ? "opacity-100" : "opacity-0"}`} 
                  />
                  <circle 
                    cx="320" 
                    cy="8" 
                    r="4" 
                    fill="#10b981" 
                    className={`transition-opacity duration-500 delay-1000 ${chartDrawn ? "opacity-100" : "opacity-0"}`} 
                  />
                </svg>
              </div>

              {/* Holdings List matching PDF */}
              <div className="space-y-2.5 pt-1">
                
                {/* Reliance */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-[11px] font-black text-emerald-300">
                      RE
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-100">RELIANCE</div>
                      <div className="text-[10px] text-emerald-300/70">50 shares</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">₹3,14,200</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">+2.4%</div>
                  </div>
                </div>

                {/* HDFC Bank */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-[10px] font-black text-emerald-300">
                      HDFC
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-100">HDFC BANK</div>
                      <div className="text-[10px] text-emerald-300/70">30 shares</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">₹4,38,000</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">+1.8%</div>
                  </div>
                </div>

                {/* TCS */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-[11px] font-black text-emerald-300">
                      TCS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-100">TCS</div>
                      <div className="text-[10px] text-emerald-300/70">20 shares</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">₹1,56,400</div>
                    <div className="text-[10px] text-rose-400 font-semibold">-0.6%</div>
                  </div>
                </div>

              </div>

              {/* Floating SIP widget banner matching bottom of card in PDF */}
              <div className="mt-4 pt-3 border-t border-emerald-800/40 flex items-center justify-between text-xs bg-emerald-950/40 p-3 rounded-2xl border border-emerald-700/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-200 text-[11px]">SIP Running</span>
                  <span className="text-white font-bold">₹25,000/mo</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200 cursor-pointer">
                  <span>3 Active SIPs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Service Highlights Bar matching Page 1 bottom */}
        <div className="mt-4 bg-white rounded-3xl border border-gray-200/80 shadow-md p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
          
          {/* Equities */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Equities</div>
              <div className="text-xs text-gray-500 leading-tight">Build your wealth with top stocks</div>
            </div>
          </div>

          {/* IPOs */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">IPOs</div>
              <div className="text-xs text-gray-500 leading-tight">Get early access to new opportunities</div>
            </div>
          </div>

          {/* Mutual Funds */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Mutual Funds</div>
              <div className="text-xs text-gray-500 leading-tight">Plan today for a better tomorrow</div>
            </div>
          </div>

          {/* Wealth Management */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Wealth Management</div>
              <div className="text-xs text-gray-500 leading-tight">Personalized strategies for long-term growth</div>
            </div>
          </div>

          {/* Right CTA Card banner matching PDF */}
          <div className="rounded-2xl bg-gradient-to-r from-[#0d4a32] to-[#083020] text-white p-4 flex items-center justify-between shadow-md">
            <div>
              <div className="text-xs font-bold leading-tight">Your Financial Goals</div>
              <div className="text-[11px] text-emerald-300">Our Expertise</div>
            </div>
            <button 
              onClick={onGetStarted}
              className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-[#093523] text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
