import React, { useState, useEffect, useRef } from "react";
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
  ClipboardList,
  Search,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Command,
  FileText,
  AlertTriangle,
  Lock,
  Building2
} from "lucide-react";
import { searchGlobalIndex } from "../utils/searchIndex";

export default function Navbar({ 
  onOpenLogin, 
  onOpenRegister, 
  onOpenEnquiries, 
  enquiriesCount = 0,
  currentUser,
  onLogout,
  currentSection, 
  setCurrentSection,
  onSelectShare,
  onSelectArticle,
  onNavigateCareers,
  onNavigateLegal
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  // Global Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Keyboard Shortcut: Ctrl+K or / to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Live Search Query Trigger
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchGlobalIndex(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Click Outside to Close Search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateTo = (id) => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setUserDropdown(false);
    setIsSearchOpen(false);
    setSearchQuery("");

    if (id === "careers") {
      if (onNavigateCareers) {
        onNavigateCareers();
      } else {
        setCurrentSection("careers");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (id === "disclaimer" || id === "terms" || id === "privacy") {
      if (onNavigateLegal) {
        onNavigateLegal(id);
      }
      return;
    }

    if (id === "insurance") {
      window.dispatchEvent(new CustomEvent("open-insurance-drawer"));
    } else if (id === "loans") {
      window.dispatchEvent(new CustomEvent("open-loans-drawer"));
    }

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

  const handleSearchResultClick = (item) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setMobileMenuOpen(false);

    if (item.type === "share" && onSelectShare && item.data) {
      onSelectShare(item.data);
      return;
    }

    if (item.type === "article" && onSelectArticle && item.data) {
      onSelectArticle(item.data);
      return;
    }

    if (item.type === "careers") {
      if (onNavigateCareers) {
        onNavigateCareers();
      } else {
        setCurrentSection("careers");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (item.type === "legal") {
      if (onNavigateLegal) {
        onNavigateLegal(item.tab || "disclaimer");
      }
      return;
    }

    if (item.type === "register") {
      if (onOpenRegister) onOpenRegister();
      return;
    }

    if (item.type === "external" && item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (item.target) {
      navigateTo(item.target);
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-950/10 py-2" : "bg-white/90 backdrop-blur-sm py-3 border-b border-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        
        {/* Official Complete GSP Brand Logo */}
        <div 
          onClick={() => navigateTo("home")} 
          className="flex items-center cursor-pointer group select-none py-1 shrink-0"
        >
          <img 
            src="/assets/gsp_full_logo.png" 
            alt="GSP Investment Pvt. Ltd. - Smart Money Starts Here" 
            className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]" 
          />
        </div>

        {/* Global Search Bar in Center Area */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-emerald-800 absolute left-3.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isSearchOpen) setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search shares, loans, insurance, calculators..."
              className="w-full pl-9 pr-14 py-2 text-xs font-semibold text-gray-900 bg-gray-50/90 hover:bg-gray-100/90 focus:bg-white border border-gray-200 focus:border-emerald-700 rounded-full outline-none transition-all shadow-2xs focus:ring-2 focus:ring-emerald-700/10"
            />
            <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none">
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded shadow-2xs font-mono">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Search Dropdown Overlay */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50 animate-fade-in max-h-[480px] flex flex-col">
              
              {/* Dropdown Header */}
              <div className="px-4 py-2.5 bg-emerald-50/70 border-b border-gray-100 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Global Platform Search</span>
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {searchQuery.trim() ? `${searchResults.length} results` : "Quick Navigation"}
                </span>
              </div>

              {/* Results List */}
              <div className="overflow-y-auto divide-y divide-gray-100 flex-1 p-1">
                {searchQuery.trim() ? (
                  searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSearchResultClick(item)}
                        className="w-full p-2.5 rounded-xl hover:bg-emerald-50/80 text-left transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                            {item.category === "Unlisted Shares" && <Coins className="w-4 h-4 text-amber-600" />}
                            {item.category === "Insurance" && <ShieldCheck className="w-4 h-4 text-emerald-700" />}
                            {item.category === "Loans" && <Briefcase className="w-4 h-4 text-emerald-700" />}
                            {item.category === "Calculators" && <Calculator className="w-4 h-4 text-emerald-700" />}
                            {item.category === "Careers" && <Sparkles className="w-4 h-4 text-amber-500" />}
                            {item.category === "Legal" && <Scale className="w-4 h-4 text-gray-700" />}
                            {item.category === "Services" && <TrendingUp className="w-4 h-4 text-emerald-700" />}
                            {item.category === "Market Insights" && <FileText className="w-4 h-4 text-emerald-700" />}
                            {!["Unlisted Shares", "Insurance", "Loans", "Calculators", "Careers", "Legal", "Services", "Market Insights"].includes(item.category) && (
                              <Search className="w-4 h-4 text-emerald-700" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-gray-900 group-hover:text-emerald-900">
                                {item.title}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-semibold uppercase">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        {item.badge && (
                          <span className="text-[11px] font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md shrink-0 border border-emerald-100">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                        <Search className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-gray-700">No matching results for "{searchQuery}"</div>
                      <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                        Try searching for keywords like "MSEI", "SIP", "Health Insurance", "Home Loan", "Careers", or "Helpline".
                      </p>
                    </div>
                  )
                ) : (
                  /* Instant Quick Links when Search is focused without query */
                  <div className="p-2 space-y-1 text-xs">
                    <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Popular Searches & Quick Access
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => navigateTo("unlisted-shares")}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-left font-medium text-gray-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        <span>Unlisted Shares</span>
                      </button>
                      <button
                        onClick={() => navigateTo("insurance")}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-left font-medium text-gray-800 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Insurance Desk</span>
                      </button>
                      <button
                        onClick={() => navigateTo("loans")}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-left font-medium text-gray-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Loan Solutions</span>
                      </button>
                      <button
                        onClick={() => navigateTo("calculator")}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-left font-medium text-gray-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                        <span>SIP Calculator</span>
                      </button>
                      <button
                        onClick={() => navigateTo("careers")}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-left font-medium text-amber-700 font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Sales Careers 🚀</span>
                      </button>
                      <button
                        onClick={() => navigateTo("contact")}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-left font-medium text-gray-800 flex items-center gap-2 cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Helpline: 0250 359 4768</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer info in search modal */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                <span>Navigate: Click or Press Enter</span>
                <span>ESC to dismiss</span>
              </div>

            </div>
          )}
        </div>

        {/* Desktop Nav Items (Market Insights REMOVED) */}
        <nav className="hidden lg:flex items-center gap-5 text-[14px] font-medium text-gray-700">
          <button 
            onClick={() => navigateTo("home")}
            className={`transition-colors py-1 cursor-pointer font-semibold ${
              currentSection === "home"
                ? "text-emerald-900 border-b-2 border-emerald-600"
                : "text-gray-700 hover:text-emerald-700"
            }`}
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
                    onClick={() => navigateTo("insurance")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Insurance Solutions
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
            onClick={() => navigateTo("careers")}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1 ${
              currentSection === "careers" 
                ? "text-emerald-900 font-bold border-b-2 border-emerald-600" 
                : "text-gray-700 hover:text-emerald-700"
            }`}
          >
            <span>Careers</span>
            <span className="px-1.5 py-0.2 text-[9px] bg-amber-400 text-gray-950 font-black rounded-sm">HIRING</span>
          </button>

          <button 
            onClick={() => navigateTo("contact")}
            className="hover:text-emerald-700 transition-colors py-1 cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* User Logged In State or Login/Register Buttons */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-xs hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span className="max-w-[100px] truncate">{currentUser.name || "Client"}</span>
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
            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-[#0f4b32] hover:bg-[#0a3523] text-white shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>

              <button 
                onClick={onOpenRegister}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#e8a317] hover:bg-[#d9940d] text-gray-900 shadow-sm transition-all cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Open Account</span>
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none cursor-pointer border border-gray-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Drawer Menu with Embedded Search */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-5 pt-3 pb-6 space-y-3 animate-fade-in">
          
          {/* Mobile Global Search Input */}
          <div className="relative pt-1 pb-2">
            <Search className="w-4 h-4 text-emerald-800 absolute left-3.5 top-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shares, loans, insurance, careers..."
              className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-700"
            />
            
            {/* Mobile Search Results */}
            {searchQuery.trim() && (
              <div className="mt-2 bg-white rounded-xl border border-gray-200 shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-100">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearchResultClick(item)}
                      className="w-full p-2.5 text-left text-xs hover:bg-emerald-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-gray-900">{item.title}</div>
                        <div className="text-[10px] text-gray-500">{item.category}</div>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>

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
            Investment Products
          </button>
          <button 
            onClick={() => navigateTo("insurance")}
            className="block w-full text-left py-2 text-base font-medium text-gray-700 cursor-pointer"
          >
            Insurance Solutions
          </button>
          <button 
            onClick={() => navigateTo("loans")}
            className="block w-full text-left py-2 text-base font-medium text-gray-700 cursor-pointer"
          >
            Loan Solutions
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
            onClick={() => navigateTo("careers")}
            className="w-full text-left py-2 text-base font-bold text-amber-700 flex items-center justify-between cursor-pointer"
          >
            <span>Careers (We're Hiring!)</span>
            <span className="px-2 py-0.5 text-[10px] bg-amber-400 text-gray-950 font-black rounded-md">NEW</span>
          </button>
          <button 
            onClick={() => navigateTo("contact")}
            className="block w-full text-left py-2 text-base font-medium text-gray-700 cursor-pointer"
          >
            Contact
          </button>

          <div className="pt-3 flex flex-col gap-2.5 border-t border-gray-100">
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
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold bg-[#0f4b32] text-white cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold bg-[#e8a317] text-gray-900 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Open Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
