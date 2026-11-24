import {ensureCollection, upsertCollectionItem} from './json-store';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

async function seedClients() {
  const mod = await import('@/data/clients');
  return clone(mod.clients || []);
}

const KEEP_SVG = new Set(['presidential-court', 'national-museum', 'military-housing']);

function preferEditedPng(item) {
  if (!item?.logo || KEEP_SVG.has(item.id)) return item;
  if (typeof item.logo === 'string' && item.logo.endsWith('.svg')) {
    return {...item, logo: item.logo.replace(/\.svg$/, '.png')};
  }
  return item;
}

export async function getClients() {
  const items = await ensureCollection('clients', seedClients);
  return Array.isArray(items) ? items.map(preferEditedPng) : items;
}

export async function saveClient(client) {
  if (!client?.id) {
    const error = new Error('Client id is required');
    error.status = 400;
    throw error;
  }
  return upsertCollectionItem('clients', {...client, updatedAt: nowIso()}, 'id');
}
