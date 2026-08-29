import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowUpRight, 
  PieChart, 
  BarChart3, 
  CreditCard, 
  Briefcase, 
  Award,
  Wallet,
  Crown,
  User,
  Home,
  Car,
  GraduationCap,
  Landmark,
  Layers,
  Banknote,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  ArrowRight
} from "lucide-react";

export default function ServicesAndLoans({ onApplyLoan, onSelectService }) {
  const [isLoansExpanded, setIsLoansExpanded] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const loanScrollRef = useRef(null);
  const isHoveredRef = useRef(false);

  // Smooth Infinite Auto-Scrolling Engine for Loans when expanded
  useEffect(() => {
    if (!isLoansExpanded) return;
    const el = loanScrollRef.current;
    if (!el) return;

    const initializePosition = () => {
      if (el.scrollWidth > el.clientWidth) {
        const oneSetWidth = el.scrollWidth / 3;
        if (el.scrollLeft === 0) {
          el.scrollLeft = oneSetWidth;
        }
      }
    };
    const timer = setTimeout(initializePosition, 100);

    let animationFrameId;
    const scrollStep = () => {
      if (isAutoScrolling && !isHoveredRef.current && el) {
        el.scrollLeft += 0.85;

        const oneSetWidth = el.scrollWidth / 3;
        if (oneSetWidth > 0) {
          if (el.scrollLeft >= oneSetWidth * 2) {
            el.scrollLeft -= oneSetWidth;
          } else if (el.scrollLeft <= 5) {
            el.scrollLeft += oneSetWidth;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoansExpanded, isAutoScrolling]);

  const scrollLoans = (direction) => {
    if (loanScrollRef.current) {
      const el = loanScrollRef.current;
      const scrollAmount = direction === "left" ? -340 : 340;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Primary Investment Products (2 Rows of 3 Cards)
  const investmentServices = [
    {
      id: "equity-trading",
      title: "Equity Trading",
      badge: "Core Market",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: BarChart3,
      description: "Trade NSE and BSE cash equities, intraday, futures & options with deep liquidity and research-backed technical charts.",
    },
    {
      id: "ipo",
      title: "IPO Investments",
      badge: "High Demand",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: ArrowUpRight,
      description: "Apply for mainline and SME initial public offerings with paperless UPI/ASBA integration and instant allotment status alerts.",
    },
    {
      id: "mutual-funds",
      title: "Mutual Funds",
      badge: "Most Popular",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: PieChart,
      description: "Explore 2,500+ direct mutual fund schemes across equity, debt, and hybrid categories. Start systematic investments from ₹500/month.",
    },
    {
      id: "demat-account",
      title: "Demat Account",
      badge: "Zero AMC Free",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: Wallet,
      description: "Open a secure, seamless Demat & trading account with zero paperwork and instant 5-minute DigiLocker-verified eKYC onboarding.",
    },
    {
      id: "wealth-management",
      title: "Wealth Management",
      badge: "HNI & Family",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: Briefcase,
      description: "Holistic asset allocation, tax-efficient investments, retirement structures, and estate succession planning for affluent families.",
    },
    {
      id: "portfolio-advisory",
      title: "Portfolio Advisory",
      badge: "SEBI Registered",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: Crown,
      description: "Custom stock and fund portfolios curated and actively rebalanced by experienced SEBI-registered portfolio managers and analysts.",
    },
  ];

  // Secondary Loan Solutions
  const loanSolutions = [
    {
      id: "personal",
      title: "Personal Loans",
      icon: User,
      description: "Instant multi-purpose funds for medical emergencies, travel, home renovation, or debt consolidation.",
      rate: "Starting @ 10.49%",
    },
    {
      id: "mortgages",
      title: "Home Loans & Mortgages",
      icon: Home,
      description: "Affordable home loans with flexible tenures up to 30 years and low processing fees for your dream property.",
      rate: "Starting @ 8.40%",
    },
    {
      id: "auto",
      title: "Auto & Vehicle Loans",
      icon: Car,
      description: "Drive your dream car with up to 100% on-road financing and flexible EMI options.",
      rate: "Starting @ 8.90%",
    },
    {
      id: "student",
      title: "Education & Student Loans",
      icon: GraduationCap,
      description: "Comprehensive financial assistance for domestic and international higher education programs.",
      rate: "Starting @ 9.15%",
    },
    {
      id: "home-equity",
      title: "Loan Against Property",
      icon: Landmark,
      description: "Unlock high-value liquidity by leveraging the equity built into your residential or commercial real estate.",
      rate: "Starting @ 8.75%",
    },
    {
      id: "debt-consolidation",
      title: "Debt Consolidation",
      icon: Layers,
      description: "Combine multiple costly debts and high-interest credit cards into a single manageable low-interest payment.",
      rate: "Save up to 40% EMI",
    },
    {
      id: "payday",
      title: "Short-Term Credit",
      icon: Banknote,
      description: "Quick turnaround working capital and cash advances tailored for immediate emergency cashflow needs.",
      rate: "Instant Approval",
    },
  ];

  return (
    <section id="services" className="bg-white">
      {/* ─────────────────────────────────────────────────────────────
          PART 1: PRIMARY SERVICES - INVESTMENT PRODUCTS (2x3 GRID)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-r from-[#062c1b] via-[#0d4629] via-50% to-[#c98914]">
        
        {/* Subtle Background Textures */}
        <div 
          className="absolute inset-y-0 left-0 w-80 opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: 'radial-gradient(#86efac 1.5px, transparent 1.5px)', 
            backgroundSize: '18px 18px' 
          }}
        ></div>
        <div 
          className="absolute inset-y-0 right-0 w-96 opacity-15 pointer-events-none"
          style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 2px, transparent 0, transparent 12px)' 
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <div className="text-xs font-black uppercase tracking-widest text-[#4ade80] mb-2 drop-shadow-xs">
              PRIMARY SERVICES
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Investment Products
            </h2>
            <p className="mt-3 text-sm sm:text-base text-emerald-100/90 font-normal">
              Structured wealth generation and capital market tools tailored for Indian investors.
            </p>

            {/* Accent divider */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <div className="w-10 h-1 rounded-full bg-[#4ade80]"></div>
              <div className="w-2.5 h-1 rounded-full bg-[#f59e0b]"></div>
            </div>
          </div>

          {/* 6 Investment Cards Grid (2 rows of 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentServices.map((service) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.id}
                  onClick={() => onSelectService(service)}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer flex flex-col justify-between border border-white/40"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 group-hover:bg-[#0f4b32] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                        <Icon className="w-6 h-6 stroke-[1.75]" />
                      </div>

                      {service.badge && (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${service.badgeColor}`}>
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-emerald-900 transition-colors mb-2.5">
                      {service.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
                    <span>Explore Solutions</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PART 2: OTHER SERVICES - SEPARATE EXPANDABLE LOAN SERVICES
      ───────────────────────────────────────────────────────────── */}
      <div id="loans" className="border-t border-gray-100 bg-[#fafcfb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          
          {/* Expandable Loan Drawer Banner */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold mb-2">
                <span>OTHER SERVICES</span>
                <span>•</span>
                <span>FINANCING & CREDIT</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Loan Solutions & Credit Facilities
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Looking for personal, home, auto, or education funding? Explore our low-interest, paperless loan options designed to reduce financial stress.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsLoansExpanded(!isLoansExpanded)}
                className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full text-sm font-bold bg-[#0f4b32] hover:bg-[#093523] text-white shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
              >
                <span>{isLoansExpanded ? "Hide Loan Options" : "View Loan Options"}</span>
                {isLoansExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Expandable Loan Solutions Carousel */}
          {isLoansExpanded && (
            <div className="mt-8 pt-6 border-t border-gray-200/80 animate-in fade-in slide-in-from-top-4 duration-300">
              
              {/* Carousel Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Explore 7 Tailored Loan Categories
                  </h4>
                  <p className="text-xs text-gray-500">
                    Instant pre-eligibility check with transparent interest rates.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Play / Pause Toggle Button */}
                  <button 
                    type="button"
                    onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 text-xs font-bold text-gray-700 hover:text-emerald-900 shadow-2xs transition-all cursor-pointer"
                    title={isAutoScrolling ? "Pause auto-scroll" : "Resume auto-scroll"}
                  >
                    {isAutoScrolling ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <Pause className="w-3.5 h-3.5 text-emerald-800" />
                        <span className="hidden sm:inline">Auto-Scroll</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                        <span className="hidden sm:inline">Play</span>
                      </>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={() => scrollLoans("left")} 
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 shadow-2xs transition-all cursor-pointer"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => scrollLoans("right")} 
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 shadow-2xs transition-all cursor-pointer"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Loan Carousel */}
              <div 
                ref={loanScrollRef}
                onMouseEnter={() => { isHoveredRef.current = true; }}
                onMouseLeave={() => { isHoveredRef.current = false; }}
                onTouchStart={() => { isHoveredRef.current = true; }}
                onTouchEnd={() => { setTimeout(() => { isHoveredRef.current = false; }, 2000); }}
                className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 focus:outline-none cursor-grab active:cursor-grabbing select-none"
                style={{ 
                  scrollSnapType: isAutoScrolling ? 'none' : 'x mandatory',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {[...loanSolutions, ...loanSolutions, ...loanSolutions].map((loan, idx) => {
                  const Icon = loan.icon;
                  return (
                    <div 
                      key={`${loan.id}-${idx}`}
                      onClick={() => onApplyLoan(loan)}
                      className="snap-start shrink-0 w-[270px] sm:w-[300px] md:w-[320px] bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 hover:border-emerald-500/70 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer group text-left"
                    >
                      <div>
                        {/* Top Row: Icon & Rate Badge */}
                        <div className="flex items-center justify-between mb-5">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-50 group-hover:bg-[#0f4b32] text-emerald-800 group-hover:text-white flex items-center justify-center transition-colors duration-300 shadow-xs">
                            <Icon className="w-7 h-7 stroke-[1.75]" />
                          </div>

                          {loan.rate && (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50/90 px-3 py-1 rounded-full border border-emerald-200/80">
                              {loan.rate}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 leading-snug group-hover:text-emerald-900 transition-colors">
                          {loan.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                          {loan.description}
                        </p>
                      </div>

                      {/* Card Bottom CTA */}
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-emerald-800 group-hover:text-emerald-950">
                        <span>Apply Online</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
