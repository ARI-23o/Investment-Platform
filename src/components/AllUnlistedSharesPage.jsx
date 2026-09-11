import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Star, 
  Building2, 
  Zap, 
  SunMedium, 
  Cpu, 
  SlidersHorizontal, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Coins,
  FileSpreadsheet
} from "lucide-react";
import { UNLISTED_SHARES } from "../data/sharesData";

export default function AllUnlistedSharesPage({ 
  shares = UNLISTED_SHARES, 
  onSelectShare, 
  onEnquireShare, 
  onBack 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular"); // 'popular', 'price-desc', 'price-asc', 'name-asc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset page to 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Extract unique categories dynamically from shares list
  const availableCategories = useMemo(() => {
    const list = Array.isArray(shares) && shares.length > 0 ? shares : UNLISTED_SHARES;
    const cats = new Set(["all"]);
    list.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return Array.from(cats);
  }, [shares]);

  const getCategoryIcon = (category) => {
    const c = String(category || "").toLowerCase();
    if (c.includes("energy") || c.includes("power") || c.includes("solar")) {
      return <Zap className="w-3.5 h-3.5 text-amber-500" />;
    }
    if (c.includes("renewable") || c.includes("clean")) {
      return <SunMedium className="w-3.5 h-3.5 text-emerald-500" />;
    }
    if (c.includes("tech") || c.includes("software") || c.includes("it")) {
      return <Cpu className="w-3.5 h-3.5 text-cyan-600" />;
    }
    return <Building2 className="w-3.5 h-3.5 text-emerald-700" />;
  };

  // Filter & Sort logic
  const filteredAndSortedShares = useMemo(() => {
    const list = Array.isArray(shares) && shares.length > 0 ? shares : UNLISTED_SHARES;
    
    let result = list.filter((share) => {
      // Category check
      let matchesCategory = true;
      if (selectedCategory !== "all") {
        matchesCategory = share.category === selectedCategory || 
          (share.sector && share.sector.toLowerCase().includes(selectedCategory.toLowerCase()));
      }

      // Search check
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        (share.name && share.name.toLowerCase().includes(q)) || 
        (share.shortName && share.shortName.toLowerCase().includes(q)) || 
        (share.code && share.code.toLowerCase().includes(q)) || 
        (share.isin && share.isin.toLowerCase().includes(q)) ||
        (share.category && share.category.toLowerCase().includes(q)) ||
        (share.sector && share.sector.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "price-desc") {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }
      if (sortBy === "price-asc") {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      }
      if (sortBy === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      // Default: Popular first, then alphabetical
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });

    return result;
  }, [shares, selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSortedShares.length / itemsPerPage) || 1;
  const paginatedShares = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedShares.slice(start, start + itemsPerPage);
  }, [filteredAndSortedShares, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#fafcfb] py-8 sm:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Back Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-emerald-900 transition-colors cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-2xs hover:shadow-xs w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-800" />
            <span>← Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Home</span>
            <span>/</span>
            <span className="font-bold text-emerald-900">All Unlisted Shares Directory</span>
          </div>
        </div>

        {/* Hero Banner / Directory Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-black uppercase tracking-widest text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>DIRECT UNLISTED & PRE-IPO CATALOG</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            All{" "}
            <span className="font-serif-accent italic font-normal text-amber-600">
              unlisted shares
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore complete list of pre-IPO companies and unlisted equities in India. Real-time indicative prices, lot sizes, and verified Demat transfer.
          </p>
        </div>

        {/* Search, Filter & Sort Toolbar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-xs mb-10 space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input (Takes 8 cols) */}
            <div className="md:col-span-8 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company by name, ISIN, ticker, or sector..."
                className="w-full pl-11 pr-10 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f4b32]/20 focus:border-[#0f4b32] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown (Takes 4 cols) */}
            <div className="md:col-span-4 flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-bold text-gray-900 outline-none focus:border-[#0f4b32] focus:bg-white cursor-pointer transition-all shadow-2xs"
              >
                <option value="popular">⭐ Most Popular</option>
                <option value="name-asc">🔤 Name (A to Z)</option>
                <option value="price-desc">📈 Price (High to Low)</option>
                <option value="price-asc">📉 Price (Low to High)</option>
              </select>
            </div>

          </div>

          {/* Dynamic Category Filter Pills */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-1">Filter Sector:</span>
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#0f4b32] text-white shadow-sm"
                      : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900 border border-gray-200/60"
                  }`}
                >
                  {cat === "all" ? "All Sectors" : cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Counter & Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1 text-xs text-gray-500 font-medium">
          <div>
            Showing <strong className="text-gray-900">{filteredAndSortedShares.length}</strong> companies
            {selectedCategory !== "all" && <span> in <strong className="text-emerald-900 capitalize">{selectedCategory}</strong></span>}
            {searchQuery && <span> matching "<strong className="text-gray-900">{searchQuery}</strong>"</span>}
            <span className="text-gray-400 ml-2">(Page {currentPage} of {totalPages})</span>
          </div>

          <div className="flex items-center gap-3 text-emerald-800 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Demat Settlement</span>
            </span>
          </div>
        </div>

        {/* CARDS GRID (Matches UnlistedZone card layout) */}
        {paginatedShares.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedShares.map((share) => {
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
                    <div className="flex items-start gap-3.5 mb-4">
                      {/* Logo or Initial Avatar */}
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-center p-2 shadow-2xs group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
                        {share.image ? (
                          <img 
                            src={share.image} 
                            alt={share.shortName || share.name} 
                            className="w-full h-full object-contain rounded-xl"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-[#083b25] text-emerald-100 flex items-center justify-center font-black text-xs uppercase shadow-xs">
                            {(share.code || share.shortName || share.name || "SH").slice(0, 4)}
                          </div>
                        )}
                      </div>

                      <div className="overflow-hidden flex-1">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-900 transition-colors">
                          {share.name}
                        </h3>
                        <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                          {share.isin ? `ISIN: ${share.isin}` : "Available upon enquiry"}
                        </span>
                      </div>
                    </div>

                    {/* Sector / Category Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 mb-5">
                      {getCategoryIcon(share.category)}
                      <span>{share.category || "Unlisted Equities"}</span>
                    </div>

                    {/* Price Block */}
                    <div className="mb-6 p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-gray-900 tracking-tight">
                          ₹{typeof share.price === "number" ? share.price.toLocaleString("en-IN") : (share.price || 0)}
                        </span>
                        <span className="text-[10px] font-extrabold tracking-wider text-amber-700 uppercase bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                          INDICATIVE
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mt-2 pt-2 border-t border-gray-200/60">
                        <span>Lot Size: <strong className="text-gray-800">{share.lotSize > 0 ? `${share.lotSize} shares` : "Flexible"}</strong></span>
                        {share.availableQty ? (
                          <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            Avail: {share.availableQty}
                          </span>
                        ) : (
                          <span>52W: <strong className="text-gray-800">{share.high52 || "Active"}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons (Enquire + Details) */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => onEnquireShare(share)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0f4b32] hover:bg-[#093523] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <span>Enquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => onSelectShare(share)}
                      className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 transition-colors cursor-pointer shadow-2xs hover:text-gray-900"
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
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-gray-200 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">No unlisted companies found</h3>
              <p className="text-xs text-gray-500 mt-1">
                We couldn't find any unlisted shares matching "{searchQuery}". Try searching with a different ticker or resetting your sector filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0f4b32] text-white hover:bg-[#093523] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                currentPage === 1 
                  ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50" 
                  : "border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer shadow-2xs"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-[#0f4b32] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-2xs"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                currentPage === totalPages 
                  ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50" 
                  : "border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer shadow-2xs"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
