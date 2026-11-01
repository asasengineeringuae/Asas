import {randomBytes} from 'crypto';
import {ensureCollection, readCollection, writeCollection} from '@/lib/cms/json-store';

const COLLECTION = 'social-posts';

function nowIso() {
  return new Date().toISOString();
}

export function emptySocialPost(overrides = {}) {
  const id = String(overrides.id || '').trim() || `sp_${randomBytes(6).toString('hex')}`;
  return {
    id: `sp_${randomBytes(6).toString('hex')}`,
    caption: '',
    captionAr: '',
    link: '',
    mediaUrl: '',
    platforms: ['facebook', 'instagram', 'linkedin', 'x'],
    status: 'draft',
    results: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    publishedAt: null,
    ...overrides,
    id,
  };
}

export async function listSocialPosts() {
  const items = await ensureCollection(COLLECTION, () => []);
  return [...items].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
}

export async function saveSocialPost(payload) {
  const items = await listSocialPosts();
  const incoming = emptySocialPost(payload || {});
  const index = items.findIndex((item) => item.id === incoming.id);
  const next = {
    ...(index >= 0 ? items[index] : emptySocialPost()),
    ...incoming,
    updatedAt: nowIso(),
  };
  if (index >= 0) items[index] = next;
  else items.unshift(next);
  await writeCollection(COLLECTION, items);
  return next;
}

export async function deleteSocialPost(id) {
  const items = await readCollection(COLLECTION);
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) {
    const error = new Error('Post not found');
    error.status = 404;
    throw error;
  }
  await writeCollection(COLLECTION, next);
  return true;
}
