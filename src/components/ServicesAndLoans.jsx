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
  Pause,
  Play
} from "lucide-react";

export default function ServicesAndLoans({ onApplyLoan, onSelectService }) {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const loanScrollRef = useRef(null);
  const isHoveredRef = useRef(false);

  // Smooth Infinite Auto-Scrolling Engine
  useEffect(() => {
    const el = loanScrollRef.current;
    if (!el) return;

    // Initialize scroll position to the middle clone set for seamless bidirectional loop
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
        el.scrollLeft += 0.85; // Smooth 60fps drift

        const oneSetWidth = el.scrollWidth / 3;
        if (oneSetWidth > 0) {
          if (el.scrollLeft >= oneSetWidth * 2) {
            el.scrollLeft -= oneSetWidth; // Seamless wrap to first set
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
  }, [isAutoScrolling]);

  const scrollLoans = (direction) => {
    if (loanScrollRef.current) {
      const el = loanScrollRef.current;
      const scrollAmount = direction === "left" ? -340 : 340;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });

      // Handle infinite wrap-around on manual scroll
      setTimeout(() => {
        const oneSetWidth = el.scrollWidth / 3;
        if (oneSetWidth > 0) {
          if (el.scrollLeft >= oneSetWidth * 2) {
            el.scrollLeft -= oneSetWidth;
          } else if (el.scrollLeft <= 10) {
            el.scrollLeft += oneSetWidth;
          }
        }
      }, 400);
    }
  };

  const investmentServices = [
    {
      id: "ipo",
      title: "IPO Investments",
      badge: "High Demand",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: ArrowUpRight,
      description: "Apply for upcoming IPOs with seamless ASBA integration and real-time allotment updates.",
    },
    {
      id: "mutual-funds",
      title: "Mutual Funds",
      badge: "Most Popular",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: PieChart,
      description: "Access 2,500+ mutual fund schemes. Start SIPs from ₹500 with goal-based planning tools.",
    },
    {
      id: "equity-trading",
      title: "Equity Trading",
      icon: BarChart3,
      description: "Trade NSE and BSE equities, derivatives and ETFs with research-backed market insights.",
    },
    {
      id: "demat-account",
      title: "Demat Account",
      badge: "Free Opening",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: Wallet,
      description: "Open a zero-maintenance Demat account with instant eKYC and paperless onboarding.",
    },
    {
      id: "wealth-management",
      title: "Wealth Management",
      badge: "Premium",
      badgeColor: "bg-emerald-100 text-emerald-800",
      icon: Briefcase,
      description: "Holistic financial planning, portfolio management and estate planning services.",
    },
    {
      id: "portfolio-advisory",
      title: "Portfolio Advisory",
      icon: Crown,
      description: "Personalised portfolio construction and rebalancing by SEBI-registered investment advisors.",
    },
  ];

  const loanSolutions = [
    {
      id: "personal",
      title: "Personal Loans",
      icon: User,
      description: "Unsecured funds you can use for almost any purpose, like medical bills or debt consolidation.",
      rate: "Starting @ 10.49%",
    },
    {
      id: "mortgages",
      title: "Mortgages",
      icon: Home,
      description: "Secured loans used to buy a house, where the property acts as collateral.",
      rate: "Starting @ 8.40%",
    },
    {
      id: "auto",
      title: "Auto Loans",
      icon: Car,
      description: "Secured loans specifically meant for purchasing a car or other vehicle.",
      rate: "Starting @ 8.90%",
    },
    {
      id: "student",
      title: "Student Loans",
      icon: GraduationCap,
      description: "Financing options designed to pay for college tuition and education-related costs.",
      rate: "Starting @ 9.15%",
    },
    {
      id: "home-equity",
      title: "Home Equity Loans",
      icon: Landmark,
      description: "Loans that let you borrow against the value or equity you have built up in your home.",
      rate: "Starting @ 8.75%",
    },
    {
      id: "debt-consolidation",
      title: "Debt Consolidation Loans",
      icon: Layers,
      description: "Specific loans used to combine multiple smaller debts or credit cards into a single monthly payment.",
      rate: "Save up to 40% EMI",
    },
    {
      id: "payday",
      title: "Payday Loans",
      icon: Banknote,
      description: "Small, short-term, and high-cost cash advances meant to be paid back by your next payday.",
      rate: "Instant 15-min approval",
    },
  ];

  return (
    <section id="services" className="bg-white">
      {/* PART 1: INVESTMENT PRODUCTS & SERVICES with Exact Green-to-Gold Gradient */}
      <div className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-r from-[#062c1b] via-[#0d4629] via-50% to-[#c98914]">
        
        {/* Subtle Left Side Micro-Dot Pattern Texture */}
        <div 
          className="absolute inset-y-0 left-0 w-80 opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: 'radial-gradient(#86efac 1.5px, transparent 1.5px)', 
            backgroundSize: '18px 18px' 
          }}
        ></div>

        {/* Subtle Right Side Diagonal Striped Pattern Texture */}
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
              OUR SERVICES
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Investment Products & Services
            </h2>
            <p className="mt-3 text-sm sm:text-base text-emerald-100/90 font-normal">
              Comprehensive investment solutions for every stage of your financial journey.
            </p>

            {/* Accent divider matching screenshot */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <div className="w-10 h-1 rounded-full bg-[#4ade80]"></div>
              <div className="w-2.5 h-1 rounded-full bg-[#f59e0b]"></div>
            </div>
          </div>

          {/* 6 Grid Cards */}
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
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* PART 2: LOAN SERVICES WITH INFINITE SCROLLING */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div id="loans">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <div className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">
                LOAN SERVICES
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Loan Solutions for Every Need
              </h2>
              <p className="mt-3 text-base sm:text-lg text-gray-600 font-normal">
                Flexible loan options tailored to help you achieve your personal and business goals.
              </p>
            </div>

            {/* Infinite Scrolling Navigation Controls */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Play / Pause Toggle Button */}
              <button 
                type="button"
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-emerald-50 text-xs font-bold text-gray-700 hover:text-emerald-900 shadow-xs hover:shadow-md transition-all cursor-pointer"
                title={isAutoScrolling ? "Pause auto-scroll" : "Resume auto-scroll"}
              >
                {isAutoScrolling ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Pause className="w-3.5 h-3.5 text-emerald-800" />
                    <span className="hidden sm:inline">Auto-Scrolling</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                    <span className="hidden sm:inline">Play Auto-Scroll</span>
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => scrollLoans("left")} 
                className="p-3 rounded-2xl border border-gray-200 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 shadow-xs hover:shadow-md transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => scrollLoans("right")} 
                className="p-3 rounded-2xl border border-gray-200 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 shadow-xs hover:shadow-md transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Infinite Auto-Scrolling Carousel with Pause on Hover */}
          <div 
            ref={loanScrollRef}
            onMouseEnter={() => { isHoveredRef.current = true; }}
            onMouseLeave={() => { isHoveredRef.current = false; }}
            onTouchStart={() => { isHoveredRef.current = true; }}
            onTouchEnd={() => { setTimeout(() => { isHoveredRef.current = false; }, 2000); }}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-2 px-1 focus:outline-none cursor-grab active:cursor-grabbing select-none"
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

                    {/* Enlarged Clear Title */}
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 leading-snug group-hover:text-emerald-900 transition-colors">
                      {loan.title}
                    </h3>

                    {/* Enlarged Readable Description */}
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

      </div>
    </section>
  );
}
