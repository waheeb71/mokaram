import React from 'react';
import { Phone, MessageSquare, MapPin, Mail, ShieldCheck, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../types.ts';
import { ScrollReveal } from './ScrollReveal.tsx';

interface FooterProps {
  lang: 'ar' | 'en';
  settings: SiteSettings;
  onOpenQuoteModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  settings,
  onOpenQuoteModal,
}) => {
  const isAr = lang === 'ar';

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#EFEAE0] text-[#555E6D] border-t border-[#DFD7C9] pt-10 sm:pt-16 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-[#D8CEBD]">

          {/* Col 1: Brand & Bio */}
          <ScrollReveal direction="up" delay={0.05} distance={20} className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-icon.png"
                alt={isAr ? 'شعار مؤسسة ريم النفوذ' : 'Reem Al-Nufood Logo'}
                className="w-11 h-11 object-contain drop-shadow-sm select-none"
                width={44}
                height={44}
              />
              <span className="text-base font-bold text-[#15181F] tracking-tight">
                {isAr ? settings.company_name_ar || 'مؤسسة ريم النفوذ للمقاولات' : settings.company_name_en || 'Reem Al-Nufood Contracting'}
              </span>
            </div>

            <p className="text-xs text-[#555E6D] leading-relaxed">
              {isAr
                ? settings.about_summary_ar || 'خبرة في التنفيذ، جودة في العمل، وثقة تدوم. خدمات متكاملة في المقاولات العامة والأعمال الكهربائية والزجاج والألمنيوم والحدادة والترميم بالرياض.'
                : 'Turnkey contracting, electrical infrastructure, architectural glass, aluminum systems, blacksmithing, and luxury renovations in Riyadh and Al-Kharj.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/70 border border-[#DDD5C5] text-xs font-medium text-[#7A5B2E]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#9B7846]" />
              <span>{isAr ? 'سجل تجاري معتمد ومصنف' : 'Licensed & Certified Establishment'}</span>
            </div>
          </ScrollReveal>

          {/* Col 2: Core Services */}
          <ScrollReveal direction="up" delay={0.15} distance={20}>
            <h4 className="text-xs font-bold text-[#15181F] uppercase tracking-wider mb-4">
              {isAr ? 'الخدمات المتخصصة' : 'Core Services'}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#555E6D]">
              <li>
                <button onClick={() => scrollTo('#services')} className="hover:text-[#9B7846] transition-colors text-start">
                  {isAr ? 'الأعمال الكهربائية الذكية' : 'Electrical Works'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#services')} className="hover:text-[#9B7846] transition-colors text-start">
                  {isAr ? 'أعمال الزجاج والسيكوريت' : 'Securit Glass & Facades'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#services')} className="hover:text-[#9B7846] transition-colors text-start">
                  {isAr ? 'أعمال الألمنيوم والكلادينج' : 'Aluminum Systems'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#services')} className="hover:text-[#9B7846] transition-colors text-start">
                  {isAr ? 'أعمال الحديد والحدادة والمظلات' : 'Blacksmithing & Shades'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#services')} className="hover:text-[#9B7846] transition-colors text-start">
                  {isAr ? 'المقاولات العامة والتشطيبات' : 'General Contracting'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#services')} className="hover:text-[#9B7846] transition-colors text-start">
                  {isAr ? 'الترميم وبناء الملاحق والمجالس' : 'Renovation & Majlis Annexes'}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('#seo-hub')} className="text-[#8C6B3A] font-semibold hover:text-[#5A4321] transition-colors text-start">
                  {isAr ? 'دليل الخدمات والكلمات الأكثر بحثاً' : 'SEO Search Directory'}
                </button>
              </li>
            </ul>
          </ScrollReveal>

          {/* Col 3: Branches & SEO Areas */}
          <ScrollReveal direction="up" delay={0.25} distance={20}>
            <h4 className="text-xs font-bold text-[#15181F] uppercase tracking-wider mb-4">
              {isAr ? 'مواقع الخدمة والفروع' : 'Operational Branches'}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#9B7846] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1F242D] block">{isAr ? 'مركز الرياض:' : 'Riyadh Hub:'}</strong>
                  <span className="text-[#646D7D]">{settings.riyadh_address_ar || 'طريق الملك فهد - حي العقيق'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#9B7846] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1F242D] block">{isAr ? 'فرع الخرج:' : 'Al-Kharj Branch:'}</strong>
                  <span className="text-[#646D7D]">{settings.alkharj_address_ar || 'طريق الملك عبدالعزيز - حي السلام'}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[11px] text-[#7A5B2E] hover:text-[#9B7846] underline decoration-[#DDD5C5]"
                >
                  <span>Google Search Console Sitemap.xml</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Col 4: Quick Contact */}
          <ScrollReveal direction="up" delay={0.35} distance={20}>
            <h4 className="text-xs font-bold text-[#15181F] uppercase tracking-wider mb-4">
              {isAr ? 'الاتصال المباشر والطلب' : 'Direct Contact'}
            </h4>

            <div className="space-y-3 text-xs mb-5">
              <a
                href={`tel:${settings.phone_primary}`}
                className="flex items-center gap-2 text-[#1F242D] hover:text-[#9B7846] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#9B7846]" />
                <span dir="ltr" className="font-semibold">{settings.phone_primary}</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#1F242D] hover:text-[#1FAF51] transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#1FAF51]" />
                <span className="font-semibold">{isAr ? 'واتساب الإدارة المباشر' : 'Official WhatsApp'}</span>
              </a>

              <div className="flex items-center gap-2 text-[#555E6D]">
                <Mail className="w-4 h-4 text-[#9B7846]" />
                <span>{settings.email || 'info@reem-alnufood.com'}</span>
              </div>
            </div>

            <button
              onClick={onOpenQuoteModal}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#9B7846] to-[#7A5B2E] hover:from-[#886737] hover:to-[#6A4D23] rounded-xl transition-all shadow-md text-center"
            >
              {isAr ? 'طلب معاينة وتسعير' : 'Request On-Site Quote'}
            </button>
          </ScrollReveal>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-center sm:text-start text-[#757E8E]">
          <div>
            © {new Date().getFullYear()} {isAr ? 'مؤسسة ريم النفوذ للمقاولات العامة والخدمات المتكاملة. جميع الحقوق محفوظة.' : 'Reem Al-Nufood Contracting. All rights reserved.'}
          </div>

          <div className="flex items-center justify-center gap-4">
            <span>{isAr ? 'الرياض والخرج والمناطق التابعة' : 'Serving Riyadh & Al-Kharj'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#8C6B3A] font-medium">{isAr ? 'سجل تجاري معتمد' : 'CR Certified'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
