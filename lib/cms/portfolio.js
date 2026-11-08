import {
  deleteCollectionItem,
  ensureCollection,
  upsertCollectionItem,
} from './json-store';
import {
  countPortfolioRows,
  deletePortfolioRow,
  getPortfolioRow,
  listPortfolioRows,
  replacePortfolioRows,
  upsertPortfolioRow,
} from './project-database';

const LEGACY_PROJECT_SLUGS = new Set([
  'traffic-access-studies',
  'culture-private-school',
  'emirates-private-school',
  'american-international-school',
  'compound-villas-portfolio',
  'reception-hall-private-villa',
  'residential-villa-al-shamkha-sh3',
  'majlis-and-dining',
  'hotel-lobby-interior',
]);

function slugish(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKC')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function matchSectorSlug(value, sectors = []) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const slug = slugish(raw);
  const found = sectors.find(
    (sector) =>
      sector.slug === raw ||
      sector.slug === slug ||
      sector.projectCategory === raw ||
      (Array.isArray(sector.relatedCategories) && sector.relatedCategories.includes(raw)),
  );
  return found?.slug || '';
}

function matchServiceSlug(value, services = []) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const slug = slugish(raw);
  const found = services.find(
    (service) =>
      service.slug === raw ||
      service.slug === slug ||
      slugish(service.title) === slug ||
      slugish(service.titleAr) === slug,
  );
  return found?.slug || '';
}

export function normalizeProjectRelations(project = {}, sectors = [], services = []) {
  const sectorValues = Array.isArray(project.sectors) && project.sectors.length
    ? project.sectors
    : project.category
      ? [project.category]
      : [];
  const serviceValues = Array.isArray(project.services) ? project.services : [];
  const sectorSlugs = [...new Set(sectorValues.map((value) => matchSectorSlug(value, sectors)).filter(Boolean))];
  const serviceSlugs = [...new Set(serviceValues.map((value) => matchServiceSlug(value, services)).filter(Boolean))];
  const primarySector = sectors.find((sector) => sector.slug === sectorSlugs[0]);
  const currentCategory = String(project.category || '').trim();
  return {
    ...project,
    sectors: sectorSlugs,
    services: serviceSlugs,
    category: currentCategory || primarySector?.projectCategory || '',
  };
}

async function seedProjects() {
  const {readFile} = await import('fs/promises');
  const path = await import('path');
  const file = path.join(process.cwd(), 'content', 'cms', 'projects.json');
  try {
    const parsed = JSON.parse(await readFile(file, 'utf8'));
    return clone(Array.isArray(parsed) ? parsed : []).map((project) => ({
      status: 'published',
      ...project,
    }));
  } catch {
    return [];
  }
}

export async function loadProjectsCollection() {
  if (countPortfolioRows() === 0) {
    const fromJson = await ensureCollection('projects', seedProjects);
    const clean = fromJson.filter((item) => item?.slug && !LEGACY_PROJECT_SLUGS.has(item.slug));
    const seed = clean.length ? clean : await seedProjects();
    replacePortfolioRows(seed);
  }
  const existing = listPortfolioRows();
  const seed = await seedProjects();
  const have = new Set(existing.map((item) => item.slug));
  const missing = seed.filter((item) => item.slug && !have.has(item.slug) && !LEGACY_PROJECT_SLUGS.has(item.slug));
  if (missing.length) {
    for (const item of missing) upsertPortfolioRow(item);
    return listPortfolioRows();
  }
  return existing;
}

export async function getProjects() {
  const {getSectors, getServices} = await import('./content-service');
  const [items, sectors, services] = await Promise.all([
    loadProjectsCollection(),
    getSectors(),
    getServices(),
  ]);
  return items.map((item) => normalizeProjectRelations(item, sectors, services));
}

export async function getProjectBySlug(slug) {
  await loadProjectsCollection();
  const row = getPortfolioRow(slug);
  if (!row) return null;
  const {getSectors, getServices} = await import('./content-service');
  const [sectors, services] = await Promise.all([getSectors(), getServices()]);
  return normalizeProjectRelations(row, sectors, services);
}

export async function saveProject(project) {
  if (!project?.slug) {
    const error = new Error('Project slug is required');
    error.status = 400;
    throw error;
  }
  const {getSectors, getServices} = await import('./content-service');
  const [sectors, services] = await Promise.all([getSectors(), getServices()]);
  const linked = normalizeProjectRelations(project, sectors, services);
  const saved = upsertPortfolioRow({
    ...linked,
    id: linked.id || linked.slug,
    status: linked.status || 'published',
    updatedAt: nowIso(),
  });
  await upsertCollectionItem('projects', saved, 'slug');
  return saved;
}

export async function deleteProject(slug) {
  deletePortfolioRow(slug);
  return deleteCollectionItem('projects', slug, 'slug');
}
