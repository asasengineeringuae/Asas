import Link from 'next/link';
import Image from 'next/image';
import HomeContactForm from '@/components/HomeContactForm';
import ServicesTabs from '@/components/home/ServicesTabs';
import HeroSlider from '@/components/home/HeroSlider';
import SectorShowcase from '@/components/home/SectorShowcase';
import HomeTeamSection from '@/components/team/HomeTeamSection';
import WireframeSphere from '@/components/home/WireframeSphere';
import ClientsMarquee from '@/components/home/ClientsMarquee';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import {ActionButton, ActionGroup} from '@/components/ActionButton';
import {whyIcons} from '@/components/icons/WhyIcons';
import {ArrowRight, Mail, MapPin, MessageCircle, Phone} from 'lucide-react';
import {company as companySeed} from '@/data/company';
import {featuredServices as featuredServicesSeed, services as servicesSeed} from '@/data/services';
import {sectors as sectorsSeed} from '@/data/sectors';
import {projectLifecycle} from '@/data/method';
import {getHomepageTeamMembers} from '@/data/team';
import {roleImages, homeSectorImages} from '@/data/image-manifest';
import ProjectVisualFallback from '@/components/ProjectVisualFallback';
import {
  getPublicCompany,
  getPublicFeaturedServices,
  getPublicHomepage,
  getPublicProjects,
  getPublicServices,
  getPublicSectors,
  getPublicClients,
  getPublicTestimonials,
  orderedHomepageSections,
} from '@/lib/cms/public-data';
import {staticPageMetadata} from '@/lib/cms/seo/page-meta';

const defaultPortfolioGridSlugs = [
  'amwaj-tower-al-raha',
  'hotel-abu-dhabi-island-e10',
  'mosque-al-shamkha-sh9',
  'public-bathroom-louvre-saadiyat',
];
const phases = projectLifecycle;

const fallbackHeroSlides = [
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
];

const fallbackSectorCards = [
  {key: 'towers-high-rise', image: homeSectorImages['towers-high-rise'], label: 'Towers', labelAr: 'الأبراج', title: 'Towers & high-rise', titleAr: 'الأبراج والمباني العالية', copy: 'Architectural, structural and electromechanical design', copyAr: 'تصميم معماري وإنشائي وكهروميكانيكي', tone: 'dark'},
  {key: 'commercial-residential-buildings', image: homeSectorImages['commercial-residential-buildings'], label: 'Buildings', labelAr: 'المباني', title: 'Commercial & residential', titleAr: 'التجاري والسكني', copy: 'Building design across coordinated disciplines', copyAr: 'تصميم مبانٍ عبر تخصصات منسقة', tone: 'dark'},
  {key: 'infrastructure-urban-planning', image: homeSectorImages['infrastructure-urban-planning'], label: 'Infrastructure', labelAr: 'البنية التحتية', title: 'Infrastructure & planning', titleAr: 'البنية التحتية والتخطيط', copy: 'Traffic, access, parking and municipality review', copyAr: 'المرور والمداخل والمواقف ومراجعة البلدية', tone: 'light'},
  {key: 'education', image: homeSectorImages.education, label: 'Education', labelAr: 'التعليم', title: 'Schools', titleAr: 'المدارس', copy: 'Campus planning and educational facilities', copyAr: 'تخطيط الحرم والمرافق التعليمية', tone: 'light'},
  {key: 'villas-compounds-palaces', image: homeSectorImages['villas-compounds-palaces'], label: 'Residential', labelAr: 'السكني', title: 'Villas & compounds', titleAr: 'الفلل والمجمعات', copy: 'Private villas, residential villas and compounds', copyAr: 'فلل خاصة وسكنية ومجمعات', tone: 'dark'},
  {key: 'interior-hospitality-retail', image: homeSectorImages['interior-hospitality-retail'], label: 'Interiors', labelAr: 'التصميم الداخلي', title: 'Interior design', titleAr: 'التصميم الداخلي', copy: 'Residential, hospitality and retail interiors', copyAr: 'تصميمات سكنية وضيافة وتجزئة', tone: 'dark'},
];

const content = {
  en: {
    eyebrow: 'Established in Abu Dhabi · 2009',
    hero: 'From Sketch to Final Handover.',
    lede: 'Architecture, structure, electromechanical services, quantity surveying, project management and site supervision in one consultancy.',
    start: 'Start a project', work: 'View our work', journey: 'Project lifecycle',
    sectorEyebrow: 'Project sectors',
    sectorTitle: 'Projects across diverse sectors.',
    sectorCopy: 'Project experience across the building types and environments represented in the ASAS portfolio.',
    sectorCta: 'View all sectors',
    processEyebrow: 'Project lifecycle', processTitle: 'From concept to financial closure', processCopy: 'A documented route through design, award, construction, handover and future phases.',
    archive: 'Selected work', archiveTitle: 'Projects from the official ASAS portfolio', archiveCopy: 'A featured project with supporting work across towers, infrastructure, education, compounds and interiors.', archiveCta: 'View all projects',
    featured: 'Selected project',
    featuredTitle: 'Four Towers, Al Nahda',
    featuredDesc:
      'Four towers consisting of 3 basement levels, 6 podium levels, 6 parking levels and 37 floors.',
    dossier: [
      ['Type', 'Planning study'],
      ['Scope', 'Access & parking'],
      ['Review', 'Municipality'],
      ['Location', 'Abu Dhabi'],
    ],
    viewProject: 'View project',
  },
  ar: {
    eyebrow: 'تأسست في أبوظبي · 2009',
    hero: 'من الرسم إلى التسليم النهائي.',
    lede: 'العمارة والإنشاءات والأعمال الكهروميكانيكية وحصر الكميات وإدارة المشاريع والإشراف الموقعي في مكتب استشاري واحد.',
    start: 'ابدأ مشروعك', work: 'استكشف أعمالنا', journey: 'دورة حياة المشروع',
    sectorEyebrow: 'قطاعات المشاريع',
    sectorTitle: 'مشاريع عبر قطاعات متعددة.',
    sectorCopy: 'خبرة عبر أنواع وبيئات المشاريع الواردة في أعمال أساس للاستشارات الهندسية وإدارة المشاريع.',
    sectorCta: 'عرض كل القطاعات',
    processEyebrow: 'دورة حياة المشروع', processTitle: 'من الفكرة إلى الإغلاق المالي', processCopy: 'مسار موثق يمر بالتصميم والترسية والتنفيذ والتسليم والمراحل المستقبلية.',
    archive: 'أعمال مختارة', archiveTitle: 'مشاريع من الملف الرسمي لأساس للاستشارات الهندسية وإدارة المشاريع', archiveCopy: 'مشروع مختار مع أعمال داعمة عبر الأبراج والبنية التحتية والتعليم والمجمعات والتصميم الداخلي.', archiveCta: 'عرض كل المشاريع',
    featured: 'مشروع مختار',
    featuredTitle: 'أربعة أبراج، النهدة',
    featuredDesc:
      'أربعة أبراج تتكون من 3 طوابق سفلية و6 طوابق منصة و6 طوابق مواقف و37 طابقاً.',
    dossier: [
      ['النوع', 'دراسة تخطيطية'],
      ['النطاق', 'المداخل والمواقف'],
      ['المراجعة', 'البلدية'],
      ['الموقع', 'أبوظبي'],
    ],
    viewProject: 'عرض المشروع',
  },
};

const fallbackWhyPoints = {
  en: [
    ['Cross-discipline checking', 'Drawings, specifications and bills of quantities are checked across disciplines before issue.'],
    ['Timely reporting', 'Scheduled progress, cost and quality reports support the project lifecycle.'],
    ['Integrated project cycle', 'Primary design, final design, tender and construction are managed as one connected cycle.'],
    ['Records and commitment', 'Project records are retained and remain available to clients after handover.'],
  ],
  ar: [
    ['مراجعة بين التخصصات', 'تُراجع الرسومات والمواصفات وجداول الكميات بين التخصصات قبل الإصدار.'],
    ['تقارير في مواعيدها', 'تدعم تقارير التقدم والتكلفة والجودة المجدولة دورة حياة المشروع.'],
    ['دورة مشروع متكاملة', 'تُدار مراحل التصميم الأولي والنهائي والعطاء والتنفيذ كدورة مترابطة.'],
    ['السجلات والالتزام', 'تُحفظ سجلات المشروع وتظل متاحة للعملاء بعد التسليم.'],
  ],
};

const fallbackFaqs = {
  en: [
    ['What engineering services does ASAS provide?', 'ASAS provides architectural, structural, civil and electromechanical design, quantity and cost services, project management, construction supervision, infrastructure, traffic studies, urban planning, sustainability and interior design.'],
    ['What project sectors does ASAS work across?', 'The portfolio includes towers, commercial and residential buildings, industrial facilities, infrastructure, schools, villas, compounds and interiors.'],
    ['Does ASAS provide both design and supervision?', 'Yes. ASAS provides coordinated design services and resident engineering and site supervision through construction and handover.'],
    ['Where is the ASAS office?', 'The office is in Musaffah East 9, Abu Dhabi, behind Safeer Mall, in ADCP Building No. P1239.'],
    ['How does a project progress with ASAS?', 'The documented lifecycle covers concept and brief, design, tender, construction, snagging, final handover, financial closure and future phases.'],
  ],
  ar: [
    ['ما الخدمات الهندسية التي تقدمها أساس للاستشارات الهندسية وإدارة المشاريع؟', 'تقدم أساس للاستشارات الهندسية وإدارة المشاريع التصميم المعماري والإنشائي والمدني والكهروميكانيكي، وخدمات الكميات والتكلفة، وإدارة المشاريع والإشراف، والبنية التحتية ودراسات المرور والتخطيط الحضري والاستدامة والتصميم الداخلي.'],
    ['ما القطاعات التي تعمل فيها أساس للاستشارات الهندسية وإدارة المشاريع؟', 'تشمل الأعمال الأبراج والمباني التجارية والسكنية والمنشآت الصناعية والبنية التحتية والمدارس والفلل والمجمعات والتصميم الداخلي.'],
    ['هل تقدم أساس للاستشارات الهندسية وإدارة المشاريع التصميم والإشراف؟', 'نعم. تقدم أساس للاستشارات الهندسية وإدارة المشاريع خدمات تصميم منسقة وهندسة مقيمة وإشرافاً موقعياً خلال التنفيذ والتسليم.'],
    ['أين يقع مكتب أساس للاستشارات الهندسية وإدارة المشاريع؟', 'يقع المكتب في مصفح شرق 9 في أبوظبي، خلف سفير مول، في مبنى ADCP رقم P1239.'],
    ['كيف يتقدم المشروع مع أساس للاستشارات الهندسية وإدارة المشاريع؟', 'تشمل دورة الحياة الموثقة الفكرة والموجز والتصميم والعطاء والتنفيذ وحصر الملاحظات والتسليم النهائي والإغلاق المالي والمراحل المستقبلية.'],
  ],
};

function NextArrow({ar}) { return <ArrowRight className={ar ? 'reverse-arrow' : ''}/>; }

function resolveWhyPoints(homepage, ar) {
  const cms = homepage?.whyPoints;
  if (Array.isArray(cms) && cms.length) {
    return cms.map((item) => [
      ar ? item.titleAr || item.titleEn : item.titleEn || item.titleAr,
      ar ? item.bodyAr || item.bodyEn : item.bodyEn || item.bodyAr,
    ]);
  }
  return fallbackWhyPoints[ar ? 'ar' : 'en'];
}

function resolveFaqs(homepage, ar) {
  const cms = homepage?.faqs;
  if (Array.isArray(cms) && cms.length) {
    return cms.map((item) => [
      ar ? item.questionAr || item.questionEn : item.questionEn || item.questionAr,
      ar ? item.answerAr || item.answerEn : item.answerEn || item.answerAr,
    ]);
  }
  return fallbackFaqs[ar ? 'ar' : 'en'];
}

export const dynamic = 'force-dynamic';

export const generateMetadata = staticPageMetadata({
  path: '',
  titleEn: 'ASAS Engineering & Project Management Consultancy',
  titleAr: 'أساس للاستشارات الهندسية وإدارة المشاريع',
  descriptionEn: companySeed.description,
  descriptionAr: companySeed.descriptionAr,
  schemaType: 'WebSite',
});


export default async function Home({params}) {
  const {locale} = await params;
  const ar = locale === 'ar';
  const [
    homepage,
    company,
    projects,
    services,
    sectors,
    featuredServices,
    featuredTeam,
    clients,
    testimonials,
  ] = await Promise.all([
    getPublicHomepage(),
    getPublicCompany(),
    getPublicProjects(),
    getPublicServices(),
    getPublicSectors(),
    getPublicFeaturedServices(),
    getHomepageTeamMembers({limit: 4}),
    getPublicClients(),
    getPublicTestimonials(),
  ]);

  const cmsCopy = homepage?.copy?.[ar ? 'ar' : 'en'];
  const t = {
    ...content[ar ? 'ar' : 'en'],
    ...(cmsCopy || {}),
    dossier: content[ar ? 'ar' : 'en'].dossier,
  };
  const url = (path) => `/${locale}/${path}`;

  const heroSlides = (homepage?.heroSlides?.length ? homepage.heroSlides : fallbackHeroSlides).filter(
    (slide) => slide && slide.enabled !== false && (slide.image || slide.video),
  );
  const sectorCards = homepage?.sectorCards?.length ? homepage.sectorCards : fallbackSectorCards;
  const about = homepage?.about || {};
  const hasAboutCopy = Boolean(about.titleEn || about.titleAr || about.bodyEn || about.bodyAr);
  const whyList = resolveWhyPoints(homepage, ar);
  const faqList = resolveFaqs(homepage, ar);

  const featuredSlug = homepage?.portfolioFeaturedSlug || 'labor-community-meg';
  const featuredProject = projects.find((project) => project.slug === featuredSlug)
    || projects.find((project) => project.featured && project.visual)
    || projects.find((project) => project.visual);
  const fallbackGridSlugs = defaultPortfolioGridSlugs;
  const requestedGrid = (homepage?.portfolioGridSlugs?.length
    ? homepage.portfolioGridSlugs
    : fallbackGridSlugs
  ).filter((slug) => slug !== featuredProject?.slug);
  const portfolioGrid = [];
  const seenGrid = new Set();
  for (const slug of [...requestedGrid, ...fallbackGridSlugs, ...projects.map((p) => p.slug)]) {
    if (portfolioGrid.length >= 4) break;
    if (!slug || slug === featuredProject?.slug || seenGrid.has(slug)) continue;
    const hit = projects.find((project) => project.slug === slug && project.visual?.src);
    if (!hit) continue;
    seenGrid.add(slug);
    portfolioGrid.push(hit);
  }
  const tabsServices = featuredServices?.length ? featuredServices : featuredServicesSeed;
  const projectCount = Math.max(1000, projects?.length || 0);
  const serviceCount = services?.length || servicesSeed.length;
  const sectorCount = sectors?.length || sectorsSeed.length;

  const aboutTitle = hasAboutCopy
    ? (ar ? about.titleAr || about.titleEn : about.titleEn || about.titleAr)
    : (ar ? 'استشارات هندسية من أبوظبي منذ 2009' : 'Abu Dhabi engineering consultancy since 2009');
  const aboutBody = hasAboutCopy
    ? (ar ? about.bodyAr || about.bodyEn : about.bodyEn || about.bodyAr)
    : (ar ? company.descriptionAr : company.description);
  const aboutNote = hasAboutCopy
    ? (ar ? about.noteAr || about.noteEn : about.noteEn || about.noteAr)
    : (ar ? company.shortDescriptionAr : company.shortDescription);
  const aboutImage = about.image || roleImages.HOME_ABOUT;
  const aboutCtaPrimary = ar
    ? about.ctaPrimaryAr || 'اعرف المزيد عنا'
    : about.ctaPrimaryEn || 'Learn more about us';
  const aboutCtaSecondary = ar
    ? about.ctaSecondaryAr || 'الملف التعريفي'
    : about.ctaSecondaryEn || 'Company profile';
  const aboutCtaPrimaryHref = about.ctaPrimaryHref || 'about';
  const aboutCtaSecondaryHref = about.ctaSecondaryHref || 'company-profile';

  const sections = {
    hero: <HeroSlider key="hero" locale={locale} slides={heroSlides} />,

    about: (
      <section className="hp-about" key="about">
        <div className="home-shell hp-about-layout">
          <div className="hp-about-visual">
            <Image src={aboutImage} alt="" width={1280} height={960} />
          </div>
          <WireframeSphere />
          <div className="hp-about-copy">
            <div className="hp-about-copy-inner">
              <p className="atlas-kicker">{ar ? 'عن ASAS' : 'About us'}</p>
              <h2>{aboutTitle}</h2>
              <p className="hp-about-lede">{aboutBody}</p>
              <p className="hp-about-note">{aboutNote}</p>
              <ActionGroup className="hp-about-actions">
                <ActionButton variant="outline" href={url(aboutCtaPrimaryHref)}>
                  {aboutCtaPrimary}
                </ActionButton>
                <ActionButton variant="primary" href={`/${locale}/${aboutCtaSecondaryHref}`} icon="file">
                  {aboutCtaSecondary}
                </ActionButton>
              </ActionGroup>
            </div>
          </div>
        </div>
      </section>
    ),

    clients: <ClientsMarquee key="clients" locale={locale} items={clients} />,

    services: <ServicesTabs key="services" locale={locale} services={tabsServices} />,

    stats: (
      <StatsSection
        key="stats"
        locale={locale}
        stats={[
          {
            id: 'years',
            value: Math.max(1, new Date().getFullYear() - Number(company.year || companySeed.year || 2009)),
            suffix: '+',
            label: 'Years Experience',
            labelAr: 'سنوات خبرة',
          },
          {
            id: 'projects',
            value: projectCount,
            suffix: '+',
            label: 'Projects',
            labelAr: 'مشاريع',
          },
          {
            id: 'services',
            value: serviceCount,
            suffix: '',
            label: 'Services',
            labelAr: 'خدمات',
          },
          {
            id: 'sectors',
            value: sectorCount,
            suffix: '',
            label: 'Sectors',
            labelAr: 'قطاعات',
          },
        ]}
      />
    ),

    sectors: (
      <SectorShowcase
        key="sectors"
        locale={locale}
        cards={sectorCards}
        eyebrow={t.sectorEyebrow}
        title={t.sectorTitle}
        copy={t.sectorCopy}
        cta={t.sectorCta}
      />
    ),

    process: (
      <section className="wf-process" key="process">
        <div className="home-shell wf-process-grid">
          <div className="wf-process-copy">
            <p className="atlas-kicker">{t.processEyebrow}</p>
            <h2>{t.processTitle}</h2>
            <p>{t.processCopy}</p>
          </div>
          <ol className="wf-process-list">
            {phases.map((phase) => (
              <li key={phase.number}>
                <span>{phase.number}</span>
                <div>
                  <h3>{ar ? phase.titleAr : phase.title}</h3>
                  <p>{ar ? phase.copyAr : phase.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    ),

    portfolio: (
      <section className="hp-portfolio" id="work" key="portfolio">
        <div className="home-shell">
          <div className="hp-portfolio-head">
            <div>
              <p className="atlas-kicker">{t.archive}</p>
              <h2>{t.archiveTitle}</h2>
              <p>{t.archiveCopy}</p>
            </div>
            <ActionButton variant="outline" href={url('projects')}>
              {t.archiveCta}
            </ActionButton>
          </div>

          {featuredProject && (
            <article className="hp-featured hp-card">
              <div className="hp-featured-visual">
                {featuredProject.visual?.src ? (
                  <Image
                    src={featuredProject.visual.src}
                    alt={ar ? featuredProject.titleAr : featuredProject.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: featuredProject.visual.crop || '50% 50%',
                    }}
                    priority
                  />
                ) : (
                  <ProjectVisualFallback project={featuredProject} locale={locale} />
                )}
              </div>
              <div className="hp-featured-copy">
                <p className="atlas-kicker">{t.featured}</p>
                <h3>{ar ? featuredProject.titleAr : featuredProject.title}</h3>
                <p>{ar ? featuredProject.descriptionAr : featuredProject.description}</p>
                <dl>
                  {(ar
                    ? [
                        ['النوع', featuredProject.kind === 'study' ? 'دراسة مفهوم' : featuredProject.kind === 'interior' ? 'تصميم داخلي' : 'مشروع'],
                        ['النطاق', featuredProject.scope || '—'],
                        ['الموقع', featuredProject.locationShortAr || featuredProject.locationAr || 'أبوظبي'],
                      ]
                    : [
                        ['Type', featuredProject.kind === 'study' ? 'Concept study' : featuredProject.kind === 'interior' ? 'Interior design' : 'Project'],
                        ['Scope', featuredProject.scope || '—'],
                        ['Location', featuredProject.locationShort || featuredProject.location || 'Abu Dhabi'],
                      ]
                  ).map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
                <ActionButton variant="ghost" href={url(`projects/${featuredProject.slug}`)}>
                  {t.viewProject}
                </ActionButton>
              </div>
            </article>
          )}

          <div className="hp-portfolio-grid">
            {portfolioGrid.map((project, index) => {
              const photo = project.visual?.classification === 'PROJECT_PHOTO'
                || project.visual?.classification === 'TECHNICAL_DRAWING';
              return (
                <article className="hp-portfolio-card hp-card" key={project.slug}>
                  <div className="hp-portfolio-media">
                    {project.visual?.src ? (
                      <Image
                        src={project.visual.src}
                        alt={photo ? (ar ? project.titleAr : project.title) : ''}
                        fill
                        sizes="(max-width: 900px) 50vw, 25vw"
                        style={{
                          objectFit: 'cover',
                          objectPosition: project.visual.crop || '50% 50%',
                        }}
                      />
                    ) : (
                      <ProjectVisualFallback project={project} locale={locale} />
                    )}
                  </div>
                  <div className="hp-portfolio-meta">
                    <small>0{index + 1}</small>
                    <h3>{ar ? project.titleAr : project.title}</h3>
                    <p>{project.locationShort
                      ? (ar ? project.locationShortAr : project.locationShort)
                      : (ar ? project.descriptionAr : project.description)}</p>
                    <Link className="atlas-link" href={url(`projects/${project.slug}`)}>
                      {ar ? 'عرض المشروع' : 'View project'}
                      <NextArrow ar={ar}/>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    ),

    why: (
      <section className="hp-why" key="why">
        <div className="home-shell">
          <div className="hp-why-head">
            <p className="atlas-kicker">{ar ? 'لماذا ASAS' : 'Why ASAS'}</p>
            <h2>{ar ? 'لماذا يختار العملاء ASAS' : 'Why clients choose ASAS'}</h2>
            <p>{ar ? 'جودة المخرجات والتقارير في مواعيدها وعلاقة عمل تستمر بعد التسليم.' : 'Quality output, timely reporting and a working relationship that continues after handover.'}</p>
          </div>
          <div className="hp-why-grid">
            {whyList.map(([title, text], index) => {
              const Icon = whyIcons[index] || whyIcons[0];
              return (
                <article className="hp-card" key={title}>
                  <span className="hp-why-badge"><Icon size={28} /></span>
                  <small>0{index + 1}</small>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              );
            })}
          </div>
          <aside className="hp-why-bridge">
            <p>{ar
              ? 'مكتب استشاري واحد في أبوظبي يغطي التصميم والإشراف من الفكرة إلى التسليم.'
              : 'One Abu Dhabi consultancy covering design and supervision from concept to handover.'}</p>
          </aside>
        </div>
      </section>
    ),

    testimonials: <TestimonialsSection key="testimonials" locale={locale} items={testimonials} />,

    team: <HomeTeamSection key="team" members={featuredTeam} locale={locale} />,

    contact: (
      <section className="home-contact" id="contact" key="contact">
        <div className="home-shell">
          <div className="home-contact-head">
            <p className="atlas-kicker center">{ar ? 'تواصل معنا' : 'Get in touch'}</p>
            <h2>{ar ? 'لنناقش مشروعك' : 'Let’s discuss your project'}</h2>
            <p>{ar
              ? 'هل أنت مستعد لبدء مشروعك الهندسي القادم؟ تواصل مع فريق ASAS.'
              : 'Ready to start your next engineering project? Contact the ASAS team.'}</p>
          </div>
          <div className="home-contact-layout">
            <div className="home-contact-details">
              <article>
                <MapPin aria-hidden="true" />
                <div>
                  <h3>{ar ? 'زورونا' : 'Visit us'}</h3>
                  <p>{ar ? company.addressAr : company.address}</p>
                </div>
              </article>
              <article>
                <Phone aria-hidden="true" />
                <div>
                  <h3>{ar ? 'اتصل بنا' : 'Call us'}</h3>
                  <a href={`tel:${String(company.phone || '').replace(/\s/g, '')}`} dir="ltr">{company.phone}</a>
                </div>
              </article>
              <article>
                <MessageCircle aria-hidden="true" />
                <div>
                  <h3>{ar ? 'واتساب' : 'WhatsApp'}</h3>
                  <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">{ar ? 'تواصل مع ASAS' : 'Message ASAS'}</a>
                </div>
              </article>
              <article>
                <Mail aria-hidden="true" />
                <div>
                  <h3>{ar ? 'البريد الإلكتروني' : 'Email'}</h3>
                  <a href={`mailto:${company.email}`} dir="ltr">{company.email}</a>
                </div>
              </article>
            </div>
            <HomeContactForm locale={locale} services={services} companyData={company} />
          </div>
        </div>
      </section>
    ),

    faq: (
      <section className="hp-faq" id="faq" key="faq">
        <div className="home-shell hp-faq-grid">
          <div className="hp-faq-intro">
            <p className="atlas-kicker">{ar ? 'أسئلة' : 'Questions'}</p>
            <h2>{ar ? 'بدء مشروع مع ASAS' : 'Starting a project with ASAS'}</h2>
          </div>
          <div className="hp-faq-list">
            {faqList.map(([question, answer], index) => (
              <details key={question}>
                <summary>
                  <span className="hp-faq-num ltr-isolate" dir="ltr">0{index + 1}</span>
                  <span className="hp-faq-q">{question}</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  };

  const ordered = orderedHomepageSections(homepage);

  return (
    <div className="asas-home atlas-home hp-revised">
      {ordered.map((section) => sections[section.id] || null)}
    </div>
  );
}
