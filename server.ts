import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SERVICES_DATA } from './src/data/content.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Cloudflare R2 Client Setup - Loaded strictly from .env
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID?.trim() || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID?.trim() || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY?.trim() || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME?.trim() || '';
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL?.trim() || '').replace(/\/$/, '');

const isR2Configured = Boolean(
  R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME
);

const r2Client = isR2Configured
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

if (!isR2Configured) {
  console.warn('⚠️ Cloudflare R2 environment variables not provided. File uploads will fallback to local base64.');
}

// Configure Multer for in-memory file handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Neon PostgreSQL Connection - Loaded strictly from .env
const DATABASE_URL = process.env.DATABASE_URL?.trim();
if (!DATABASE_URL) {
  console.error('❌ FATAL: DATABASE_URL is missing in .env! Please define DATABASE_URL in your .env file.');
  process.exit(1);
}

const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD?.trim() || '';

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
});

// Prevent unhandled error crashes from idle connection resets by Neon serverless
pool.on('error', (err) => {
  console.warn('⚠️ PostgreSQL pool idle connection reset (recovered automatically):', err.message);
});

// Initialize Database Tables and Default Seeds
async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL Neon DB successfully');

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        description_ar TEXT NOT NULL,
        description_en TEXT,
        city VARCHAR(100) NOT NULL DEFAULT 'الرياض',
        district VARCHAR(150),
        image_url TEXT NOT NULL,
        before_image_url TEXT,
        completion_year VARCHAR(20) DEFAULT '2024',
        client_type VARCHAR(100) DEFAULT 'فيلا خاصة',
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create advertisements / promotions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS advertisements (
        id SERIAL PRIMARY KEY,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        badge_ar VARCHAR(100) DEFAULT 'عرض خاص',
        badge_en VARCHAR(100) DEFAULT 'Exclusive Offer',
        description_ar TEXT NOT NULL,
        description_en TEXT,
        discount_label VARCHAR(100),
        service_category VARCHAR(100) DEFAULT 'all',
        target_cities VARCHAR(100) DEFAULT 'الرياض والخرج',
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create quote requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quote_requests (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        service_type VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        district VARCHAR(150),
        details TEXT,
        preferred_time VARCHAR(100),
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create site settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        company_name_ar VARCHAR(255) DEFAULT 'مؤسسة ريم النفوذ للمقاولات والخدمات المتكاملة',
        company_name_en VARCHAR(255) DEFAULT 'Reem Al-Nufood Contracting & Integrated Services',
        phone_primary VARCHAR(50) DEFAULT '0552345678',
        whatsapp_number VARCHAR(50) DEFAULT '966552345678',
        email VARCHAR(100) DEFAULT 'info@reem-alnufood.com',
        riyadh_address_ar VARCHAR(255) DEFAULT 'الرياض - طريق الملك فهد - حي العقيق',
        alkharj_address_ar VARCHAR(255) DEFAULT 'الخرج - طريق الملك عبدالعزيز - حي السلام',
        about_summary_ar TEXT DEFAULT 'خبرة في التنفيذ، جودة في العمل، وثقة تدوم. نقدم خدمات متكاملة في مجال المقاولات العامة والأعمال الكهربائية والسكوريت والألمنيوم والترميم والتشطيبات بالرياض والخرج.',
        admin_password VARCHAR(100),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Migrate new settings columns if not present
    await client.query(`
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS admin_password VARCHAR(100);
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS motto_ar VARCHAR(255) DEFAULT 'خبرة في التنفيذ، جودة في العمل، وثقة تدوم.';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_title_ar TEXT DEFAULT 'خبرة في التنفيذ، جودة في العمل، وثقة تدوم.';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_subtitle_ar TEXT DEFAULT 'نقدم حلولاً متكاملة في المقاولات العامة، الأعمال الكهربائية، زجاج السيكوريت، الألمنيوم، الحدادة والترميم الإنشائي بأعلى معايير كود البناء السعودي مع الالتزام التام بالمواعيد.';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat_years_exp VARCHAR(50) DEFAULT '15+';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat_projects_done VARCHAR(50) DEFAULT '450+';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat_happy_clients VARCHAR(50) DEFAULT '100%';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat_warranty_years VARCHAR(50) DEFAULT '10 سنوات';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS working_hours_ar VARCHAR(255) DEFAULT 'السبت - الخميس: 8:00 صباحاً - 10:00 مساءً | خدمة طوارئ 24/7';
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_bg_image TEXT DEFAULT '/src/assets/images/hero_luxury_villa_1794075925416.jpg';
    `);

    // Create services table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(100) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        short_desc_ar TEXT NOT NULL,
        short_desc_en TEXT,
        hero_image TEXT,
        icon_name VARCHAR(100) DEFAULT 'Building2',
        features_ar JSONB DEFAULT '[]'::jsonb,
        features_en JSONB DEFAULT '[]'::jsonb,
        scope_ar JSONB DEFAULT '[]'::jsonb,
        scope_en JSONB DEFAULT '[]'::jsonb,
        seo_keywords JSONB DEFAULT '[]'::jsonb,
        faqs JSONB DEFAULT '[]'::jsonb,
        riyadh_districts JSONB DEFAULT '[]'::jsonb,
        alkharj_districts JSONB DEFAULT '[]'::jsonb,
        sort_order INT DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Check if site settings row exists
    const settingsCheck = await client.query('SELECT COUNT(*) FROM site_settings');
    if (parseInt(settingsCheck.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO site_settings (
          company_name_ar, company_name_en, phone_primary, whatsapp_number, email,
          riyadh_address_ar, alkharj_address_ar, about_summary_ar, motto_ar,
          hero_title_ar, hero_subtitle_ar, stat_years_exp, stat_projects_done,
          stat_happy_clients, stat_warranty_years, working_hours_ar, admin_password
        ) VALUES (
          'مؤسسة ريم النفوذ للمقاولات والخدمات المتكاملة',
          'Reem Al-Nufood Contracting & Integrated Services',
          '0552345678', '966552345678', 'info@reem-alnufood.com',
          'الرياض - طريق الملك فهد - حي العقيق',
          'الخرج - طريق الملك عبدالعزيز - حي السلام',
          'خبرة في التنفيذ، جودة في العمل، وثقة تدوم. نقدم خدمات متكاملة في مجال المقاولات العامة والأعمال الكهربائية والسكوريت والألمنيوم والترميم والتشطيبات بالرياض والخرج.',
          'خبرة في التنفيذ، جودة في العمل، وثقة تدوم.',
          'خبرة في التنفيذ، جودة في العمل، وثقة تدوم.',
          'نقدم حلولاً متكاملة في المقاولات العامة، الأعمال الكهربائية، زجاج السيكوريت، الألمنيوم، الحدادة والترميم الإنشائي بأعلى معايير كود البناء السعودي مع الالتزام التام بالمواعيد.',
          '15+', '450+', '100%', '10 سنوات',
          'السبت - الخميس: 8:00 صباحاً - 10:00 مساءً | خدمة طوارئ 24/7',
          $1
        );
      `, [ADMIN_DEFAULT_PASSWORD]);
    }

    // Seed sample showcase projects if empty
    const countCheck = await client.query('SELECT COUNT(*) FROM projects');
    if (parseInt(countCheck.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial luxury projects for Reem Al-Nufood...');
      await client.query(`
        INSERT INTO projects (title_ar, title_en, category, description_ar, description_en, city, district, image_url, client_type, featured)
        VALUES
        (
          'تأسيس شبكة إنارة ذكية وتوزيع أحمال لفيلا مودرن',
          'Smart Architectural Lighting & Load Balancing for Modern Villa',
          'electrical',
          '• تنفيذ كامل لأعمال التأسيس والتمديدات الكهربائية وفق كود البناء السعودي.\n• تركيب لوحات قواطع شنايدر الأصلية وتوزيع الأحمال المتوازنة.\n• إضاءات ليد بروفايل مخفية وأفياش ذكية متوافقة مع أنظمة المنازل الذكية.\n✓ ضمان 10 سنوات على الكابلات والتمديدات.',
          'Full electrical infrastructure, smart distribution boards, recessed LED cove lighting and home automation in Riyadh.',
          'الرياض',
          'حي حطين',
          '/src/assets/images/service_electrical_panel_1794075926208.jpg',
          'فيلا سكنية فاخرة',
          true
        ),
        (
          'واجهات زجاج سيكوريت عازل ودرابزين ستانلس ستيل',
          'Tempered Securit Glass Facades & Frameless Railings',
          'glass_securit',
          '• تفصيل وتركيب زجاج سيكوريت 12 ملم معالج حرارياً عازل للصوت والحرارة.\n• واجهات محلات تجارية وقواطع مكاتب فاخرة وإكسسوارات إيطالية ستانلس 304.\n✓ صيانة دورية ومقاومة عالية للعوامل الجوية.',
          '12mm thermally tempered acoustic and heat-insulated glass facades and luxury frameless office partitions.',
          'الرياض',
          'حي العليا',
          '/src/assets/images/service_securit_glass_1794075927280.jpg',
          'مقر إداري وتجاري',
          true
        ),
        (
          'أبواب وشبابيك ألمنيوم سرايا دبل جلاس وواجهات كلادينج',
          'Double Glazed Aluminum Sliding Systems & Cladding',
          'aluminum',
          '• تصنيع وتركيب شبابيك وأبواب ألمنيوم قطاع سرايا عازل دبل جلاس مانع لتسرب الغبار والأمطار.\n• تشطيب برونزي بودرة إلكتروستاتيك مع زجاج مثلج أو عاكس.\n✓ ضمان 20 سنة على ثبات لون الكلادينج.',
          'High thermal-break acoustic aluminum sliding doors and champagne bronze facade cladding.',
          'الخرج',
          'حي السلام',
          '/src/assets/images/service_aluminum_cladding_1794075926506.jpg',
          'فيلا خاصة',
          true
        ),
        (
          'بوابات حديد ليزر مشغول ومظلات سيارات لكسان',
          'Laser-Cut Wrought Iron Gates & Modern Canopies',
          'blacksmith_steel',
          '• تفصيل بوابات حديد قص ليزر بتصاميم هندسية عصرية وإسلامية.\n• دهانات حرارية بودرة مقاومة للصدأ والرطوبة.\n• سواتر ومظلات سيارات لكسان بتغطية متكاملة وقوة تحمل عالية.',
          'Custom laser-cut geometric architectural gates with powder-coated anti-rust finish in Riyadh.',
          'الرياض',
          'حي الملقا',
          '/src/assets/images/service_wrought_iron_gate_1794075927418.jpg',
          'قصر سكني',
          true
        ),
        (
          'تنفيذ وبناء ملحق خارجي VIP مع التشطيب والتكييف',
          'Construction & Luxury Turnkey Majlis Annex',
          'renovation',
          '• بناء ملحق ومجلس ضيافة متكامل عظم وتشطيب تسليم مفتاح.\n• تمديدات سباكة وكهرباء متكاملة، عزل فوم مائي وحراري معتمد.\n• ديكورات بديل خشب ورخام وأسقف جبس بورد مضيئة.',
          'Turnkey construction of modern VIP annex with thermal insulation and luxury interior woodwork.',
          'الخرج',
          'حي الخزامى',
          '/src/assets/images/hero_luxury_villa_1794075925416.jpg',
          'ملحق استراحة راقية',
          true
        ),
        (
          'تشطيبات عامة ودهانات جوتن وتكسيات جدارية',
          'General Contracting & Modern Interior Finishes',
          'general_contracting',
          '• إدارة وتشطيب مبنى متعدد الأدوار: دهانات ديكورية ناعمة، أسقف جبس بورد معلقة.\n• أرضيات بورسلان إسباني فاخر ومعالجة احترافية للرطوبة والتشققات.\n✓ إشراف هندسي مستمر حتى التسليم.',
          'Comprehensive turnkey interior and exterior finishing with premium paints and porcelain tiling.',
          'الرياض',
          'حي الياسمين',
          '/src/assets/images/hero_luxury_villa_1794075925416.jpg',
          'مجمع سكني',
          true
        );
      `);
    }

    // Seed default advertisements if empty
    const adsCheck = await client.query('SELECT COUNT(*) FROM advertisements');
    if (parseInt(adsCheck.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO advertisements (title_ar, title_en, badge_ar, description_ar, discount_label, service_category, target_cities, is_active)
        VALUES
        (
          'عرض خاص لمشاريع الرياض والخرج: خصم 15% على التأسيس الكهربائي المتكامل',
          'Riyadh & Al-Kharj Special: 15% Off Electrical Installations',
          'عرض التأسيس',
          '• احصل على خصم فوري مع ضمان 10 سنوات على تمديدات الكابلات وقواطع التوزيع.\n• إشراف مهندسين وفنيين معتمدين وفق كود البناء السعودي.\n✓ المعاينة والتسعير الأولي مجاناً.',
          'خصم 15% لفترة محدودة',
          'electrical',
          'الرياض والخرج',
          true
        ),
        (
          'عروض الزجاج والسيكوريت: تركيب واجهات المحلات والشورات مع التوصيل المجاني بالخرج',
          'Glass & Securit Promotion: Free Delivery & Extended Warranty in Al-Kharj',
          'عرض الزجاج',
          '• تفصيل فوري لزجاج السيكوريت 10 و 12 ملم بأسعار الجملة للفلل والمحلات التجارية.\n• إكسسوارات إيطالية ستانلس ستيل 304 مقاومة للرطوبة.\n✓ ضمان 5 سنوات على الإكسسوارات والماكينات.',
          'ضمان 5 سنوات على الإكسسوارات',
          'glass_securit',
          'الخرج',
          true
        ),
        (
          'باقة بناء الملاحق والمجالس تسليم مفتاح مع العزل المعتمد',
          'VIP Majlis Annex Turnkey Package with Thermal Insulation',
          'باقة الملاحق',
          '• تصميم وتنفيذ مجالس ضيافة حديثة تشمل الأساسات، العظم، الكهرباء، والدهانات.\n• عزل حراري ومائي بالفوم المعتمد من شركة الكهرباء.\n✓ أسعار تنافسية وجدول زمني محدد في العقد.',
          'عرض شامل المواد والتنفيذ',
          'renovation',
          'الرياض والخرج',
          true
        );
      `);
    }

    // Seed services if empty
    const sCheck = await client.query('SELECT COUNT(*) FROM services');
    if (parseInt(sCheck.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial core services for Reem Al-Nufood...');
      for (let i = 0; i < SERVICES_DATA.length; i++) {
        const s = SERVICES_DATA[i];
        await client.query(
          `INSERT INTO services (
            id, slug, title_ar, title_en, short_desc_ar, short_desc_en,
            hero_image, icon_name, features_ar, features_en, scope_ar, scope_en,
            seo_keywords, faqs, riyadh_districts, alkharj_districts, sort_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          ON CONFLICT (id) DO NOTHING`,
          [
            s.id,
            s.slug,
            s.title_ar,
            s.title_en,
            s.short_desc_ar,
            s.short_desc_en,
            s.hero_image,
            s.icon_name,
            JSON.stringify(s.features_ar),
            JSON.stringify(s.features_en),
            JSON.stringify(s.scope_ar),
            JSON.stringify(s.scope_en),
            JSON.stringify(s.seo_keywords),
            JSON.stringify(s.faqs),
            JSON.stringify(s.riyadh_districts),
            JSON.stringify(s.alkharj_districts),
            i,
          ]
        );
      }
    }

    client.release();
  } catch (err) {
    console.error('⚠️ Database initialization error:', err);
  }
}

// REST API Routes

// --- SERVICES ENDPOINTS ---
// 1. Get all services
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY sort_order ASC, id ASC');
    if (result.rows.length === 0) {
      return res.json({ success: true, data: SERVICES_DATA });
    }
    const services = result.rows.map((row) => ({
      ...row,
      features_ar: typeof row.features_ar === 'string' ? JSON.parse(row.features_ar) : row.features_ar || [],
      features_en: typeof row.features_en === 'string' ? JSON.parse(row.features_en) : row.features_en || [],
      scope_ar: typeof row.scope_ar === 'string' ? JSON.parse(row.scope_ar) : row.scope_ar || [],
      scope_en: typeof row.scope_en === 'string' ? JSON.parse(row.scope_en) : row.scope_en || [],
      seo_keywords: typeof row.seo_keywords === 'string' ? JSON.parse(row.seo_keywords) : row.seo_keywords || [],
      faqs: typeof row.faqs === 'string' ? JSON.parse(row.faqs) : row.faqs || [],
      riyadh_districts: typeof row.riyadh_districts === 'string' ? JSON.parse(row.riyadh_districts) : row.riyadh_districts || [],
      alkharj_districts: typeof row.alkharj_districts === 'string' ? JSON.parse(row.alkharj_districts) : row.alkharj_districts || [],
    }));
    res.json({ success: true, data: services });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Update a service
app.put('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title_ar,
      title_en,
      short_desc_ar,
      short_desc_en,
      hero_image,
      icon_name,
      features_ar,
      features_en,
      scope_ar,
      scope_en,
      seo_keywords,
      faqs,
      riyadh_districts,
      alkharj_districts,
    } = req.body;

    const result = await pool.query(
      `UPDATE services SET
        title_ar = COALESCE($1, title_ar),
        title_en = COALESCE($2, title_en),
        short_desc_ar = COALESCE($3, short_desc_ar),
        short_desc_en = COALESCE($4, short_desc_en),
        hero_image = COALESCE($5, hero_image),
        icon_name = COALESCE($6, icon_name),
        features_ar = COALESCE($7, features_ar),
        features_en = COALESCE($8, features_en),
        scope_ar = COALESCE($9, scope_ar),
        scope_en = COALESCE($10, scope_en),
        seo_keywords = COALESCE($11, seo_keywords),
        faqs = COALESCE($12, faqs),
        riyadh_districts = COALESCE($13, riyadh_districts),
        alkharj_districts = COALESCE($14, alkharj_districts),
        updated_at = NOW()
       WHERE id = $15
       RETURNING *`,
      [
        title_ar,
        title_en,
        short_desc_ar,
        short_desc_en,
        hero_image,
        icon_name,
        features_ar ? JSON.stringify(features_ar) : null,
        features_en ? JSON.stringify(features_en) : null,
        scope_ar ? JSON.stringify(scope_ar) : null,
        scope_en ? JSON.stringify(scope_en) : null,
        seo_keywords ? JSON.stringify(seo_keywords) : null,
        faqs ? JSON.stringify(faqs) : null,
        riyadh_districts ? JSON.stringify(riyadh_districts) : null,
        alkharj_districts ? JSON.stringify(alkharj_districts) : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'القسم المطلوب غير موجود' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Error updating service:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Reset services to default template
app.post('/api/services/reset', async (req, res) => {
  try {
    await pool.query('DELETE FROM services');
    for (let i = 0; i < SERVICES_DATA.length; i++) {
      const s = SERVICES_DATA[i];
      await pool.query(
        `INSERT INTO services (
          id, slug, title_ar, title_en, short_desc_ar, short_desc_en,
          hero_image, icon_name, features_ar, features_en, scope_ar, scope_en,
          seo_keywords, faqs, riyadh_districts, alkharj_districts, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          s.id,
          s.slug,
          s.title_ar,
          s.title_en,
          s.short_desc_ar,
          s.short_desc_en,
          s.hero_image,
          s.icon_name,
          JSON.stringify(s.features_ar),
          JSON.stringify(s.features_en),
          JSON.stringify(s.scope_ar),
          JSON.stringify(s.scope_en),
          JSON.stringify(s.seo_keywords),
          JSON.stringify(s.faqs),
          JSON.stringify(s.riyadh_districts),
          JSON.stringify(s.alkharj_districts),
          i,
        ]
      );
    }
    res.json({ success: true, message: 'تمت استعادة الخدمات الافتراضية بنجاح' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- PROJECTS ENDPOINTS ---
// 1. Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const category = req.query.category as string;
    const city = req.query.city as string;

    let query = 'SELECT * FROM projects WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (city && city !== 'all') {
      params.push(`%${city}%`);
      query += ` AND city ILIKE $${params.length}`;
    }

    query += ' ORDER BY id DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Create a project
app.post('/api/projects', async (req, res) => {
  try {
    const {
      title_ar,
      title_en,
      category,
      description_ar,
      description_en,
      city,
      district,
      image_url,
      before_image_url,
      completion_year,
      client_type,
      featured,
    } = req.body;

    if (!title_ar || !category || !description_ar || !image_url) {
      return res.status(400).json({ success: false, error: 'يرجى ملء كافة الحقول الأساسية (العنوان، القسم، الوصف، والصورة)' });
    }

    const result = await pool.query(
      `INSERT INTO projects (
        title_ar, title_en, category, description_ar, description_en,
        city, district, image_url, before_image_url, completion_year, client_type, featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        title_ar,
        title_en || title_ar,
        category,
        description_ar,
        description_en || '',
        city || 'الرياض',
        district || '',
        image_url,
        before_image_url || null,
        completion_year || '2025',
        client_type || 'فيلا خاصة',
        featured || false,
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Error inserting project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Update an existing project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title_ar,
      title_en,
      category,
      description_ar,
      description_en,
      city,
      district,
      image_url,
      before_image_url,
      completion_year,
      client_type,
      featured,
    } = req.body;

    const result = await pool.query(
      `UPDATE projects SET
        title_ar = COALESCE($1, title_ar),
        title_en = COALESCE($2, title_en),
        category = COALESCE($3, category),
        description_ar = COALESCE($4, description_ar),
        description_en = COALESCE($5, description_en),
        city = COALESCE($6, city),
        district = COALESCE($7, district),
        image_url = COALESCE($8, image_url),
        before_image_url = $9,
        completion_year = COALESCE($10, completion_year),
        client_type = COALESCE($11, client_type),
        featured = COALESCE($12, featured)
       WHERE id = $13
       RETURNING *`,
      [
        title_ar,
        title_en,
        category,
        description_ar,
        description_en,
        city,
        district,
        image_url,
        before_image_url,
        completion_year,
        client_type,
        featured,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'المشروع غير موجود' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Delete a project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ success: true, message: 'تم حذف المشروع بنجاح' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- ADVERTISEMENTS ENDPOINTS ---
// 1. Get active ads (Public)
app.get('/api/ads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM advertisements WHERE is_active = true ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Get all ads including inactive (Admin)
app.get('/api/ads/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM advertisements ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Create advertisement
app.post('/api/ads', async (req, res) => {
  try {
    const {
      title_ar,
      title_en,
      badge_ar,
      badge_en,
      description_ar,
      description_en,
      discount_label,
      service_category,
      target_cities,
      image_url,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO advertisements (
        title_ar, title_en, badge_ar, badge_en, description_ar, description_en,
        discount_label, service_category, target_cities, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        title_ar,
        title_en || title_ar,
        badge_ar || 'عرض خاص',
        badge_en || 'Special Offer',
        description_ar,
        description_en || '',
        discount_label || '',
        service_category || 'all',
        target_cities || 'الرياض والخرج',
        image_url || null,
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Update advertisement
app.put('/api/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title_ar,
      title_en,
      badge_ar,
      badge_en,
      description_ar,
      description_en,
      discount_label,
      service_category,
      target_cities,
      image_url,
      is_active,
    } = req.body;

    const result = await pool.query(
      `UPDATE advertisements SET
        title_ar = COALESCE($1, title_ar),
        title_en = COALESCE($2, title_en),
        badge_ar = COALESCE($3, badge_ar),
        badge_en = COALESCE($4, badge_en),
        description_ar = COALESCE($5, description_ar),
        description_en = COALESCE($6, description_en),
        discount_label = COALESCE($7, discount_label),
        service_category = COALESCE($8, service_category),
        target_cities = COALESCE($9, target_cities),
        image_url = $10,
        is_active = COALESCE($11, is_active)
       WHERE id = $12
       RETURNING *`,
      [
        title_ar,
        title_en,
        badge_ar,
        badge_en,
        description_ar,
        description_en,
        discount_label,
        service_category,
        target_cities,
        image_url,
        is_active,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'الإعلان غير موجود' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Delete advertisement
app.delete('/api/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM advertisements WHERE id = $1', [id]);
    res.json({ success: true, message: 'تم حذف الإعلان' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- QUOTE REQUESTS ENDPOINTS ---
// 1. Submit Quote Request (Public)
app.post('/api/quotes', async (req, res) => {
  try {
    const { customer_name, phone, service_type, city, district, details, preferred_time } = req.body;

    if (!customer_name || !phone || !service_type || !city) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال الاسم، رقم الجوال، الخدمة والمدينة' });
    }

    const result = await pool.query(
      `INSERT INTO quote_requests (
        customer_name, phone, service_type, city, district, details, preferred_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [customer_name, phone, service_type, city, district || '', details || '', preferred_time || 'في أقرب وقت']
    );

    res.json({
      success: true,
      message: 'تم إرسال طلب عرض السعر بنجاح! سيتم التواصل معكم فوراً.',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error saving quote request:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Get all quote requests (Admin)
app.get('/api/quotes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quote_requests ORDER BY id DESC');
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Update Quote Status & Admin Notes
app.patch('/api/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const result = await pool.query(
      `UPDATE quote_requests SET
        status = COALESCE($1, status),
        notes = COALESCE($2, notes)
       WHERE id = $3 RETURNING *`,
      [status, notes, id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Delete Quote Request
app.delete('/api/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM quote_requests WHERE id = $1', [id]);
    res.json({ success: true, message: 'تم حذف الطلب' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- SITE SETTINGS ENDPOINTS ---
// 1. Get Site Settings (Excludes sensitive password)
app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings LIMIT 1');
    const settings = { ...result.rows[0] };
    delete settings.admin_password;
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Update Site Settings (Full editing for all website content)
app.put('/api/settings', async (req, res) => {
  try {
    const {
      company_name_ar,
      company_name_en,
      phone_primary,
      whatsapp_number,
      email,
      riyadh_address_ar,
      alkharj_address_ar,
      about_summary_ar,
      motto_ar,
      hero_title_ar,
      hero_subtitle_ar,
      stat_years_exp,
      stat_projects_done,
      stat_happy_clients,
      stat_warranty_years,
      working_hours_ar,
      hero_bg_image,
    } = req.body;

    const result = await pool.query(
      `UPDATE site_settings SET
        company_name_ar = COALESCE($1, company_name_ar),
        company_name_en = COALESCE($2, company_name_en),
        phone_primary = COALESCE($3, phone_primary),
        whatsapp_number = COALESCE($4, whatsapp_number),
        email = COALESCE($5, email),
        riyadh_address_ar = COALESCE($6, riyadh_address_ar),
        alkharj_address_ar = COALESCE($7, alkharj_address_ar),
        about_summary_ar = COALESCE($8, about_summary_ar),
        motto_ar = COALESCE($9, motto_ar),
        hero_title_ar = COALESCE($10, hero_title_ar),
        hero_subtitle_ar = COALESCE($11, hero_subtitle_ar),
        stat_years_exp = COALESCE($12, stat_years_exp),
        stat_projects_done = COALESCE($13, stat_projects_done),
        stat_happy_clients = COALESCE($14, stat_happy_clients),
        stat_warranty_years = COALESCE($15, stat_warranty_years),
        working_hours_ar = COALESCE($16, working_hours_ar),
        hero_bg_image = COALESCE($17, hero_bg_image),
        updated_at = NOW()
       WHERE id = (SELECT id FROM site_settings LIMIT 1)
       RETURNING *`,
      [
        company_name_ar,
        company_name_en,
        phone_primary,
        whatsapp_number,
        email,
        riyadh_address_ar,
        alkharj_address_ar,
        about_summary_ar,
        motto_ar,
        hero_title_ar,
        hero_subtitle_ar,
        stat_years_exp,
        stat_projects_done,
        stat_happy_clients,
        stat_warranty_years,
        working_hours_ar,
        hero_bg_image,
      ]
    );

    const updatedSettings = { ...result.rows[0] };
    delete updatedSettings.admin_password;
    res.json({ success: true, data: updatedSettings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- IMAGE UPLOAD TO CLOUDFLARE R2 ---
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم رفع أي ملف صوري' });
    }

    const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectKey = `portfolio/${Date.now()}-${sanitizedName}`;

    if (!r2Client || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
      const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      return res.json({
        success: true,
        url: base64Data,
        warning: 'Uploaded with base64 fallback because Cloudflare R2 is not configured in .env',
      });
    }

    try {
      await r2Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: objectKey,
          Body: req.file.buffer,
          ContentType: req.file.mimetype || 'image/jpeg',
        })
      );

      const publicUrl = `${R2_PUBLIC_URL}/${objectKey}`;
      return res.json({
        success: true,
        url: publicUrl,
        key: objectKey,
        storage: 'Cloudflare R2',
      });
    } catch (r2Err: any) {
      console.warn('⚠️ Cloudflare R2 upload warning:', r2Err.message);
      // Fallback: return data URL so functionality remains completely unblocked
      const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      return res.json({
        success: true,
        url: base64Data,
        warning: 'Uploaded with base64 fallback: ' + r2Err.message,
      });
    }
  } catch (error: any) {
    console.error('Error handling upload:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- ADMIN AUTHENTICATION ---
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال كلمة المرور' });
    }

    const result = await pool.query('SELECT admin_password FROM site_settings LIMIT 1');
    const storedPassword = result.rows[0]?.admin_password || ADMIN_DEFAULT_PASSWORD;

    if (!storedPassword) {
      return res.status(500).json({ success: false, error: 'لم يتم تكوين كلمة مرور الإدارة في البيئة .env' });
    }

    if (password === storedPassword) {
      return res.json({
        success: true,
        token: 'auth_admin_' + Buffer.from(password).toString('base64'),
        message: 'تم تسجيل الدخول بنجاح',
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'كلمة المرور غير صحيحة، يرجى التأكد والمحاولة مجدداً.',
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Admin Password
app.post('/api/admin/change-password', async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, error: 'يرجى إدخال كلمة المرور الحالية والجديدة' });
    }

    if (new_password.length < 4) {
      return res.status(400).json({ success: false, error: 'يجب ألا تقل كلمة المرور الجديدة عن 4 خانات' });
    }

    const check = await pool.query('SELECT admin_password FROM site_settings LIMIT 1');
    const storedPassword = check.rows[0]?.admin_password || ADMIN_DEFAULT_PASSWORD;

    if (!storedPassword) {
      return res.status(500).json({ success: false, error: 'لم يتم تكوين كلمة مرور الإدارة في البيئة .env' });
    }

    if (current_password !== storedPassword) {
      return res.status(401).json({ success: false, error: 'كلمة المرور الحالية غير مطابقة' });
    }

    await pool.query('UPDATE site_settings SET admin_password = $1 WHERE id = (SELECT id FROM site_settings LIMIT 1)', [new_password]);
    res.json({ success: true, message: 'تم تحديث كلمة المرور الإدارية بنجاح' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dynamic SEO Sitemap for Google Search Console
app.get('/sitemap.xml', async (req, res) => {
  const baseUrl = process.env.APP_URL || `http://${req.headers.host}`;
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/#services`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/#projects`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/#advertisements`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/#seo-hub`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/#coverage`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/services/glass-securit`, priority: '0.95', changefreq: 'weekly' },
    { loc: `${baseUrl}/services/aluminum`, priority: '0.95', changefreq: 'weekly' },
    { loc: `${baseUrl}/services/electrical`, priority: '0.95', changefreq: 'weekly' },
    { loc: `${baseUrl}/services/blacksmith-steel`, priority: '0.95', changefreq: 'weekly' },
    { loc: `${baseUrl}/services/general-contracting`, priority: '0.95', changefreq: 'weekly' },
    { loc: `${baseUrl}/services/renovation`, priority: '0.95', changefreq: 'weekly' },
    { loc: `${baseUrl}/cities/riyadh`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/cities/alkharj`, priority: '0.9', changefreq: 'weekly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Dynamic robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || `http://${req.headers.host}`;
  res.header('Content-Type', 'text/plain');
  res.send(
    `User-agent: *\nAllow: /\nAllow: /api/services\nAllow: /api/projects\nAllow: /api/ads\nAllow: /sitemap.xml\nDisallow: /api/admin/\nDisallow: /api/quotes\nSitemap: ${baseUrl}/sitemap.xml\n`
  );
});

// Mounting Vite in development or static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    // Initialize DB tables asynchronously so server listens immediately
    initDatabase().catch((err) => {
      console.warn('⚠️ Background database initialization warning:', err);
    });
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
