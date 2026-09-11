import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import UnlistedSharesSection from "./components/UnlistedSharesSection";
import InvestorServiceCentre from "./components/InvestorServiceCentre";
import DeviceSection from "./components/DeviceSection";
import ServicesAndLoans from "./components/ServicesAndLoans";
import SipCalculatorSection from "./components/SipCalculatorSection";
import MarketInsightsSection from "./components/MarketInsightsSection";
import ShareDetailsView from "./components/ShareDetailsView";
import ArticleDetailsView from "./components/ArticleDetailsView";
import CareersPage from "./components/CareersPage";
import LegalPoliciesView from "./components/LegalPoliciesView";
import AllUnlistedSharesPage from "./components/AllUnlistedSharesPage";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { LoginModal, OpenAccountModal, QuickEnquiryModal, ConsultAdvisorModal } from "./components/Modals";
import AdminDeskModal from "./components/AdminDeskModal";
import { CheckCircle2, X, Bell } from "lucide-react";
import { 
  fetchAllEnquiries, 
  saveEnquiryToBackend, 
  deleteEnquiryFromBackend, 
  clearAllEnquiriesFromBackend,
  fetchSettingsFromBackend
} from "./services/api";
import { getLocalUnlistedShares, fetchUnlistedSharesFromSheet } from "./services/unlistedSharesService";

// Parse route and parameters from URL query, hash, or pathname
function parseRouteFromUrl() {
  if (typeof window === "undefined") return { view: "home" };
  const hash = window.location.hash || "";
  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname.toLowerCase();

  // 1. Search params (?share=msei or ?view=all-shares)
  if (params.get("share")) {
    return { view: "share-details", shareId: params.get("share") };
  }
  if (params.get("view") === "all-shares" || params.get("view") === "unlisted-shares") {
    return { view: "all-shares" };
  }
  if (params.get("article")) {
    return { view: "article-details", articleId: params.get("article") };
  }

  // 2. Hash routing (#/all-shares, #/share/msei, #/careers, #/legal)
  if (hash.startsWith("#/share/") || hash.startsWith("#/shares/") || hash.startsWith("#share/")) {
    const cleanId = hash.replace(/^#\/?(shares|share)\//, "").split("?")[0].split("#")[0].trim();
    if (cleanId) return { view: "share-details", shareId: cleanId };
  }

  if (
    hash === "#/all-shares" ||
    hash === "#/unlisted-shares" ||
    hash === "#/all-unlisted-shares" ||
    hash === "#all-shares" ||
    hash === "#/shares" ||
    hash === "#all-unlisted"
  ) {
    return { view: "all-shares" };
  }

  if (hash.startsWith("#/article/") || hash.startsWith("#article/")) {
    const cleanId = hash.replace(/^#\/?article\//, "").split("?")[0].split("#")[0].trim();
    if (cleanId) return { view: "article-details", articleId: cleanId };
  }

  if (hash === "#/careers" || hash === "#careers") {
    return { view: "careers" };
  }

  if (hash.startsWith("#/legal") || hash.startsWith("#legal")) {
    const tabMatch = hash.match(/tab=([a-z]+)/);
    return { view: "legal", legalTab: tabMatch ? tabMatch[1] : "disclaimer" };
  }

  // 3. Pathname routing
  if (path.endsWith("/all-shares") || path.endsWith("/unlisted-shares")) {
    return { view: "all-shares" };
  }
  if (path.endsWith("/careers")) {
    return { view: "careers" };
  }

  return { view: "home" };
}

export default function App() {
  const initialRoute = parseRouteFromUrl();
  const [currentView, setCurrentView] = useState(() => initialRoute.view || "home"); // 'home', 'all-shares', 'share-details', 'article-details', 'careers', 'legal'
  const [previousView, setPreviousView] = useState("home");
  const [unlistedShares, setUnlistedShares] = useState(getLocalUnlistedShares);
  const [selectedShareId, setSelectedShareId] = useState(() => initialRoute.shareId || "msei");
  const [selectedArticleId, setSelectedArticleId] = useState(() => initialRoute.articleId || "renewable-energy-unlisted");
  const [legalTab, setLegalTab] = useState(() => initialRoute.legalTab || "disclaimer"); // 'disclaimer', 'terms', 'privacy'
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [enquiriesDeskOpen, setEnquiriesDeskOpen] = useState(false);
  const [quickEnquiryShare, setQuickEnquiryShare] = useState(null);
  const [consultAdvisorService, setConsultAdvisorService] = useState(null);
  const [toast, setToast] = useState(null);

  // Central routing helper with browser History & URL hash sync
  const navigateToView = (view, extra = {}) => {
    setPreviousView(currentView);
    setCurrentView(view);

    if (view === "home") {
      if (window.location.hash.startsWith("#/")) {
        window.history.pushState(null, "", window.location.pathname + window.location.search);
      }
    } else if (view === "all-shares") {
      window.history.pushState(null, "", "#/all-shares");
    } else if (view === "share-details") {
      const sId = extra.shareId || selectedShareId;
      if (sId) {
        setSelectedShareId(sId);
        window.history.pushState(null, "", `#/share/${sId}`);
      }
    } else if (view === "article-details") {
      const aId = extra.articleId || selectedArticleId;
      if (aId) {
        setSelectedArticleId(aId);
        window.history.pushState(null, "", `#/article/${aId}`);
      }
    } else if (view === "careers") {
      window.history.pushState(null, "", "#/careers");
    } else if (view === "legal") {
      const tab = extra.tab || legalTab || "disclaimer";
      setLegalTab(tab);
      window.history.pushState(null, "", `#/legal?tab=${tab}`);
    }
  };

  // Persistent User Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("gsp_current_user");
      return (saved && saved !== "undefined" && saved !== "null") ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Central Backend Enquiries State (Shared across all browsers)
  const [enquiries, setEnquiries] = useState([]);

  // Fetch enquiries from central server
  const refreshEnquiries = async () => {
    try {
      const list = await fetchAllEnquiries();
      setEnquiries(list);
    } catch (e) {
      console.warn("Fetch enquiries error:", e);
    }
  };

  // Sync across all browsers: Poll server, settings, and Google Sheet products
  useEffect(() => {
    refreshEnquiries();

    // Helper to fetch and update unlisted shares state
    const syncShares = async (url = null) => {
      try {
        const res = await fetchUnlistedSharesFromSheet(url);
        if (res && res.products && Array.isArray(res.products) && res.products.length > 0) {
          setUnlistedShares(res.products);
        }
      } catch (err) {
        console.warn("Sync shares error:", err);
      }
    };

    // 1. Initial immediate sync
    syncShares();

    // 2. Fetch central settings & sync with configured webhook
    fetchSettingsFromBackend().then((settings) => {
      if (settings && settings.googleSheetWebhook) {
        syncShares(settings.googleSheetWebhook);
      }
    });

    // 3. React to custom event whenever dynamic shares update
    const handleSharesUpdated = (e) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length > 0) {
        setUnlistedShares(e.detail);
      }
    };
    window.addEventListener("unlisted-shares-updated", handleSharesUpdated);

    // 4. Listen to browser Back / Forward buttons & URL hash changes
    const handlePopState = () => {
      const route = parseRouteFromUrl();
      setCurrentView(route.view);
      if (route.shareId) setSelectedShareId(route.shareId);
      if (route.articleId) setSelectedArticleId(route.articleId);
      if (route.legalTab) setLegalTab(route.legalTab);
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);

    // 5. Background real-time polling
    const enquiriesInterval = setInterval(refreshEnquiries, 2500);
    const sharesInterval = setInterval(() => {
      syncShares();
    }, 10000); // Check for sheet updates every 10 seconds

    // 6. Sync when user switches back to browser tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshEnquiries();
        syncShares();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(enquiriesInterval);
      clearInterval(sharesInterval);
      window.removeEventListener("unlisted-shares-updated", handleSharesUpdated);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleLoginSuccess = (user) => {
    const userProfile = typeof user === "object" ? user : { name: user, clientId: "GSP" + Math.floor(100000 + Math.random() * 900000) };
    setCurrentUser(userProfile);
    localStorage.setItem("gsp_current_user", JSON.stringify(userProfile));
    showToast(`Welcome back, ${userProfile.name}! (Client ID: ${userProfile.clientId || 'GSP102839'})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("gsp_current_user");
    showToast("You have been safely logged out.");
  };

  const handleRegisterSuccess = async (user) => {
    setCurrentUser(user);
    localStorage.setItem("gsp_current_user", JSON.stringify(user));
    await refreshEnquiries();
    showToast(`Demat Account created! Welcome, ${user.name}. You are now logged in.`);
  };

  const handleSelectShare = (share) => {
    const id = typeof share === "object" ? share.id : share;
    navigateToView("share-details", { shareId: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectArticle = (article) => {
    const id = typeof article === "object" ? article.id : article;
    navigateToView("article-details", { articleId: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEnquireShare = (share) => {
    setQuickEnquiryShare(share);
  };

  const handleEnquiryRecorded = async (record) => {
    await refreshEnquiries();
  };

  const handleClearEnquiries = async () => {
    await clearAllEnquiriesFromBackend();
    await refreshEnquiries();
    showToast("All enquiries cleared from Central Database.");
  };

  const handleDeleteEnquiry = async (index) => {
    const item = enquiries[index];
    if (item && item.id) {
      await deleteEnquiryFromBackend(item.id);
    }
    await refreshEnquiries();
    showToast("Record removed from Central Database.");
  };

  const handleServiceClick = (service) => {
    showToast(`Opening Investor Desk for: ${service.title}`);
  };

  const handleLoanClick = (loan) => {
    showToast(`Eligibility criteria for ${loan.title} opened.`);
    if (currentView !== "home") navigateToView("home");
    setTimeout(() => {
      const contactElem = document.getElementById("contact");
      if (contactElem) contactElem.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  const handlePlatformClick = (platform) => {
    showToast(`Launching ${platform.toUpperCase()} Terminal... Please connect your credentials.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] text-gray-900 font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#063321] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toast}</span>
          <button 
            onClick={() => setToast(null)}
            className="p-1 hover:bg-white/10 rounded-lg ml-2 cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      )}

      {/* Top Navbar matching Page 1 */}
      <Navbar
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenRegister={() => setRegisterModalOpen(true)}
        onOpenEnquiries={() => setEnquiriesDeskOpen(true)}
        enquiriesCount={enquiries.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        currentSection={currentView}
        setCurrentSection={(sec) => navigateToView(sec)}
        onSelectShare={handleSelectShare}
        onSelectArticle={handleSelectArticle}
        onNavigateCareers={() => {
          navigateToView("careers");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigateLegal={(tab) => {
          setLegalTab(tab || "disclaimer");
          navigateToView("legal", { tab: tab || "disclaimer" });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === "all-shares" ? (
          /* Dedicated All Unlisted Shares Catalog View */
          <AllUnlistedSharesPage
            shares={unlistedShares}
            onSelectShare={handleSelectShare}
            onEnquireShare={handleEnquireShare}
            onBack={() => {
              navigateToView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : currentView === "share-details" ? (
          /* Dedicated Details For A Single Particular Share */
          <ShareDetailsView
            selectedShareId={selectedShareId}
            shares={unlistedShares}
            onBack={() => {
              if (previousView === "all-shares") {
                navigateToView("all-shares");
              } else {
                navigateToView("home");
                setTimeout(() => {
                  const el = document.getElementById("unlisted-shares");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 60);
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onEnquirySuccess={(record) => {
              handleEnquiryRecorded(record);
            }}
          />
        ) : currentView === "article-details" ? (
          /* Dedicated Research Article Details View */
          <ArticleDetailsView
            selectedArticleId={selectedArticleId}
            onBack={() => {
              navigateToView("home");
              setTimeout(() => {
                const el = document.getElementById("market-insights");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 60);
            }}
            onSelectArticle={(art) => {
              handleSelectArticle(art);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onConsultTopic={(topic) => {
              setConsultAdvisorService({
                title: topic.title,
                tag: topic.tag || "Market Research",
                badge: "Research Advisory"
              });
            }}
          />
        ) : currentView === "careers" ? (
          /* Dedicated Careers & Job Application Page */
          <CareersPage
            onBack={() => {
              navigateToView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onApplicationSubmitted={(record) => {
              handleEnquiryRecorded(record);
              showToast("Application submitted! Our HR team at gspinvestment6@gmail.com has received your details.");
            }}
          />
        ) : currentView === "legal" ? (
          /* Dedicated Legal Policies: Disclaimer, Terms of Use, Privacy Policy */
          <LegalPoliciesView
            initialTab={legalTab}
            onBack={() => {
              navigateToView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onNavigateTab={(tab) => {
              setLegalTab(tab);
              navigateToView("legal", { tab });
            }}
          />
        ) : (
          /* Home Layout Comprising all 9 Pages */
          <>
            {/* Page 1: Hero & Live Portfolio */}
            <HeroSection
              onOpenRegister={() => setRegisterModalOpen(true)}
              onBookConsultation={() => {
                const contactEl = document.getElementById("contact");
                if (contactEl) contactEl.scrollIntoView({ behavior: "smooth" });
              }}
              onGetStarted={() => setRegisterModalOpen(true)}
            />

            {/* About Us Corporate Section */}
            <AboutSection />

            {/* Page 2: Popular Unlisted Shares */}
            <UnlistedSharesSection
              shares={unlistedShares}
              onSelectShare={handleSelectShare}
              onEnquireShare={handleEnquireShare}
              onViewAllShares={() => {
                navigateToView("all-shares");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />

            {/* Page 3: Investor Service Centre */}
            <InvestorServiceCentre
              onSelectService={(service) => {
                if (service.id === "open-account") {
                  setRegisterModalOpen(true);
                } else {
                  handleServiceClick(service);
                }
              }}
            />

            {/* Digital Suite on Devices */}
            <DeviceSection
              onOpenPlatform={(platform) => {
                showToast(`Digital Suite (${platform.toUpperCase()}) is a future upcoming release.`);
              }}
            />

            {/* Page 5: Our Services & Loan Solutions */}
            <ServicesAndLoans
              onApplyLoan={(loan) => setConsultAdvisorService(loan)}
              onSelectService={(service) => setConsultAdvisorService(service)}
            />

            {/* Page 6: Mutual Fund Centre & Interactive SIP Calculator */}
            <SipCalculatorSection
              onStartInvesting={() => setRegisterModalOpen(true)}
            />

            {/* Market Insights & Research Section */}
            <MarketInsightsSection 
              onSelectArticle={handleSelectArticle}
            />

            {/* Page 9: Contact Us & Head Office */}
            <ContactSection
              onCallbackSubmitted={(record) => {
                handleEnquiryRecorded(record);
              }}
            />
          </>
        )}
      </main>

      {/* Footer matching Brand Architecture */}
      <Footer
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenRegister={() => setRegisterModalOpen(true)}
        onSelectShare={handleSelectShare}
        onOpenAdmin={() => setEnquiriesDeskOpen(true)}
        onNavigateCareers={() => {
          navigateToView("careers");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigateLegal={(tab) => {
          setLegalTab(tab || "disclaimer");
          navigateToView("legal", { tab: tab || "disclaimer" });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Interactive Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <OpenAccountModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />

      <QuickEnquiryModal
        isOpen={!!quickEnquiryShare}
        share={quickEnquiryShare}
        onClose={() => setQuickEnquiryShare(null)}
        onSubmitted={(shareName) => {
          handleEnquiryRecorded({ title: shareName, type: "buy" });
        }}
      />

      {/* Consultation & Callback Modal for Insurance & Services */}
      <ConsultAdvisorModal
        isOpen={!!consultAdvisorService}
        service={consultAdvisorService}
        onClose={() => setConsultAdvisorService(null)}
        onSubmitted={(record) => {
          handleEnquiryRecorded(record);
          showToast(`Advisor consultation booked for ${consultAdvisorService?.title || 'service'}.`);
        }}
      />

      {/* Central Admin Desk & Excel Export Modal */}
      <AdminDeskModal
        isOpen={enquiriesDeskOpen}
        onClose={() => setEnquiriesDeskOpen(false)}
        enquiries={enquiries}
        onClearAll={handleClearEnquiries}
        onDeleteOne={handleDeleteEnquiry}
        onRefresh={refreshEnquiries}
      />

    </div>
  );
}
