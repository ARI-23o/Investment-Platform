import React, { useState, useEffect } from "react";
import { 
  LogIn, 
  ArrowUpRight, 
  ChevronDown, 
  Menu, 
  X, 
  TrendingUp, 
  PieChart, 
  Coins, 
  ShieldCheck, 
  Briefcase, 
  Calculator,
  Layers,
  PhoneCall,
  User,
  LogOut,
  ClipboardList
} from "lucide-react";

export default function Navbar({ 
  onOpenLogin, 
  onOpenRegister, 
  onOpenEnquiries, 
  enquiriesCount = 0,
  currentUser,
  onLogout,
  currentSection, 
  setCurrentSection 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (id) => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setUserDropdown(false);

    if (currentSection !== "home") {
      setCurrentSection("home");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 80);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-950/10 py-2.5" : "bg-white/90 backdrop-blur-sm py-3.5 border-b border-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo matching PDF */}
        <div 
          onClick={() => navigateTo("home")} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center">
            <div className="flex items-baseline font-black tracking-tighter text-2xl">
              <span className="text-[#0a482d] text-2xl md:text-3xl font-extrabold tracking-tight">G</span>
              <span className="text-[#d97706] text-2xl md:text-3xl font-extrabold tracking-tight">S</span>
              <span className="text-[#0a482d] text-2xl md:text-3xl font-extrabold tracking-tight">P</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 left-4.5 animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col border-l border-gray-300 pl-2.5">
            <span className="text-xs md:text-sm font-black tracking-wider text-[#0e3b27] uppercase leading-none">
              Investment
            </span>
            <span className="text-[10px] md:text-[11px] font-semibold tracking-widest text-gray-500 uppercase leading-tight">
              Pvt. Ltd.
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-gray-700">
          <button 
            onClick={() => navigateTo("home")}
            className="hover:text-emerald-700 transition-colors py-1 cursor-pointer font-semibold text-emerald-900 border-b-2 border-emerald-600"
          >
            Home
          </button>
          
          <button 
            onClick={() => navigateTo("about")}
            className="hover:text-emerald-700 transition-colors py-1 cursor-pointer"
          >
            About Us
          </button>

          {/* Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
          >
            <button 
              onClick={() => navigateTo("services")}
              className="flex items-center gap-1 hover:text-emerald-700 transition-colors py-1 cursor-pointer"
            >
              Services
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdown ? "rotate-180" : ""}`} />
            </button>

            {servicesDropdown && (
              <div className="absolute top-full left-0 w-64 pt-2 shadow-2xl rounded-2xl z-50 animate-fade-in">
                <div className="bg-white rounded-2xl border border-emerald-100 p-3 shadow-xl space-y-1">
                  <button 
                    onClick={() => navigateTo("services")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Equity & Derivatives
                  </button>
                  <button 
                    onClick={() => navigateTo("unlisted-shares")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-amber-600" />
                    Unlisted Shares
                  </button>
                  <button 
                    onClick={() => navigateTo("calculator")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <PieChart className="w-4 h-4 text-emerald-600" />
                    Mutual Funds & SIP
                  </button>
                  <button 
                    onClick={() => navigateTo("loans")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    Loan Solutions
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => navigateTo("market-insights")}
            className="hover:text-emerald-700 transition-colors py-1 cursor-pointer"
          >
            Market Insights
          </button>

          <button 
            onClick={() => navigateTo("contact")}
            className="hover:text-emerald-700 transition-colors py-1 cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Action Buttons & Profile matching PDF */}
        <div className="hidden lg:flex items-center gap-3">

          {/* User Logged In State or Login/Register Buttons */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-xs hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span className="max-w-[120px] truncate">{currentUser.name || "Client"}</span>
                <ChevronDown className="w-3 h-3 text-emerald-700" />
              </button>

              {userDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-200 shadow-xl p-3 z-50 animate-fade-in text-xs">
                  <div className="pb-2 mb-2 border-b border-gray-100">
                    <div className="font-bold text-gray-900">{currentUser.name}</div>
                    <div className="text-gray-400 text-[11px] font-mono">{currentUser.clientId || "Client Active"}</div>
                  </div>
                  <button
                    onClick={() => { setUserDropdown(false); onOpenEnquiries(); }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-emerald-700" />
                    <span>My Enquiries & Forms</span>
                  </button>
                  <button
                    onClick={() => { setUserDropdown(false); onLogout(); }}
                    className="w-full text-left py-1.5 px-2 rounded-lg hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-2 cursor-pointer mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-[#0f4b32] hover:bg-[#0a3523] text-white shadow-sm transition-all duration-200 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>

              <button 
                onClick={onOpenRegister}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-[#e8a317] hover:bg-[#d9940d] text-gray-900 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Open Account</span>
              </button>
            </>
          )}

        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-5 pt-3 pb-6 space-y-3">
          <button 
            onClick={() => navigateTo("home")}
            className="block w-full text-left py-2 text-base font-semibold text-emerald-900 cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={() => navigateTo("about")}
            className="block w-full text-left py-2 text-base font-medium text-gray-700 cursor-pointer"
          >
            About Us
          </button>
          <button 
            onClick={() => navigateTo("services")}
            className="block w-full text-left py-2 text-base font-medium text-gray-700 cursor-pointer"
          >
            Services & Loans
          </button>
          <button 
            onClick={() => navigateTo("unlisted-shares")}
            className="block w-full text-left py-2 text-base font-medium text-gray-700 cursor-pointer"
          >
            Unlisted Shares
          </button>
          <button 
            onClick={() => navigateTo("calculator")}
            className="block w-full text-left py-2 text-base font-medium text-gray-700 cursor-pointer"
          >
            SIP Calculator
          </button>
          <button 
            onClick={() => navigateTo("market-insights")}
            className="block w-full text-left py-2 text-base font-medium text-gray-700 cursor-pointer"
          >
            Market Insights
          </button>
          <button 
            onClick={() => navigateTo("contact")}
            className="block w-full text-left py-2 text-base font-medium text-gray-700 cursor-pointer"
          >
            Contact
          </button>

          <div className="pt-4 flex flex-col gap-2.5 border-t border-gray-100">
            {currentUser ? (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 rounded-xl text-xs">
                  <div className="font-bold text-gray-900">{currentUser.name}</div>
                  <div className="text-gray-500">{currentUser.clientId}</div>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="w-full py-2.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium bg-[#0f4b32] text-white cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold bg-[#e8a317] text-gray-900 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Open Account</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
