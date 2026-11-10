import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, Sparkles, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal.tsx';

interface SeoKeywordsHubSectionProps {
  lang: 'ar' | 'en';
  onRequestQuote: (keyword: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const SeoKeywordsHubSection: React.FC<SeoKeywordsHubSectionProps> = ({
  lang,
  onRequestQuote,
  onSelectCategory,
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<string>('all');

  const clusters = [
    {
      id: 'glass',
      category: 'glass_securit',
      title_ar: 'زجاج سيكوريت وسكريت الرياض',
      title_en: 'Securit Glass & Facades',
      badge: 'المرتبة الأولى',
      description_ar:
        'خدمات تفصيل وتركيب زجاج سيكوريت عازل 10 و 12 ملم، واجهات معارض ومحلات، كبائن شاور زجاجية مقاومة للتسرب، وقواطع مكاتب ودرابزين مسابح وسلالم.',
      keywords: [
        'زجاج سكريت الرياض',
        'زجاج سيكوريت الرياض',
        'تفصيل زجاج سيكوريت الخرج',
        'واجهات محلات زجاج سيكوريت',
        'ابواب زجاج سكريت سحاب وهيدروليك',
        'قواطع زجاجية للمكاتب والشركات',
        'شورات وكبائن زجاجية للحمامات',
        'درابزين زجاجي استركشر وسبايدر',
        'سعر متر زجاج سيكوريت 12 ملم الرياض',
        'صيانة ابواب زجاج وماكينات ارضية',
      ],
    },
    {
      id: 'aluminum',
      category: 'aluminum',
      title_ar: 'ألمنيوم وكلادينج الرياض',
      title_en: 'Aluminum & Architectural Cladding',
      badge: 'ضمان 20 سنة',
      description_ar:
        'تصنيع وتركيب شبابيك وأبواب ألمنيوم قطاع سرايا وسوبر سرايا دبل جلاس عازل للغبار والحرارة، وواجهات كلادينج ألمنيوم مقاوم للحريق للمعارض والمباني.',
      keywords: [
        'المنيوم الرياض',
        'ورشة المنيوم الخرج',
        'شبابيك المنيوم دبل جلاس عازل',
        'ابواب المنيوم سرايا وسوبر سرايا',
        'واجهات كلادينج الرياض',
        'تركيب كلادينج الخرج',
        'اسعار كلادينج محلات ومباني بالرياض',
        'تكسيات المنيوم للمعارض والفلل',
        'مطابخ المنيوم حديثة',
        'شبابيك المنيوم سحاب وقلاب',
      ],
    },
    {
      id: 'electrical',
      category: 'electrical',
      title_ar: 'أعمال الكهرباء والإنارة الذكية',
      title_en: 'Electrical Installations & Smart Lighting',
      badge: 'كود البناء السعودي',
      description_ar:
        'تأسيس وتمديدات كهربائية متكاملة للفلل والمشاريع، لوحات قواطع شنايدر، توزيع أحمال متوازنة، إنارة مخفية وليد بروفايل معتمد، وكشف أعطال وتماس الكابلات.',
      keywords: [
        'كهربائي الرياض',
        'كهربائي الخرج',
        'فني كهرباء منازل وفلل بالرياض',
        'تأسيس كهرباء فلل ومباني كود سعودي',
        'لوحات قواطع كهربائية شنايدر',
        'كشف التماس واعطال الكهرباء باحدث الاجهزة',
        'انارة مخفية وليد بروفايل الرياض',
        'تمديدات كهرباء ذكية سمارت هوم',
        'كهربائي ممتاز شمال وشرق الرياض',
        'صيانة كهرباء طارئة 24 ساعة الخرج',
      ],
    },
    {
      id: 'blacksmith',
      category: 'blacksmith_steel',
      title_ar: 'الحديد والحدادة والمظلات',
      title_en: 'Wrought Iron, Gates & Canopies',
      badge: 'قص ليزر مودرن',
      description_ar:
        'تفصيل بوابات حديد مشغول وقص ليزر، مظلات سيارات لكسان وقماش عازل للحرارة، سواتر شرائح ومجدول، وهياكل حديدية مع دهانات حرارية ضد الصدأ.',
      keywords: [
        'حداد الرياض',
        'ورشة حدادة الخرج',
        'ابواب حديد قص ليزر الرياض',
        'بوابات حديد مشغول مودرن للفلل',
        'مظلات سيارات لكسان بالرياض',
        'سواتر حديد مجدول وشرائح',
        'درابزين حديد وسلالم طوارئ',
        'مظلات جلسات ومسابح بالخرج',
        'تفصيل ابواب ليزر خارجية',
        'سواتر احواش ومداخل فلل',
      ],
    },
    {
      id: 'contracting',
      category: 'general_contracting',
      title_ar: 'المقاولات العامة والتشطيبات',
      title_en: 'General Turnkey Contracting',
      badge: 'تسليم مفتاح',
      description_ar:
        'تنفيذ مشاريع المقاولات عظم وتشطيب، دهانات جوتن ديكورية، أسقف جبس بورد معلقة، أرضيات بورسلان ورخام فاخر، وإشراف هندسي متكامل.',
      keywords: [
        'مقاولات الرياض',
        'مقاول الخرج',
        'مقاول تشطيب فلل وقصور بالرياض',
        'تشطيب شقق ومباني تسليم مفتاح',
        'دهانات داخلية وخارجية جوتن الرياض',
        'اسقف جبس بورد معلقة ومضيئة',
        'تركيب بورسلان وسيراميك ارضيات',
        'مقاول معتمد الرياض',
        'تشطيبات ديكورية بديل خشب ورخام',
        'عزل اسطح وخزانات مائي وحراري',
      ],
    },
    {
      id: 'renovation',
      category: 'renovation',
      title_ar: 'الترميم وبناء الملاحق والمجالس',
      title_en: 'Renovation & Majlis Annexes',
      badge: 'إشراف هندسي',
      description_ar:
        'بناء ملاحق ومجالس ضيافة خارجية VIP، ترميم الفلل والمباني القديمة، معالجة التصدعات والرطوبة، عزل فوم مائي وحراري، وتجديد دورات المياه والمطابخ.',
      keywords: [
        'ترميم منازل الرياض',
        'ترميم فلل الخرج',
        'بناء ملاحق بالرياض عظم وتشطيب',
        'بناء مجلس خارجي الخرج VIP',
        'معالجة الرطوبة والتشققات وتصدع الجدران',
        'تجديد حمامات ومطابخ بالرياض',
        'مقاول ترميم معتمد الخرج',
        'بناء ملاحق اسطح ومداخل',
        'عزل فوم بولي يوريثان معتمد سكيكو',
        'ترميم شامل للقصور والفلل القديمة',
      ],
    },
  ];

  const activeClusters =
    activeTab === 'all' ? clusters : clusters.filter((c) => c.id === activeTab);

  return (
    <section id="seo-hub" className="py-12 sm:py-20 bg-[#F4EFE6] border-t border-[#E8E2D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <ScrollReveal direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE3D5] text-[#8C6B3A] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'دليل الخدمات والكلمات الأكثر طلباً في الرياض والخرج' : 'SEO Service & Search Index'}</span>
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#15181F] mb-3">
            {isAr ? 'خدماتنا المتخصصة وتغطيتنا الشاملة في الرياض ومحافظة الخرج' : 'Core Capabilities & Regional Coverage'}
          </h2>

          <p className="text-xs sm:text-sm text-[#5A6273] leading-relaxed">
            {isAr
              ? 'تغطي مؤسسة ريم النفوذ كافة متطلبات زجاج السيكوريت والسكريت، قطاعات الألمنيوم، واجهات الكلادينج، التأسيس الكهربائي، الحدادة والمقاولات والترميم بأعلى المواصفات المعتمدة.'
              : 'End-to-end expertise covering tempered glass, aluminum, architectural cladding, electrical works, blacksmithing, and full turnkey contracting.'}
          </p>
        </ScrollReveal>

        {/* Category Selector Tabs - Horizontal Swipe on Mobile */}
        <ScrollReveal direction="up" delay={0.1} distance={20} className="flex items-center gap-1.5 sm:gap-2 mb-8 overflow-x-auto no-scrollbar pb-1 px-1 justify-start sm:justify-center w-full max-w-full">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 ${activeTab === 'all'
                ? 'bg-[#9B7846] text-white shadow-md'
                : 'bg-white hover:bg-[#FAF7F2] text-[#4E5667] border border-[#DDD5C5]'
              }`}
          >
            {isAr ? 'كافة الخدمات والكلمات' : 'All Divisions'}
          </button>

          {clusters.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 ${activeTab === c.id
                  ? 'bg-[#9B7846] text-white shadow-md'
                  : 'bg-white hover:bg-[#FAF7F2] text-[#4E5667] border border-[#DDD5C5]'
                }`}
            >
              {isAr ? c.title_ar.split(' ')[0] + ' ' + (c.title_ar.split(' ')[1] || '') : c.title_en}
            </button>
          ))}
        </ScrollReveal>

        {/* Keyword Cluster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeClusters.map((cluster, idx) => (
            <ScrollReveal
              key={cluster.id}
              direction="up"
              delay={idx * 0.08}
              distance={20}
              className="h-full"
            >
              <div
                className="h-full bg-white border border-[#E8E2D5] hover:border-[#9B7846] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-white bg-[#9B7846] px-2.5 py-0.5 rounded-full">
                      {cluster.badge}
                    </span>
                    <span className="text-xs text-[#717786] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#9B7846]" />
                      <span>الرياض</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#15181F] mb-2">
                    {isAr ? cluster.title_ar : cluster.title_en}
                  </h3>

                  <p className="text-xs text-[#5A6273] leading-relaxed mb-4">
                    {isAr ? cluster.description_ar : cluster.title_en}
                  </p>

                  {/* Keyword Pills */}
                  <div className="pt-3 border-t border-[#F2EDE2]">
                    <span className="text-[11px] font-bold text-[#8C6B3A] block mb-2">
                      {isAr ? 'الكلمات والخدمات الأكثر بحثاً:' : 'Top Search Queries:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.keywords.map((kw, kwIdx) => (
                        <button
                          key={kwIdx}
                          onClick={() => onRequestQuote(kw)}
                          className="text-[11px] bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#4E5667] hover:text-[#9B7846] px-2.5 py-1 rounded-md border border-[#E0D8C8] transition-colors text-start"
                          title={isAr ? `طلب عرض سعر لـ ${kw}` : `Request quote for ${kw}`}
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 mt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                  <button
                    onClick={() => onRequestQuote(cluster.title_ar)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-xl shadow-xs transition-colors"
                  >
                    <span>{isAr ? 'طلب تسعير ومعاينة لهذه الخدمة' : 'Request Inspection & Quote'}</span>
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom Local SEO Notice */}
        <ScrollReveal direction="up" distance={20}>
          <div className="mt-12 p-6 rounded-2xl bg-white border border-[#E8E2D5] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-start shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] border border-[#DDD5C5] flex items-center justify-center text-[#9B7846] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#15181F]">
                  {isAr ? 'هل تبحث عن خدمة مخصصة في موقعك أو حيك بالرياض أو الخرج؟' : 'Looking for custom on-site execution in Riyadh or Al-Kharj?'}
                </h4>
                <p className="text-xs text-[#5A6273] mt-0.5">
                  {isAr
                    ? 'نوفر فرق عمل سريعة تغطي شمال وشرق وغرب وجنوب الرياض، بالإضافة لمدينة الخرج والدلم والمحافظات المجاورة.'
                    : 'Fast response teams covering all districts of Riyadh, Al-Kharj, Ad-Dilam, and neighboring areas.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onRequestQuote(isAr ? 'استفسار عام عن الخدمات' : 'General Inquiry')}
              className="px-5 py-2.5 text-xs font-bold text-[#15181F] bg-[#F4EFE6] hover:bg-[#EAE3D5] rounded-xl transition-colors border border-[#DDD5C5] whitespace-nowrap shadow-xs"
            >
              {isAr ? 'تواصل مع المهندس الميداني' : 'Contact On-Site Engineer'}
            </button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

