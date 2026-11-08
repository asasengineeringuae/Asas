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

export async function getClients() {
  return ensureCollection('clients', seedClients);
}

export async function saveClient(client) {
  if (!client?.id) {
    const error = new Error('Client id is required');
    error.status = 400;
    throw error;
  }
  return upsertCollectionItem('clients', {...client, updatedAt: nowIso()}, 'id');
}
