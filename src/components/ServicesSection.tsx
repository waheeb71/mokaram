import React from 'react';
import { Zap, Layers, Maximize2, Shield, Building2, Wrench, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { SERVICES_DATA } from '../data/content.ts';
import { ServiceItem } from '../types.ts';
import { FormattedContent } from './FormattedContent.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';

interface ServicesSectionProps {
  lang: 'ar' | 'en';
  services?: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
  onRequestQuoteForService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  lang,
  services,
  onSelectService,
  onRequestQuoteForService,
}) => {
  const isAr = lang === 'ar';
  const activeServices = services && services.length > 0 ? services : SERVICES_DATA;

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#C5A880]" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#C5A880]" />;
      case 'Maximize2':
        return <Maximize2 className="w-5 h-5 text-[#C5A880]" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-[#C5A880]" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-[#C5A880]" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-[#C5A880]" />;
      default:
        return <Building2 className="w-5 h-5 text-[#C5A880]" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-[#FAF7F2] relative border-t border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" distance={30} className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6B3A] tracking-wider uppercase mb-3">
            <span>{isAr ? 'قطاعات الأعمال المتخصصة' : 'Core Business Divisions'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'مؤسسة ريم النفوذ' : 'Reem Al-Nufood'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15181F] tracking-tight leading-tight mb-4">
            {isAr ? 'خدماتنا المتكاملة في الرياض والخرج' : 'Integrated Contracting & Engineering Services'}
          </h2>

          <p className="text-base sm:text-lg text-[#5A6273] font-normal leading-relaxed">
            {isAr
              ? 'نضع خبرتنا الهندسية والفنية الممتدة لتنفيذ كل نشاط وفق أعلى المواصفات الفنية مع استقلالية تامة في الفرق المتخصصة وسرعة الإنجاز.'
              : 'Dedicated independent divisions engineered for superior execution quality, rigorous safety standards, and guaranteed reliability.'}
          </p>
        </ScrollReveal>

        {/* 6 Core Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, index) => (
            <ScrollReveal
              key={service.id}
              direction="up"
              delay={index * 0.08}
              distance={25}
              className="h-full"
            >
              <div
                className="group h-full flex flex-col bg-[#FFFFFF] border border-[#E8E2D5] hover:border-[#9B7846]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#9B7846]/10"
              >
                {/* Media Thumbnail Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F2EDE2]">
                  <img
                    src={service.hero_image}
                    alt={isAr ? service.title_ar : service.title_en}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

                  {/* Service Category Floating Icon */}
                  <div className="absolute top-4 start-4 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-[#DDD5C5] flex items-center justify-center shadow-md">
                    {getServiceIcon(service.icon_name)}
                  </div>

                  {/* Human Editorial Index */}
                  <div className="absolute top-4 end-4 text-xs font-mono text-[#8C6B3A] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#DDD5C5] font-semibold">
                    0{index + 1}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Clean unboxed metadata */}
                    <div className="flex items-center gap-2 text-xs text-[#717786] mb-3">
                      <span>{isAr ? 'الرياض' : 'Riyadh'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{isAr ? 'الخرج' : 'Al-Kharj'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#8C6B3A] font-medium">{isAr ? 'ضمان معتمد' : 'Warranty Included'}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#15181F] group-hover:text-[#8C6B3A] transition-colors mb-3">
                      {isAr ? service.title_ar : service.title_en}
                    </h3>

                    <div className="text-xs sm:text-sm text-[#4E5667] leading-relaxed mb-6">
                      <FormattedContent text={isAr ? service.short_desc_ar : service.short_desc_en} clampLines={3} />
                    </div>

                    {/* Highlights Bullet List Preview */}
                    <div className="space-y-2 mb-6 pt-4 border-t border-[#F2EDE2]">
                      {(isAr ? service.features_ar : service.features_en).slice(0, 3).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-[#525968]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9B7846] mt-1.5 shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clean Action Row */}
                  <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                    <button
                      onClick={() => onSelectService(service)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6B3A] hover:text-[#6D4F23] transition-colors"
                    >
                      <span>{isAr ? 'عرض المواصفات والأسئلة' : 'View Specifications'}</span>
                      {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onRequestQuoteForService(isAr ? service.title_ar : service.title_en)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#15181F] bg-[#F4EFE6] hover:bg-[#EAE3D5] rounded-lg transition-colors border border-[#DDD5C5]"
                    >
                      {isAr ? 'طلب تسعير' : 'Get Quote'}
                    </button>
                  </div>

                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
