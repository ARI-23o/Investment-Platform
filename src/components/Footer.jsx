import React from "react";
import { ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

export default function Footer({ onOpenLogin, onOpenRegister, onSelectShare, onOpenAdmin, onNavigateCareers, onNavigateLegal }) {
  const scrollTo = (id) => {
    if (id === "careers") {
      if (onNavigateCareers) {
        onNavigateCareers();
        return;
      }
    }
    if (id === "disclaimer" || id === "terms" || id === "privacy") {
      if (onNavigateLegal) {
        onNavigateLegal(id);
        return;
      }
    }
    if (id === "insurance") {
      window.dispatchEvent(new CustomEvent("open-insurance-drawer"));
    } else if (id === "loans") {
      window.dispatchEvent(new CustomEvent("open-loans-drawer"));
    }
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
            <div className="flex items-center select-none">
              <img 
                src="/assets/gsp_full_logo_white.png" 
                alt="GSP Investment Pvt. Ltd. - Smart Money Starts Here" 
                className="h-12 sm:h-14 md:h-15 w-auto object-contain" 
              />
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/70 leading-relaxed max-w-sm font-normal">
              GSP Investment Pvt. Ltd. is a premier investment and wealth advisory firm empowering Indian investors with equities, IPOs, direct mutual funds, and pre-IPO unlisted shares.
            </p>

            <div className="pt-2 text-xs text-emerald-400 font-medium space-y-1">
              <div>CIN: U64990MH2025PTC449205</div>
              <div>Reg. No: 449205</div>
              <div className="flex flex-wrap items-center gap-6">
                <span>ROC: ROC Mumbai</span>
                <span>GSTIN: 27AAMCG0815G1ZP</span>
              </div>
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
                <button onClick={() => scrollTo("insurance")} className="hover:text-amber-400 transition-colors">
                  Insurance Solutions
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
                <a href="https://evoting.cdslindia.com/Evoting/EvotingLogin" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>CDSL E-Voting</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.evoting.nsdl.com/" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>NSDL E-Voting</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button onClick={() => scrollTo("contact")} className="hover:text-amber-400 transition-colors">
                  Contact Support
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
                Regd. Off. : A-302 Aparna Niwas, Behind Tungareshwar sweet, Near Vasai road station, Vasai West, Vasai-Virar City, Maharashtra 401202
              </p>
              <div className="pt-2">
                <span className="text-emerald-400 block font-semibold">Investor Helpline:</span>
                <a href="tel:02503594768" className="text-white font-bold text-sm hover:text-amber-400 transition-colors">0250 359 4768</a>
              </div>
              <div>
                <span className="text-emerald-400 block font-semibold">WhatsApp:</span>
                <a href="https://wa.me/919096993499" target="_blank" rel="noreferrer" className="text-white font-bold hover:text-amber-400 transition-colors">+91 9096993499</a>
              </div>
              <div>
                <span className="text-emerald-400 block font-semibold">Customer Support:</span>
                <a href="mailto:gspinvestment6@gmail.com" className="text-white hover:text-amber-400 transition-colors break-all">gspinvestment6@gmail.com</a>
              </div>
              <div>
                <span className="text-emerald-400 block font-semibold">Compliance:</span>
                <a href="mailto:gspbackoffice6@gmail.com" className="text-white hover:text-amber-400 transition-colors break-all">gspbackoffice6@gmail.com</a>
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
            <button onClick={() => scrollTo("disclaimer")} className="hover:text-white cursor-pointer transition-colors">
              Disclaimer
            </button>
            <button onClick={() => scrollTo("terms")} className="hover:text-white cursor-pointer transition-colors">
              Terms of Use
            </button>
            <button onClick={() => scrollTo("privacy")} className="hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </button>
            <button 
              onClick={onOpenAdmin}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg border border-amber-400/30 transition-colors"
            >
              <span>Admin Desk & Excel 🔐</span>
            </button>
            <button onClick={() => scrollTo("careers")} className="hover:text-white cursor-pointer transition-colors">
              Careers
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
