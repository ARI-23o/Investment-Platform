import React, { useState } from "react";
import { Star, ArrowRight, CheckCircle, ExternalLink, MessageSquare } from "lucide-react";

export default function ClientReviewSection({ onReadAllReviews }) {
  const reviews = [
    {
      id: 1,
      initials: "GD",
      name: "Gopinath Damodaran",
      role: "Long-term investor",
      stars: 5,
      quote: "Lighting fast. Shares were credited immediately on settlement, and the lower denominations they offer made it easy to start small.",
      verified: true,
      time: "2 weeks ago",
    },
    {
      id: 2,
      initials: "ND",
      name: "Nilesh Dahiwalkar",
      role: "Equity investor",
      stars: 5,
      quote: "Excellent and trustworthy. My experience buying private equity through them was smooth end to end. Recommended for unlisted dealing.",
      verified: true,
      time: "1 month ago",
    },
    {
      id: 3,
      initials: "RG",
      name: "Rahul Gupta",
      role: "Private-market investor",
      stars: 5,
      quote: "The promoters are genuine and very professional — prompt with documents and funds, thorough, and genuinely helpful throughout.",
      verified: true,
      time: "3 weeks ago",
    },
  ];

  return (
    <section id="reviews" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Rated{" "}
            <span className="font-serif-accent italic font-normal text-[#d97706] text-3xl sm:text-4xl">
              4.9
            </span>{" "}
            by investors
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Verified reviews from people who've dealt with us.
          </p>

          {/* Rating Badge with Google Logo matching Page 7 */}
          <div className="inline-flex items-center gap-4 mt-6 px-6 py-3 rounded-2xl bg-gray-50 border border-gray-200/80 shadow-xs">
            <span className="text-4xl font-black text-gray-900 tracking-tight">
              4.9
            </span>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs text-gray-600 font-medium mt-0.5">
                Based on 750+ Google reviews
              </div>
            </div>

            {/* Google G Logo SVG */}
            <div className="pl-3 border-l border-gray-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 3 Review Cards Grid matching Page 7 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1"
            >
              <div>
                {/* Reviewer Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#093523] text-emerald-100 flex items-center justify-center font-bold text-sm shadow-sm">
                      {rev.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">
                        {rev.name}
                      </h3>
                      <div className="text-xs text-gray-500 font-medium">
                        {rev.role}
                      </div>
                    </div>
                  </div>

                  {/* Google G icon indicator */}
                  <div className="w-6 h-6 shrink-0">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  </div>
                </div>

                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Icon & Text */}
                <div className="relative">
                  <span className="text-amber-500 font-serif text-3xl leading-none block mb-1">“</span>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    {rev.quote}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified Buyer
                </span>
                <span>{rev.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Read All Google Reviews Button matching Page 7 */}
        <div className="text-center">
          <button 
            onClick={onReadAllReviews}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-bold bg-[#093523] hover:bg-[#062417] text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#ffffff"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
            </svg>
            <span>Read all Google reviews</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
