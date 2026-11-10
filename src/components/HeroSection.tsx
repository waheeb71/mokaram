import React from 'react';
import { Phone, MessageSquare, ArrowLeft, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../types.ts';
import { FormattedContent } from './FormattedContent.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';

interface HeroSectionProps {
  lang: 'ar' | 'en';
  settings: SiteSettings;
  onOpenQuoteModal: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  settings,
  onOpenQuoteModal,
}) => {
  const isAr = lang === 'ar';

  const companyName = isAr
    ? settings.company_name_ar || 'مؤسسة ريم النفوذ للمقاولات والخدمات المتكاملة'
    : settings.company_name_en || 'Reem Al-Nufood Contracting & Integrated Services';

  const heroTitle = isAr
    ? settings.hero_title_ar || 'خبرة في التنفيذ، جودة في العمل، وثقة تدوم.'
    : 'Expertise in execution, excellence in quality, and lasting trust.';

  const heroSubtitle = isAr
    ? settings.hero_subtitle_ar ||
    'نقدم حلولاً متكاملة في المقاولات العامة، الأعمال الكهربائية، زجاج السيكوريت، الألمنيوم، الحدادة والترميم الإنشائي بأعلى معايير كود البناء السعودي مع الالتزام التام بالمواعيد.'
    : 'End-to-end solutions in general contracting, electrical infrastructure, tempered securit glass, high-spec aluminum, blacksmithing, and luxury restoration across Riyadh and Al-Kharj.';

  const whatsappMessage = encodeURIComponent(
    isAr
      ? `مرحباً ${settings.company_name_ar || 'مؤسسة ريم النفوذ'}، أرغب بالحصول على استشارة وعرض سعر لمشروعي (الرياض / الخرج).`
      : 'Hello Reem Al-Nufood, I would like to get a consultation and quote for my project in Riyadh / Al-Kharj.'
  );

  const heroImage = settings.hero_bg_image || '/src/assets/images/hero_luxury_villa_1794075925416.jpg';

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0E121B]">
      {/* 1. Crystal-Clear Architectural Cover Photography (Zero Milky Fog) */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={companyName}
          className="w-full h-full object-cover object-center filter brightness-[0.76] contrast-[1.12] saturate-[1.08] transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
          loading="eager"
        />
        {/* Subtle cinematic gradient: keeps photo sharp and architectural while ensuring 100% text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E121B] via-[#0E121B]/35 to-[#0E121B]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0E121B]/20 to-[#0E121B]/60 pointer-events-none" />
      </div>

      {/* 2. Main Hero Content Layout - Centered Directly on Cover Image (NO Cards!) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-20 lg:pt-24 pb-10 sm:pb-14 flex-1 flex flex-col items-center justify-center text-center">

        {/* Top Graphic Pill Badge */}
        <ScrollReveal direction="down" delay={0.1} distance={20}>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-[#E5C896]/40 text-[11px] sm:text-sm font-bold mb-4 sm:mb-6 shadow-xl shadow-black/30 max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#E5C896] animate-pulse shrink-0" />
            <span className="text-[#E5C896] truncate">{companyName}</span>
            <span className="text-white/30" aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-stone-200 font-medium shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#E5C896]" />
              {isAr ? 'الرياض والخرج' : 'Riyadh & Al-Kharj'}
            </span>
          </div>
        </ScrollReveal>

        {/* Primary Main Headline - Bold Centered Graphic Typography */}
        <ScrollReveal direction="up" delay={0.25} distance={35}>
          <h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.25] mb-4 sm:mb-6 drop-shadow-2xl"
            style={{ textWrap: 'balance' }}
          >
            {heroTitle}
          </h1>
        </ScrollReveal>

        {/* Value Proposition Subtitle with Formatting Support */}
        <ScrollReveal direction="up" delay={0.4} distance={25} className="max-w-3xl mx-auto mb-6 sm:mb-10 px-2 sm:px-0">
          <FormattedContent
            text={heroSubtitle}
            className="text-white text-sm sm:text-base lg:text-xl font-medium leading-relaxed text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          />
        </ScrollReveal>

        {/* Centered Action Buttons - Fully Responsive Mobile Stack */}
        <ScrollReveal direction="up" delay={0.55} distance={25} className="w-full max-w-md sm:max-w-none mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            {/* Primary Gold Metallic Button */}
            <button
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-black text-[#15181F] bg-gradient-to-r from-[#E5C896] via-[#D4B37F] to-[#C4A470] hover:from-[#eed5a7] hover:to-[#b99863] rounded-xl shadow-xl shadow-black/40 transition-all transform hover:-translate-y-0.5 whitespace-nowrap border border-[#F3E2C4]"
            >
              <span>{isAr ? 'طلب عرض سعر فوري' : 'Request Instant Quote'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            </button>

            {/* Mobile 2-Column Row for Secondary Actions */}
            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-4">
              {/* Direct WhatsApp Action */}
              <a
                href={`https://wa.me/${settings.whatsapp_number}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-base font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl shadow-lg transition-all whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 text-white shrink-0" />
                <span>{isAr ? 'واتساب مباشر' : 'WhatsApp'}</span>
              </a>

              {/* Direct Phone Call */}
              <a
                href={`tel:${settings.phone_primary}`}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-base font-bold text-white bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 rounded-xl shadow-lg transition-all whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#E5C896] shrink-0" />
                <span dir="ltr">{settings.phone_primary}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Centered Verified Trust Indicators */}
        <ScrollReveal direction="up" delay={0.7} distance={20} className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 text-xs sm:text-sm text-stone-200 font-medium drop-shadow-md">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E5C896] shrink-0" />
              <span>{isAr ? 'مطابق لكود البناء السعودي' : 'Saudi Building Code'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E5C896] shrink-0" />
              <span>{isAr ? 'معاينة واستشارة ميدانية سريعة' : 'On-Site Inspection'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E5C896] shrink-0" />
              <span>{isAr ? 'ضمان رسمي موثق على كافة الأعمال' : 'Certified Official Warranty'}</span>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* 3. Luxury Anchoring Statistics Strip at Bottom */}
      <div className="relative z-10 w-full border-t border-white/10 bg-[#0E121B]/95 backdrop-blur-xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center divide-x divide-x-reverse divide-white/10">

            <ScrollReveal direction="up" delay={0.1} distance={20} className="px-1 sm:px-3 py-1">
              <div className="text-xl sm:text-3xl lg:text-4xl font-black text-[#E5C896] tabular-nums tracking-tight">
                {settings.stat_years_exp || '+15'}
              </div>
              <div className="text-[11px] sm:text-sm text-stone-300 mt-0.5 sm:mt-1 font-bold">
                {isAr ? 'عاماً من الخبرة الهندسية' : 'Years Experience'}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2} distance={20} className="px-1 sm:px-3 py-1">
              <div className="text-xl sm:text-3xl lg:text-4xl font-black text-[#E5C896] tabular-nums tracking-tight">
                {settings.stat_projects_done || '+480'}
              </div>
              <div className="text-[11px] sm:text-sm text-stone-300 mt-0.5 sm:mt-1 font-bold">
                {isAr ? 'مشروع منجز في الرياض والخرج' : 'Completed Projects'}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3} distance={20} className="px-1 sm:px-3 py-1 border-t border-white/10 sm:border-t-0">
              <div className="text-xl sm:text-3xl lg:text-4xl font-black text-[#E5C896] tabular-nums tracking-tight">
                {settings.stat_happy_clients || '100%'}
              </div>
              <div className="text-[11px] sm:text-sm text-stone-300 mt-0.5 sm:mt-1 font-bold">
                {isAr ? 'التزام تام بالمواصفات والمواعيد' : 'Punctuality Guarantee'}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4} distance={20} className="px-1 sm:px-3 py-1 border-t border-white/10 sm:border-t-0">
              <div className="text-xl sm:text-3xl lg:text-4xl font-black text-[#E5C896] tabular-nums tracking-tight">
                {settings.stat_warranty_years || '10 سنوات'}
              </div>
              <div className="text-[11px] sm:text-sm text-stone-300 mt-0.5 sm:mt-1 font-bold">
                {isAr ? 'ضمان معتمد على الأعمال' : 'Warranty Period'}
              </div>
            </ScrollReveal>

          </div>
        </div>
      </div>
    </section>
  );
};
