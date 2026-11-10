import { ServiceItem } from '../types.ts';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'electrical',
    slug: 'electrical',
    title_ar: 'الأعمال الكهربائية',
    title_en: 'Electrical Engineering & Installation',
    short_desc_ar: 'تأسيس وتمديدات كهربائية متكاملة، توزيع أحمال، إنارة ذكية معمارية وصيانة طارئة وفق كود البناء السعودي.',
    short_desc_en: 'Comprehensive electrical wiring, load distribution, architectural smart lighting, and maintenance compliant with Saudi Building Code.',
    hero_image: '/src/assets/images/service_electrical_panel_1794075926208.jpg',
    icon_name: 'Zap',
    features_ar: [
      'التأسيس والتمديدات الكهربائية للفلل والمباني والمشاريع الجديدة.',
      'تركيب وصيانة اللوحات والقواطع الرئيسية وتوزيع الأحمال المتوازنة.',
      'الإنارة المخفية والليد بروفايل والسبوت لايت والمفاتيح الذكية.',
      'صيانة وإصلاح الأعطال الكهربائية وكشف التماس الكابلات بأحدث الأجهزة.'
    ],
    features_en: [
      'New electrical conduit wiring and infrastructure for villas and commercial projects.',
      'Master breaker board installation, load balancing, and Schneider / ABB switchgear.',
      'Architectural recessed linear LEDs, profile lights, and smart switches.',
      'Troubleshooting electrical breakdowns, short circuit detection, and preventive maintenance.'
    ],
    scope_ar: [
      'تمديد كابلات الجهد المنخفض والمتوسط وتأريض المباني',
      'ربط أنظمة الإنارة بالمنازل الذكية (Smart Home Automation)',
      'تركيب محولات ومولدات الطاقة الاحتياطية',
      'فحص واختبار شبكات الكهرباء وإصدار تقارير السلامة'
    ],
    scope_en: [
      'Low and medium voltage cabling with certified building grounding systems',
      'Smart home automation lighting integration (KNX / Tuya / Lutron)',
      'Backup power generator and inverter installations',
      'Comprehensive network safety audits and load certification'
    ],
    seo_keywords: [
      'كهربائي الرياض',
      'كهربائي الخرج',
      'تأسيس كهرباء فلل الرياض',
      'صيانة كهرباء منازل بالخرج',
      'فني كهربائي ممتاز الرياض',
      'تركيب سبوت لايت وليد الرياض',
      'لوحات قواطع كهربائية الخرج'
    ],
    faqs: [
      {
        q_ar: 'هل تمديدات الكهرباء لديكم مطابقة لمواصفات شركة الكهرباء وكود البناء السعودي؟',
        q_en: 'Are your electrical installations compliant with the Saudi Building Code and SEC?',
        a_ar: 'نعم، جميع أعمالنا تنفذ بكابلات معتمدة (مثل كابلات الرياض والخليج) وتخضع لاختبارات العزل وتوزيع الأحمال بدقة وإشراف فنيين متخصصين.',
        a_en: 'Yes, all wiring utilizes certified Saudi cables and adheres strictly to the Saudi Building Code safety specifications.'
      },
      {
        q_ar: 'ما هي سرعة الاستجابة لبلاغات الأعطال في الرياض والخرج؟',
        q_en: 'What is your response time for electrical repair in Riyadh and Al-Kharj?',
        a_ar: 'لدينا فرق ميدانية سريعة تغطي جميع أحياء شمال وشرق ووسط الرياض بالإضافة إلى مدينة الخرج والمناطق المجاورة خلال وقت قياسي.',
        a_en: 'Our rapid response teams cover all districts of Riyadh and Al-Kharj promptly.'
      }
    ],
    riyadh_districts: ['حطين', 'الملقا', 'الياسمين', 'النرجس', 'العليا', 'الروضة', 'الصحافة', 'العقيق', 'السليمانية'],
    alkharj_districts: ['حي السلام', 'حي الخزامى', 'حي الأندلس', 'حي الورود', 'الفيصلية', 'الدلم']
  },
  {
    id: 'glass_securit',
    slug: 'glass-securit',
    title_ar: 'أعمال الزجاج والسيكوريت',
    title_en: 'Tempered Glass & Securit Facades',
    short_desc_ar: 'تفصيل وتركيب زجاج سيكوريت عازل، واجهات المحلات، كبائن الشاور وقواطع المكاتب الفاخرة بأعلى متانة.',
    short_desc_en: 'Custom fabrication and installation of tempered securit glass, commercial facades, shower enclosures, and luxury partitions.',
    hero_image: '/src/assets/images/service_securit_glass_1794075927280.jpg',
    icon_name: 'Layers',
    features_ar: [
      'تفصيل وتركيب أعمال السكريت 10 ملم و 12 ملم عالي المتانة.',
      'واجهات المحلات والشركات والمعارض التجارية الزجاجية المقاومة للصدمات.',
      'قواطع زجاجية للمكاتب وغرف الاجتماعات بتصاميم عصرية وعازلة للصوت.',
      'كبائن شاور زجاجية ودرابزين دراج ومسابح ستانلس ستيل بدون إطار.'
    ],
    features_en: [
      'Fabrication and installation of 10mm & 12mm heavy-duty tempered glass.',
      'High-impact commercial store facades, showroom entries, and frameless spider fittings.',
      'Modern acoustic glass partitions for executive offices and boardrooms.',
      'Luxury frameless bathroom shower glass and glass swimming pool balustrades.'
    ],
    scope_ar: [
      'واجهات زجاجية بنظام الاستركشر والسبايدر',
      'أبواب زجاجية أوتوماتيكية وسحابة بأنظمة هيدروليكية ألمانية وإيطالية',
      'تجليد الزجاج بأفلام الحماية والعزل الحراري وساندبلاست الزخرفي',
      'صيانة وتبديل الماكينات والمقابض الزجاجية التالفة'
    ],
    scope_en: [
      'Spider system structural glass facade installation',
      'Automatic and hydraulic sliding glass doors with German hardware',
      'Decorative sandblasting, thermal control and privacy films',
      'Maintenance and immediate replacement of hydraulic floor springs'
    ],
    seo_keywords: [
      'زجاج سيكوريت الرياض',
      'زجاج سيكوريت الخرج',
      'واجهات محلات زجاج الرياض',
      'شورات زجاجية بالرياض',
      'قواطع زجاجية مكاتب الخرج',
      'تفصيل ابواب سيكوريت الرياض',
      'درابزين زجاجي الرياض'
    ],
    faqs: [
      {
        q_ar: 'ما هو سمك الزجاج السيكوريت المفضل للواجهات والأبواب؟',
        q_en: 'What is the recommended securit glass thickness for facades and doors?',
        a_ar: 'نوصي بزجاج سيكوريت 10 ملم أو 12 ملم معالج حرارياً ومعتمد ضد الصدمات مع إكسسوارات ستانلس ستيل 304 المقاومة للرطوبة والصدأ.',
        a_en: 'We recommend 10mm to 12mm thermally toughened glass equipped with grade 304 stainless steel hardware.'
      }
    ],
    riyadh_districts: ['العليا', 'السليمانية', 'حي الملقا', 'حي النرجس', 'حي القيروان', 'حي اليرموك'],
    alkharj_districts: ['المنطقة الصناعية بالخرج', 'طريق الملك فهد بالخرج', 'حي الخزامى', 'حي اليمامة']
  },
  {
    id: 'aluminum',
    slug: 'aluminum',
    title_ar: 'أعمال الألمنيوم والكلادينج',
    title_en: 'Aluminum Systems & Cladding',
    short_desc_ar: 'أبواب وشبابيك ألمنيوم سرايا ودبل جلاس عازل للغبار والحرارة، واجهات كلادينج فاخرة ومطابخ حديثة.',
    short_desc_en: 'High-performance thermal break aluminum sliding doors, double glazed windows, architectural cladding, and modern profiles.',
    hero_image: '/src/assets/images/service_aluminum_cladding_1794075926506.jpg',
    icon_name: 'Maximize2',
    features_ar: [
      'أبواب وشبابيك الألمنيوم قطاعات سرايا وسوبر سرايا العازلة للصوت.',
      'زجاج دبل جلاس عازل للحرارة مع فاصل هواء وغاز الأرجون لمنع الرطوبة.',
      'واجهات كلادينج ألمنيوم مقاومة للحريق للفلل والمباني التجارية.',
      'مطابخ ألمنيوم وقواطع داخلية وصيانة وتعديل القطاعات القائمة.'
    ],
    features_en: [
      'Saraya and super Saraya high acoustic-rated aluminum doors and windows.',
      'Double-glazed thermal units with argon gas spacers preventing condensation.',
      'Fire-rated architectural aluminum composite panel (ACP) cladding.',
      'Custom aluminum architectural louvers, modern kitchens, and maintenance.'
    ],
    scope_ar: [
      'تصنيع شبابيك سحاب وقلاب وفصالات مع شبك حماية أمريكي',
      'تكسيات واجهات المباني بأحدث ألوان الكلادينج المضمونة 20 سنة',
      'أبواب ألمنيوم ليزر وأبواب مصفحة للقصور والفلل',
      'عزل كامل للسيليكون الإنشائي المقاوم لأشعة الشمس والحرارة'
    ],
    scope_en: [
      'Manufacturing sliding, casement, and tilt-and-turn windows with heavy-duty screens',
      'Modern building facade cladding with 20-year coating warranties',
      'Reinforced laser aluminum entry gates and doors',
      'Structural weather-resistant silicone glazing against extreme Gulf climate'
    ],
    seo_keywords: [
      'ورشة المنيوم الرياض',
      'المنيوم الخرج',
      'شبابيك سرايا الرياض',
      'كلادينج الرياض',
      'كلادينج الخرج',
      'ابواب المنيوم الرياض',
      'دبل جلاس عازل الرياض والخرج'
    ],
    faqs: [
      {
        q_ar: 'هل يوفر الألمنيوم الدبل جلاس عزل حقيقي لحرارة صيف الرياض والخرج؟',
        q_en: 'Does double-glazed aluminum really isolate the summer heat in Riyadh and Al-Kharj?',
        a_ar: 'نعم، يقلل الزجاج المزدوج مع القطاعات المعزولة درجات الحرارة بنسبة تتجاوز 40% ويخفض استهلاك أجهزة التكييف بشكل ملحوظ.',
        a_en: 'Yes, double-glazed units with thermal break reduce indoor heat gain by over 40% and lower AC energy consumption.'
      }
    ],
    riyadh_districts: ['شمال الرياض', 'شرق الرياض', 'حي المونسية', 'حي الرمال', 'حي لبن', 'الدرعية'],
    alkharj_districts: ['طريق الملك عبدالعزيز بالخرج', 'حي الزاهر', 'حي العزيزية', 'الدلم']
  },
  {
    id: 'blacksmith_steel',
    slug: 'blacksmith-steel',
    title_ar: 'أعمال الحديد والحدادة',
    title_en: 'Architectural Steel & Blacksmithing',
    short_desc_ar: 'تفصيل بوابات ليزر فاخرة، مظلات سيارات وسواتر لكسان وقماش، درابزين حديد مشغول وهياكل معدنية.',
    short_desc_en: 'Custom architectural laser-cut gates, car park shades, privacy screens, wrought iron railings, and steel structures.',
    hero_image: '/src/assets/images/service_wrought_iron_gate_1794075927418.jpg',
    icon_name: 'Shield',
    features_ar: [
      'بوابات حديد قص ليزر عصرية وحديد مشغول كلاسيكي مدهون حرارياً.',
      'مظلات سيارات لكسان وقماش كوري وألماني عالي الكثافة (PVC).',
      'سواتر حديد مجدول وشرائح لحجب الرؤية وتأمين خصوصية الفلل.',
      'درابزين سلالم وقصور، سلالم طوارئ وهياكل حديدية ومستودعات.'
    ],
    features_en: [
      'Bespoke laser-cut modern steel entry gates and classic wrought iron.',
      'High-grade PVC / PVDF / Lexan shade canopies for luxury vehicles and courtyards.',
      'Perimeter louvers and decorative privacy screens for residential compounds.',
      'Custom stair balustrades, emergency fire stairs, and industrial steel framing.'
    ],
    scope_ar: [
      'دهانات بودرة حرارية إلكتروستاتيك مقاومة للصدأ والتآكل',
      'مظلات معلقة بدون أعمدة لتسهيل حركة السيارات والمداخل',
      'تركيب أنظمة الفتح الذكي للبوابات عبر الريموت والهاتف',
      'تفصيل هناجر ومستودعات وملاحق حديدية متطورة'
    ],
    scope_en: [
      'Electrostatic thermoset powder coating resistant to corrosion and desert sandstorms',
      'Cantilevered vehicle canopies without obstructive floor pillars',
      'Smart gate automation with remote and smartphone app access',
      'Fabrication of steel hangars, warehouses, and steel mezzanine decks'
    ],
    seo_keywords: [
      'حداد الرياض',
      'حداد الخرج',
      'مظلات وسواتر الرياض',
      'مظلات سيارات الخرج',
      'بوابات ليزر الرياض',
      'درابزين حديد مشغول الرياض',
      'سواتر شرائح حديد الخرج'
    ],
    faqs: [
      {
        q_ar: 'ما هو الضمان المقدم على مظلات السيارات والسواتر؟',
        q_en: 'What warranty is offered on vehicle shades and privacy screens?',
        a_ar: 'نقدم ضماناً يصل إلى 10 سنوات على الهياكل الحديدية والأقمشة الكورية ضد التمزق وتغير الألوان والرياح.',
        a_en: 'We provide up to a 10-year structural and fabric warranty against color fading, wind, and tear.'
      }
    ],
    riyadh_districts: ['حي الملقا', 'حي العارض', 'حي الياسمين', 'حي طويق', 'حي الشفا', 'الدرعية'],
    alkharj_districts: ['حي السلام', 'طريق حرض بالخرج', 'حي غرناطة', 'نعجان']
  },
  {
    id: 'general_contracting',
    slug: 'general-contracting',
    title_ar: 'المقاولات العامة والتشطيبات',
    title_en: 'General Contracting & Interior Finishes',
    short_desc_ar: 'بناء المباني والفلل تسليم على المفتاح، أعمال العظم والخرسانات، تشطيبات معمارية وديكورية فاخرة.',
    short_desc_en: 'Turnkey villa and commercial construction, reinforced concrete, luxury architectural finishes, and project management.',
    hero_image: '/src/assets/images/hero_luxury_villa_1794075925416.jpg',
    icon_name: 'Building2',
    features_ar: [
      'تنفيذ الملاحق والمباني والفلل السكنية من الأساسات حتى المفتاح.',
      'أعمال البناء والخرسانة المسلحة تحت إشراف هندسي ورقابة جودة.',
      'إدارة وتنفيذ مشاريع التشطيب الكاملة (دهانات، ديكورات، أرضيات).',
      'تنفيذ الأعمال بدقة متناهية حسب المخططات والمواصفات المتفق عليها.'
    ],
    features_en: [
      'Turnkey construction of residential villas, annexes, and commercial complexes.',
      'Certified reinforced concrete structural execution and strict engineering quality oversight.',
      'End-to-end luxury finishes: paints, gypsum designs, porcelain tiling, and acoustics.',
      'Exact adherence to architectural blueprints, bill of quantities, and delivery schedules.'
    ],
    scope_ar: [
      'صب الخرسانات والقواعد والميد والأعمدة وفق الكود السعودي',
      'أعمال الدهانات الديكورية (جوتن، الجزيرة) وورق الجدران والتكسيات',
      'أعمال الأسقف المستعارة والجبس بورد المعلق المخفي',
      'تركيب الرخام الطبيعي والجرانيت والبورسلان الإسباني والإيطالي'
    ],
    scope_en: [
      'Concrete pouring, footings, tie-beams, and columns per Saudi Building Code',
      'High-grade decorative painting (Jotun / Al Jazeera) and textured wall claddings',
      'Concealed gypsum board ceilings and modern indirect architectural troughs',
      'Natural Italian and Spanish marble, granite, and porcelain flooring installation'
    ],
    seo_keywords: [
      'مقاول عام بالرياض',
      'مقاول بناء بالخرج',
      'تشطيب فلل الرياض',
      'مقاول عظم بالرياض',
      'تسليم مفتاح الرياض والخرج',
      'افضل شركة مقاولات الرياض',
      'مقاول تشطيب دهانات الخرج'
    ],
    faqs: [
      {
        q_ar: 'هل يمكن التعاقد على مرحلة العظم فقط أو التشطيب فقط؟',
        q_en: 'Can we contract solely for structural skeleton or solely for interior finishes?',
        a_ar: 'نعم، نوفر عقوداً مرنة سواءً للبناء عظم بالمواد، أو تسليم مفتاح كامل، أو تنفيذ بنود التشطيب والديكور المستقلة.',
        a_en: 'Yes, we offer flexible contracts for skeleton construction, turnkey full delivery, or specialized finishing packages.'
      }
    ],
    riyadh_districts: ['شمال الرياض', 'حي النرجس', 'حي الياسمين', 'حي حطين', 'حي الرمال', 'شرق الرياض'],
    alkharj_districts: ['وسط الخرج', 'حي السلام', 'حي النهضة', 'حي الاندلس', 'حي مشرف']
  },
  {
    id: 'renovation',
    slug: 'renovation',
    title_ar: 'الترميم وإنشاء الملاحق',
    title_en: 'Renovation & Luxury Annex Construction',
    short_desc_ar: 'ترميم شامل للفلل والمباني، بناء الملاحق والمجالس الخارجية، معالجة التشققات والرطوبة وتجديد الواجهات.',
    short_desc_en: 'Complete building restoration, external majlis and rooftop annex construction, crack repairs, and waterproofing.',
    hero_image: '/src/assets/images/hero_luxury_villa_1794075925416.jpg',
    icon_name: 'Wrench',
    features_ar: [
      'ترميم الشقق والفلل والمباني القديمة وتحويلها إلى تصاميم مودرن عصرية.',
      'بناء وتوسعة الملاحق الأرضية والعلوية ومجالس الضيافة التراثية والمودرن.',
      'معالجة التشققات الإنشائية وتسرّبات الرطوبة والعزل المائي والحراري المعتمد.',
      'تجديد شامل للحمامات والمطابخ واستبدال خطوط السباكة والكهرباء التالفة.'
    ],
    features_en: [
      'Complete modernization of older villas and properties into contemporary luxury spaces.',
      'Construction of custom ground/rooftop majlis guest annexes and outdoor pavilions.',
      'Structural crack consolidation, water seepage damp-proofing, and certified thermal insulation.',
      'Full refurbishment of luxury bathrooms and kitchens with modernized plumbing.'
    ],
    scope_ar: [
      'تدعيم الأعمدة والأسقف الخرسانية واستبدال الأجزاء المتضررة',
      'تجديد الواجهات الخارجية بالحجر الطبيعي وتكسيات بديل الخشب والكلادينج',
      'عزل الأسطح بفوم البولي يوريثان المعتمد من شركة الكهرباء',
      'تحديث شبكات التغذية والصرف الصحي وحل مشاكل الروائح والانسدادات'
    ],
    scope_en: [
      'Concrete structural reinforcement and damaged rebar restoration',
      'Exterior facade uplift using natural stone, WPC fluted louvers, and composite panels',
      'SEC-approved polyurethane foam spray thermal and water roof insulation',
      'Complete plumbing re-piping, modern drainage traps, and water pressure enhancement'
    ],
    seo_keywords: [
      'ترميم فلل الرياض',
      'ترميم منازل الخرج',
      'بناء ملاحق الرياض',
      'بناء مجلس خارجي الخرج',
      'معالجة الرطوبة والتشققات الرياض',
      'تجديد حمامات ومطابخ الرياض والخرج',
      'مقاول ترميم معتمد الرياض'
    ],
    faqs: [
      {
        q_ar: 'كم تستغرق عادة أعمال ترميم فيلا أو بناء ملحق خارجي؟',
        q_en: 'How long does a villa renovation or external majlis annex take?',
        a_ar: 'بناء الملحق الخارجي يستغرق في المتوسط من 25 إلى 45 يوماً عمل شاملاً التشطيب والعوازل، ويتم تحديد جدول زمني صارم في العقد.',
        a_en: 'An external annex typically takes 25 to 45 working days including turnkey finishing and thermal insulation.'
      }
    ],
    riyadh_districts: ['حي الروضة', 'حي الصحافة', 'حي الملقا', 'حي النفل', 'حي الربوة', 'غرب الرياض'],
    alkharj_districts: ['حي الخزامى', 'حي اليمامة', 'حي المحمدية', 'حي الصفا', 'الدلم']
  }
];

export const COMPANY_INFO = {
  name_ar: 'مؤسسة ريم النفوذ للمقاولات والخدمات المتكاملة',
  name_en: 'Reem Al-Nufood Contracting & Integrated Services',
  motto_ar: 'خبرة في التنفيذ، جودة في العمل، وثقة تدوم.',
  motto_en: 'Expertise in execution, excellence in quality, and lasting trust.',
  about_text_ar: 'نقدم خدمات متكاملة في مجال المقاولات العامة والأعمال الكهربائية والسكوريت والألمنيوم والترميم والتشطيبات، مع الحرص على أعلى معايير الجودة والدقة والالتزام بالمواعيد في مدينة الرياض ومحافظة الخرج والمناطق التابعة.',
  about_text_en: 'We provide integrated services across general contracting, electrical works, securit glass, aluminum, blacksmithing, and luxury renovation, adhering to the highest standards of precision and on-time delivery across Riyadh and Al-Kharj.',
  phone_primary: '0552345678',
  phone_display: '055 234 5678',
  whatsapp_number: '966552345678',
  email: 'info@reem-alnufood.com',
  riyadh_address: 'الرياض - طريق الملك فهد - حي العقيق',
  alkharj_address: 'الخرج - طريق الملك عبدالعزيز - حي السلام',
  coverage_summary_ar: 'نخدمكم في الرياض وجميع المناطق والخرج حسب نطاق المشروع.',
  coverage_summary_en: 'Proudly serving Riyadh, Al-Kharj, and surrounding project regions.',
  working_hours_ar: 'السبت - الخميس: 8:00 صباحاً - 10:00 مساءً | خدمة طوارئ 24/7',
  working_hours_en: 'Sat - Thu: 8:00 AM - 10:00 PM | Emergency Services Available 24/7'
};

export const VALUE_PROPOSITIONS = [
  {
    title_ar: 'جودة في التنفيذ',
    title_en: 'Flawless Execution Quality',
    desc_ar: 'نستخدم أفضل المواد المعتمدة عالمياً ومحلياً مع الالتزام التام بكود البناء السعودي وضمانات طويلة الأمد.',
    desc_en: 'Certified materials, stringent quality control, and compliance with the Saudi Building Code with written warranties.'
  },
  {
    title_ar: 'أسعار مناسبة ومدروسة',
    title_en: 'Transparent Competitive Pricing',
    desc_ar: 'عروض أسعار شفافة ومفصلة بدون أي تكاليف خفية، مع توفير خيارات تناسب الميزانيات وتضمن أفضل قيمة مقابل السعر.',
    desc_en: 'Detailed itemized quotations with zero hidden surprises, providing the optimal balance of luxury and value.'
  },
  {
    title_ar: 'دقة في المواعيد',
    title_en: 'Punctual Delivery Milestones',
    desc_ar: 'نحترم وقت عملائنا ونلتزم بالجدول الزمني المعتمد في العقد مع تقارير إنجاز دورية حتى استلام المشروع.',
    desc_en: 'Strict commitment to contractual completion deadlines backed by regular progress updates.'
  },
  {
    title_ar: 'اهتمام بالتفاصيل',
    title_en: 'Meticulous Attention to Detail',
    desc_ar: 'نحرص على أدق التفاصيل الهندسية والجمالية في التشطيب والتأسيس لضمان تناغم المنظر وديمومة العمل.',
    desc_en: 'Artisan craftsmanship in every millimetre of jointing, wiring, framing, and final decorative coating.'
  },
  {
    title_ar: 'متابعة العمل حتى التسليم',
    title_en: 'Turnkey Handover & Warranty',
    desc_ar: 'إشراف ميداني مستمر من مهندسين وفنيين متخصصين، مع خدمة ما بعد البيع والدعم الفني السريع.',
    desc_en: 'On-site engineering supervision from excavation to handover with proactive after-sales support.'
  }
];
