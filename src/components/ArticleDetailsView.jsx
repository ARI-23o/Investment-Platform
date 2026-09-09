import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  Clock, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  Sparkles,
  BookOpen,
  Bookmark,
  Check,
  Send,
  Building2,
  ChevronRight
} from "lucide-react";
import { RESEARCH_ARTICLES } from "../data/marketInsightsData";
import { syncLeadToGoogleSheet } from "../utils/exportUtils";
import { saveEnquiryToBackend } from "../services/api";

export default function ArticleDetailsView({ 
  selectedArticleId, 
  onBack, 
  onSelectArticle,
  onConsultTopic 
}) {
  const currentArticle = RESEARCH_ARTICLES.find((a) => a.id === selectedArticleId) || RESEARCH_ARTICLES[0];
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Quick Enquiry Form state inside article
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedArticleId]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || mobile.length !== 10) return;

    setIsSubmitting(true);
    const enquiryRecord = {
      id: "ENQ-" + Date.now(),
      type: "article-enquiry",
      title: `Research Inquiry: ${currentArticle.title}`,
      service: currentArticle.tag,
      articleTitle: currentArticle.title,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      message: query.trim() || `Interested in advisory for ${currentArticle.title}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Desk Assigned",
      source: "Market Insights Reader"
    };

    try {
      await saveEnquiryToBackend(enquiryRecord);
      syncLeadToGoogleSheet(enquiryRecord);
    } catch (err) {
      console.warn("Lead sync error:", err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFullName("");
        setMobile("");
        setQuery("");
      }, 4000);
    }, 700);
  };

  const otherArticles = RESEARCH_ARTICLES.filter((a) => a.id !== currentArticle.id);

  return (
    <div className="min-h-screen bg-[#fafcfb] text-gray-900 pb-20">
      
      {/* Top Navigation Bar / Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-emerald-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Insights</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                bookmarked 
                  ? "bg-amber-50 border-amber-300 text-amber-900" 
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
              title={bookmarked ? "Bookmarked" : "Bookmark article"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-amber-600 text-amber-600" : ""}`} />
              <span className="hidden sm:inline">{bookmarked ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Share article link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Category & Tags Header */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/90 text-emerald-900 border border-emerald-300">
            {currentArticle.tag}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
            {currentArticle.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-[1.25] mb-4">
          {currentArticle.title}
        </h1>

        {/* Subtitle */}
        {currentArticle.subtitle && (
          <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed mb-6">
            {currentArticle.subtitle}
          </p>
        )}

        {/* Author & Meta Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200/80 mb-8 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
              GSP
            </div>
            <div>
              <div className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                <span>{currentArticle.author}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                {currentArticle.authorRole} • GSP Investment Pvt. Ltd.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500 font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{currentArticle.publishedAt || currentArticle.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{currentArticle.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-gray-400" />
              <span>{currentArticle.views} reads</span>
            </div>
          </div>
        </div>

        {/* Executive Summary & Key Takeaways Card */}
        <div className="bg-gradient-to-br from-emerald-50/90 to-amber-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs mb-10">
          <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-emerald-900 mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Executive Summary & Key Takeaways</span>
          </div>

          <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed mb-5">
            {currentArticle.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-emerald-200/60">
            {currentArticle.keyTakeaways.map((takeaway, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="leading-snug">{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Metrics Bar */}
        {currentArticle.metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {currentArticle.metrics.map((metric, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs text-center">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  {metric.label}
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-gray-900 mt-1">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Structured Article Sections */}
        <div className="space-y-8 text-gray-800 text-sm sm:text-base leading-relaxed">
          {currentArticle.contentSections.map((sec, i) => (
            <section key={i} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xs">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                {sec.heading}
              </h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed font-normal">
                {sec.text}
              </p>

              {sec.bullets && (
                <ul className="space-y-2.5 pl-1">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></div>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Analyst Verdict Box */}
        {currentArticle.analystVerdict && (
          <div className="mt-10 bg-[#0f4b32] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-bold mb-3 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Analyst Strategic Verdict</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Actionable Recommendation
              </h3>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                {currentArticle.analystVerdict}
              </p>

              <button
                onClick={() => onConsultTopic && onConsultTopic({ title: currentArticle.title, tag: currentArticle.tag })}
                className="px-6 py-3 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-gray-950 font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Book Free Advisory Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* In-Article Direct Inquiry Form */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="max-w-xl">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              Have questions regarding {currentArticle.tag}?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-5">
              Connect directly with our equity research & portfolio desk for personalized allocation guidance.
            </p>

            {isSubmitted ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your research request has been logged. Our analyst will connect shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold outline-none focus:border-emerald-600"
                  />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-Digit Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Specific questions or portfolio query (optional)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#0f4b32] hover:bg-[#093523] text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-all"
                  >
                    {isSubmitting ? "Sending..." : "Submit Inquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Related Articles Carousel / Grid */}
        <div className="mt-14 pt-10 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Related Research & Market Insights
              </h3>
              <p className="text-xs text-gray-500">
                Continue reading actionable insights curated by our analysts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {otherArticles.slice(0, 3).map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full mb-3">
                    {art.tag}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-emerald-900 transition-colors leading-snug line-clamp-3 mb-2">
                    {art.title}
                  </h4>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 mt-4">
                  <span>{art.readTime}</span>
                  <span className="text-emerald-800 font-bold group-hover:underline flex items-center gap-1">
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </article>

    </div>
  );
}
