export type ServiceCategoryId =
  | 'electrical'
  | 'glass_securit'
  | 'aluminum'
  | 'blacksmith_steel'
  | 'general_contracting'
  | 'renovation'
  | string;

export interface ServiceItem {
  id: ServiceCategoryId;
  slug: string;
  title_ar: string;
  title_en: string;
  short_desc_ar: string;
  short_desc_en: string;
  hero_image: string;
  icon_name: string;
  features_ar: string[];
  features_en: string[];
  scope_ar: string[];
  scope_en: string[];
  seo_keywords: string[];
  faqs: {
    q_ar: string;
    q_en: string;
    a_ar: string;
    a_en: string;
  }[];
  riyadh_districts: string[];
  alkharj_districts: string[];
  sort_order?: number;
}

export interface Project {
  id: number;
  title_ar: string;
  title_en?: string;
  category: ServiceCategoryId;
  description_ar: string;
  description_en?: string;
  city: string;
  district?: string;
  image_url: string;
  before_image_url?: string;
  completion_year?: string;
  client_type?: string;
  featured?: boolean;
  created_at?: string;
}

export interface Advertisement {
  id: number;
  title_ar: string;
  title_en?: string;
  badge_ar?: string;
  badge_en?: string;
  description_ar: string;
  description_en?: string;
  discount_label?: string;
  service_category?: string;
  target_cities?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface QuoteRequest {
  id: number;
  customer_name: string;
  phone: string;
  service_type: string;
  city: string;
  district?: string;
  details?: string;
  preferred_time?: string;
  status: 'new' | 'in_progress' | 'quoted' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
}

export interface SiteSettings {
  id?: number;
  company_name_ar: string;
  company_name_en: string;
  motto_ar?: string;
  phone_primary: string;
  whatsapp_number: string;
  email: string;
  riyadh_address_ar: string;
  alkharj_address_ar: string;
  about_summary_ar: string;
  hero_title_ar?: string;
  hero_subtitle_ar?: string;
  stat_years_exp?: string;
  stat_projects_done?: string;
  stat_happy_clients?: string;
  stat_warranty_years?: string;
  working_hours_ar?: string;
  hero_bg_image?: string;
  admin_password?: string;
  updated_at?: string;
}
