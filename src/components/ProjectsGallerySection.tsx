import React, { useState } from 'react';
import { Project, ServiceCategoryId } from '../types.ts';
import { MapPin, Calendar, Sparkles, PlusCircle, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { FormattedContent } from './FormattedContent.tsx';
import { ScrollReveal } from './ScrollReveal.tsx';

interface ProjectsGallerySectionProps {
  projects: Project[];
  loading: boolean;
  lang: 'ar' | 'en';
  onRequestQuote: (context: string) => void;
  onSelectProject?: (project: Project) => void;
}

export const ProjectsGallerySection: React.FC<ProjectsGallerySectionProps> = ({
  projects,
  loading,
  lang,
  onRequestQuote,
  onSelectProject,
}) => {
  const isAr = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const categories = [
    { id: 'all', label_ar: 'كافة الأعمال', label_en: 'All Projects' },
    { id: 'electrical', label_ar: 'الكهرباء والإنارة', label_en: 'Electrical' },
    { id: 'glass_securit', label_ar: 'السيكوريت والزجاج', label_en: 'Securit Glass' },
    { id: 'aluminum', label_ar: 'الألمنيوم والكلادينج', label_en: 'Aluminum' },
    { id: 'blacksmith_steel', label_ar: 'الحديد والمظلات', label_en: 'Blacksmithing' },
    { id: 'general_contracting', label_ar: 'المقاولات والتشطيب', label_en: 'Finishing' },
    { id: 'renovation', label_ar: 'الترميم والملاحق', label_en: 'Renovation' },
  ];

  const filteredProjects = projects.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchCity =
      selectedCity === 'all' ||
      p.city.includes(selectedCity) ||
      (selectedCity === 'الرياض' && p.city.includes('Riyadh')) ||
      (selectedCity === 'الخرج' && p.city.includes('Kharj'));
    return matchCategory && matchCity;
  });

  return (
    <section id="projects" className="py-14 sm:py-20 lg:py-24 bg-[#FAF7F2] border-t border-[#E8E2D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <ScrollReveal direction="up" distance={30} className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6B3A] tracking-wider uppercase mb-3">
              <span>{isAr ? 'سجل الإنجاز والمشاريع المنفذة' : 'Portfolio of Delivered Works'}</span>
              <span aria-hidden="true">·</span>
              <span>{isAr ? 'مرتبط بقاعدة البيانات' : 'Connected to Live DB'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#15181F] tracking-tight">
              {isAr ? 'نماذج من أعمالنا الميدانية' : 'Featured On-Site Projects'}
            </h2>

            <p className="text-xs sm:text-base text-[#5A6273] mt-2 max-w-xl font-normal">
              {isAr
                ? 'مشاريع حقيقية تم تنفيذها بأعلى معايير الإتقان والدقة في قصور وفلل ومباني ومحلات الرياض والخرج.'
                : 'Real executed projects across residential villas, commercial showrooms, and private estates.'}
            </p>
          </div>

          {/* Quick Action: Request Quote */}
          <button
            onClick={() => onRequestQuote(isAr ? 'استفسار عن المشاريع والأعمال' : 'Portfolio Inquiry')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-xl transition-all self-stretch sm:self-auto shadow-md shadow-[#9B7846]/20"
          >
            <span>{isAr ? 'طلب تنفيذ مشروع مماثل' : 'Request Similar Project'}</span>
          </button>
        </ScrollReveal>

        {/* Dual Filter Bars */}
        <ScrollReveal direction="up" delay={0.1} distance={20} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-10 pb-4 border-b border-[#E8E2D5]">

          {/* Category Filter Controls - Horizontal Swipe on Mobile */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#DDD5C5] shadow-xs overflow-x-auto no-scrollbar w-full sm:w-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${selectedCategory === cat.id
                    ? 'bg-[#9B7846] text-white font-semibold shadow-xs'
                    : 'text-[#5A6273] hover:text-[#15181F] hover:bg-[#F8F5EE]'
                  }`}
              >
                {isAr ? cat.label_ar : cat.label_en}
              </button>
            ))}
          </div>

          {/* City Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#DDD5C5] shadow-xs self-start sm:self-auto shrink-0">
            <button
              onClick={() => setSelectedCity('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${selectedCity === 'all'
                  ? 'bg-[#9B7846] text-white font-semibold'
                  : 'text-[#5A6273] hover:text-[#15181F]'
                }`}
            >
              {isAr ? 'كافة المناطق' : 'All Areas'}
            </button>
            <button
              onClick={() => setSelectedCity('الرياض')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${selectedCity === 'الرياض'
                  ? 'bg-[#9B7846] text-white font-semibold'
                  : 'text-[#5A6273] hover:text-[#15181F]'
                }`}
            >
              {isAr ? 'مشاريع الرياض' : 'Riyadh'}
            </button>
            <button
              onClick={() => setSelectedCity('الخرج')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${selectedCity === 'الخرج'
                  ? 'bg-[#9B7846] text-white font-semibold'
                  : 'text-[#5A6273] hover:text-[#15181F]'
                }`}
            >
              {isAr ? 'مشاريع الخرج' : 'Al-Kharj'}
            </button>
          </div>

        </ScrollReveal>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-[#717786]">
            <div className="inline-block w-8 h-8 border-2 border-[#9B7846] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">{isAr ? 'جارٍ تحميل الأعمال من قاعدة البيانات...' : 'Loading portfolio from database...'}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => (
              <ScrollReveal
                key={project.id}
                direction="up"
                delay={idx * 0.08}
                distance={25}
                className="h-full"
              >
                <div
                  className="group h-full flex flex-col bg-white border border-[#E8E2D5] hover:border-[#9B7846]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl shadow-xs"
                >
                  {/* Media Image with Zoom on Hover */}
                  <div
                    className="relative aspect-[4/3] overflow-hidden bg-[#F2EDE2] cursor-pointer"
                    onClick={() => onSelectProject?.(project)}
                  >
                    <img
                      src={project.image_url}
                      alt={isAr ? project.title_ar : project.title_en || project.title_ar}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-75" />

                    {/* Location Tag */}
                    <div className="absolute top-4 start-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-[#DDD5C5] text-xs text-[#15181F] font-medium shadow-xs">
                      <MapPin className="w-3 h-3 text-[#9B7846]" />
                      <span>{project.city}</span>
                      {project.district && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{project.district}</span>
                        </>
                      )}
                    </div>

                    {project.client_type && (
                      <div className="absolute bottom-4 end-4 text-xs text-[#15181F] bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#DDD5C5] font-medium shadow-xs">
                        {project.client_type}
                      </div>
                    )}

                    {project.featured && (
                      <div className="absolute top-4 end-4 text-xs font-bold bg-[#9B7846] text-white px-2.5 py-0.5 rounded-md shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{isAr ? 'مميز' : 'Featured'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => onSelectProject?.(project)}
                        className="text-lg font-bold text-[#15181F] group-hover:text-[#8C6B3A] transition-colors mb-2.5 cursor-pointer"
                      >
                        {isAr ? project.title_ar : project.title_en || project.title_ar}
                      </h3>
                      <div className="text-xs sm:text-sm text-[#5A6273] leading-relaxed mb-6">
                        <FormattedContent text={isAr ? project.description_ar : project.description_en || project.description_ar} clampLines={3} />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                      <button
                        onClick={() => onSelectProject?.(project)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#8C6B3A] hover:text-[#6D4F23] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isAr ? 'معاينة التفاصيل' : 'View Details'}</span>
                      </button>

                      <button
                        onClick={() => onRequestQuote(isAr ? project.title_ar : project.title_en || project.title_ar)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#9B7846] hover:bg-[#866637] rounded-lg transition-colors whitespace-nowrap shadow-xs"
                      >
                        {isAr ? 'طلب تنفيذ مماثل' : 'Request Similar'}
                      </button>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#E8E2D5]">
            <p className="text-sm text-[#717786] mb-3">
              {isAr ? 'لا توجد مشاريع مضافة في هذا التصنيف حالياً.' : 'No projects listed under this filter currently.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCity('all');
              }}
              className="text-xs text-[#8C6B3A] underline hover:text-[#15181F]"
            >
              {isAr ? 'عرض كافة الأعمال' : 'View All Projects'}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
