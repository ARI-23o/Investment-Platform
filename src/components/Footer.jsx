import React from "react";
import { ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

export default function Footer({ onOpenLogin, onOpenRegister, onSelectShare, onOpenAdmin }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#031d13] text-gray-300 pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer: Brand + Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 select-none">
              <div className="flex items-baseline font-black tracking-tighter text-2xl">
                <span className="text-white text-3xl font-extrabold tracking-tight">G</span>
                <span className="text-[#e8a317] text-3xl font-extrabold tracking-tight">S</span>
                <span className="text-white text-3xl font-extrabold tracking-tight">P</span>
              </div>
              <div className="flex flex-col border-l border-emerald-800 pl-2.5">
                <span className="text-sm font-black tracking-wider text-emerald-100 uppercase leading-none">
                  Investment
                </span>
                <span className="text-[11px] font-semibold tracking-widest text-emerald-400 uppercase leading-tight">
                  Pvt. Ltd.
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/70 leading-relaxed max-w-sm font-normal">
              GSP Investment Pvt. Ltd. is a premier investment and wealth advisory firm empowering Indian investors with equities, IPOs, direct mutual funds, and pre-IPO unlisted shares.
            </p>

            <div className="pt-2 text-xs text-emerald-400 font-medium space-y-1">
              <div>CIN: U67120MH2008PTC182940 • CDSL DP ID: 12081600</div>
              <div>NSE Member Code: 14238 • BSE Member Code: 6521</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Products
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-200/80">
              <li>
                <button onClick={() => scrollTo("services")} className="hover:text-amber-400 transition-colors">
                  Equity Trading
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("unlisted-shares")} className="hover:text-amber-400 transition-colors">
                  Unlisted Shares
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("services")} className="hover:text-amber-400 transition-colors">
                  IPO Investments
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("calculator")} className="hover:text-amber-400 transition-colors">
                  Mutual Funds & SIP
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("loans")} className="hover:text-amber-400 transition-colors">
                  Loan Solutions
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("services")} className="hover:text-amber-400 transition-colors">
                  Wealth Management
                </button>
              </li>
            </ul>
          </div>

          {/* Investor Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-200/80">
              <li>
                <button onClick={() => scrollTo("services-centre")} className="hover:text-amber-400 transition-colors">
                  Open Demat Account
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("services-centre")} className="hover:text-amber-400 transition-colors">
                  KYC Updation
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("services-centre")} className="hover:text-amber-400 transition-colors">
                  Fund Transfer Desk
                </button>
              </li>
              <li>
                <a href="https://www.evotingindia.com/" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>CDSL E-Voting</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.eservices.nsdl.com/" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>NSDL E-Voting</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button onClick={() => scrollTo("contact")} className="hover:text-amber-400 transition-colors">
                  Grievance Redressal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Head Office
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-200/80">
              <p className="leading-relaxed">
                Regd. Off. : A-109, Everest Tower, Santoshi Mata Road, Opp. Maxi Ground, Kalyan (West) 421 301
              </p>
              <div className="pt-2">
                <span className="text-emerald-400 block font-semibold">Toll-Free Helpline:</span>
                <span className="text-white font-bold text-sm">1800-123-4567</span>
              </div>
              <div>
                <span className="text-emerald-400 block font-semibold">WhatsApp:</span>
                <span className="text-white font-bold">9323986654</span>
              </div>
              <div>
                <span className="text-emerald-400 block font-semibold">Email:</span>
                <span className="text-white">support@shreetisai.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimers & Statutory Notice */}
        <div className="py-8 border-b border-emerald-900/60 text-[11px] text-emerald-300/60 space-y-2.5 leading-relaxed">
          <p>
            <strong>Regulatory Disclaimer:</strong> Investments in securities market are subject to market risks; read all the related documents carefully before investing. Unlisted shares/securities are subject to illiquidity risk, higher price volatility, and are indicative for informational purposes only. GSP Investment Pvt. Ltd. does not guarantee returns on any financial products.
          </p>
          <p>
            <strong>Attention Investors:</strong> Prevent Unauthorized Transactions in your account. Update your Mobile Numbers/Email IDs with your stock broker/depository participant. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day.
          </p>
        </div>

        {/* Bottom Copyright & Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <div>
            © {new Date().getFullYear()} GSP Investment Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-white cursor-pointer">Investor Charter</span>
            <span className="hover:text-white cursor-pointer">Risk Disclosure</span>
            <button 
              onClick={onOpenAdmin}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg border border-amber-400/30 transition-colors"
            >
              <span>Admin Desk & Excel 🔐</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
