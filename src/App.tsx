import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { ServiceDetailModal } from './components/ServiceDetailModal.tsx';
import { ProjectsGallerySection } from './components/ProjectsGallerySection.tsx';
import { ProjectDetailModal } from './components/ProjectDetailModal.tsx';
import { AdvertisementsSection } from './components/AdvertisementsSection.tsx';
import { SeoKeywordsHubSection } from './components/SeoKeywordsHubSection.tsx';
import { CoverageMapSection } from './components/CoverageMapSection.tsx';
import { WhyUsSection } from './components/WhyUsSection.tsx';
import { QuoteModal } from './components/QuoteModal.tsx';
import { AdminDashboardModal } from './components/AdminDashboardModal.tsx';
import { Footer } from './components/Footer.tsx';
import { SERVICES_DATA, COMPANY_INFO } from './data/content.ts';
import { ServiceItem, Project, Advertisement, QuoteRequest, SiteSettings } from './types.ts';
import { Phone, MessageSquare } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // Modals state
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteInitialService, setQuoteInitialService] = useState('');
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Live Database data
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);
  const [projects, setProjects] = useState<Project[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>({
    company_name_ar: COMPANY_INFO.name_ar,
    company_name_en: COMPANY_INFO.name_en,
    motto_ar: COMPANY_INFO.motto_ar,
    phone_primary: COMPANY_INFO.phone_primary,
    whatsapp_number: COMPANY_INFO.whatsapp_number,
    email: COMPANY_INFO.email,
    riyadh_address_ar: COMPANY_INFO.riyadh_address,
    alkharj_address_ar: COMPANY_INFO.alkharj_address,
    about_summary_ar: COMPANY_INFO.about_text_ar,
    hero_title_ar: COMPANY_INFO.motto_ar,
    hero_subtitle_ar: COMPANY_INFO.about_text_ar,
    stat_years_exp: '15+',
    stat_projects_done: '450+',
    stat_happy_clients: '100%',
    stat_warranty_years: '10 سنوات',
    working_hours_ar: COMPANY_INFO.working_hours_ar,
  });

  // Sync RTL / LTR document attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      // 1. Services
      const servRes = await fetch('/api/services');
      if (servRes.ok) {
        const servData = await servRes.json();
        if (servData.success && Array.isArray(servData.data) && servData.data.length > 0) {
          setServices(servData.data);
        }
      }

      // 2. Projects
      const projRes = await fetch('/api/projects');
      if (projRes.ok) {
        const projData = await projRes.json();
        if (projData.success && Array.isArray(projData.data)) {
          setProjects(projData.data);
        }
      }

      // 3. Advertisements
      const adsRes = await fetch('/api/ads/all');
      if (adsRes.ok) {
        const adsData = await adsRes.json();
        if (adsData.success && Array.isArray(adsData.data)) {
          setAds(adsData.data);
        }
      } else {
        const fallbackAdsRes = await fetch('/api/ads');
        if (fallbackAdsRes.ok) {
          const fallbackData = await fallbackAdsRes.json();
          if (fallbackData.success && Array.isArray(fallbackData.data)) {
            setAds(fallbackData.data);
          }
        }
      }

      // 4. Quotes
      const quotesRes = await fetch('/api/quotes');
      if (quotesRes.ok) {
        const quotesData = await quotesRes.json();
        if (quotesData.success && Array.isArray(quotesData.data)) {
          setQuotes(quotesData.data);
        }
      }

      // 5. Settings
      const setRes = await fetch('/api/settings');
      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData.success && setData.data && setData.data.phone_primary) {
          setSettings((prev) => ({
            ...prev,
            ...setData.data,
          }));
        }
      }
    } catch (err) {
      console.warn('API fetch warning, using defaults:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Secret unguessable admin access path (configured via .env or fallback)
  const RAW_ADMIN_PATH = (import.meta.env.VITE_ADMIN_SECRET_PATH as string)?.trim() || '/rn-portal-94827';
  const ADMIN_SECRET_PATH = (RAW_ADMIN_PATH.startsWith('/') ? RAW_ADMIN_PATH : `/${RAW_ADMIN_PATH}`).toLowerCase();
  const ADMIN_SECRET_HASH = `#${ADMIN_SECRET_PATH.replace(/^\//, '')}`;
  const ADMIN_SECRET_TOKEN = ADMIN_SECRET_PATH.replace(/[^a-zA-Z0-9]/g, '');

  // Check URL strictly for the unguessable admin secret route:
  // e.g. /rn-portal-94827 or #rn-portal-94827 or ?key=rn-portal-94827
  // Notice: Standard routes like /admin, /dashboard, /manage are completely ignored.
  const checkAdminUrl = () => {
    try {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      const isExactMatch =
        path === ADMIN_SECRET_PATH ||
        hash === ADMIN_SECRET_HASH ||
        params.get('portal_key') === ADMIN_SECRET_TOKEN ||
        params.get('key') === ADMIN_SECRET_TOKEN;

      if (isExactMatch) {
        setAdminModalOpen(true);
      }
    } catch (e) {
      console.warn('Secret URL check warning:', e);
    }
  };

  useEffect(() => {
    checkAdminUrl();
    window.addEventListener('popstate', checkAdminUrl);
    window.addEventListener('hashchange', checkAdminUrl);

    // Covert keyboard shortcut: Ctrl+Shift+A (or Cmd+Shift+A) for admin convenience
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkAdminUrl);
      window.removeEventListener('hashchange', checkAdminUrl);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseAdminModal = () => {
    setAdminModalOpen(false);
    // Quietly remove secret path from address bar so it leaves no trace on screen
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const hash = window.location.hash.toLowerCase();
    if (path === ADMIN_SECRET_PATH) {
      window.history.replaceState(null, '', '/');
    } else if (hash === ADMIN_SECRET_HASH) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleOpenQuoteWithService = (serviceTitle: string) => {
    setQuoteInitialService(serviceTitle);
    setQuoteModalOpen(true);
  };

  const handleSelectServiceBySlug = (slug: string) => {
    const found = services.find((s) => s.slug === slug || s.id === slug);
    if (found) setSelectedService(found);
  };

  const isAr = lang === 'ar';
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    isAr
      ? `مرحباً ${settings.company_name_ar || 'مؤسسة ريم النفوذ'}، أود الاستفسار عن خدمات المقاولات والتشطيبات في الرياض.`
      : 'Hello Reem Al-Nufood, I would like to inquire about your services in Riyadh and Al-Kharj.'
  )}`;

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1E2229] font-sans selection:bg-[#9B7846]/20 selection:text-[#7A5B2E] relative">

      {/* Top Bar Navigation with direct admin access */}
      <Navbar
        lang={lang}
        setLang={setLang}
        settings={settings}
        onOpenQuoteModal={() => {
          setQuoteInitialService(isAr ? 'مشروع متكامل' : 'Turnkey Project');
          setQuoteModalOpen(true);
        }}
        onSelectService={handleSelectServiceBySlug}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <HeroSection
          lang={lang}
          settings={settings}
          onOpenQuoteModal={() => {
            setQuoteInitialService(isAr ? 'مشروع متكامل' : 'Turnkey Project');
            setQuoteModalOpen(true);
          }}
          onExploreServices={() => {
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 6 Core Activities Grid */}
        <ServicesSection
          lang={lang}
          services={services}
          onSelectService={(service) => setSelectedService(service)}
          onRequestQuoteForService={handleOpenQuoteWithService}
        />

        {/* Dynamic Database Advertisements */}
        <AdvertisementsSection
          ads={ads}
          lang={lang}
          settings={settings}
          onRequestQuote={handleOpenQuoteWithService}
        />

        {/* Live Projects Gallery */}
        <ProjectsGallerySection
          projects={projects}
          loading={loadingProjects}
          lang={lang}
          onRequestQuote={handleOpenQuoteWithService}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        {/* Specialized High-Ranking Local SEO Keywords Hub */}
        <SeoKeywordsHubSection
          lang={lang}
          onRequestQuote={handleOpenQuoteWithService}
          onSelectCategory={(cat) => handleSelectServiceBySlug(cat)}
        />

        {/* Google Maps & Regional Operations Coverage */}
        <CoverageMapSection
          lang={lang}
          settings={settings}
        />

        {/* Brand Values & Principles */}
        <WhyUsSection lang={lang} />
      </main>

      {/* Footer with direct admin entry */}
      <Footer
        lang={lang}
        settings={settings}
        onOpenQuoteModal={() => {
          setQuoteInitialService(isAr ? 'مشروع متكامل' : 'Turnkey Project');
          setQuoteModalOpen(true);
        }}
      />

      {/* Floating Action Strip for Mobile & Instant Access */}
      <div className="fixed bottom-4 sm:bottom-6 start-4 sm:start-6 z-40 flex items-center gap-2.5 sm:gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#1faf51] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white"
          title={isAr ? 'واتساب مباشر' : 'WhatsApp'}
          aria-label="WhatsApp"
        >
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </a>

        <a
          href={`tel:${settings.phone_primary}`}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[#9B7846] to-[#7A5B2E] hover:from-[#886737] hover:to-[#6A4D23] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white"
          title={isAr ? 'اتصال مباشر' : 'Phone'}
          aria-label="Direct Phone"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </a>
      </div>

      {/* Independent Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        lang={lang}
        settings={settings}
        onClose={() => setSelectedService(null)}
        onRequestQuote={handleOpenQuoteWithService}
      />

      {/* Dedicated Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        lang={lang}
        settings={settings}
        onClose={() => setSelectedProject(null)}
        onRequestQuote={handleOpenQuoteWithService}
      />

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        initialService={quoteInitialService}
        lang={lang}
        settings={settings}
        onClose={() => setQuoteModalOpen(false)}
        onQuoteSubmitted={() => fetchData()}
      />

      {/* Comprehensive Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminModalOpen}
        lang={lang}
        projects={projects}
        ads={ads}
        quotes={quotes}
        services={services}
        settings={settings}
        onClose={handleCloseAdminModal}
        onRefreshData={() => fetchData()}
      />

    </div>
  );
}
