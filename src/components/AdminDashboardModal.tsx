import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  MessageSquare,
  Phone,
  Settings,
  CheckCircle,
  FileText,
  Tag,
  Briefcase,
  AlertCircle,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  Edit,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';
import { Project, Advertisement, QuoteRequest, SiteSettings, ServiceItem } from '../types.ts';
import { FormattingToolbar } from './FormattingToolbar.tsx';
import { FormattedContent } from './FormattedContent.tsx';
import { AutoResizeTextarea } from './AutoResizeTextarea.tsx';

interface AdminDashboardModalProps {
  isOpen: boolean;
  lang: 'ar' | 'en';
  projects: Project[];
  ads: Advertisement[];
  quotes: QuoteRequest[];
  services: ServiceItem[];
  settings: SiteSettings;
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  lang,
  projects,
  ads,
  quotes,
  services,
  settings,
  onClose,
  onRefreshData,
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem('reem_admin_token');
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'quotes' | 'projects' | 'ads' | 'services' | 'settings' | 'security'
  >('quotes');

  // Quotes filters & search
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState('all');
  const [quoteNotesEdit, setQuoteNotesEdit] = useState<Record<number, string>>({});

  // --- PROJECT MANAGEMENT STATE ---
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title_ar: '',
    title_en: '',
    category: 'electrical',
    city: 'الرياض',
    district: '',
    client_type: 'فيلا خاصة',
    completion_year: '2025',
    featured: false,
    image_url: '',
    before_image_url: '',
    description_ar: '',
    description_en: '',
  });
  const [projectShowPreview, setProjectShowPreview] = useState(false);
  const [projectUploading, setProjectUploading] = useState(false);
  const [projectBeforeUploading, setProjectBeforeUploading] = useState(false);
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectMsg, setProjectMsg] = useState('');

  // --- AD MANAGEMENT STATE ---
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [adForm, setAdForm] = useState({
    title_ar: '',
    title_en: '',
    badge_ar: 'عرض خاص',
    discount_label: 'خصم 15% لفترة محدودة',
    service_category: 'all',
    target_cities: 'الرياض والخرج',
    description_ar: '',
    image_url: '',
    is_active: true,
  });
  const [adShowPreview, setAdShowPreview] = useState(false);
  const [adUploading, setAdUploading] = useState(false);
  const [adSaving, setAdSaving] = useState(false);
  const [adMsg, setAdMsg] = useState('');

  // --- SERVICE MANAGEMENT STATE ---
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<ServiceItem>>({});
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newScopeInput, setNewScopeInput] = useState('');
  const [serviceShowPreview, setServiceShowPreview] = useState(false);
  const [serviceUploading, setServiceUploading] = useState(false);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [serviceMsg, setServiceMsg] = useState('');

  // --- SITE SETTINGS STATE ---
  const [settingsForm, setSettingsForm] = useState({
    company_name_ar: settings.company_name_ar || 'مؤسسة ريم النفوذ للمقاولات والخدمات المتكاملة',
    company_name_en: settings.company_name_en || 'Reem Al-Nufood Contracting & Integrated Services',
    motto_ar: settings.motto_ar || 'خبرة في التنفيذ، جودة في العمل، وثقة تدوم.',
    phone_primary: settings.phone_primary || '0552345678',
    whatsapp_number: settings.whatsapp_number || '966552345678',
    email: settings.email || 'info@reem-alnufood.com',
    riyadh_address_ar: settings.riyadh_address_ar || 'الرياض - طريق الملك فهد - حي العقيق',
    alkharj_address_ar: settings.alkharj_address_ar || 'الخرج - طريق الملك عبدالعزيز - حي السلام',
    about_summary_ar: settings.about_summary_ar || 'خبرة في التنفيذ، جودة في العمل، وثقة تدوم. نقدم خدمات متكاملة في مجال المقاولات العامة والأعمال الكهربائية والسكوريت والألمنيوم والترميم والتشطيبات بالرياض والخرج.',
    hero_title_ar: settings.hero_title_ar || 'خبرة في التنفيذ، جودة في العمل، وثقة تدوم.',
    hero_subtitle_ar: settings.hero_subtitle_ar || 'نقدم حلولاً متكاملة في المقاولات العامة، الأعمال الكهربائية، زجاج السيكوريت، الألمنيوم، الحدادة والترميم الإنشائي بأعلى معايير كود البناء السعودي مع الالتزام التام بالمواعيد.',
    stat_years_exp: settings.stat_years_exp || '15+',
    stat_projects_done: settings.stat_projects_done || '450+',
    stat_happy_clients: settings.stat_happy_clients || '100%',
    stat_warranty_years: settings.stat_warranty_years || '10 سنوات',
    working_hours_ar: settings.working_hours_ar || 'السبت - الخميس: 8:00 صباحاً - 10:00 مساءً | خدمة طوارئ 24/7',
    hero_bg_image: settings.hero_bg_image || '/src/assets/images/hero_luxury_villa_1794075925416.jpg',
  });
  const [heroBgUploading, setHeroBgUploading] = useState(false);
  const [settingsShowPreview, setSettingsShowPreview] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState('');

  // --- SECURITY STATE ---
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState('');

  // Sync settingsForm when settings prop updates
  useEffect(() => {
    if (settings) {
      setSettingsForm((prev) => ({
        ...prev,
        company_name_ar: settings.company_name_ar || prev.company_name_ar,
        company_name_en: settings.company_name_en || prev.company_name_en,
        motto_ar: settings.motto_ar || prev.motto_ar,
        phone_primary: settings.phone_primary || prev.phone_primary,
        whatsapp_number: settings.whatsapp_number || prev.whatsapp_number,
        email: settings.email || prev.email,
        riyadh_address_ar: settings.riyadh_address_ar || prev.riyadh_address_ar,
        alkharj_address_ar: settings.alkharj_address_ar || prev.alkharj_address_ar,
        about_summary_ar: settings.about_summary_ar || prev.about_summary_ar,
        hero_title_ar: settings.hero_title_ar || prev.hero_title_ar,
        hero_subtitle_ar: settings.hero_subtitle_ar || prev.hero_subtitle_ar,
        stat_years_exp: settings.stat_years_exp || prev.stat_years_exp,
        stat_projects_done: settings.stat_projects_done || prev.stat_projects_done,
        stat_happy_clients: settings.stat_happy_clients || prev.stat_happy_clients,
        stat_warranty_years: settings.stat_warranty_years || prev.stat_warranty_years,
        working_hours_ar: settings.working_hours_ar || prev.working_hours_ar,
        hero_bg_image: settings.hero_bg_image || prev.hero_bg_image,
      }));
    }
  }, [settings]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!passwordInput) return;

    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem('reem_admin_token', data.token);
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setLoginError(data.error || (isAr ? 'كلمة المرور غير صحيحة' : 'Invalid credentials'));
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error logging in');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('reem_admin_token');
    setIsAuthenticated(false);
  };

  // Generic Image Upload Helper
  const handleUploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success && data.url) {
      return data.url;
    }
    throw new Error(data.error || 'Failed to upload image');
  };

  // --- QUOTE ACTIONS ---
  const handleUpdateQuote = async (id: number, status: string, notes?: string) => {
    try {
      await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuote = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Delete this quote?')) return;
    try {
      await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- PROJECT ACTIONS ---
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      title_ar: '',
      title_en: '',
      category: 'electrical',
      city: 'الرياض',
      district: '',
      client_type: 'فيلا خاصة',
      completion_year: '2025',
      featured: false,
      image_url: '',
      before_image_url: '',
      description_ar: '',
      description_en: '',
    });
    setProjectMsg('');
    setIsAddingProject(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setIsAddingProject(false);
    setEditingProject(proj);
    setProjectForm({
      title_ar: proj.title_ar,
      title_en: proj.title_en || '',
      category: proj.category,
      city: proj.city,
      district: proj.district || '',
      client_type: proj.client_type || 'فيلا خاصة',
      completion_year: proj.completion_year || '2025',
      featured: proj.featured || false,
      image_url: proj.image_url,
      before_image_url: proj.before_image_url || '',
      description_ar: proj.description_ar,
      description_en: proj.description_en || '',
    });
    setProjectMsg('');
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title_ar || !projectForm.description_ar || !projectForm.image_url) {
      setProjectMsg(isAr ? 'يرجى إدخال العنوان والوصف والصورة الأساسية.' : 'Title, description, and image required.');
      return;
    }

    setProjectSaving(true);
    setProjectMsg('');
    try {
      const isEdit = !!editingProject;
      const url = isEdit ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      });
      const data = await res.json();
      if (data.success) {
        setProjectMsg(isAr ? 'تم حفظ بيانات العمل بنجاح!' : 'Project saved successfully!');
        setIsAddingProject(false);
        setEditingProject(null);
        onRefreshData();
      } else {
        setProjectMsg(data.error || 'Error saving project');
      }
    } catch (err: any) {
      setProjectMsg(err.message || 'Error');
    } finally {
      setProjectSaving(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا العمل نهائياً؟' : 'Delete this project permanently?')) return;
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- AD ACTIONS ---
  const handleOpenAddAd = () => {
    setEditingAd(null);
    setAdForm({
      title_ar: '',
      title_en: '',
      badge_ar: 'عرض خاص',
      discount_label: 'خصم 15% لفترة محدودة',
      service_category: 'all',
      target_cities: 'الرياض والخرج',
      description_ar: '',
      image_url: '',
      is_active: true,
    });
    setAdMsg('');
    setIsAddingAd(true);
  };

  const handleOpenEditAd = (ad: Advertisement) => {
    setIsAddingAd(false);
    setEditingAd(ad);
    setAdForm({
      title_ar: ad.title_ar,
      title_en: ad.title_en || '',
      badge_ar: ad.badge_ar || 'عرض خاص',
      discount_label: ad.discount_label || '',
      service_category: ad.service_category || 'all',
      target_cities: ad.target_cities || 'الرياض والخرج',
      description_ar: ad.description_ar,
      image_url: ad.image_url || '',
      is_active: ad.is_active !== false,
    });
    setAdMsg('');
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.title_ar || !adForm.description_ar) {
      setAdMsg(isAr ? 'يرجى إدخال عنوان وتفاصيل العرض.' : 'Please enter title and details.');
      return;
    }

    setAdSaving(true);
    setAdMsg('');
    try {
      const isEdit = !!editingAd;
      const url = isEdit ? `/api/ads/${editingAd.id}` : '/api/ads';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adForm),
      });
      const data = await res.json();
      if (data.success) {
        setAdMsg(isAr ? 'تم حفظ الإعلان بنجاح!' : 'Ad saved successfully!');
        setIsAddingAd(false);
        setEditingAd(null);
        onRefreshData();
      } else {
        setAdMsg(data.error || 'Error');
      }
    } catch (err: any) {
      setAdMsg(err.message || 'Error');
    } finally {
      setAdSaving(false);
    }
  };

  const handleDeleteAd = async (id: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الإعلان؟' : 'Delete this ad?')) return;
    try {
      await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- SERVICE ACTIONS ---
  const handleOpenEditService = (service: ServiceItem) => {
    setEditingService(service);
    setServiceForm({
      title_ar: service.title_ar,
      title_en: service.title_en,
      short_desc_ar: service.short_desc_ar,
      short_desc_en: service.short_desc_en,
      hero_image: service.hero_image,
      icon_name: service.icon_name,
      features_ar: [...(service.features_ar || [])],
      scope_ar: [...(service.scope_ar || [])],
      faqs: [...(service.faqs || [])],
      riyadh_districts: [...(service.riyadh_districts || [])],
      alkharj_districts: [...(service.alkharj_districts || [])],
    });
    setServiceMsg('');
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setServiceSaving(true);
    setServiceMsg('');
    try {
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm),
      });
      const data = await res.json();
      if (data.success) {
        setServiceMsg(isAr ? 'تم تحديث بيانات القسم بنجاح!' : 'Service updated successfully!');
        setEditingService(null);
        onRefreshData();
      } else {
        setServiceMsg(data.error || 'Error saving service');
      }
    } catch (err: any) {
      setServiceMsg(err.message || 'Error');
    } finally {
      setServiceSaving(false);
    }
  };

  const handleResetServices = async () => {
    if (!window.confirm(isAr ? 'هل ترغب باستعادة قوالب الخدمات الافتراضية الأصلية؟' : 'Reset services to default template?')) return;
    try {
      await fetch('/api/services/reset', { method: 'POST' });
      onRefreshData();
      alert(isAr ? 'تمت استعادة الخدمات الافتراضية بنجاح!' : 'Services restored to default!');
    } catch (err) {
      console.error(err);
    }
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsMsg(isAr ? 'تم حفظ وتطبيق كافة إعدادات الموقع بنجاح!' : 'All site settings updated!');
        onRefreshData();
      } else {
        setSettingsMsg(data.error || 'Error saving settings');
      }
    } catch (err: any) {
      setSettingsMsg(err.message || 'Error');
    } finally {
      setSettingsSaving(false);
    }
  };

  // --- SECURITY ACTIONS ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg('');

    if (newPwd !== confirmPwd) {
      setPwdMsg(isAr ? 'كلمة المرور الجديدة غير متطابقة مع التأكيد' : 'New passwords do not match');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPwd,
          new_password: newPwd,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPwdMsg(isAr ? 'تم تحديث كلمة المرور بنجاح في قاعدة البيانات!' : 'Password changed successfully!');
        setCurrentPwd('');
        setNewPwd('');
        setConfirmPwd('');
      } else {
        setPwdMsg(data.error || 'Error');
      }
    } catch (err: any) {
      setPwdMsg(err.message || 'Error');
    } finally {
      setPwdLoading(false);
    }
  };

  // Filtered quotes
  const filteredQuotes = quotes.filter((q) => {
    const matchStatus = quoteStatusFilter === 'all' || q.status === quoteStatusFilter;
    const matchSearch =
      !quoteSearch ||
      q.customer_name.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.phone.includes(quoteSearch) ||
      q.city.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.service_type.toLowerCase().includes(quoteSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 overflow-y-auto bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Dashboard Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9B7846] to-[#7A5B2E] text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#15181F] flex items-center gap-2">
                <span>{isAr ? 'لوحة التحكم والإدارة الشاملة' : 'Complete Admin Control Center'}</span>
                {isAuthenticated && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {isAr ? 'تحكم كامل متصل' : 'Full Control Connected'}
                  </span>
                )}
              </h3>
              <span className="text-xs text-[#717786]">
                {isAr ? 'مؤسسة ريم النفوذ · PostgreSQL Neon DB · Cloudflare R2' : 'Reem Al-Nufood · Neon PostgreSQL · Cloudflare R2'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                title={isAr ? 'تسجيل الخروج' : 'Logout'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'خروج' : 'Logout'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#717786] hover:text-[#15181F] hover:bg-[#F2EDE2] rounded-lg transition-colors"
              title={isAr ? 'إغلاق والعودة للموقع' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECURITY AUTHENTICATION GATE */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <img
              src="/logo-icon.png"
              alt={isAr ? 'شعار مؤسسة ريم النفوذ' : 'Reem Al-Nufood Logo'}
              className="w-16 h-16 object-contain drop-shadow-md select-none"
              width={64}
              height={64}
            />

            <div>
              <h4 className="text-xl font-bold text-[#15181F] mb-2">
                {isAr ? 'تسجيل الدخول إلى لوحة التحكم' : 'Administrative Authentication'}
              </h4>
              <p className="text-xs sm:text-sm text-[#5A6273] leading-relaxed">
                {isAr
                  ? 'يرجى إدخال كلمة المرور الإدارية للوصول للتحكم الكامل وتعديل المشاريع والخدمات والإعلانات والإعدادات.'
                  : 'Enter master password to unlock complete management and editing capabilities.'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              {loginError && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl text-center">
                  {loginError}
                </div>
              )}

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={isAr ? 'أدخل كلمة المرور...' : 'Enter admin password...'}
                  className="w-full px-4 py-3 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-xl text-sm text-[#15181F] focus:outline-none transition-colors shadow-xs pe-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-[#717786] hover:text-[#15181F]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-xl shadow-md shadow-[#9B7846]/20 transition-all disabled:opacity-50"
              >
                {loginLoading ? (
                  <span>{isAr ? 'جارٍ التحقق...' : 'Verifying...'}</span>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>{isAr ? 'دخول لوحة التحكم' : 'Unlock Dashboard'}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#8C94A5]">
                {isAr
                  ? 'كلمة المرور الإدارية محددة في متغيرات البيئة .env (ويمكن تعديلها بأي وقت من إعدادات الأمان بالداخل).'
                  : 'Administrative master key is secured via .env (can be updated anytime in Security settings).'}
              </p>
            </form>
          </div>
        ) : (
          <>
            {/* Dashboard Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-[#E8E2D5] bg-[#F2EDE2] overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('quotes');
                  setEditingProject(null);
                  setEditingAd(null);
                  setEditingService(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'quotes'
                    ? 'bg-[#9B7846] text-white shadow-xs'
                    : 'text-[#5A6273] hover:text-[#15181F] hover:bg-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isAr ? `طلبات الأسعار (${quotes.length})` : `Quotes (${quotes.length})`}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('projects');
                  setEditingAd(null);
                  setEditingService(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-[#9B7846] text-white shadow-xs'
                    : 'text-[#5A6273] hover:text-[#15181F] hover:bg-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{isAr ? `المشاريع والأعمال (${projects.length})` : `Projects (${projects.length})`}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('ads');
                  setEditingProject(null);
                  setEditingService(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'ads'
                    ? 'bg-[#9B7846] text-white shadow-xs'
                    : 'text-[#5A6273] hover:text-[#15181F] hover:bg-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{isAr ? `العروض والإعلانات (${ads.length})` : `Promotions (${ads.length})`}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('services');
                  setEditingProject(null);
                  setEditingAd(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'bg-[#9B7846] text-white shadow-xs'
                    : 'text-[#5A6273] hover:text-[#15181F] hover:bg-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isAr ? `الأنشطة والخدمات (${services.length})` : `Services (${services.length})`}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setEditingProject(null);
                  setEditingAd(null);
                  setEditingService(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-[#9B7846] text-white shadow-xs'
                    : 'text-[#5A6273] hover:text-[#15181F] hover:bg-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعدادات الموقع والواجهة' : 'Site Settings'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('security');
                  setEditingProject(null);
                  setEditingAd(null);
                  setEditingService(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-[#9B7846] text-white shadow-xs'
                    : 'text-[#5A6273] hover:text-[#15181F] hover:bg-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isAr ? 'كلمة المرور والأمان' : 'Security'}</span>
              </button>
            </div>

            {/* TAB CONTENT BODY */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* ======================================================== */}
              {/* TAB 1: QUOTES MANAGEMENT                                 */}
              {/* ======================================================== */}
              {activeTab === 'quotes' && (
                <div className="space-y-4">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#E8E2D5] shadow-xs">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-[#717786] absolute start-3 top-2.5" />
                      <input
                        type="text"
                        value={quoteSearch}
                        onChange={(e) => setQuoteSearch(e.target.value)}
                        placeholder={isAr ? 'بحث بالاسم، الجوال، المدينة...' : 'Search quotes...'}
                        className="w-full ps-9 pe-3 py-1.5 bg-[#FAF7F2] border border-[#DDD5C5] rounded-lg text-xs focus:outline-none focus:border-[#9B7846]"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs text-[#717786] whitespace-nowrap">{isAr ? 'الحالة:' : 'Status:'}</span>
                      <select
                        value={quoteStatusFilter}
                        onChange={(e) => setQuoteStatusFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#DDD5C5] rounded-lg text-[#15181F] focus:outline-none"
                      >
                        <option value="all">{isAr ? 'كافة الحالات' : 'All'}</option>
                        <option value="new">{isAr ? 'جديد' : 'New'}</option>
                        <option value="in_progress">{isAr ? 'قيد المتابعة' : 'In Progress'}</option>
                        <option value="quoted">{isAr ? 'تم إرسال السعر' : 'Quoted'}</option>
                        <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
                        <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                      </select>
                    </div>
                  </div>

                  {filteredQuotes.length === 0 ? (
                    <div className="py-12 text-center text-[#717786] bg-white rounded-xl border border-[#E8E2D5]">
                      {isAr ? 'لا توجد طلبات عروض أسعار مطابقة للبحث.' : 'No quote requests match your filter.'}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredQuotes.map((q) => {
                        const waLink = `https://wa.me/${q.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          isAr
                            ? `مرحباً ${q.customer_name}، نتواصل معك من مؤسسة ريم النفوذ للمقاولات بخصوص طلبكم لخدمة (${q.service_type}) في ${q.city}.`
                            : `Hello ${q.customer_name}, contacting from Reem Al-Nufood regarding ${q.service_type}.`
                        )}`;

                        return (
                          <div
                            key={q.id}
                            className="p-4 rounded-xl bg-white border border-[#E8E2D5] flex flex-col gap-3 shadow-xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <span className="font-bold text-sm text-[#15181F]">{q.customer_name}</span>
                                <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#F4EFE6] text-[#8C6B3A] border border-[#DDD5C5] font-semibold">
                                  {q.service_type}
                                </span>
                                <span className="text-xs text-[#5A6273]">
                                  {q.city} {q.district ? `(${q.district})` : ''}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-[#717786]">
                                  {q.created_at ? new Date(q.created_at).toLocaleString('ar-SA') : ''}
                                </span>
                                <button
                                  onClick={() => handleDeleteQuote(q.id)}
                                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                                  title={isAr ? 'حذف الطلب' : 'Delete'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="text-xs text-[#717786] flex flex-wrap items-center gap-4">
                              <span>
                                {isAr ? 'الجوال:' : 'Phone:'}{' '}
                                <strong className="text-[#15181F]" dir="ltr">
                                  {q.phone}
                                </strong>
                              </span>
                              {q.preferred_time && (
                                <span>
                                  {isAr ? 'الوقت المفضل:' : 'Preferred:'}{' '}
                                  <strong className="text-[#15181F]">{q.preferred_time}</strong>
                                </span>
                              )}
                            </div>

                            {q.details && (
                              <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E2D5]">
                                <span className="text-[11px] font-semibold text-[#8C6B3A] block mb-1">
                                  {isAr ? 'تفاصيل الطلب من العميل:' : 'Customer Details:'}
                                </span>
                                <FormattedContent text={q.details} />
                              </div>
                            )}

                            {/* Status, Admin Notes & Contact */}
                            <div className="pt-2 border-t border-[#F2EDE2] flex flex-col md:flex-row md:items-center justify-between gap-3">
                              {/* Internal Admin Notes */}
                              <div className="flex-1 flex items-center gap-2">
                                <input
                                  type="text"
                                  value={quoteNotesEdit[q.id] ?? q.notes ?? ''}
                                  onChange={(e) => setQuoteNotesEdit({ ...quoteNotesEdit, [q.id]: e.target.value })}
                                  placeholder={isAr ? 'أضف ملاحظة إدارية داخلية (مثل: تم الاتفاق على موعد المعاينة يوم الأحد)...' : 'Admin internal notes...'}
                                  className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#DDD5C5] rounded-lg text-xs text-[#15181F] focus:outline-none"
                                />
                                {quoteNotesEdit[q.id] !== undefined && quoteNotesEdit[q.id] !== q.notes && (
                                  <button
                                    onClick={() => handleUpdateQuote(q.id, q.status, quoteNotesEdit[q.id])}
                                    className="px-2.5 py-1.5 bg-[#9B7846] text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                                  >
                                    {isAr ? 'حفظ' : 'Save'}
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <select
                                  value={q.status}
                                  onChange={(e) => handleUpdateQuote(q.id, e.target.value, q.notes)}
                                  className="px-2.5 py-1.5 text-xs bg-white border border-[#DDD5C5] rounded-lg text-[#15181F] font-semibold focus:outline-none"
                                >
                                  <option value="new">{isAr ? 'جديد 🟢' : 'New'}</option>
                                  <option value="in_progress">{isAr ? 'قيد المتابعة 🟡' : 'In Progress'}</option>
                                  <option value="quoted">{isAr ? 'تم إرسال السعر 🔵' : 'Quoted'}</option>
                                  <option value="completed">{isAr ? 'مكتمل ✅' : 'Completed'}</option>
                                  <option value="cancelled">{isAr ? 'ملغي ❌' : 'Cancelled'}</option>
                                </select>

                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg transition-colors shadow-xs"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'واتساب' : 'Chat'}</span>
                                </a>

                                <a
                                  href={`tel:${q.phone}`}
                                  className="p-1.5 text-[#15181F] hover:text-[#9B7846] bg-[#F4EFE6] hover:bg-[#EAE3D5] rounded-lg transition-colors border border-[#DDD5C5]"
                                  title={isAr ? 'اتصال مباشر' : 'Call'}
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: PROJECTS MANAGEMENT (Full Add, Edit, Delete)      */}
              {/* ======================================================== */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {/* Top action row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#15181F]">
                        {isAr ? 'إدارة معرض الأعمال والمشاريع المنفذة' : 'Executed Projects Portfolio'}
                      </h4>
                      <p className="text-xs text-[#717786]">
                        {isAr ? 'تحكم كامل: إضافة عمل جديد أو تعديل أي مشروع قائم وتنسيقه.' : 'Add or edit projects.'}
                      </p>
                    </div>

                    {!isAddingProject && !editingProject && (
                      <button
                        onClick={handleOpenAddProject}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-lg shadow-sm transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isAr ? 'إضافة مشروع جديد' : 'Add New Project'}</span>
                      </button>
                    )}
                  </div>

                  {/* PROJECT ADD / EDIT FORM MODAL / INLINE */}
                  {(isAddingProject || editingProject) && (
                    <div className="p-6 rounded-xl bg-white border-2 border-[#9B7846]/40 shadow-md space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
                        <h4 className="text-sm font-bold text-[#15181F] flex items-center gap-2">
                          <Edit className="w-4 h-4 text-[#9B7846]" />
                          <span>
                            {editingProject
                              ? (isAr ? `تعديل المشروع: ${editingProject.title_ar}` : `Edit Project: ${editingProject.title_ar}`)
                              : (isAr ? 'إضافة مشروع جديد للمعرض' : 'Add New Project')}
                          </span>
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingProject(false);
                            setEditingProject(null);
                          }}
                          className="text-[#717786] hover:text-[#15181F] text-xs font-semibold px-2 py-1 bg-[#FAF7F2] rounded"
                        >
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>

                      {projectMsg && (
                        <div className="p-3 text-xs text-[#8C6B3A] bg-[#F4EFE6] border border-[#DDD5C5] rounded-lg">
                          {projectMsg}
                        </div>
                      )}

                      <form onSubmit={handleSaveProject} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'عنوان المشروع (عربي) *' : 'Project Title (Arabic) *'}
                            </label>
                            <input
                              type="text"
                              required
                              value={projectForm.title_ar}
                              onChange={(e) => setProjectForm({ ...projectForm, title_ar: e.target.value })}
                              placeholder={isAr ? 'مثال: تركيب واجهات سيكوريت عازلة لمعرض تجاري' : 'Project title'}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'القسم / النشاط *' : 'Category *'}
                            </label>
                            <select
                              value={projectForm.category}
                              onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            >
                              <option value="electrical">{isAr ? 'الأعمال الكهربائية' : 'Electrical'}</option>
                              <option value="glass_securit">{isAr ? 'أعمال الزجاج والسيكوريت' : 'Glass & Securit'}</option>
                              <option value="aluminum">{isAr ? 'أعمال الألمنيوم والكلادينج' : 'Aluminum'}</option>
                              <option value="blacksmith_steel">{isAr ? 'أعمال الحديد والحدادة' : 'Blacksmithing'}</option>
                              <option value="general_contracting">{isAr ? 'المقاولات العامة والتشطيبات' : 'General Contracting'}</option>
                              <option value="renovation">{isAr ? 'الترميم وإنشاء الملاحق' : 'Renovation'}</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'المدينة *' : 'City *'}
                            </label>
                            <select
                              value={projectForm.city}
                              onChange={(e) => setProjectForm({ ...projectForm, city: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            >
                              <option value="الرياض">{isAr ? 'الرياض' : 'Riyadh'}</option>
                              <option value="الخرج">{isAr ? 'الخرج' : 'Al-Kharj'}</option>
                              <option value="الدرعية">{isAr ? 'الدرعية' : 'Diriyah'}</option>
                              <option value="الدلم">{isAr ? 'الدلم' : 'Ad-Dilam'}</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'الحي' : 'District'}
                            </label>
                            <input
                              type="text"
                              value={projectForm.district}
                              onChange={(e) => setProjectForm({ ...projectForm, district: e.target.value })}
                              placeholder={isAr ? 'مثال: حي الملقا' : 'District'}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'نوع المبنى / العميل' : 'Client Type'}
                            </label>
                            <input
                              type="text"
                              value={projectForm.client_type}
                              onChange={(e) => setProjectForm({ ...projectForm, client_type: e.target.value })}
                              placeholder={isAr ? 'فيلا خاصة / مجمع تجاري' : 'Client type'}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'سنة الإنجاز' : 'Year'}
                            </label>
                            <input
                              type="text"
                              value={projectForm.completion_year}
                              onChange={(e) => setProjectForm({ ...projectForm, completion_year: e.target.value })}
                              placeholder="2025"
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Image upload & URL */}
                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                            {isAr ? 'صورة المشروع الرئيسية (Cloudflare R2 أو رابط) *' : 'Main Project Photo *'}
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#DDD5C5] rounded-lg text-xs font-semibold text-[#15181F] cursor-pointer transition-colors whitespace-nowrap shadow-xs">
                              <Upload className="w-4 h-4 text-[#9B7846]" />
                              <span>{projectUploading ? (isAr ? 'جارٍ الرفع لـ R2...' : 'Uploading...') : (isAr ? 'رفع صورة جديدة' : 'Upload File')}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={projectUploading}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setProjectUploading(true);
                                  try {
                                    const url = await handleUploadFile(file);
                                    setProjectForm({ ...projectForm, image_url: url });
                                    setProjectMsg(isAr ? 'تم رفع الصورة بنجاح إلى Cloudflare R2!' : 'Uploaded successfully!');
                                  } catch (err: any) {
                                    setProjectMsg(err.message);
                                  } finally {
                                    setProjectUploading(false);
                                  }
                                }}
                              />
                            </label>

                            <input
                              type="text"
                              required
                              value={projectForm.image_url}
                              onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                              placeholder={isAr ? 'أو أدخل رابط الصورة مباشرة...' : 'Image URL'}
                              className="flex-1 w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          {projectForm.image_url && (
                            <div className="mt-2.5 flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-lg border border-[#DDD5C5]">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <img
                                  src={projectForm.image_url}
                                  alt="Preview"
                                  className="w-16 h-12 object-cover rounded bg-[#E8E2D5]"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="text-xs text-[#5A6273] truncate">{projectForm.image_url}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setProjectForm({ ...projectForm, image_url: '' })}
                                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 hover:bg-rose-50 rounded transition-colors shrink-0"
                              >
                                {isAr ? 'حذف الصورة' : 'Remove'}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Optional Before Image with Device Upload */}
                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                            {isAr ? 'صورة قبل التنفيذ (اختياري - لمقارنة قبل وبعد)' : 'Before Image (Optional)'}
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#DDD5C5] rounded-lg text-xs font-semibold text-[#15181F] cursor-pointer transition-colors whitespace-nowrap shadow-xs">
                              <Upload className="w-4 h-4 text-[#9B7846]" />
                              <span>{projectBeforeUploading ? (isAr ? 'جارٍ الرفع...' : 'Uploading...') : (isAr ? 'رفع من الجهاز' : 'Upload From Device')}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={projectBeforeUploading}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setProjectBeforeUploading(true);
                                  try {
                                    const url = await handleUploadFile(file);
                                    setProjectForm({ ...projectForm, before_image_url: url });
                                    setProjectMsg(isAr ? 'تم رفع صورة ما قبل التنفيذ بنجاح!' : 'Before photo uploaded successfully!');
                                  } catch (err: any) {
                                    setProjectMsg(err.message);
                                  } finally {
                                    setProjectBeforeUploading(false);
                                  }
                                }}
                              />
                            </label>

                            <input
                              type="text"
                              value={projectForm.before_image_url}
                              onChange={(e) => setProjectForm({ ...projectForm, before_image_url: e.target.value })}
                              placeholder={isAr ? 'أو أدخل رابط صورة الموقع قبل بدء العمل...' : 'Before image URL...'}
                              className="flex-1 w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          {projectForm.before_image_url && (
                            <div className="mt-2.5 flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-lg border border-[#DDD5C5]">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <img
                                  src={projectForm.before_image_url}
                                  alt="Before Preview"
                                  className="w-16 h-12 object-cover rounded bg-[#E8E2D5]"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="text-xs text-[#5A6273] truncate">{projectForm.before_image_url}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setProjectForm({ ...projectForm, before_image_url: '' })}
                                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 hover:bg-rose-50 rounded transition-colors shrink-0"
                              >
                                {isAr ? 'حذف الصورة' : 'Remove'}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Description with Rich Formatting Toolbar & Live Preview */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-[#15181F]">
                              {isAr ? 'وصف وتفاصيل العمل المنجز مع دعم التنسيق *' : 'Description of Work with Formatting *'}
                            </label>
                            <span className="text-[11px] text-[#8C6B3A]">
                              {isAr ? 'استخدم أدوات التنسيق لإدراج نقاط ومميزات بارزة تظهر مرتبة بالموقع' : 'Use formatting tools for bullet items'}
                            </span>
                          </div>

                          {/* Formatting Toolbar */}
                          <FormattingToolbar
                            textareaId="project-desc-textarea"
                            value={projectForm.description_ar}
                            onChange={(val) => setProjectForm({ ...projectForm, description_ar: val })}
                            showPreview={projectShowPreview}
                            onTogglePreview={() => setProjectShowPreview(!projectShowPreview)}
                            lang={lang}
                          />

                          {projectShowPreview ? (
                            <div className="p-4 bg-white border border-t-0 border-[#DDD5C5] rounded-b-lg min-h-[120px]">
                              <div className="text-[11px] font-semibold text-[#8C6B3A] mb-2">
                                {isAr ? 'معاينة شكل النص المنسق كما سيظهر بالموقع:' : 'Live Rendered Preview:'}
                              </div>
                              <FormattedContent text={projectForm.description_ar} />
                            </div>
                          ) : (
                            <AutoResizeTextarea
                              id="project-desc-textarea"
                              minRows={4}
                              required
                              value={projectForm.description_ar}
                              onChange={(e) => setProjectForm({ ...projectForm, description_ar: e.target.value })}
                              placeholder={isAr ? '• اذكر المواد المستخدمة والضمانات...\n• أضف المواصفات الفنية...\n✓ ضمان معتمد...' : 'Description with formatting...'}
                              className="w-full px-3 py-2.5 bg-white border border-t-0 border-[#DDD5C5] focus:border-[#9B7846] rounded-b-lg text-xs sm:text-sm text-[#15181F] focus:outline-none"
                            />
                          )}
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="proj-featured"
                            checked={projectForm.featured}
                            onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                            className="rounded text-[#9B7846] focus:ring-[#9B7846] w-4 h-4"
                          />
                          <label htmlFor="proj-featured" className="text-xs font-semibold text-[#15181F] cursor-pointer">
                            {isAr ? 'تمييز هذا المشروع (يظهر كعمل بارز مع علامة خاصة)' : 'Mark as Featured Project'}
                          </label>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="submit"
                            disabled={projectSaving}
                            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-lg transition-colors shadow-sm disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>{projectSaving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ العمل في قاعدة البيانات' : 'Save Project')}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Existing Projects List */}
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {projects.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#E8E2D5] hover:border-[#9B7846] transition-all shadow-xs"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <img
                              src={p.image_url}
                              alt={p.title_ar}
                              className="w-14 h-14 object-cover rounded-lg shrink-0 bg-[#F2EDE2]"
                              referrerPolicy="no-referrer"
                            />
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-[#15181F] truncate">{p.title_ar}</p>
                                {p.featured && (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                                    {isAr ? 'مميز' : 'Featured'}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-[#717786]">
                                {p.city} {p.district ? `(${p.district})` : ''} · {p.category}
                              </span>
                              <div className="text-[11px] text-[#5A6273] truncate max-w-xs mt-0.5">
                                {p.description_ar}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleOpenEditProject(p)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#8C6B3A] bg-[#F4EFE6] hover:bg-[#EAE3D5] rounded-lg transition-colors border border-[#DDD5C5]"
                              title={isAr ? 'تعديل كامل' : 'Edit'}
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>{isAr ? 'تعديل' : 'Edit'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                              title={isAr ? 'حذف' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: ADS & PROMOTIONS (Full Add, Edit, Delete)         */}
              {/* ======================================================== */}
              {activeTab === 'ads' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#15181F]">
                        {isAr ? 'إدارة العروض والإعلانات الموسمية' : 'Promotions & Seasonal Offers'}
                      </h4>
                      <p className="text-xs text-[#717786]">
                        {isAr ? 'تعديل العروض ونسب الخصم والمدن المستهدفة والتفعيل والإلغاء.' : 'Manage offers.'}
                      </p>
                    </div>

                    {!isAddingAd && !editingAd && (
                      <button
                        onClick={handleOpenAddAd}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-lg shadow-sm transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isAr ? 'إضافة إعلان / عرض جديد' : 'Publish New Offer'}</span>
                      </button>
                    )}
                  </div>

                  {/* AD ADD / EDIT FORM */}
                  {(isAddingAd || editingAd) && (
                    <div className="p-6 rounded-xl bg-white border-2 border-[#9B7846]/40 shadow-md space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
                        <h4 className="text-sm font-bold text-[#15181F] flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#9B7846]" />
                          <span>
                            {editingAd
                              ? (isAr ? `تعديل الإعلان: ${editingAd.title_ar}` : `Edit Ad: ${editingAd.title_ar}`)
                              : (isAr ? 'إضافة إعلان أو عرض موسمي جديد' : 'Publish Offer')}
                          </span>
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingAd(false);
                            setEditingAd(null);
                          }}
                          className="text-[#717786] hover:text-[#15181F] text-xs font-semibold px-2 py-1 bg-[#FAF7F2] rounded"
                        >
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>

                      {adMsg && (
                        <div className="p-3 text-xs text-[#8C6B3A] bg-[#F4EFE6] border border-[#DDD5C5] rounded-lg">
                          {adMsg}
                        </div>
                      )}

                      <form onSubmit={handleSaveAd} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'عنوان العرض *' : 'Offer Title *'}
                            </label>
                            <input
                              type="text"
                              required
                              value={adForm.title_ar}
                              onChange={(e) => setAdForm({ ...adForm, title_ar: e.target.value })}
                              placeholder={isAr ? 'مثال: خصم 20% على تمديدات الكهرباء للفلل بالرياض' : 'Offer title'}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'شارة العرض (Badge)' : 'Badge Label'}
                            </label>
                            <input
                              type="text"
                              value={adForm.badge_ar}
                              onChange={(e) => setAdForm({ ...adForm, badge_ar: e.target.value })}
                              placeholder={isAr ? 'مثال: باقة الموسم / عرض حصري' : 'e.g. Special Offer'}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'نسبة أو شارة الخصم' : 'Discount Tag'}
                            </label>
                            <input
                              type="text"
                              value={adForm.discount_label}
                              onChange={(e) => setAdForm({ ...adForm, discount_label: e.target.value })}
                              placeholder={isAr ? 'مثال: خصم 15% + إشراف مجاني' : '15% Off'}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'المدن المستهدفة' : 'Target Cities'}
                            </label>
                            <input
                              type="text"
                              value={adForm.target_cities}
                              onChange={(e) => setAdForm({ ...adForm, target_cities: e.target.value })}
                              placeholder="الرياض والخرج"
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'حالة الإعلان' : 'Status'}
                            </label>
                            <select
                              value={adForm.is_active ? 'true' : 'false'}
                              onChange={(e) => setAdForm({ ...adForm, is_active: e.target.value === 'true' })}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            >
                              <option value="true">{isAr ? 'نشط ويظهر بالموقع ✅' : 'Active'}</option>
                              <option value="false">{isAr ? 'معلق / غير نشط ⏸️' : 'Inactive'}</option>
                            </select>
                          </div>
                        </div>

                        {/* Optional Ad Image Banner with Device Upload */}
                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                            {isAr ? 'صورة العرض الترويجي (اختياري - رفع من الجهاز أو رابط)' : 'Offer Banner Image (Optional)'}
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#DDD5C5] rounded-lg text-xs font-semibold text-[#15181F] cursor-pointer transition-colors whitespace-nowrap shadow-xs">
                              <Upload className="w-4 h-4 text-[#9B7846]" />
                              <span>{adUploading ? (isAr ? 'جارٍ الرفع...' : 'Uploading...') : (isAr ? 'رفع من الجهاز' : 'Upload From Device')}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={adUploading}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setAdUploading(true);
                                  try {
                                    const url = await handleUploadFile(file);
                                    setAdForm({ ...adForm, image_url: url });
                                    setAdMsg(isAr ? 'تم رفع صورة العرض بنجاح!' : 'Uploaded successfully!');
                                  } catch (err: any) {
                                    setAdMsg(err.message);
                                  } finally {
                                    setAdUploading(false);
                                  }
                                }}
                              />
                            </label>

                            <input
                              type="text"
                              value={adForm.image_url || ''}
                              onChange={(e) => setAdForm({ ...adForm, image_url: e.target.value })}
                              placeholder={isAr ? 'أو أدخل رابط صورة العرض...' : 'Banner image URL...'}
                              className="flex-1 w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          {adForm.image_url && (
                            <div className="mt-2.5 flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-lg border border-[#DDD5C5]">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <img
                                  src={adForm.image_url}
                                  alt="Ad Preview"
                                  className="w-16 h-12 object-cover rounded bg-[#E8E2D5]"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="text-xs text-[#5A6273] truncate">{adForm.image_url}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setAdForm({ ...adForm, image_url: '' })}
                                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 hover:bg-rose-50 rounded transition-colors shrink-0"
                              >
                                {isAr ? 'حذف الصورة' : 'Remove'}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Description with Formatting Toolbar */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-[#15181F]">
                              {isAr ? 'تفاصيل وشروط العرض مع دعم التنسيق *' : 'Offer Details with Formatting *'}
                            </label>
                            <span className="text-[11px] text-[#8C6B3A]">
                              {isAr ? 'أضف نقاط العرض لتظهر منسقة' : 'Use formatting'}
                            </span>
                          </div>

                          <FormattingToolbar
                            textareaId="ad-desc-textarea"
                            value={adForm.description_ar}
                            onChange={(val) => setAdForm({ ...adForm, description_ar: val })}
                            showPreview={adShowPreview}
                            onTogglePreview={() => setAdShowPreview(!adShowPreview)}
                            lang={lang}
                          />

                          {adShowPreview ? (
                            <div className="p-4 bg-white border border-t-0 border-[#DDD5C5] rounded-b-lg min-h-[100px]">
                              <FormattedContent text={adForm.description_ar} />
                            </div>
                          ) : (
                            <AutoResizeTextarea
                              id="ad-desc-textarea"
                              minRows={3}
                              required
                              value={adForm.description_ar}
                              onChange={(e) => setAdForm({ ...adForm, description_ar: e.target.value })}
                              placeholder={isAr ? '• ميزات العرض والضمان...\n• الشروط والمدة...\n✓ معاينة مجانية...' : 'Offer details...'}
                              className="w-full px-3 py-2.5 bg-white border border-t-0 border-[#DDD5C5] focus:border-[#9B7846] rounded-b-lg text-xs sm:text-sm text-[#15181F] focus:outline-none"
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="submit"
                            disabled={adSaving}
                            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-lg transition-colors shadow-sm disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>{adSaving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ ونشر الإعلان' : 'Save Ad')}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Ads List */}
                  <div className="space-y-3">
                    {ads.map((ad) => (
                      <div
                        key={ad.id}
                        className="p-4 rounded-xl bg-white border border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white bg-[#9B7846] px-2.5 py-0.5 rounded-full">
                              {ad.badge_ar}
                            </span>
                            <span className="text-sm font-bold text-[#15181F]">{ad.title_ar}</span>
                            {ad.is_active === false && (
                              <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {isAr ? 'متوقف' : 'Inactive'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#5A6273]">{ad.target_cities} · {ad.discount_label}</div>
                          <div className="text-xs text-[#4E5667] pt-1">
                            <FormattedContent text={ad.description_ar} clampLines={2} />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenEditAd(ad)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#8C6B3A] bg-[#F4EFE6] hover:bg-[#EAE3D5] rounded-lg transition-colors border border-[#DDD5C5]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تعديل' : 'Edit'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                            title={isAr ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: SERVICES & DIVISIONS (Full Edit for Every Service) */}
              {/* ======================================================== */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#15181F]">
                        {isAr ? 'إدارة الأقسام والخدمات المتكاملة (6 أنشطة)' : 'Core Services & Divisions'}
                      </h4>
                      <p className="text-xs text-[#717786]">
                        {isAr ? 'تعديل كامل لعناوين الخدمات، الوصف، الصور، المواصفات والأسئلة الشائعة.' : 'Edit service content.'}
                      </p>
                    </div>

                    <button
                      onClick={handleResetServices}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#7A5B2E] bg-white border border-[#DDD5C5] hover:bg-[#FAF7F2] rounded-lg transition-colors shadow-2xs"
                      title={isAr ? 'استعادة النصوص الافتراضية الأصلية' : 'Reset defaults'}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'استعادة القوالب الافتراضية' : 'Reset Defaults'}</span>
                    </button>
                  </div>

                  {/* EDIT SERVICE FORM */}
                  {editingService && (
                    <div className="p-6 rounded-xl bg-white border-2 border-[#9B7846]/40 shadow-md space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
                        <h4 className="text-sm font-bold text-[#15181F] flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#9B7846]" />
                          <span>
                            {isAr ? `تعديل قسم: ${editingService.title_ar}` : `Edit Division: ${editingService.title_ar}`}
                          </span>
                        </h4>
                        <button
                          onClick={() => setEditingService(null)}
                          className="text-[#717786] hover:text-[#15181F] text-xs font-semibold px-2 py-1 bg-[#FAF7F2] rounded"
                        >
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>

                      {serviceMsg && (
                        <div className="p-3 text-xs text-[#8C6B3A] bg-[#F4EFE6] border border-[#DDD5C5] rounded-lg">
                          {serviceMsg}
                        </div>
                      )}

                      <form onSubmit={handleSaveService} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'عنوان الخدمة (عربي) *' : 'Service Title (Arabic) *'}
                            </label>
                            <input
                              type="text"
                              required
                              value={serviceForm.title_ar || ''}
                              onChange={(e) => setServiceForm({ ...serviceForm, title_ar: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#15181F] mb-1">
                              {isAr ? 'العنوان بالإنجليزية' : 'English Title'}
                            </label>
                            <input
                              type="text"
                              value={serviceForm.title_en || ''}
                              onChange={(e) => setServiceForm({ ...serviceForm, title_en: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Hero Image */}
                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                            {isAr ? 'صورة الغلاف للقسم (Cloudflare R2 أو رابط)' : 'Hero Banner Image'}
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#DDD5C5] rounded-lg text-xs font-semibold text-[#15181F] cursor-pointer transition-colors whitespace-nowrap shadow-xs">
                              <Upload className="w-4 h-4 text-[#9B7846]" />
                              <span>{serviceUploading ? (isAr ? 'جارٍ الرفع...' : 'Uploading...') : (isAr ? 'رفع صورة جديدة' : 'Upload Image')}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={serviceUploading}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setServiceUploading(true);
                                  try {
                                    const url = await handleUploadFile(file);
                                    setServiceForm({ ...serviceForm, hero_image: url });
                                  } catch (err: any) {
                                    setServiceMsg(err.message);
                                  } finally {
                                    setServiceUploading(false);
                                  }
                                }}
                              />
                            </label>

                            <input
                              type="text"
                              value={serviceForm.hero_image || ''}
                              onChange={(e) => setServiceForm({ ...serviceForm, hero_image: e.target.value })}
                              className="flex-1 w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                            />
                          </div>

                          {serviceForm.hero_image && (
                            <div className="mt-2.5 flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-lg border border-[#DDD5C5]">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <img
                                  src={serviceForm.hero_image}
                                  alt="Preview"
                                  className="w-20 h-12 object-cover rounded bg-[#E8E2D5]"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="text-xs text-[#5A6273] truncate">{serviceForm.hero_image}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setServiceForm({ ...serviceForm, hero_image: '' })}
                                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 hover:bg-rose-50 rounded transition-colors shrink-0"
                              >
                                {isAr ? 'حذف الصورة' : 'Remove'}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Short Description with Formatting Toolbar */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-[#15181F]">
                              {isAr ? 'الوصف التقديمي للقسم مع دعم التنسيق *' : 'Overview with Formatting *'}
                            </label>
                            <span className="text-[11px] text-[#8C6B3A]">
                              {isAr ? 'يظهر ببطاقة القسم وبصفحة التفاصيل' : 'Overview'}
                            </span>
                          </div>

                          <FormattingToolbar
                            textareaId="service-desc-textarea"
                            value={serviceForm.short_desc_ar || ''}
                            onChange={(val) => setServiceForm({ ...serviceForm, short_desc_ar: val })}
                            showPreview={serviceShowPreview}
                            onTogglePreview={() => setServiceShowPreview(!serviceShowPreview)}
                            lang={lang}
                          />

                          {serviceShowPreview ? (
                            <div className="p-4 bg-white border border-t-0 border-[#DDD5C5] rounded-b-lg min-h-[100px]">
                              <FormattedContent text={serviceForm.short_desc_ar || ''} />
                            </div>
                          ) : (
                            <AutoResizeTextarea
                              id="service-desc-textarea"
                              minRows={3}
                              required
                              value={serviceForm.short_desc_ar || ''}
                              onChange={(e) => setServiceForm({ ...serviceForm, short_desc_ar: e.target.value })}
                              placeholder={isAr ? 'اكتب نبذة تعريفية شاملة عن هذا القسم...' : 'Service overview...'}
                              className="w-full px-3 py-2.5 bg-white border border-t-0 border-[#DDD5C5] focus:border-[#9B7846] rounded-b-lg text-xs sm:text-sm text-[#15181F] focus:outline-none"
                            />
                          )}
                        </div>

                        {/* Features List Manager */}
                        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D5] space-y-3">
                          <label className="block text-xs font-bold text-[#15181F]">
                            {isAr ? 'قائمة المميزات والمواصفات الفنية للخدمة:' : 'Execution Features:'}
                          </label>

                          <div className="space-y-2">
                            {(serviceForm.features_ar || []).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#9B7846] shrink-0" />
                                <input
                                  type="text"
                                  value={feat}
                                  onChange={(e) => {
                                    const updated = [...(serviceForm.features_ar || [])];
                                    updated[fIdx] = e.target.value;
                                    setServiceForm({ ...serviceForm, features_ar: updated });
                                  }}
                                  className="flex-1 px-3 py-1.5 bg-white border border-[#DDD5C5] rounded-lg text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (serviceForm.features_ar || []).filter((_, idx) => idx !== fIdx);
                                    setServiceForm({ ...serviceForm, features_ar: updated });
                                  }}
                                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                                  title={isAr ? 'حذف هذه النقطة' : 'Remove'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={newFeatureInput}
                              onChange={(e) => setNewFeatureInput(e.target.value)}
                              placeholder={isAr ? 'أضف ميزة أو مواصفة جديدة...' : 'Add feature item...'}
                              className="flex-1 px-3 py-1.5 bg-white border border-[#DDD5C5] rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newFeatureInput.trim()) return;
                                setServiceForm({
                                  ...serviceForm,
                                  features_ar: [...(serviceForm.features_ar || []), newFeatureInput.trim()],
                                });
                                setNewFeatureInput('');
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#9B7846] text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isAr ? 'إضافة' : 'Add'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="submit"
                            disabled={serviceSaving}
                            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-lg transition-colors shadow-sm disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>{serviceSaving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ تعديلات القسم' : 'Save Service')}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Services Cards List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((s, idx) => (
                      <div
                        key={s.id}
                        className="bg-white border border-[#E8E2D5] hover:border-[#9B7846] rounded-xl p-4 flex flex-col justify-between shadow-xs transition-all"
                      >
                        <div>
                          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3 bg-[#F2EDE2]">
                            <img
                              src={s.hero_image}
                              alt={s.title_ar}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute top-2 start-2 text-[10px] font-mono bg-white/90 text-[#8C6B3A] font-bold px-2 py-0.5 rounded">
                              0{idx + 1}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#15181F] mb-1">{s.title_ar}</h4>
                          <p className="text-xs text-[#5A6273] line-clamp-2 leading-relaxed mb-3">
                            {s.short_desc_ar}
                          </p>
                          <div className="text-[11px] text-[#8C6B3A] font-medium">
                            {s.features_ar?.length || 0} {isAr ? 'مواصفة وميزة معتمدة' : 'features'}
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-[#F2EDE2] flex items-center justify-between">
                          <span className="text-[11px] text-[#717786]">الرياض والخرج</span>
                          <button
                            onClick={() => handleOpenEditService(s)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#8C6B3A] bg-[#F4EFE6] hover:bg-[#EAE3D5] rounded-lg border border-[#DDD5C5] transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تعديل كامل' : 'Edit'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 5: SITE SETTINGS & HERO CONTROLS                     */}
              {/* ======================================================== */}
              {activeTab === 'settings' && (
                <div className="p-6 rounded-xl bg-white border border-[#E8E2D5] shadow-xs space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-[#15181F]">
                      {isAr ? 'إعدادات الموقع العامة والواجهة الرئيسية (Hero & About)' : 'Site & Hero Content Settings'}
                    </h4>
                    <p className="text-xs text-[#717786]">
                      {isAr ? 'تحكم كامل بنصوص الواجهة، أرقام التواصل، عدادات الإنجاز ونبذة المؤسسة.' : 'Full website text controls.'}
                    </p>
                  </div>

                  {settingsMsg && (
                    <div className="p-3 text-xs text-[#8C6B3A] bg-[#F4EFE6] border border-[#DDD5C5] rounded-lg">
                      {settingsMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    {/* General Company Identifiers */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-[#8C6B3A] uppercase tracking-wider">
                        {isAr ? '1. بيانات وهوية المؤسسة' : '1. Establishment Identity'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'اسم المؤسسة (عربي)' : 'Company Name (Arabic)'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.company_name_ar}
                            onChange={(e) => setSettingsForm({ ...settingsForm, company_name_ar: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'شعار المؤسسة (Motto)' : 'Company Slogan'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.motto_ar}
                            onChange={(e) => setSettingsForm({ ...settingsForm, motto_ar: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Section Texts */}
                    <div className="space-y-4 pt-4 border-t border-[#E8E2D5]">
                      <h5 className="text-xs font-bold text-[#8C6B3A] uppercase tracking-wider">
                        {isAr ? '2. نصوص الواجهة الترحيبية (Hero Section)' : '2. Hero Section Content'}
                      </h5>
                      <div>
                        <label className="block text-xs font-semibold text-[#15181F] mb-1">
                          {isAr ? 'العنوان الرئيسي لواجهة الموقع (Hero Headline)' : 'Hero Main Headline'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.hero_title_ar}
                          onChange={(e) => setSettingsForm({ ...settingsForm, hero_title_ar: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-[#15181F]">
                            {isAr ? 'الوصف الترحيبي بالواجهة (Hero Subtitle) مع دعم التنسيق' : 'Hero Subtitle with Formatting'}
                          </label>
                        </div>
                        <FormattingToolbar
                          textareaId="hero-subtitle-textarea"
                          value={settingsForm.hero_subtitle_ar}
                          onChange={(val) => setSettingsForm({ ...settingsForm, hero_subtitle_ar: val })}
                          showPreview={settingsShowPreview}
                          onTogglePreview={() => setSettingsShowPreview(!settingsShowPreview)}
                          lang={lang}
                        />
                        {settingsShowPreview ? (
                          <div className="p-4 bg-white border border-t-0 border-[#DDD5C5] rounded-b-lg min-h-[100px]">
                            <FormattedContent text={settingsForm.hero_subtitle_ar} />
                          </div>
                        ) : (
                          <AutoResizeTextarea
                            id="hero-subtitle-textarea"
                            minRows={4}
                            value={settingsForm.hero_subtitle_ar}
                            onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle_ar: e.target.value })}
                            placeholder={isAr ? 'اكتب الوصف الترحيبي للواجهة مع دعم التنسيق والنقاط...' : 'Hero subtitle...'}
                            className="w-full px-3 py-2.5 bg-white border border-t-0 border-[#DDD5C5] focus:border-[#9B7846] rounded-b-lg text-xs sm:text-sm text-[#15181F] focus:outline-none"
                          />
                        )}
                      </div>

                      {/* Hero Cover Image Background */}
                      <div>
                        <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                          {isAr ? 'صورة غلاف واجهة الموقع (Hero Cover Image)' : 'Hero Cover Background Image'}
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE3D5] border border-[#DDD5C5] rounded-lg text-xs font-semibold text-[#15181F] cursor-pointer transition-colors whitespace-nowrap shadow-xs">
                            <Upload className="w-4 h-4 text-[#9B7846]" />
                            <span>{heroBgUploading ? (isAr ? 'جارٍ الرفع...' : 'Uploading...') : (isAr ? 'رفع من الجهاز' : 'Upload From Device')}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={heroBgUploading}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setHeroBgUploading(true);
                                try {
                                  const url = await handleUploadFile(file);
                                  setSettingsForm({ ...settingsForm, hero_bg_image: url });
                                  setSettingsMsg(isAr ? 'تم رفع صورة الغلاف بنجاح!' : 'Hero cover image uploaded successfully!');
                                } catch (err: any) {
                                  setSettingsMsg(err.message);
                                } finally {
                                  setHeroBgUploading(false);
                                }
                              }}
                            />
                          </label>

                          <input
                            type="text"
                            value={settingsForm.hero_bg_image || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, hero_bg_image: e.target.value })}
                            placeholder={isAr ? 'أو أدخل رابط صورة الغلاف مباشرة...' : 'Cover image URL...'}
                            className="flex-1 w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none"
                          />
                        </div>

                        {settingsForm.hero_bg_image && (
                          <div className="mt-2.5 flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-lg border border-[#DDD5C5]">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <img
                                src={settingsForm.hero_bg_image}
                                alt="Hero Cover Preview"
                                className="w-20 h-12 object-cover rounded bg-[#E8E2D5]"
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-xs text-[#5A6273] truncate">{settingsForm.hero_bg_image}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSettingsForm({ ...settingsForm, hero_bg_image: '' })}
                              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 hover:bg-rose-50 rounded transition-colors shrink-0"
                            >
                              {isAr ? 'استعادة الافتراضي' : 'Reset'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Statistics Counters */}
                    <div className="space-y-4 pt-4 border-t border-[#E8E2D5]">
                      <h5 className="text-xs font-bold text-[#8C6B3A] uppercase tracking-wider">
                        {isAr ? '3. عدادات الأرقام والإنجاز (Statistics)' : '3. Numerical Achievements'}
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'سنوات الخبرة' : 'Years Experience'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.stat_years_exp}
                            onChange={(e) => setSettingsForm({ ...settingsForm, stat_years_exp: e.target.value })}
                            placeholder="15+"
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-center font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'المشاريع المنفذة' : 'Completed Projects'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.stat_projects_done}
                            onChange={(e) => setSettingsForm({ ...settingsForm, stat_projects_done: e.target.value })}
                            placeholder="450+"
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-center font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'رضا العملاء' : 'Client Satisfaction'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.stat_happy_clients}
                            onChange={(e) => setSettingsForm({ ...settingsForm, stat_happy_clients: e.target.value })}
                            placeholder="100%"
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-center font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'مدة الضمان' : 'Warranty Period'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.stat_warranty_years}
                            onChange={(e) => setSettingsForm({ ...settingsForm, stat_warranty_years: e.target.value })}
                            placeholder="10 سنوات"
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-center font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact & Addresses */}
                    <div className="space-y-4 pt-4 border-t border-[#E8E2D5]">
                      <h5 className="text-xs font-bold text-[#8C6B3A] uppercase tracking-wider">
                        {isAr ? '4. أرقام الاتصال المباشر والفروع' : '4. Contact Numbers & Branches'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'رقم الاتصال المباشر' : 'Phone'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.phone_primary}
                            onChange={(e) => setSettingsForm({ ...settingsForm, phone_primary: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'رقم الواتساب (مع كود 966)' : 'WhatsApp (with 966)'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.whatsapp_number}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'البريد الإلكتروني' : 'Email'}
                          </label>
                          <input
                            type="email"
                            value={settingsForm.email}
                            onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'عنوان فرع الرياض' : 'Riyadh Branch Address'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.riyadh_address_ar}
                            onChange={(e) => setSettingsForm({ ...settingsForm, riyadh_address_ar: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#15181F] mb-1">
                            {isAr ? 'عنوان فرع الخرج' : 'Al-Kharj Branch Address'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.alkharj_address_ar}
                            onChange={(e) => setSettingsForm({ ...settingsForm, alkharj_address_ar: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#15181F] mb-1">
                          {isAr ? 'أوقات الدوام وخدمة الطوارئ' : 'Working Hours'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.working_hours_ar}
                          onChange={(e) => setSettingsForm({ ...settingsForm, working_hours_ar: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* About Us Summary */}
                    <div className="space-y-4 pt-4 border-t border-[#E8E2D5]">
                      <h5 className="text-xs font-bold text-[#8C6B3A] uppercase tracking-wider">
                        {isAr ? '5. نبذة عن المؤسسة (About Summary)' : '5. About Company'}
                      </h5>
                      <AutoResizeTextarea
                        id="settings-about-textarea"
                        minRows={4}
                        value={settingsForm.about_summary_ar}
                        onChange={(e) => setSettingsForm({ ...settingsForm, about_summary_ar: e.target.value })}
                        placeholder={isAr ? 'اكتب نبذة شاملة عن تاريخ المؤسسة وخبراتها ومجالات عملها...' : 'About company...'}
                        className="w-full px-3 py-2.5 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs sm:text-sm text-[#15181F] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={settingsSaving}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                      {settingsSaving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ وتطبيق التغييرات على الموقع' : 'Save All Settings')}
                    </button>
                  </form>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 6: SECURITY & PASSWORD CHANGE                        */}
              {/* ======================================================== */}
              {activeTab === 'security' && (
                <div className="p-6 rounded-xl bg-white border border-[#E8E2D5] shadow-xs max-w-lg space-y-4">
                  <h4 className="text-sm font-bold text-[#15181F] mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#9B7846]" />
                    <span>{isAr ? 'تغيير كلمة مرور لوحة التحكم' : 'Change Master Password'}</span>
                  </h4>
                  <p className="text-xs text-[#5A6273]">
                    {isAr
                      ? 'يمكنك تغيير كلمة المرور في أي وقت لحماية لوحة التحكم. يتم حفظ الكلمة مباشرة في قاعدة بيانات PostgreSQL.'
                      : 'Update the master key used to unlock this administrative dashboard.'}
                  </p>

                  {pwdMsg && (
                    <div className="p-3 text-xs text-[#8C6B3A] bg-[#F4EFE6] border border-[#DDD5C5] rounded-lg">
                      {pwdMsg}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#15181F] mb-1">
                        {isAr ? 'كلمة المرور الحالية *' : 'Current Password *'}
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#15181F] mb-1">
                        {isAr ? 'كلمة المرور الجديدة *' : 'New Password *'}
                      </label>
                      <input
                        type="password"
                        required
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#15181F] mb-1">
                        {isAr ? 'تأكيد كلمة المرور الجديدة *' : 'Confirm New Password *'}
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-lg text-xs text-[#15181F] focus:outline-none shadow-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={pwdLoading}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                      {pwdLoading ? (isAr ? 'جارٍ التحديث...' : 'Updating...') : (isAr ? 'حفظ كلمة المرور الجديدة' : 'Update Password')}
                    </button>
                  </form>

                  {/* Secret URL Reference Card */}
                  <div className="mt-6 pt-5 border-t border-[#E8E2D5] space-y-3">
                    <h5 className="text-xs font-bold text-[#15181F] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#9B7846]" />
                      <span>{isAr ? 'طرق الدخول السريع للوحة التحكم:' : 'Quick Access Routes:'}</span>
                    </h5>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#DDD5C5] text-[#15181F] flex items-center justify-between">
                        <span>/admin</span>
                        <span className="text-[10px] text-[#8C6B3A] font-sans font-semibold">{isAr ? 'رابط مباشر' : 'Direct URL'}</span>
                      </div>
                      <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#DDD5C5] text-[#15181F] flex items-center justify-between">
                        <span>/#admin</span>
                        <span className="text-[10px] text-[#8C6B3A] font-sans font-semibold">{isAr ? 'رابط فوري' : 'Hash'}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#8C6B3A]">
                      {isAr ? 'اختصار لوحة المفاتيح: Ctrl + Shift + A' : 'Keyboard Shortcut: Ctrl + Shift + A'}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
