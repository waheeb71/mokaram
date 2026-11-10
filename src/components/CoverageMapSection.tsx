import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, Building, ExternalLink, CheckCircle } from 'lucide-react';
import { SiteSettings } from '../types.ts';
import { ScrollReveal } from './ScrollReveal.tsx';

interface CoverageMapSectionProps {
  lang: 'ar' | 'en';
  settings: SiteSettings;
}

export const CoverageMapSection: React.FC<CoverageMapSectionProps> = ({ lang, settings }) => {
  const isAr = lang === 'ar';
  const [activeCityTab, setActiveCityTab] = useState<'riyadh' | 'alkharj'>('riyadh');

  const riyadhDistricts = [
    'حي الملقا',
    'حي حطين',
    'حي الياسمين',
    'حي النرجس',
    'حي العارض',
    'حي الصحافة',
    'حي العليا',
    'حي السليمانية',
    'حي الروضة',
    'حي المونسية',
    'حي الرمال',
    'حي القيروان',
    'الدرعية'
  ];

  const alkharjDistricts = [
    'حي السلام',
    'حي الخزامى',
    'حي الأندلس',
    'حي الورود',
    'حي الفيصلية',
    'حي النهضة',
    'المنطقة الصناعية بالخرج',
    'الدلم',
    'الهياثم',
    'نعجان',
    'حوطة بني تميم'
  ];

  const googleMapsUrlRiyadh = 'https://www.google.com/maps/search/?api=1&query=24.7136,46.6753';
  const googleMapsUrlKharj = 'https://www.google.com/maps/search/?api=1&query=24.1554,47.3119';

  return (
    <section id="coverage" className="py-24 bg-[#FAF7F2] relative border-t border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" distance={30} className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6B3A] tracking-wider uppercase mb-3">
            <Navigation className="w-3.5 h-3.5" />
            <span>{isAr ? 'نطاق التغطية والمواقع الميدانية' : 'Operational Geographic Hubs'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'جاهزية خرائط Google' : 'Google Maps Ready'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15181F] tracking-tight leading-tight mb-4">
            {isAr ? 'تغطية شاملة ومباشرة في الرياض والخرج' : 'Comprehensive Coverage in Riyadh & Al-Kharj'}
          </h2>

          <p className="text-base text-[#5A6273] font-normal leading-relaxed">
            {isAr
              ? 'فرقنا الهندسية والفنية متمركزة ومجهزة بالمعدات الكاملة في قلب العاصمة الرياض ومحافظة الخرج لضمان سرعة المعاينة وبدء الأعمال في وقت قياسي.'
              : 'Strategic project teams permanently stationed in Riyadh and Al-Kharj governorates to ensure prompt on-site assessments and execution.'}
          </p>
        </ScrollReveal>

        {/* 2 Regional Hubs Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Riyadh Hub Card */}
          <ScrollReveal direction="up" delay={0.1} distance={25} className="h-full">
            <div
              onClick={() => setActiveCityTab('riyadh')}
              className={`h-full p-8 rounded-2xl border transition-all cursor-pointer ${
                activeCityTab === 'riyadh'
                  ? 'bg-white border-[#9B7846] shadow-xl shadow-[#9B7846]/10'
                  : 'bg-white/80 border-[#E8E2D5] hover:border-[#DDD5C5]'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] border border-[#DDD5C5] flex items-center justify-center">
                    <Building className="w-5 h-5 text-[#9B7846]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#15181F]">
                      {isAr ? 'مركز عمليات الرياض' : 'Riyadh Central Operations'}
                    </h3>
                    <span className="text-xs text-[#717786]">
                      {isAr ? 'شمال وشرق وغرب العاصمة' : 'Metropolitan Riyadh Hub'}
                    </span>
                  </div>
                </div>

                <a
                  href={googleMapsUrlRiyadh}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#8C6B3A] hover:text-white bg-[#F4EFE6] hover:bg-[#9B7846] border border-[#DDD5C5] rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{isAr ? 'فتح في خرائط Google' : 'Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-sm text-[#4E5667] font-normal leading-relaxed mb-6">
                {settings.riyadh_address_ar || (isAr ? 'الرياض - طريق الملك فهد - حي العقيق' : 'King Fahd Rd, Al-Aqiq, Riyadh')}
              </p>

              <div className="space-y-3 pt-4 border-t border-[#E8E2D5] text-xs text-[#5A6273]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#9B7846]" />
                  <span>{isAr ? 'سرعة الوصول للمعاينة: خلال ساعتين من الطلب' : 'Rapid dispatch response: Within 2 hours'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#9B7846]" />
                  <span>{isAr ? 'معاينة ورفع مساحي أولي مجاناً داخل الرياض' : 'Free initial site survey inside Riyadh'}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Al-Kharj Hub Card */}
          <ScrollReveal direction="up" delay={0.2} distance={25} className="h-full">
            <div
              onClick={() => setActiveCityTab('alkharj')}
              className={`h-full p-8 rounded-2xl border transition-all cursor-pointer ${
                activeCityTab === 'alkharj'
                  ? 'bg-white border-[#9B7846] shadow-xl shadow-[#9B7846]/10'
                  : 'bg-white/80 border-[#E8E2D5] hover:border-[#DDD5C5]'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] border border-[#DDD5C5] flex items-center justify-center">
                    <Building className="w-5 h-5 text-[#9B7846]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#15181F]">
                      {isAr ? 'فرع محافظة الخرج' : 'Al-Kharj Governorate Division'}
                    </h3>
                    <span className="text-xs text-[#717786]">
                      {isAr ? 'الخرج والمراكز والمحافظات المجاورة' : 'Al-Kharj & Southern Sector'}
                    </span>
                  </div>
                </div>

                <a
                  href={googleMapsUrlKharj}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#8C6B3A] hover:text-white bg-[#F4EFE6] hover:bg-[#9B7846] border border-[#DDD5C5] rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{isAr ? 'فتح في خرائط Google' : 'Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-sm text-[#4E5667] font-normal leading-relaxed mb-6">
                {settings.alkharj_address_ar || (isAr ? 'الخرج - طريق الملك عبدالعزيز - حي السلام' : 'King Abdulaziz Rd, Al-Salam, Al-Kharj')}
              </p>

              <div className="space-y-3 pt-4 border-t border-[#E8E2D5] text-xs text-[#5A6273]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#9B7846]" />
                  <span>{isAr ? 'تغطية دائمة وورش تصنيع مجهزة للألمنيوم والحدادة' : 'Fully equipped workshops for steel & aluminum'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#9B7846]" />
                  <span>{isAr ? 'تغطية الدلم، الهياثم، نعجان والمناطق المجاورة' : 'Covers Ad-Dilam, Al-Hayathim, and nearby districts'}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Selected City Districts Interactive Cloud */}
        <ScrollReveal direction="up" delay={0.15} distance={20}>
          <div className="p-8 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-[#15181F] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9B7846]" />
                <span>
                  {activeCityTab === 'riyadh'
                    ? isAr ? 'أحياء الرياض المشمولة بالخدمة السريعة' : 'Riyadh Priority Districts'
                    : isAr ? 'أحياء ومناطق الخرج المشمولة' : 'Al-Kharj Service Zones'}
                </span>
              </h4>
              <span className="text-xs text-[#717786]">
                {isAr ? 'مستهدفات تحسين محركات البحث SEO' : 'Local SEO Geotagged'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {(activeCityTab === 'riyadh' ? riyadhDistricts : alkharjDistricts).map((district, dIdx) => (
                <span
                  key={dIdx}
                  className="px-3.5 py-1.5 text-xs text-[#3E4554] bg-[#F8F5EE] hover:bg-[#F2EDE2] border border-[#DDD5C5] hover:border-[#9B7846]/40 rounded-lg transition-colors font-medium"
                >
                  {district}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
