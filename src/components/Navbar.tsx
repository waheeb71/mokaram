import React, { useState } from 'react';
import { Phone, MessageSquare, Menu, X, ShieldCheck, Globe } from 'lucide-react';
import { SiteSettings } from '../types.ts';

interface NavbarProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  settings: SiteSettings;
  onOpenQuoteModal: () => void;
  onSelectService: (serviceId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  settings,
  onOpenQuoteModal,
  onSelectService,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAr = lang === 'ar';

  const navLinks = [
    { name: isAr ? 'الرئيسية' : 'Home', href: '#hero' },
    { name: isAr ? 'خدماتنا' : 'Services', href: '#services' },
    { name: isAr ? 'أعمالنا' : 'Portfolio', href: '#projects' },
    { name: isAr ? 'العروض' : 'Offers', href: '#advertisements' },
    { name: isAr ? 'دليل الخدمات' : 'Search Hub', href: '#seo-hub' },
    { name: isAr ? 'التغطية' : 'Coverage', href: '#coverage' },
    { name: isAr ? 'لماذا تختارنا' : 'Why Us', href: '#why-us' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-8 h-16 sm:h-20">

          {/* Zone 1: Single text element wordmark */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="group flex items-center gap-2 sm:gap-3 shrink min-w-0 text-decoration-none"
          >
            <img
              src="/logo-icon.png"
              alt={isAr ? 'شعار مؤسسة ريم النفوذ' : 'Reem Al-Nufood Logo'}
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-sm select-none shrink-0"
              width={44}
              height={44}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-lg font-black tracking-tight text-[#181B22] group-hover:text-[#9B7846] transition-colors truncate">
                {isAr ? 'ريم النفوذ للمقاولات' : 'Reem Al-Nufood'}
              </span>
              <span className="text-[10px] sm:text-xs text-[#717786] truncate hidden sm:inline">
                {isAr ? 'الرياض والخرج · خدمات متكاملة' : 'Riyadh & Al-Kharj · Turnkey'}
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#464D5D]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-[#9B7846] transition-colors whitespace-nowrap shrink-0 py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions & utility controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs text-[#464D5D] hover:text-[#9B7846] rounded-lg border border-[#DDD5C5] hover:border-[#9B7846] bg-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 shadow-2xs font-semibold"
              title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#9B7846]" />
              <span className="text-[11px] sm:text-xs">{isAr ? 'EN' : 'عربي'}</span>
            </button>

            {/* Direct Phone Action (desktop) */}
            <a
              href={`tel:${settings.phone_primary}`}
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#181B22] bg-[#FFFFFF] hover:bg-[#F4EFE6] border border-[#DDD5C5] rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#9B7846]" />
              <span dir="ltr">{settings.phone_primary}</span>
            </a>

            {/* Primary Action Button (desktop / tablet) */}
            <button
              onClick={onOpenQuoteModal}
              className="hidden sm:inline-flex px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#9B7846] hover:bg-[#866637] shadow-md shadow-[#9B7846]/20 rounded-xl transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              {isAr ? 'طلب عرض سعر' : 'Get a Quote'}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-[#464D5D] hover:text-[#181B22] rounded-lg focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#9B7846]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E2D5] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 shadow-xl">
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-2.5 text-sm font-semibold text-[#181B22] hover:bg-[#F2EDE2] rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#E8E2D5] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-xl shadow-md text-center"
            >
              {isAr ? 'طلب عرض سعر فوري' : 'Request Instant Quote'}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${settings.phone_primary}`}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-[#181B22] bg-white border border-[#DDD5C5] rounded-xl shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#9B7846]" />
                <span dir="ltr">{settings.phone_primary}</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-white bg-[#25D366] rounded-xl shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
