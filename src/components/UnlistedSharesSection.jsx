import React, { useState, useMemo } from "react";
import { 
  ArrowRight, 
  Star, 
  Building2, 
  Zap, 
  SunMedium, 
  ChevronRight, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Search, 
  X,
  Coins
} from "lucide-react";
import { UNLISTED_SHARES } from "../data/sharesData";

export default function UnlistedSharesSection({ onSelectShare, onEnquireShare, onViewAllShares }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All" },
    { id: "financial", label: "Financial" },
    { id: "energy", label: "Energy" },
    { id: "technology", label: "Technology" },
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Energy & Power":
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case "Renewable Energy":
        return <SunMedium className="w-3.5 h-3.5 text-emerald-500" />;
      case "Technology":
        return <Cpu className="w-3.5 h-3.5 text-cyan-600" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-emerald-700" />;
    }
  };

  // Filter logic based on Category and Search Query
  const filteredShares = useMemo(() => {
    return UNLISTED_SHARES.filter((share) => {
      // Category check
      let matchesCategory = true;
      if (selectedCategory === "financial") {
        matchesCategory = share.category.includes("Financial") || (share.sector && share.sector.includes("Exchange"));
      } else if (selectedCategory === "energy") {
        matchesCategory = share.category.includes("Energy") || share.category.includes("Power");
      } else if (selectedCategory === "technology") {
        matchesCategory = share.category.includes("Technology") || (share.sector && (share.sector.includes("Technology") || share.sector.includes("Tech")));
      }

      // Search check
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        share.name.toLowerCase().includes(q) || 
        share.shortName.toLowerCase().includes(q) || 
        share.code.toLowerCase().includes(q) || 
        share.isin.toLowerCase().includes(q) ||
        share.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="unlisted-shares" className="py-20 bg-[#fafcfb] border-t border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">
            PRE-IPO & UNLISTED EQUITIES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Popular{" "}
            <span className="font-serif-accent italic font-normal text-amber-600">
              unlisted shares
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-normal">
            The most-followed unlisted companies with investors this month. Discover real-time price discovery and place buy/sell enquiries.
          </p>
        </div>

        {/* Search Bar & Category Filters Block */}
        <div className="max-w-3xl mx-auto mb-12 space-y-5">
          
          {/* [ 🔍 Search company... ] */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company by name, ticker, sector or ISIN..."
              className="w-full pl-12 pr-11 py-3.5 bg-white border border-gray-200/90 rounded-2xl text-sm sm:text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f4b32]/20 focus:border-[#0f4b32] shadow-xs transition-all"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills: [ All ] [ Financial ] [ Energy ] [ Technology ] */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#0f4b32] text-white shadow-md shadow-emerald-950/20"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200/90 shadow-2xs hover:text-gray-900"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 px-1 text-xs text-gray-500 font-medium">
          <div>
            Showing <strong className="text-gray-900">{filteredShares.length}</strong> {filteredShares.length === 1 ? "company" : "companies"}
            {selectedCategory !== "all" && <span> in <strong className="text-emerald-900 capitalize">{selectedCategory}</strong></span>}
            {searchQuery && <span> matching "<strong className="text-gray-900">{searchQuery}</strong>"</span>}
          </div>

          <button 
            onClick={onViewAllShares}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0f4b32] hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <span>View full table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cards Grid */}
        {filteredShares.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredShares.map((share) => {
              const isGreenButton = share.color === "emerald";

              return (
                <div 
                  key={share.id}
                  className="relative bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  {/* Popular Ribbon Tag */}
                  {share.popular && (
                    <div className="absolute -top-3 right-4 bg-gradient-to-r from-emerald-800 to-[#0f4b32] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1 tracking-wider">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>POPULAR</span>
                    </div>
                  )}

                  <div>
                    {/* Company Logo Header & Title */}
                    <div className="flex items-center gap-3.5 mb-4">
                      {/* Dynamic Logo Representation */}
                      <div className="w-13 h-13 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-center p-2 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                        {share.code === "XMSEI" && (
                          <div className="font-black text-xs tracking-tighter">
                            <span className="text-red-500 text-sm">X</span>
                            <span className="text-blue-900">MSEI</span>
                          </div>
                        )}
                        {share.code === "ONSE" && (
                          <div className="flex items-center gap-1 font-black text-xs text-orange-950">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                            <span>NSE</span>
                          </div>
                        )}
                        {share.code === "HPX" && (
                          <div className="font-black text-xs text-emerald-800 tracking-wider">
                            HPX
                          </div>
                        )}
                        {share.code === "onix" && (
                          <div className="font-bold text-xs text-amber-700 lowercase tracking-tight">
                            onix
                          </div>
                        )}
                        {share.code === "SI" && (
                          <div className="font-black text-xs text-emerald-800">
                            SRIT
                          </div>
                        )}
                        {share.code === "HDB" && (
                          <div className="font-black text-xs text-blue-900">
                            HDB
                          </div>
                        )}
                        {share.code === "BOAT" && (
                          <div className="font-black text-[11px] text-red-600 tracking-tighter uppercase">
                            boAt
                          </div>
                        )}
                        {share.code === "WAAREE" && (
                          <div className="font-black text-[10px] text-emerald-900 uppercase tracking-tighter">
                            WAAREE
                          </div>
                        )}
                      </div>

                      <div className="overflow-hidden">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-900 transition-colors">
                          {share.name}
                        </h3>
                        <span className="text-[11px] text-gray-400 font-medium">ISIN: {share.isin}</span>
                      </div>
                    </div>

                    {/* Category Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 mb-5">
                      {getCategoryIcon(share.category)}
                      <span>{share.category}</span>
                    </div>

                    {/* Price Block */}
                    <div className="mb-6 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                          ₹{share.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] font-extrabold tracking-wider text-amber-700 uppercase bg-amber-100/80 px-2 py-0.5 rounded-md">
                          INDICATIVE
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mt-1.5 pt-1.5 border-t border-gray-200/60">
                        <span>Lot: {share.lotSize > 0 ? `${share.lotSize} shares` : "Flexible"}</span>
                        <span>52W: {share.high52}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons matching PDF */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => onEnquireShare(share)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                        isGreenButton 
                          ? "bg-[#0f4b32] hover:bg-[#093523]" 
                          : "bg-[#d97706] hover:bg-[#b45309]"
                      }`}
                    >
                      <span>Enquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => onSelectShare(share)}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 transition-colors cursor-pointer shadow-2xs hover:text-gray-900"
                    >
                      Details
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search Results State */
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-gray-200 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No unlisted companies found</h3>
            <p className="text-xs text-gray-500 mb-5">
              We couldn't find any companies matching your search filters. Try a different keyword or category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-5 py-2 rounded-full text-xs font-bold bg-[#0f4b32] text-white hover:bg-[#093523] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
