import React, { useState } from "react";
import { 
  ArrowUpRight, 
  PieChart, 
  BarChart3, 
  CreditCard, 
  Briefcase, 
  Award,
  User,
  Home,
  Car,
  GraduationCap,
  Landmark,
  Layers,
  Banknote,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default function ServicesAndLoans({ onApplyLoan, onSelectService }) {
  const [selectedLoan, setSelectedLoan] = useState(null);

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
      icon: CreditCard,
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
      icon: Award,
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
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PART 1: INVESTMENT PRODUCTS & SERVICES */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">
            OUR SERVICES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Investment Products & Services
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Comprehensive investment solutions for every stage of your financial journey.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {investmentServices.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.id}
                onClick={() => onSelectService(service)}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 group-hover:bg-[#0f4b32] group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>

                    {service.badge && (
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${service.badgeColor}`}>
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-900 transition-colors mb-2">
                    {service.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* PART 2: LOAN SERVICES */}
        <div id="loans" className="text-center max-w-3xl mx-auto mb-12 pt-6 border-t border-gray-100">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-2">
            LOAN SERVICES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Loan Solutions for Every Need
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Flexible loan options tailored to help you achieve your goals.
          </p>
        </div>

        {/* 7 Loan Solutions Cards matching Page 5 bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {loanSolutions.map((loan) => {
            const Icon = loan.icon;
            return (
              <div 
                key={loan.id}
                onClick={() => onApplyLoan(loan)}
                className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer group text-center"
              >
                <div>
                  <div className="w-11 h-11 mx-auto rounded-xl bg-purple-50 group-hover:bg-purple-100 text-purple-700 flex items-center justify-center mb-3 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-2 leading-snug">
                    {loan.title}
                  </h3>

                  <p className="text-[11px] text-gray-500 leading-normal line-clamp-4">
                    {loan.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-100 text-[10px] font-bold text-purple-800 group-hover:underline">
                  Apply Now →
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
