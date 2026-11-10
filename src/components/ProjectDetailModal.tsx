import React from 'react';
import { X, MapPin, Calendar, Building, Sparkles, MessageSquare, Phone, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Project, SiteSettings } from '../types.ts';
import { FormattedContent } from './FormattedContent.tsx';

interface ProjectDetailModalProps {
  project: Project | null;
  lang: 'ar' | 'en';
  settings: SiteSettings;
  onClose: () => void;
  onRequestQuote: (projectTitle: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  lang,
  settings,
  onClose,
  onRequestQuote,
}) => {
  if (!project) return null;

  const isAr = lang === 'ar';
  const title = isAr ? project.title_ar : project.title_en || project.title_ar;
  const description = isAr ? project.description_ar : project.description_en || project.description_ar;

  const categoryNames: Record<string, { ar: string; en: string }> = {
    electrical: { ar: 'الأعمال الكهربائية', en: 'Electrical Works' },
    glass_securit: { ar: 'زجاج سيكوريت', en: 'Securit Glass' },
    aluminum: { ar: 'ألمنيوم وكلادينج', en: 'Aluminum & Cladding' },
    blacksmith_steel: { ar: 'أعمال الحديد والحدادة', en: 'Blacksmithing & Steel' },
    general_contracting: { ar: 'المقاولات العامة والتشطيب', en: 'General Contracting' },
    renovation: { ar: 'الترميم والملاحق', en: 'Renovation & Annexes' },
  };

  const categoryName = categoryNames[project.category]
    ? isAr
      ? categoryNames[project.category].ar
      : categoryNames[project.category].en
    : project.category;

  const whatsappMessage = encodeURIComponent(
    isAr
      ? `مرحباً مؤسسة ريم النفوذ، أود الاستفسار وطلب تنفيذ عمل مماثل لمشروع: (${project.title_ar}) في ${project.city}.`
      : `Hello Reem Al-Nufood, I would like to inquire about similar project: ${project.title_ar}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#8C6B3A] uppercase tracking-wider">
              {isAr ? 'تفاصيل المشروع المنفذ' : 'Executed Project Dossier'}
            </span>
            <span className="text-[#DDD5C5]">·</span>
            <span className="text-xs text-[#5A6273] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#9B7846]" />
              <span>{project.city}</span>
              {project.district && <span>- {project.district}</span>}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#717786] hover:text-[#15181F] hover:bg-[#F2EDE2] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          {/* Main Showcase Image */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#F2EDE2] border border-[#DDD5C5] shadow-xs">
            <img
              src={project.image_url}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {project.client_type && (
              <div className="absolute top-4 start-4 text-xs font-medium bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-white/20">
                {project.client_type}
              </div>
            )}
            {project.featured && (
              <div className="absolute top-4 end-4 text-xs font-bold bg-[#9B7846] text-white px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'مشروع مميز' : 'Featured'}</span>
              </div>
            )}
          </div>

          {/* Before Image if available */}
          {project.before_image_url && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#8C6B3A] uppercase tracking-wider">
                {isAr ? 'صورة الموقع قبل بدء التنفيذ' : 'Site Before Execution'}
              </h4>
              <div className="aspect-[16/9] max-h-72 rounded-xl overflow-hidden bg-[#F2EDE2] border border-[#DDD5C5]">
                <img
                  src={project.before_image_url}
                  alt={isAr ? 'قبل التنفيذ' : 'Before Execution'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          {/* Title and Specs Grid */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F4EFE6] text-[#8C6B3A] border border-[#DDD5C5]">
                {categoryName}
              </span>
              {project.completion_year && (
                <span className="flex items-center gap-1 text-xs text-[#717786] bg-white px-3 py-1 rounded-full border border-[#E8E2D5]">
                  <Calendar className="w-3 h-3 text-[#9B7846]" />
                  <span>{project.completion_year}</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#15181F] mb-4">
              {title}
            </h2>

            {/* Rich Formatted Description with bullet points and neat typography */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D5] shadow-2xs">
              <h3 className="text-sm font-bold text-[#15181F] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9B7846]" />
                <span>{isAr ? 'المواصفات الفنية وتفاصيل التنفيذ' : 'Technical Specifications & Execution'}</span>
              </h3>
              <FormattedContent text={description} />
            </div>
          </div>

          {/* Contact & Quote Bar */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#F4EFE6] to-[#EAE3D5] border border-[#DDD5C5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#15181F]">
                {isAr ? 'هل يعجبك هذا العمل وترغب بتنفيذه؟' : 'Interested in a similar project?'}
              </h4>
              <p className="text-xs text-[#5A6273] mt-0.5">
                {isAr
                  ? 'نوفر معاينة وتصميماً وعرض سعر مفصلاً وشاملاً الضمان والمواد بالرياض والخرج.'
                  : 'We provide full turnkey execution with warranties in Riyadh and Al-Kharj.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href={`https://wa.me/${settings.whatsapp_number}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isAr ? 'واتساب للمشروع' : 'Inquire on WhatsApp'}</span>
              </a>

              <button
                onClick={() => {
                  onClose();
                  onRequestQuote(title);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-xl transition-all shadow-sm"
              >
                <span>{isAr ? 'طلب عرض سعر لهذا العمل' : 'Request Quote'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

