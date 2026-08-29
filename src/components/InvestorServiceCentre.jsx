import React from "react";
import { 
  UserPlus, 
  TrendingUp, 
  PieChart, 
  FileCheck, 
  Briefcase, 
  ArrowLeftRight,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function InvestorServiceCentre({ onSelectService }) {
  const services = [
    {
      id: "open-account",
      title: "Open Account",
      subtitle: "Start investing",
      icon: UserPlus,
      color: "emerald",
      tag: "Instant 5 Mins",
      description: "Paperless Demat & Trading account opening with instant Aadhaar eKYC.",
    },
    {
      id: "ipo-application",
      title: "IPO Application",
      subtitle: "Apply for IPOs",
      icon: TrendingUp,
      color: "emerald",
      tag: "UPI / ASBA",
      description: "Seamless IPO bids with instant UPI mandate approval and live status tracking.",
    },
    {
      id: "mutual-funds",
      title: "Mutual Funds",
      subtitle: "Start SIP today",
      icon: PieChart,
      color: "emerald",
      tag: "Zero Commission",
      description: "Explore 2,500+ direct mutual fund schemes and setup flexible automated SIPs.",
    },
    {
      id: "kyc-update",
      title: "KYC Update",
      subtitle: "Update details",
      icon: FileCheck,
      color: "emerald",
      tag: "Online Process",
      description: "Update your address, mobile, email, nominee, or bank details easily.",
    },
    {
      id: "account-closure",
      title: "Account Closure",
      subtitle: "Close account",
      icon: Briefcase,
      color: "emerald",
      tag: "Assisted Desk",
      description: "Transparent and hassle-free account closure request and stock transfer guide.",
    },
    {
      id: "fund-transfer",
      title: "Fund Transfer",
      subtitle: "Transfer funds",
      icon: ArrowLeftRight,
      color: "emerald",
      tag: "Instant Payout",
      description: "Deposit or withdraw funds via UPI, Net Banking, or NEFT/RTGS with zero charges.",
    },
  ];

  return (
    <section id="services-centre" className="relative py-20 overflow-hidden bg-gradient-to-b from-[#fbfdfc] via-[#f7faf8] to-[#f4f8f6]">
      
      {/* Large Centered Gold Coins & Sprout Plant Background */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[380px] sm:w-[540px] md:w-[680px] lg:w-[820px] h-[220px] sm:h-[290px] md:h-[350px] pointer-events-none select-none z-0 overflow-hidden flex items-end justify-center">
        <img 
          src="/assets/gold_coins_sprout_clean.png" 
          alt="Investor Service Centre Wealth Background" 
          className="w-full h-full object-contain object-bottom opacity-70 sm:opacity-85 drop-shadow-2xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Investor Service Centre
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-medium">
            Access all investor services instantly without waiting in queues.
          </p>
        </div>

        {/* 6 Grid Service Cards in one continuous sleek row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onSelectService(item)}
                className="group relative bg-white/95 backdrop-blur-md border border-gray-200/90 hover:border-emerald-500/80 rounded-2xl p-5 text-center flex flex-col items-center justify-between shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1.5"
              >
                {/* Circular Icon Container */}
                <div className="w-14 h-14 rounded-full bg-emerald-50/80 group-hover:bg-[#0f4b32] text-emerald-800 group-hover:text-white flex items-center justify-center transition-colors duration-300 shadow-inner mb-4">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>

                {/* Service Title */}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-emerald-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {item.subtitle}
                  </p>
                </div>

                {/* Subtle Accent Dash Indicator matching PDF */}
                <div className="w-6 h-0.5 bg-amber-500/80 group-hover:w-10 group-hover:bg-emerald-600 rounded-full mt-4 transition-all duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Wealth Plant & Golden Coins decorative strip matching Page 3 bottom */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>24/7 Digital Self-Service Portal for GSP Account Holders</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-800 font-semibold">
            <span>Instant Resolution</span>
            <span>•</span>
            <span>Bank-Grade 256-bit Encryption</span>
            <span>•</span>
            <span>SEBI / Exchange Compliant</span>
          </div>
        </div>

      </div>
    </section>
  );
}
