import React from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Newspaper, Sparkles, BarChart2 } from "lucide-react";

export default function MarketInsightsSection() {
  const indices = [
    { name: "NIFTY 50", value: "24,852.15", change: "+164.20 (+0.67%)", positive: true },
    { name: "SENSEX", value: "81,332.72", change: "+512.40 (+0.63%)", positive: true },
    { name: "BANK NIFTY", value: "51,240.60", change: "+280.90 (+0.55%)", positive: true },
    { name: "INDIA VIX", value: "13.42", change: "-0.45 (-3.24%)", positive: false },
  ];

  const insights = [
    {
      tag: "Pre-IPO Sector Watch",
      title: "Renewable Energy & Power Exchanges witness surging demand in unlisted markets",
      date: "Today, 11:30 AM",
      readTime: "3 min read",
    },
    {
      tag: "IPO Calendar",
      title: "Upcoming Mainboard & SME IPOs: Review of issue size, price band and anchor bids",
      date: "Yesterday",
      readTime: "5 min read",
    },
    {
      tag: "Mutual Fund Research",
      title: "Large & Midcap vs Flexicap Funds: Which SIP category fits current valuation levels?",
      date: "2 days ago",
      readTime: "4 min read",
    },
  ];

  return (
    <section id="market-insights" className="py-20 bg-[#f8faf9] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">
            RESEARCH & INTELLIGENCE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Market{" "}
            <span className="font-serif-accent italic font-normal text-amber-600">
              Insights & Analysis
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Real-time market intelligence, unlisted market discovery, and actionable research for smart investors.
          </p>
        </div>

        {/* Live Indices Ticker Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {indices.map((idx) => (
            <div key={idx.name} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs text-gray-500 font-bold">{idx.name}</span>
              <div className="text-xl font-extrabold text-gray-900 mt-1">{idx.value}</div>
              <div className={`text-xs font-semibold flex items-center gap-1 mt-1 ${idx.positive ? "text-emerald-600" : "text-rose-600"}`}>
                {idx.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{idx.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Research Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((item, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">
                  {item.tag}
                </span>
                <h3 className="font-bold text-base text-gray-900 group-hover:text-emerald-900 transition-colors leading-snug mb-3">
                  {item.title}
                </h3>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>{item.date} • {item.readTime}</span>
                <span className="text-emerald-800 font-bold group-hover:underline">Read →</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
