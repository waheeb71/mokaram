import React from 'react';
import { VALUE_PROPOSITIONS } from '../data/content.ts';
import { CheckCircle2, Award, Clock, Eye, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.tsx';

interface WhyUsSectionProps {
  lang: 'ar' | 'en';
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const icons = [
    <Award className="w-6 h-6 text-[#C5A880]" />,
    <ShieldCheck className="w-6 h-6 text-[#C5A880]" />,
    <Clock className="w-6 h-6 text-[#C5A880]" />,
    <Eye className="w-6 h-6 text-[#C5A880]" />,
    <CheckCircle2 className="w-6 h-6 text-[#C5A880]" />,
  ];

  return (
    <section id="why-us" className="py-24 bg-[#F5F1E8] border-t border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal direction="up" distance={30} className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6B3A] tracking-wider uppercase mb-3">
            <span>{isAr ? 'معايير التميز والضمان' : 'Principles of Distinction'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'مؤسسة ريم النفوذ' : 'Reem Al-Nufood'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15181F] tracking-tight leading-tight mb-4">
            {isAr ? 'لماذا تختار مؤسسة ريم النفوذ؟' : 'Why Choose Reem Al-Nufood?'}
          </h2>

          <p className="text-base text-[#5A6273] font-normal leading-relaxed">
            {isAr
              ? 'نبني علاقات ثقة مستدامة مع عملائنا عبر الاحترافية العالية، الشفافية التامة، والالتزام بأدق تفاصيل العقود والمواصفات.'
              : 'Forging enduring trust through exceptional engineering discipline, clear accountability, and flawless project delivery.'}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VALUE_PROPOSITIONS.map((prop, idx) => (
            <ScrollReveal
              key={idx}
              direction="up"
              delay={idx * 0.08}
              distance={25}
              className="h-full"
            >
              <div
                className="h-full p-8 rounded-2xl bg-white border border-[#E8E2D5] hover:border-[#9B7846]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#9B7846]/10 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F8F5EE] border border-[#DDD5C5] flex items-center justify-center mb-6">
                    {icons[idx % icons.length]}
                  </div>

                  <h3 className="text-xl font-bold text-[#15181F] mb-3">
                    {isAr ? prop.title_ar : prop.title_en}
                  </h3>

                  <p className="text-sm text-[#4E5667] font-normal leading-relaxed">
                    {isAr ? prop.desc_ar : prop.desc_en}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E8E2D5] text-xs font-mono text-[#8C6B3A] font-semibold">
                  0{idx + 1} / 05
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
