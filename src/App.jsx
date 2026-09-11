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

export default function App() {
  const [currentView, setCurrentView] = useState("home"); // 'home', 'share-details', 'article-details', 'careers', 'legal'
  const [unlistedShares, setUnlistedShares] = useState(getLocalUnlistedShares);
  const [selectedShareId, setSelectedShareId] = useState("msei");
  const [selectedArticleId, setSelectedArticleId] = useState("renewable-energy-unlisted");
  const [legalTab, setLegalTab] = useState("disclaimer"); // 'disclaimer', 'terms', 'privacy'
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [enquiriesDeskOpen, setEnquiriesDeskOpen] = useState(false);
  const [quickEnquiryShare, setQuickEnquiryShare] = useState(null);
  const [consultAdvisorService, setConsultAdvisorService] = useState(null);
  const [toast, setToast] = useState(null);

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

  // Sync across all browsers: Poll server and fetch settings
  useEffect(() => {
    refreshEnquiries();
    fetchSettingsFromBackend();
    
    // Fetch unlisted shares from Google Sheet
    fetchUnlistedSharesFromSheet().then((shares) => {
      if (shares && shares.length > 0) {
        setUnlistedShares(shares);
      }
    });

    const handleSharesUpdated = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setUnlistedShares(e.detail);
      }
    };
    window.addEventListener("unlisted-shares-updated", handleSharesUpdated);

    const interval = setInterval(refreshEnquiries, 2500);
    return () => {
      clearInterval(interval);
      window.removeEventListener("unlisted-shares-updated", handleSharesUpdated);
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
    setSelectedShareId(share.id);
    setCurrentView("share-details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectArticle = (article) => {
    setSelectedArticleId(article.id);
    setCurrentView("article-details");
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
    if (currentView !== "home") setCurrentView("home");
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
        setCurrentSection={setCurrentView}
        onSelectShare={handleSelectShare}
        onSelectArticle={handleSelectArticle}
        onNavigateCareers={() => {
          setCurrentView("careers");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigateLegal={(tab) => {
          setLegalTab(tab || "disclaimer");
          setCurrentView("legal");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === "share-details" ? (
          /* Page 8: Dedicated Details For Shares */
          <ShareDetailsView
            selectedShareId={selectedShareId}
            shares={unlistedShares}
            onBack={() => {
              setCurrentView("home");
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
              setCurrentView("home");
              setTimeout(() => {
                const el = document.getElementById("market-insights");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 60);
            }}
            onSelectArticle={(art) => {
              setSelectedArticleId(art.id);
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
              setCurrentView("home");
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
              setCurrentView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onNavigateTab={(tab) => setLegalTab(tab)}
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
                setSelectedShareId(unlistedShares[0]?.id || "msei");
                setCurrentView("share-details");
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
          setCurrentView("careers");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigateLegal={(tab) => {
          setLegalTab(tab || "disclaimer");
          setCurrentView("legal");
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
