/**
 * Default homepage CMS document.
 * heroSlides / sectorCards seeded from the live homepage so CMS can edit them.
 */
import {roleImages, homeSectorImages} from '@/data/image-manifest';

export default function buildHomepageSeed() {
  return {
    sections: [
      {id: 'hero', enabled: true, order: 10},
      {id: 'about', enabled: true, order: 20},
      {id: 'clients', enabled: true, order: 30},
      {id: 'services', enabled: true, order: 40},
      {id: 'stats', enabled: true, order: 50},
      {id: 'sectors', enabled: true, order: 60},
      {id: 'process', enabled: true, order: 70},
      {id: 'portfolio', enabled: true, order: 80},
      {id: 'why', enabled: true, order: 90},
      {id: 'testimonials', enabled: true, order: 100},
      {id: 'team', enabled: true, order: 110},
      {id: 'contact', enabled: true, order: 120},
      {id: 'faq', enabled: true, order: 130},
    ],

    heroSlides: [
      {
        id: 'four-towers',
        slug: 'four-towers-al-nahda',
        image: '/assets/asas/projects-client/four-towers-al-nahda/four-towers-al-nahda-01.jpg',
        crop: '50% 40%',
        strip: 'Four Towers',
        stripAr: 'أربعة أبراج',
        location: 'Al Nahda, Sharjah',
        locationAr: 'النهدة، الشارقة',
        title: 'Four Towers, Al Nahda',
        titleAr: 'أربعة أبراج، النهدة',
        note: 'A four-tower composition over a shared podium with coordinated architectural, structural and electromechanical design.',
        noteAr: 'تكوين من أربعة أبراج فوق منصة مشتركة بتصميم معماري وإنشائي وكهروميكانيكي منسّق.',
        facts: [['Towers', '4'], ['Floors', '37'], ['Scope', 'A / S / MEP']],
        factsAr: [['أبراج', '4'], ['طوابق', '37'], ['النطاق', 'A / S / MEP']],
      },
      {
        id: 'amwaj',
        slug: 'amwaj-tower-al-raha',
        image: '/assets/asas/projects-client/amwaj-tower-al-raha/amwaj-tower-al-raha-01.jpg',
        crop: '50% 45%',
        strip: 'Towers',
        stripAr: 'أبراج',
        location: 'Al Raha Beach, Abu Dhabi',
        locationAr: 'شاطئ الراحة، أبوظبي',
        title: 'Amwaj Tower, Al Raha Beach',
        titleAr: 'برج أمواج، شاطئ الراحة',
        note: 'Amwaj Tower at Al Raha Beach: 3 basement levels, ground, mezzanine and 13 floors.',
        noteAr: 'برج أمواج في شاطئ الراحة: 3 طوابق سفلية وطابق أرضي وميزانين و13 طابقاً.',
        facts: [['Form', '3B+G+M+13'], ['Plot', '2-A'], ['Place', 'Al Raha']],
        factsAr: [['التكوين', '3B+G+M+13'], ['القطعة', '2-A'], ['المكان', 'الراحة']],
      },
      {
        id: 'hotel',
        slug: 'hotel-abu-dhabi-island-e10',
        image: '/assets/asas/projects-client/hotel-abu-dhabi-island-e10/hotel-abu-dhabi-island-e10-01.jpg',
        crop: '50% 40%',
        strip: 'Hospitality',
        stripAr: 'ضيافة',
        location: 'Abu Dhabi Island',
        locationAr: 'جزيرة أبوظبي',
        title: 'Hotel — Abu Dhabi Island E10',
        titleAr: 'فندق — جزيرة أبوظبي E10',
        note: 'Hotel on Abu Dhabi Island, sector E10. Full design package.',
        noteAr: 'فندق في جزيرة أبوظبي، القطاع E10. حزمة تصميم كاملة.',
        facts: [['Type', 'Hotel'], ['Sector', 'E10'], ['Scope', 'Full design']],
        factsAr: [['النوع', 'فندق'], ['القطاع', 'E10'], ['النطاق', 'تصميم كامل']],
      },
      {
        id: 'mosque',
        slug: 'mosque-al-shamkha-sh9',
        image: '/assets/asas/projects-client/mosque-al-shamkha-sh9/mosque-al-shamkha-sh9-01.jpg',
        crop: '50% 40%',
        strip: 'Worship',
        stripAr: 'مساجد',
        location: 'Al Shamkha, Abu Dhabi',
        locationAr: 'الشامخة، أبوظبي',
        title: 'Mosque — Al Shamkha SH9',
        titleAr: 'مسجد — الشامخة SH9',
        note: 'Mosque in Al Shamkha with civil defence and CCTV in the design package.',
        noteAr: 'مسجد في الشامخة يشمل الدفاع المدني والكاميرات ضمن حزمة التصميم.',
        facts: [['Type', 'Mosque'], ['Sector', 'SH9'], ['Extras', 'Civil defence']],
        factsAr: [['النوع', 'مسجد'], ['القطاع', 'SH9'], ['إضافي', 'دفاع مدني']],
      },
    ],

    sectorCards: [
      {
        key: 'towers-high-rise',
        image: homeSectorImages['towers-high-rise'],
        label: 'Towers',
        labelAr: 'الأبراج',
        title: 'Towers & high-rise',
        titleAr: 'الأبراج والمباني العالية',
        copy: 'Architectural, structural and electromechanical design',
        copyAr: 'تصميم معماري وإنشائي وكهروميكانيكي',
        tone: 'dark',
      },
      {
        key: 'commercial-residential-buildings',
        image: homeSectorImages['commercial-residential-buildings'],
        label: 'Buildings',
        labelAr: 'المباني',
        title: 'Commercial & residential',
        titleAr: 'التجاري والسكني',
        copy: 'Building design across coordinated disciplines',
        copyAr: 'تصميم مبانٍ عبر تخصصات منسقة',
        tone: 'dark',
      },
      {
        key: 'infrastructure-urban-planning',
        image: homeSectorImages['infrastructure-urban-planning'],
        label: 'Infrastructure',
        labelAr: 'البنية التحتية',
        title: 'Infrastructure & planning',
        titleAr: 'البنية التحتية والتخطيط',
        copy: 'Traffic, access, parking and municipality review',
        copyAr: 'المرور والمداخل والمواقف ومراجعة البلدية',
        tone: 'light',
      },
      {
        key: 'education',
        image: homeSectorImages.education,
        label: 'Education',
        labelAr: 'التعليم',
        title: 'Schools',
        titleAr: 'المدارس',
        copy: 'Campus planning and educational facilities',
        copyAr: 'تخطيط الحرم والمرافق التعليمية',
        tone: 'light',
      },
      {
        key: 'villas-compounds-palaces',
        image: homeSectorImages['villas-compounds-palaces'],
        label: 'Residential',
        labelAr: 'السكني',
        title: 'Villas & compounds',
        titleAr: 'الفلل والمجمعات',
        copy: 'Private villas, residential villas and compounds',
        copyAr: 'فلل خاصة وسكنية ومجمعات',
        tone: 'dark',
      },
      {
        key: 'interior-hospitality-retail',
        image: homeSectorImages['interior-hospitality-retail'],
        label: 'Interiors',
        labelAr: 'التصميم الداخلي',
        title: 'Interior design',
        titleAr: 'التصميم الداخلي',
        copy: 'Residential, hospitality and retail interiors',
        copyAr: 'تصميمات سكنية وضيافة وتجزئة',
        tone: 'dark',
      },
    ],

    about: {
      titleEn: 'Abu Dhabi engineering consultancy since 2009.',
      titleAr: 'استشارات هندسية من أبوظبي منذ 2009.',
      bodyEn:
        'Founded in Abu Dhabi in 2009, ASAS provides architectural, structural, civil and electromechanical design, quantities and cost services, project management and construction supervision.',
      bodyAr:
        'تأسست أساس للاستشارات الهندسية وإدارة المشاريع في أبوظبي عام 2009، وتقدم التصميم المعماري والإنشائي والمدني والكهروميكانيكي، وخدمات الكميات والتكلفة، وإدارة المشاريع والإشراف على التنفيذ.',
      noteEn:
        'A single Abu Dhabi consultancy covering architecture, structure, electromechanical services, quantity surveying and site supervision.',
      noteAr:
        'مكتب استشاري واحد في أبوظبي يغطي العمارة والإنشاءات والأعمال الكهروميكانيكية وحصر الكميات والإشراف الموقعي.',
      ctaPrimaryEn: 'Learn more about us',
      ctaPrimaryAr: 'اعرف المزيد عنا',
      ctaPrimaryHref: 'about',
      ctaSecondaryEn: 'Company profile',
      ctaSecondaryAr: 'الملف التعريفي',
      ctaSecondaryHref: 'company-profile',
      image: '/assets/asas/roles/asas-role-home-about.webp',
    },

    copy: {
      en: {
        eyebrow: 'Established in Abu Dhabi · 2009',
        hero: 'From Sketch to Final Handover.',
        lede: 'Architecture, structure, electromechanical services, quantity surveying, project management and site supervision in one consultancy.',
        start: 'Start a project',
        work: 'View our work',
        journey: 'Project lifecycle',
        sectorEyebrow: 'Project sectors',
        sectorTitle: 'Projects across diverse sectors.',
        sectorCopy:
          'Project experience across the building types and environments represented in the ASAS portfolio.',
        sectorCta: 'View all sectors',
        processEyebrow: 'Project lifecycle',
        processTitle: 'From concept to financial closure',
        processCopy:
          'A documented route through design, award, construction, handover and future phases.',
        archive: 'Selected work',
        archiveTitle: 'Projects from the official ASAS portfolio',
        archiveCopy:
          'A featured project with supporting work across towers, infrastructure, education, compounds and interiors.',
        archiveCta: 'View all projects',
        featured: 'Selected project',
        featuredTitle: 'Four Towers, Al Nahda',
        featuredDesc:
          'Four towers consisting of 3 basement levels, 6 podium levels, 6 parking levels and 37 floors.',
        viewProject: 'View project',
      },
      ar: {
        eyebrow: 'تأسست في أبوظبي · 2009',
        hero: 'من الرسم إلى التسليم النهائي.',
        lede: 'العمارة والإنشاءات والأعمال الكهروميكانيكية وحصر الكميات وإدارة المشاريع والإشراف الموقعي في مكتب استشاري واحد.',
        start: 'ابدأ مشروعك',
        work: 'استكشف أعمالنا',
        journey: 'دورة حياة المشروع',
        sectorEyebrow: 'قطاعات المشاريع',
        sectorTitle: 'مشاريع عبر قطاعات متعددة.',
        sectorCopy:
          'خبرة عبر أنواع وبيئات المشاريع الواردة في أعمال أساس للاستشارات الهندسية وإدارة المشاريع.',
        sectorCta: 'عرض كل القطاعات',
        processEyebrow: 'دورة حياة المشروع',
        processTitle: 'من الفكرة إلى الإغلاق المالي',
        processCopy: 'مسار موثق يمر بالتصميم والترسية والتنفيذ والتسليم والمراحل المستقبلية.',
        archive: 'أعمال مختارة',
        archiveTitle: 'مشاريع من الملف الرسمي لأساس للاستشارات الهندسية وإدارة المشاريع',
        archiveCopy:
          'مشروع مختار مع أعمال داعمة عبر الأبراج والبنية التحتية والتعليم والمجمعات والتصميم الداخلي.',
        archiveCta: 'عرض كل المشاريع',
        featured: 'مشروع مختار',
        featuredTitle: 'أربعة أبراج، النهدة',
        featuredDesc:
          'أربعة أبراج تتكون من 3 طوابق سفلية و6 طوابق منصة و6 طوابق مواقف و37 طابقاً.',
        viewProject: 'عرض المشروع',
      },
    },

    whyPoints: [
      {
        id: 'cross-discipline',
        titleEn: 'Cross-discipline checking',
        titleAr: 'مراجعة بين التخصصات',
        bodyEn:
          'Drawings, specifications and bills of quantities are checked across disciplines before issue.',
        bodyAr: 'تُراجع الرسومات والمواصفات وجداول الكميات بين التخصصات قبل الإصدار.',
      },
      {
        id: 'timely-reporting',
        titleEn: 'Timely reporting',
        titleAr: 'تقارير في مواعيدها',
        bodyEn: 'Scheduled progress, cost and quality reports support the project lifecycle.',
        bodyAr: 'تدعم تقارير التقدم والتكلفة والجودة المجدولة دورة حياة المشروع.',
      },
      {
        id: 'integrated-cycle',
        titleEn: 'Integrated project cycle',
        titleAr: 'دورة مشروع متكاملة',
        bodyEn:
          'Primary design, final design, tender and construction are managed as one connected cycle.',
        bodyAr: 'تُدار مراحل التصميم الأولي والنهائي والعطاء والتنفيذ كدورة مترابطة.',
      },
      {
        id: 'records',
        titleEn: 'Records and commitment',
        titleAr: 'السجلات والالتزام',
        bodyEn: 'Project records are retained and remain available to clients after handover.',
        bodyAr: 'تُحفظ سجلات المشروع وتظل متاحة للعملاء بعد التسليم.',
      },
    ],

    faqs: [
      {
        id: 'services',
        questionEn: 'What engineering services does ASAS provide?',
        questionAr: 'ما الخدمات الهندسية التي تقدمها أساس للاستشارات الهندسية وإدارة المشاريع؟',
        answerEn:
          'ASAS provides architectural, structural, civil and electromechanical design, quantity and cost services, project management, construction supervision, infrastructure, traffic studies, urban planning, sustainability and interior design.',
        answerAr:
          'تقدم أساس للاستشارات الهندسية وإدارة المشاريع التصميم المعماري والإنشائي والمدني والكهروميكانيكي، وخدمات الكميات والتكلفة، وإدارة المشاريع والإشراف، والبنية التحتية ودراسات المرور والتخطيط الحضري والاستدامة والتصميم الداخلي.',
      },
      {
        id: 'sectors',
        questionEn: 'What project sectors does ASAS work across?',
        questionAr: 'ما القطاعات التي تعمل فيها أساس للاستشارات الهندسية وإدارة المشاريع؟',
        answerEn:
          'The portfolio includes towers, commercial and residential buildings, industrial facilities, infrastructure, schools, villas, compounds and interiors.',
        answerAr:
          'تشمل الأعمال الأبراج والمباني التجارية والسكنية والمنشآت الصناعية والبنية التحتية والمدارس والفلل والمجمعات والتصميم الداخلي.',
      },
      {
        id: 'supervision',
        questionEn: 'Does ASAS provide both design and supervision?',
        questionAr: 'هل تقدم أساس للاستشارات الهندسية وإدارة المشاريع التصميم والإشراف؟',
        answerEn:
          'Yes. ASAS provides coordinated design services and resident engineering and site supervision through construction and handover.',
        answerAr:
          'نعم. تقدم أساس للاستشارات الهندسية وإدارة المشاريع خدمات تصميم منسقة وهندسة مقيمة وإشرافاً موقعياً خلال التنفيذ والتسليم.',
      },
      {
        id: 'office',
        questionEn: 'Where is the ASAS office?',
        questionAr: 'أين يقع مكتب أساس للاستشارات الهندسية وإدارة المشاريع؟',
        answerEn:
          'The office is in Musaffah East 9, Abu Dhabi, behind Safeer Mall, in ADCP Building No. P1239.',
        answerAr:
          'يقع المكتب في مصفح شرق 9 في أبوظبي، خلف سفير مول، في مبنى ADCP رقم P1239.',
      },
      {
        id: 'lifecycle',
        questionEn: 'How does a project progress with ASAS?',
        questionAr: 'كيف يتقدم المشروع مع أساس للاستشارات الهندسية وإدارة المشاريع؟',
        answerEn:
          'The documented lifecycle covers concept and brief, design, tender, construction, snagging, final handover, financial closure and future phases.',
        answerAr:
          'تشمل دورة الحياة الموثقة الفكرة والموجز والتصميم والعطاء والتنفيذ وحصر الملاحظات والتسليم النهائي والإغلاق المالي والمراحل المستقبلية.',
      },
    ],

    portfolioFeaturedSlug: 'four-towers-al-nahda',
    portfolioGridSlugs: [
      'amwaj-tower-al-raha',
      'hotel-abu-dhabi-island-e10',
      'mosque-al-shamkha-sh9',
      'public-bathroom-louvre-saadiyat',
    ],
  };
}
