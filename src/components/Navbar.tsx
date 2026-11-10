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
    <header className="sticky top-0 z-50 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="group flex items-center gap-3 whitespace-nowrap shrink-0 text-decoration-none"
          >
            <img
              src="/logo-icon.png"
              alt={isAr ? 'شعار مؤسسة ريم النفوذ' : 'Reem Al-Nufood Logo'}
              className="w-11 h-11 object-contain drop-shadow-sm select-none"
              width={44}
              height={44}
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#181B22] group-hover:text-[#9B7846] transition-colors whitespace-nowrap">
                {isAr ? settings.company_name_ar || 'ريم النفوذ للمقاولات' : settings.company_name_en || 'Reem Al-Nufood Contracting'}
              </span>
              <span className="text-xs text-[#717786] whitespace-nowrap hidden sm:inline">
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
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#464D5D] hover:text-[#9B7846] rounded-md border border-[#DDD5C5] hover:border-[#9B7846] bg-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 shadow-2xs"
              title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#9B7846]" />
              <span>{isAr ? 'EN' : 'عربي'}</span>
            </button>

            {/* Direct Phone Action (desktop) */}
            <a
              href={`tel:${settings.phone_primary}`}
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#181B22] bg-[#FFFFFF] hover:bg-[#F4EFE6] border border-[#DDD5C5] rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#9B7846]" />
              <span dir="ltr">{settings.phone_primary}</span>
            </a>

            {/* Primary Action Button */}
            <button
              onClick={onOpenQuoteModal}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#9B7846] hover:bg-[#866637] shadow-md shadow-[#9B7846]/20 rounded-xl transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              {isAr ? 'طلب عرض سعر' : 'Get a Quote'}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#464D5D] hover:text-[#181B22] rounded-lg focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#9B7846]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E2D5] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2 text-sm font-medium text-[#181B22] hover:bg-[#F2EDE2] rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between gap-3">
            <a
              href={`tel:${settings.phone_primary}`}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-[#181B22] bg-white border border-[#DDD5C5] rounded-lg"
            >
              <Phone className="w-3.5 h-3.5 text-[#9B7846]" />
              <span dir="ltr">{settings.phone_primary}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
