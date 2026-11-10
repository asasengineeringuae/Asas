import {galleryItems as gallerySeed} from '@/data/gallery';
import {roleImages} from '@/data/image-manifest';

export function pad(n) {
  return String(n).padStart(2, '0');
}

const FEATURED_SLUGS = [
  'labor-community-meg',
  'four-towers-al-nahda',
  'amwaj-tower-al-raha',
  'hotel-abu-dhabi-island-e10',
  'mosque-al-shamkha-sh9',
  'villa-g1-roof',
  'villa-al-rumaithi',
];

const FOCUS_SLUGS = [
  'marine-complex-alaliah-island',
  'public-bathroom-louvre-saadiyat',
  'industrial-musaffah-m15-6',
  'villa-g1-roof',
  'villa-al-rumaithi',
  'mosque-mbz-city',
  'labor-community-meg',
];

function enrich(item, locale, projectBySlug) {
  const ar = locale === 'ar';
  const project = item.slug ? projectBySlug.get(item.slug) : null;
  return {
    ...item,
    label: project ? (ar ? project.titleAr : project.title) : ar ? item.titleAr : item.title,
    href: project ? `/${locale}/projects/${project.slug}` : null,
    location:
      (ar ? project?.locationShortAr || project?.locationAr : project?.locationShort || project?.location) ||
      null,
    caption: project ? (ar ? project.titleAr : project.title) : ar ? item.titleAr : item.title,
  };
}

export function buildJournalCatalog(locale, {items, projects} = {}) {
  const galleryItems = Array.isArray(items) && items.length ? items : gallerySeed;
  const projectList = Array.isArray(projects) ? projects : [];
  const projectBySlug = new Map(projectList.map((p) => [p.slug, p]));
  const extras = [];
  const haveSlug = new Set(galleryItems.map((item) => item.slug).filter(Boolean));
  for (const project of projectList) {
    const imgs = (project.gallery || project.images || []).filter(Boolean);
    const cover = imgs[0] || project.image || project.visual?.src;
    if (project.slug === 'villa-g1-roof' || project.slug === 'villa-al-rumaithi') {
      imgs.forEach((src, index) => {
        extras.push({
          id: `${project.slug}-asset-${index}`,
          src,
          slug: project.slug,
          title: project.title,
          titleAr: project.titleAr,
          category: 'interior',
        });
      });
      continue;
    }
    if (project.slug === 'labor-community-meg') {
      imgs.forEach((src, index) => {
        extras.push({
          id: `${project.slug}-asset-${index}`,
          src,
          slug: project.slug,
          title: project.title,
          titleAr: project.titleAr,
          category: 'architecture',
        });
      });
      continue;
    }
    if (cover && !haveSlug.has(project.slug)) {
      extras.push({
        id: `${project.slug}-cover`,
        src: cover,
        slug: project.slug,
        title: project.title,
        titleAr: project.titleAr,
        category: 'architecture',
      });
    }
  }
  return [...galleryItems, ...extras].map((item) => enrich(item, locale, projectBySlug));
}

function uniqueBySlug(items, slugs, used) {
  const out = [];
  for (const slug of slugs) {
    const hit = items.find((i) => i.slug === slug && !used.has(i.id));
    if (hit) {
      used.add(hit.id);
      out.push(hit);
    }
  }
  return out;
}

function takeCategory(items, category, used, limit) {
  const out = [];
  const seenSlug = new Set();
  const seenSrc = new Set();
  for (const item of items) {
    if (out.length >= limit) break;
    if (item.category !== category || used.has(item.id)) continue;
    const slugKey = item.slug || item.id;
    const srcKey = item.src;
    if (slugKey && seenSlug.has(slugKey)) continue;
    if (srcKey && seenSrc.has(srcKey)) continue;
    if (slugKey) seenSlug.add(slugKey);
    if (srcKey) seenSrc.add(srcKey);
    used.add(item.id);
    out.push(item);
  }
  return out;
}

/**
 * Only sections with real assets are returned.
 * On Site / Offices / Events / Company Life omitted — no photo packs in repo.
 */
export function buildJournalNarrative(catalog) {
  const used = new Set();

  const featured = uniqueBySlug(catalog, FEATURED_SLUGS, used);
  const featuredSlugs = new Set(featured.map((item) => item.slug).filter(Boolean));
  if (featured.length < 6) {
    for (const item of catalog) {
      if (featured.length >= 6) break;
      if (used.has(item.id) || item.category !== 'architecture') continue;
      if (item.slug && featuredSlugs.has(item.slug)) continue;
      used.add(item.id);
      if (item.slug) featuredSlugs.add(item.slug);
      featured.push(item);
    }
  }

  const architecture = takeCategory(catalog, 'architecture', used, 18);
  // Client asked to drop the old interiors pack from the public gallery.
  const interiors = catalog.filter(
    (item) => (item.slug === 'villa-g1-roof' || item.slug === 'villa-al-rumaithi') && !used.has(item.id),
  );
  interiors.forEach((item) => used.add(item.id));
  const focus = uniqueBySlug(catalog, FOCUS_SLUGS, used);

  const sections = [
    {id: 'featured', en: 'Featured', ar: 'مميز', count: featured.length},
    architecture.length
      ? {id: 'architecture', en: 'Architecture', ar: 'عمارة', count: architecture.length}
      : null,
    interiors.length
      ? {id: 'interiors', en: 'Interiors', ar: 'تصميم داخلي', count: interiors.length}
      : null,
    focus.length
      ? {id: 'focus', en: 'Projects in Focus', ar: 'مشاريع في الواجهة', count: focus.length}
      : null,
  ].filter(Boolean);

  return {featured, architecture, interiors, focus, sections};
}

/** Homepage teaser — max 6 real images, asymmetric mix from available assets only. */
export function buildHomeGalleryTeaser(locale) {
  const catalog = buildJournalCatalog(locale);
  const picks = [];
  const used = new Set();

  const want = [
    'labor-community-meg',
    ...FEATURED_SLUGS.slice(1, 3),
    'industrial-facility-musaffah-m42',
    'private-villa-khalifa-se24',
    'villa-g1-roof',
    'villa-al-rumaithi',
  ];

  for (const slug of want) {
    const hit = catalog.find((i) => i.slug === slug && !used.has(i.id));
    if (hit) {
      used.add(hit.id);
      picks.push(hit);
    }
  }

  while (picks.length < 6) {
    const next = catalog.find((i) => !used.has(i.id));
    if (!next) break;
    used.add(next.id);
    picks.push(next);
  }

  // Optional company editorial as last slot if under 6 and asset exists
  if (picks.length < 6 && roleImages.COMPANY_OVERVIEW) {
    picks.push({
      id: 'home-corporate',
      src: roleImages.COMPANY_OVERVIEW,
      label: locale === 'ar' ? 'أساس' : 'ASAS',
      category: 'architecture',
      caption: locale === 'ar' ? 'أساس' : 'ASAS',
    });
  }

  return picks.slice(0, 6);
}
