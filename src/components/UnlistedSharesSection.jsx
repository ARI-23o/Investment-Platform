import React, { useState } from "react";
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
  Cpu
} from "lucide-react";
import { UNLISTED_SHARES } from "../data/sharesData";

export default function UnlistedSharesSection({ onSelectShare, onEnquireShare, onViewAllShares }) {
  const [filter, setFilter] = useState("all");

  const sharesToDisplay = UNLISTED_SHARES.slice(0, 4);

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

  return (
    <section id="unlisted-shares" className="py-16 bg-[#f9faf9] border-t border-gray-100 relative overflow-hidden">
      {/* Background Upward Arrow Chart Matching Page 2 */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-15 select-none overflow-hidden">
        <img 
          src="/assets/growth_chart.jpg" 
          alt="" 
          className="w-full h-full object-cover object-right-top"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Popular{" "}
            <span className="font-serif-accent italic font-normal text-amber-600 text-3xl sm:text-4xl">
              unlisted shares
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            The most-followed names with investors this month. Prices shown are indicative and for information only.
          </p>

          <div className="mt-4">
            <button 
              onClick={onViewAllShares}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0f4b32] hover:text-emerald-800 transition-colors border-b border-emerald-600/60 pb-0.5 cursor-pointer"
            >
              <span>View all shares</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Cards Grid matching PDF layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sharesToDisplay.map((share) => {
            const isGreenButton = share.color === "emerald";

            return (
              <div 
                key={share.id}
                className="relative bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Popular Ribbon Tag */}
                {share.popular && (
                  <div className="absolute -top-3.5 -right-2 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>POPULAR</span>
                  </div>
                )}

                <div>
                  {/* Company Logo Header & Title */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Dynamic Logo Representation */}
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform shrink-0">
                      {share.code === "XMSEI" && (
                        <div className="font-extrabold text-xs tracking-tighter">
                          <span className="text-red-500 text-sm">X</span>
                          <span className="text-blue-900">MSEI</span>
                        </div>
                      )}
                      {share.code === "ONSE" && (
                        <div className="flex items-center gap-0.5">
                          <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
                          <span className="font-black text-xs text-orange-950">NSE</span>
                        </div>
                      )}
                      {share.code === "HPX" && (
                        <div className="font-black text-xs text-emerald-900 tracking-wider">
                          HPX
                        </div>
                      )}
                      {share.code === "onix" && (
                        <div className="font-bold text-xs text-amber-900 lowercase tracking-tight">
                          onix
                        </div>
                      )}
                      {share.code === "SI" && (
                        <div className="font-bold text-xs text-emerald-800">
                          SI
                        </div>
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                        {share.name}
                      </h3>
                    </div>
                  </div>

                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 mb-6">
                    {getCategoryIcon(share.category)}
                    <span>{share.category}</span>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6">
                    <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                      ₹{share.price.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] font-bold tracking-wider text-amber-700 uppercase mt-0.5">
                      INDICATIVE
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons matching PDF */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button 
                    onClick={() => onEnquireShare(share)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white transition-all duration-200 cursor-pointer ${
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
                    className="py-2 px-3 rounded-xl text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
