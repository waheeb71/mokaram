import React from 'react';
import { Advertisement, SiteSettings } from '../types.ts';
import { Tag, Sparkles, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { FormattedContent } from './FormattedContent.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';

interface AdvertisementsSectionProps {
  ads: Advertisement[];
  lang: 'ar' | 'en';
  settings: SiteSettings;
  onRequestQuote: (adTitle: string) => void;
}

export const AdvertisementsSection: React.FC<AdvertisementsSectionProps> = ({
  ads,
  lang,
  settings,
  onRequestQuote,
}) => {
  const isAr = lang === 'ar';

  // Only display active ads on the public frontend
  const activeAds = (ads || []).filter((a) => a.is_active !== false);

  if (activeAds.length === 0) return null;

  return (
    <section id="advertisements" className="py-20 bg-[#F4EFE6] relative overflow-hidden border-t border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" distance={25} className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6B3A] tracking-wider uppercase mb-2">
              <Tag className="w-3.5 h-3.5" />
              <span>{isAr ? 'عروض حصرية وإعلانات موسمية' : 'Exclusive Promotions & Offers'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15181F]">
              {isAr ? 'عروض وباقات مشاريع الرياض والخرج' : 'Special Project Packages'}
            </h2>
          </div>
        </ScrollReveal>

        {/* Ads Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeAds.map((ad, idx) => {
            const title = isAr ? ad.title_ar : ad.title_en || ad.title_ar;
            const description = isAr ? ad.description_ar : ad.description_en || ad.description_ar;
            const badge = isAr ? ad.badge_ar : ad.badge_en || 'Special Offer';

            const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
              isAr
                ? `مرحباً مؤسسة ريم النفوذ، أرغب بالاستفادة من (${title}) المعلن في الموقع.`
                : `Hello Reem Al-Nufood, I would like to inquire about the promotional offer: ${title}`
            )}`;

            return (
              <ScrollReveal
                key={ad.id}
                direction="up"
                delay={idx * 0.08}
                distance={20}
                className="h-full"
              >
                <div
                  className="relative h-full bg-white border border-[#E8E2D5] hover:border-[#9B7846] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <div>
                    {/* Badge & Target Location */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-bold text-white bg-[#9B7846] px-3 py-1 rounded-full uppercase tracking-wider">
                        {badge}
                      </span>
                      <span className="text-xs text-[#717786] font-medium">
                        {ad.target_cities || (isAr ? 'الرياض والخرج' : 'Riyadh & Al-Kharj')}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#15181F] mb-3 leading-snug">
                      {title}
                    </h3>

                    {/* Description with rich formatting */}
                    <div className="text-xs sm:text-sm text-[#4E5667] leading-relaxed font-normal mb-6">
                      <FormattedContent text={description} />
                    </div>
                  </div>

                  {/* Offer Action & Discount Label */}
                  <div className="pt-4 border-t border-[#E8E2D5] space-y-3">
                    {ad.discount_label && (
                      <div className="text-xs font-semibold text-[#8C6B3A] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#9B7846]" />
                        <span>{ad.discount_label}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تأكيد العرض واتساب' : 'Claim via WhatsApp'}</span>
                      </a>

                      <button
                        onClick={() => onRequestQuote(title)}
                        className="px-3.5 py-2 text-xs font-semibold text-[#15181F] bg-[#F4EFE6] hover:bg-[#EAE3D5] rounded-xl transition-colors border border-[#DDD5C5]"
                      >
                        {isAr ? 'طلب تسعير' : 'Quote'}
                      </button>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
