import React, { useState } from 'react';
import { X, CheckCircle, Phone, MessageSquare, MapPin, ChevronDown, ChevronUp, FileText, Shield } from 'lucide-react';
import { ServiceItem, SiteSettings } from '../types.ts';
import { FormattedContent } from './FormattedContent.tsx';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  lang: 'ar' | 'en';
  settings: SiteSettings;
  onClose: () => void;
  onRequestQuote: (serviceTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  lang,
  settings,
  onClose,
  onRequestQuote,
}) => {
  if (!service) return null;

  const isAr = lang === 'ar';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const title = isAr ? service.title_ar : service.title_en;
  const description = isAr ? service.short_desc_ar : service.short_desc_en;
  const features = isAr ? service.features_ar : service.features_en;
  const scope = isAr ? service.scope_ar : service.scope_en;

  const whatsappMessage = encodeURIComponent(
    isAr
      ? `مرحباً مؤسسة ريم النفوذ، أود الاستفسار والحصول على عرض سعر لخدمة (${service.title_ar}) في الرياض/الخرج.`
      : `Hello Reem Al-Nufood, I would like to inquire about ${service.title_en} in Riyadh/Al-Kharj.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Sticky Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-white/95 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#8C6B3A] uppercase tracking-wider">
              {isAr ? 'صفحة النشاط والخدمة' : 'Dedicated Activity Dossier'}
            </span>
            <span className="text-[#DDD5C5]">·</span>
            <span className="text-xs text-[#5A6273]">
              {isAr ? 'الرياض والخرج' : 'Riyadh & Al-Kharj'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#717786] hover:text-[#15181F] hover:bg-[#F2EDE2] rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          
          {/* Hero Banner with Photography */}
          <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-[#F2EDE2] border border-[#DDD5C5]">
            <img
              src={service.hero_image}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            <div className="absolute bottom-6 start-6 end-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
                {title}
              </h2>
              <div className="text-sm sm:text-base text-gray-200 max-w-2xl font-normal leading-relaxed">
                <FormattedContent text={description} className="text-gray-100" />
              </div>
            </div>
          </div>

          {/* Core Highlights & Saudi Code Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] shadow-xs">
              <h3 className="text-base font-bold text-[#15181F] mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#9B7846]" />
                <span>{isAr ? 'المواصفات ومميزات التنفيذ' : 'Specifications & Execution Features'}</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#4E5667]">
                {features.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9B7846] mt-2 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] shadow-xs">
              <h3 className="text-base font-bold text-[#15181F] mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#9B7846]" />
                <span>{isAr ? 'نطاق العمل والتوريد' : 'Scope of Work & Materials'}</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#4E5667]">
                {scope.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A5B2E] mt-2 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* District Coverage for this specific service */}
          <div className="bg-[#F4EFE6] p-6 rounded-xl border border-[#E8E2D5]">
            <h3 className="text-sm font-bold text-[#15181F] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9B7846]" />
              <span>{isAr ? 'تغطية الأحياء والمناطق المباشرة لهذا النشاط' : 'Target District Coverage'}</span>
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-[#8C6B3A]">{isAr ? 'أحياء الرياض المغطاة:' : 'Riyadh:'}</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(service.riyadh_districts || []).map((dist, idx) => (
                    <span key={idx} className="bg-white px-2.5 py-1 rounded-md border border-[#DDD5C5] text-[#15181F]">
                      {dist}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-[#8C6B3A]">{isAr ? 'أحياء الخرج والمحافظات:' : 'Al-Kharj:'}</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(service.alkharj_districts || []).map((dist, idx) => (
                    <span key={idx} className="bg-white px-2.5 py-1 rounded-md border border-[#DDD5C5] text-[#15181F]">
                      {dist}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions Accordion */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#15181F]">
                {isAr ? 'الأسئلة الشائعة حول هذا النشاط' : 'Frequently Asked Questions'}
              </h3>
              
              <div className="space-y-2">
                {service.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  const q = isAr ? faq.q_ar : faq.q_en;
                  const a = isAr ? faq.a_ar : faq.a_en;

                  return (
                    <div
                      key={idx}
                      className="border border-[#E8E2D5] bg-white rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-start text-xs sm:text-sm font-semibold text-[#15181F] hover:bg-[#FAF7F2] transition-colors"
                      >
                        <span>{q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#8C6B3A]" /> : <ChevronDown className="w-4 h-4 text-[#8C6B3A]" />}
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#5A6273] leading-relaxed border-t border-[#F2EDE2]">
                          {a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Direct CTA Bar */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#9B7846] to-[#7A5B2E] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <h4 className="text-lg font-bold mb-1">
                {isAr ? `احجز موعد استشارة ومعاينة لـ ${service.title_ar}` : `Book a Consultation for ${service.title_en}`}
              </h4>
              <p className="text-xs text-[#FAF7F2]/90">
                {isAr ? 'فريقنا الهندسي جاهز للتنسيق معك وتحديد موعد الزيارة الميدانية فوراً.' : 'Our engineers are ready for rapid on-site inspection.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${settings.whatsapp_number}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1faf51] rounded-lg transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isAr ? 'واتساب الإدارة' : 'WhatsApp'}</span>
              </a>

              <button
                onClick={() => {
                  onClose();
                  onRequestQuote(title);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#15181F] bg-white hover:bg-[#F8F5EE] rounded-lg transition-colors shadow-sm"
              >
                <span>{isAr ? 'طلب عرض سعر مفصل' : 'Formal Quote'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
