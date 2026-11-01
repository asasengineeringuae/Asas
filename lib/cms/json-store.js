import {mkdir, readFile, writeFile} from 'fs/promises';
import path from 'path';
import {tmpdir} from 'os';

const SEED_DIR = path.join(process.cwd(), 'content', 'cms');
const LOCAL_DATA_DIR = path.join(process.cwd(), '.data', 'cms');
const TMP_DATA_DIR = path.join(tmpdir(), 'asas', 'cms');

function isServerless() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function runtimeDir() {
  return isServerless() ? TMP_DATA_DIR : LOCAL_DATA_DIR;
}

function dataPath(name) {
  return path.join(runtimeDir(), `${name}.json`);
}

function seedPath(name) {
  return path.join(SEED_DIR, `${name}.json`);
}

function cmsMemory() {
  if (!globalThis.__asasCmsDocs) {
    globalThis.__asasCmsDocs = new Map();
  }
  return globalThis.__asasCmsDocs;
}

function isEmptyValue(value) {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

async function readJson(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Read a JSON document. Prefers in-memory overlay, then runtime store, then committed seed.
 */
export async function readDocument(name, defaultValue = null) {
  const mem = cmsMemory().get(name);
  if (!isEmptyValue(mem)) return mem;
  let parsed = await readJson(dataPath(name));
  if (isEmptyValue(parsed)) {
    parsed = await readJson(seedPath(name));
  }
  if (isEmptyValue(parsed)) return defaultValue;
  return parsed;
}

/**
 * Write a JSON document to memory + writable runtime dir.
 * On local/dev also dual-writes the committed seed file.
 */
export async function writeDocument(name, value) {
  cmsMemory().set(name, value);
  const payload = `${JSON.stringify(value, null, 2)}\n`;
  let saved = false;
  try {
    await mkdir(runtimeDir(), {recursive: true});
    await writeFile(dataPath(name), payload, 'utf8');
    saved = true;
  } catch {
    // Runtime FS may still fail; memory overlay keeps this isolate consistent.
  }
  if (!isServerless()) {
    try {
      await mkdir(SEED_DIR, {recursive: true});
      await writeFile(seedPath(name), payload, 'utf8');
      saved = true;
    } catch {
      // Seed dual-write is best-effort locally.
    }
  }
  try {
    const {invalidateAiKnowledge} = await import('@/lib/ai/knowledge-cache');
    invalidateAiKnowledge();
  } catch {
    // AI cache is optional for CMS writes.
  }
  return value;
}

export async function readCollection(name) {
  const value = await readDocument(name, []);
  return Array.isArray(value) ? value : [];
}

export async function writeCollection(name, items) {
  const list = Array.isArray(items) ? items : [];
  await writeDocument(name, list);
  return list;
}

export async function upsertCollectionItem(name, item, idKey = 'id') {
  const items = await readCollection(name);
  const key = item?.[idKey];
  if (key == null) {
    const error = new Error(`Item is missing ${idKey}`);
    error.status = 400;
    throw error;
  }
  const index = items.findIndex((entry) => entry?.[idKey] === key);
  if (index >= 0) {
    items[index] = {...items[index], ...item};
  } else {
    items.push(item);
  }
  await writeCollection(name, items);
  return items.find((entry) => entry?.[idKey] === key);
}

export async function deleteCollectionItem(name, id, idKey = 'id') {
  const items = await readCollection(name);
  const next = items.filter((entry) => entry?.[idKey] !== id);
  if (next.length === items.length) {
    const error = new Error('Item not found');
    error.status = 404;
    throw error;
  }
  await writeCollection(name, next);
  return true;
}

export async function ensureDocument(name, factory) {
  const existing = await readDocument(name, null);
  if (!isEmptyValue(existing)) return existing;
  const created = typeof factory === 'function' ? await factory() : factory;
  const value = created == null ? {} : created;
  await writeDocument(name, value);
  return value;
}

export async function ensureCollection(name, factory) {
  const existing = await readCollection(name);
  if (existing.length) return existing;
  const created = typeof factory === 'function' ? await factory() : factory;
  const items = Array.isArray(created) ? created : [];
  await writeCollection(name, items);
  return items;
}

export {LOCAL_DATA_DIR as DATA_DIR, SEED_DIR};
