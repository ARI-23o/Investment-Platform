import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Newspaper, 
  Sparkles, 
  BarChart2, 
  Clock, 
  Eye, 
  Search, 
  RotateCw, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight
} from "lucide-react";
import { INITIAL_INDICES, RESEARCH_ARTICLES } from "../data/marketInsightsData";

export default function MarketInsightsSection({ onSelectArticle }) {
  const [indices, setIndices] = useState(INITIAL_INDICES);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Live real-time tick simulation engine
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices((prev) =>
        prev.map((idx) => {
          if (idx.id === "indiavix") {
            const delta = (Math.random() * 0.08 - 0.04);
            const newVal = Math.max(10, Math.min(25, Number((idx.value + delta).toFixed(2))));
            const changeVal = Number((newVal - idx.baseValue).toFixed(2));
            const changePercent = Number(((changeVal / idx.baseValue) * 100).toFixed(2));
            return {
              ...idx,
              value: newVal,
              change: `${changeVal >= 0 ? "+" : ""}${changeVal} (${changePercent >= 0 ? "+" : ""}${changePercent}%)`,
              positive: changeVal >= 0,
            };
          } else {
            // Index fluctuation
            const maxFluct = idx.baseValue * 0.0006;
            const delta = (Math.random() * maxFluct * 2) - maxFluct;
            const newVal = Number((idx.value + delta).toFixed(2));
            const changeVal = Number((newVal - idx.baseValue).toFixed(2));
            const changePercent = Number(((changeVal / idx.baseValue) * 100).toFixed(2));
            return {
              ...idx,
              value: newVal,
              change: `${changeVal >= 0 ? "+" : ""}${changeVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (${changePercent >= 0 ? "+" : ""}${changePercent}%)`,
              positive: changeVal >= 0,
            };
          }
        })
      );
      setLastUpdated(new Date());
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 600);
  };

  const categories = ["All", "Pre-IPO & Unlisted", "IPO & Primary Market", "Mutual Funds & SIP"];

  const filteredArticles = useMemo(() => {
    return RESEARCH_ARTICLES.filter((art) => {
      const matchesCategory = activeCategory === "All" || art.category === activeCategory;
      const matchesSearch = 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="market-insights" className="py-20 bg-[#f8faf9] border-t border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5 text-emerald-700" />
              <span>LIVE RESEARCH & INTELLIGENCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Market{" "}
              <span className="font-serif-accent italic font-normal text-[#c28414]">
                Insights & Analysis
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 font-normal">
              Real-time index intelligence, institutional unlisted discovery, and actionable research for disciplined wealth creation.
            </p>
          </div>

          {/* Live Status Badge + Refresh */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE FEED</span>
            </div>

            <button
              onClick={handleManualRefresh}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Refresh live data"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Live Indices Ticker Row (6 Market Barometers) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-10">
          {indices.map((idx) => {
            const formattedVal = typeof idx.value === "number" 
              ? idx.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : idx.value;

            return (
              <div 
                key={idx.id} 
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{idx.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-70"></span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-gray-900 mt-1 font-mono tracking-tight">
                    {formattedVal}
                  </div>
                </div>

                <div className={`text-[11px] font-bold flex items-center gap-1 mt-2 ${idx.positive ? "text-emerald-700" : "text-rose-600"}`}>
                  {idx.positive ? (
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                  )}
                  <span className="truncate">{idx.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#0f4b32] text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Keyword Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search research topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Dynamic Research Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredArticles.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSelectArticle && onSelectArticle(item)}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                      {item.tag}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-emerald-900 transition-colors leading-snug mb-3 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal line-clamp-3 mb-4">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.date} • {item.readTime}</span>
                  </div>
                  
                  <span className="text-emerald-800 font-bold group-hover:text-emerald-950 flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-200">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-800">No articles match your search</h4>
            <p className="text-xs text-gray-500 mt-1">Try searching with a different keyword or select another category filter.</p>
          </div>
        )}

      </div>
    </section>
  );
}
