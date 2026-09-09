import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown,
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
  ChevronRight,
  X,
  Calendar,
  Activity,
  Maximize2
} from "lucide-react";
import { RESEARCH_ARTICLES } from "../data/marketInsightsData";
import { fetchLiveMarketData, isMarketOpenNow } from "../services/marketService";

export default function MarketInsightsSection({ onSelectArticle }) {
  const [indices, setIndices] = useState([]);
  const [timeframe, setTimeframe] = useState("5d"); // '1d', '5d', '1m', '6m', '1y'
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isMarketOpen, setIsMarketOpen] = useState(isMarketOpenNow());

  // Load Real-Time Market Data
  const loadData = async (tf = timeframe, showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const data = await fetchLiveMarketData(tf);
      if (data && data.length > 0) {
        setIndices(data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.warn("Failed loading live index data:", err);
    } finally {
      if (showSpin) setIsRefreshing(false);
      setIsMarketOpen(isMarketOpenNow());
    }
  };

  useEffect(() => {
    loadData(timeframe, false);
    // Poll real market data every 15 seconds
    const interval = setInterval(() => {
      loadData(timeframe, false);
    }, 15000);
    return () => clearInterval(interval);
  }, [timeframe]);

  const handleManualRefresh = () => {
    loadData(timeframe, true);
  };

  const handleTimeframeChange = (tf) => {
    setTimeframe(tf);
    loadData(tf, true);
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
    <section id="market-insights" className="py-16 sm:py-20 bg-[#f8faf9] border-t border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-emerald-700" />
              <span>REAL-TIME MARKET INTELLIGENCE</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Market{" "}
              <span className="font-serif-accent italic font-normal text-amber-600">
                Insights & Analysis
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal pt-1">
              Real-time index intelligence, daily OHLC market feeds, and actionable research for disciplined wealth creation.
            </p>
          </div>

          {/* Market Status + Day-Wise Switcher & Refresh Button */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            
            {/* Live Feed Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-2xs">
              <span className={`w-2 h-2 rounded-full ${isMarketOpen ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></span>
              <span>{isMarketOpen ? "LIVE FEED" : "DAILY CLOSE"}</span>
            </div>

            {/* Day-Wise Timeframe Selector */}
            <div className="flex items-center p-1 bg-white rounded-xl border border-gray-200 shadow-2xs">
              {[
                { id: "1d", label: "1D" },
                { id: "5d", label: "5D" },
                { id: "1m", label: "1M" },
                { id: "6m", label: "6M" },
                { id: "1y", label: "1Y" },
              ].map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => handleTimeframeChange(tf.id)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    timeframe === tf.id
                      ? "bg-[#0f4b32] text-white shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-emerald-800 hover:border-emerald-300 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
              title="Refresh live market indices"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-700" : "text-gray-500"}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Real-time Ticker Cards Grid (6 Indian Indices) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-12">
          {indices.map((idx) => {
            const isPos = idx.positive;
            return (
              <div 
                key={idx.id} 
                onClick={() => setSelectedIndex(idx)}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 truncate">
                    {idx.name}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPos ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                </div>

                <div className="text-base sm:text-lg font-black text-gray-900 tracking-tight font-mono">
                  {idx.value ? idx.value.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}
                </div>

                <div className={`flex items-center gap-1 text-[11px] font-extrabold mt-1.5 font-mono ${
                  isPos ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {isPos ? <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> : <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />}
                  <span>{idx.change}</span>
                </div>

                <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                  <span>{idx.exchange || "NSE"}</span>
                  <span className="text-emerald-700 group-hover:underline font-bold flex items-center gap-0.5">
                    <span>Day Trend</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* In-Depth Research Articles Container */}
        <div className="space-y-6">
          
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#0f4b32] text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Article Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text"
                placeholder="Search research reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-[#0f4b32] shadow-2xs"
              />
            </div>
          </div>

          {/* Research Articles Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div 
                key={art.id}
                onClick={() => onSelectArticle && onSelectArticle(art)}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
              >
                <div className="space-y-4">
                  
                  {/* Article Tag & Read Time */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200/80">
                      {art.tag}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                      {art.subtitle}
                    </p>
                  </div>

                  {/* Highlights Mini Badge */}
                  <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-100 text-xs text-gray-700 leading-relaxed font-medium">
                    {art.summary.slice(0, 140)}...
                  </div>

                </div>

                {/* Card Footer: Author + Read Link */}
                <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Published</span>
                    <strong className="text-gray-900 text-xs font-semibold">{art.date}</strong>
                  </div>

                  <span className="inline-flex items-center gap-1 font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Full Note</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          INDEX DETAIL MODAL (REAL-TIME OHLC & DAY-WISE LEDGER)
      ───────────────────────────────────────────────────────────── */}
      {selectedIndex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                  {selectedIndex.exchange} • {selectedIndex.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">Symbol: {selectedIndex.symbol}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {selectedIndex.name}
              </h3>
              
              {/* Current Price & Change */}
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 font-mono">
                  {selectedIndex.value ? selectedIndex.value.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}
                </span>
                <span className={`text-sm font-black font-mono flex items-center gap-1 ${
                  selectedIndex.positive ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {selectedIndex.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{selectedIndex.change}</span>
                </span>
              </div>
            </div>

            {/* Real Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Day High</span>
                <strong className="text-gray-900 font-mono text-sm">{selectedIndex.dayHigh}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Day Low</span>
                <strong className="text-gray-900 font-mono text-sm">{selectedIndex.dayLow}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Previous Close</span>
                <strong className="text-gray-900 font-mono text-sm">₹{selectedIndex.baseValue ? selectedIndex.baseValue.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">52W High</span>
                <strong className="text-emerald-800 font-mono text-sm">{selectedIndex.high52}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">52W Low</span>
                <strong className="text-rose-800 font-mono text-sm">{selectedIndex.low52}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Data Mode</span>
                <strong className="text-emerald-700 text-xs flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Daily Verified Feed</span>
                </strong>
              </div>
            </div>

            {/* Day-Wise Historical Ledger Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Day-Wise Historical Record ({timeframe.toUpperCase()})</span>
                </h4>
                <span className="text-[11px] text-gray-400 font-mono">IST Daily Settlement</span>
              </div>

              <div className="rounded-2xl border border-gray-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-100/90 text-gray-600 font-bold text-[11px] border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3.5">Date</th>
                      <th className="py-2.5 px-3.5">Open</th>
                      <th className="py-2.5 px-3.5">High</th>
                      <th className="py-2.5 px-3.5">Low</th>
                      <th className="py-2.5 px-3.5 text-right">Close Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono font-medium text-gray-800">
                    {selectedIndex.history && selectedIndex.history.length > 0 ? (
                      selectedIndex.history.map((row, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/50 transition-colors">
                          <td className="py-2 px-3.5 font-sans font-semibold text-gray-900">{row.date}</td>
                          <td className="py-2 px-3.5 text-gray-600">{row.open ? row.open.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}</td>
                          <td className="py-2 px-3.5 text-emerald-700 font-bold">{row.high ? row.high.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}</td>
                          <td className="py-2 px-3.5 text-rose-700">{row.low ? row.low.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}</td>
                          <td className="py-2 px-3.5 text-right font-black text-gray-900">
                            ₹{row.close ? row.close.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-400 font-sans">
                          Historical daily ticks loading...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-100">
              <span>Settlement: National Stock Exchange (NSE) & BSE India</span>
              <button
                onClick={() => setSelectedIndex(null)}
                className="px-4 py-2 rounded-xl bg-[#0f4b32] text-white font-bold cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
