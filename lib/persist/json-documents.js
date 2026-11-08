import {mkdir, readFile, writeFile, rename, unlink} from 'fs/promises';
import {randomUUID} from 'crypto';
import {tmpdir} from 'os';
import path from 'path';

function isServerless() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function isEmptyValue(value) {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

function memoryMap(key) {
  if (!globalThis[key]) globalThis[key] = new Map();
  return globalThis[key];
}

/**
 * Deep JSON document module. Callers see read/write only.
 * Adapters: local `.data`, serverless tmp, in-memory overlay.
 */
export function createJsonDocuments({
  memoryKey,
  seedDir,
  localRuntimeDir,
  tmpRuntimeDir,
  blobPrefix = '',
  dualWriteSeed = false,
  atomicWrite = false,
  treatEmptyAsMissing = true,
  throwOnReadError = false,
  throwOnWriteError = false,
  onWrite = null,
} = {}) {
  const seedRoot = seedDir;
  const runtimeRoot = () => (isServerless() ? tmpRuntimeDir : localRuntimeDir);

  function fileFor(root, name) {
    return path.join(root, `${name}.json`);
  }

  function blobPath(name) {
    if (!blobPrefix) return '';
    return `${blobPrefix}/${name}.json`;
  }

  async function parseFile(filePath) {
    try {
      const raw = await readFile(filePath, 'utf8');
      return JSON.parse(raw);
    } catch (error) {
      if (error.code === 'ENOENT') return undefined;
      if (error.name === 'SyntaxError' && !throwOnReadError) return undefined;
      if (!throwOnReadError) return undefined;
      throw new Error('JSON document could not be read.', {cause: error});
    }
  }

  async function putFile(filePath, payload) {
    await mkdir(path.dirname(filePath), {recursive: true});
    if (!atomicWrite) {
      await writeFile(filePath, payload, 'utf8');
      return;
    }
    const temporary = `${filePath}.${randomUUID()}.tmp`;
    try {
      await writeFile(temporary, payload, {encoding: 'utf8', flag: 'wx'});
      await rename(temporary, filePath);
    } catch (error) {
      await unlink(temporary).catch(() => {});
      throw error;
    }
  }

  async function readDocument(name, defaultValue = null) {
    if (memoryKey) {
      const mem = memoryMap(memoryKey).get(name);
      if (treatEmptyAsMissing ? !isEmptyValue(mem) : mem !== undefined) return mem;
    }
    if (blobPrefix) {
      try {
        const {readPrivateJson} = await import('./vercel-blob');
        const fromBlob = await readPrivateJson(blobPath(name));
        if (treatEmptyAsMissing ? !isEmptyValue(fromBlob) : fromBlob !== undefined) return fromBlob;
      } catch {
        /* blob optional until a store is linked */
      }
    }
    let parsed = await parseFile(fileFor(runtimeRoot(), name));
    if (treatEmptyAsMissing ? isEmptyValue(parsed) : parsed === undefined) {
      parsed = await parseFile(fileFor(seedRoot, name));
    }
    if (treatEmptyAsMissing ? isEmptyValue(parsed) : parsed === undefined) return defaultValue;
    return parsed;
  }

  async function writeDocument(name, value) {
    if (memoryKey) memoryMap(memoryKey).set(name, value);
    const payload = `${JSON.stringify(value, null, 2)}\n`;
    let saved = false;
    if (blobPrefix) {
      try {
        const {writePrivateJson} = await import('./vercel-blob');
        saved = Boolean(await writePrivateJson(blobPath(name), value));
      } catch (error) {
        if (throwOnWriteError) {
          throw new Error('Changes were not saved to Vercel Blob. Link a Blob store on the Hobby plan.', {
            cause: error,
          });
        }
      }
    }
    try {
      await putFile(fileFor(runtimeRoot(), name), payload);
      saved = true;
    } catch (error) {
      if (throwOnWriteError) {
        throw new Error('Changes were not saved. Storage is unavailable; please retry.', {cause: error});
      }
    }
    if (dualWriteSeed && !isServerless()) {
      try {
        await putFile(fileFor(seedRoot, name), payload);
        saved = true;
      } catch {
        /* local seed dual-write is best-effort */
      }
    }
    if (typeof onWrite === 'function') {
      try {
        await onWrite(name, value);
      } catch {
        /* side effects optional */
      }
    }
    return value;
  }

  async function readCollection(name) {
    const value = await readDocument(name, []);
    return Array.isArray(value) ? value : [];
  }

  async function writeCollection(name, items) {
    const list = Array.isArray(items) ? items : [];
    await writeDocument(name, list);
    return list;
  }

  async function upsertCollectionItem(name, item, idKey = 'id') {
    const items = await readCollection(name);
    const key = item?.[idKey];
    if (key == null) {
      const error = new Error(`Item is missing ${idKey}`);
      error.status = 400;
      throw error;
    }
    const index = items.findIndex((entry) => entry?.[idKey] === key);
    if (index >= 0) items[index] = {...items[index], ...item};
    else items.push(item);
    await writeCollection(name, items);
    return items.find((entry) => entry?.[idKey] === key);
  }

  async function deleteCollectionItem(name, id, idKey = 'id') {
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

  async function ensureDocument(name, factory) {
    const existing = await readDocument(name, null);
    if (treatEmptyAsMissing ? !isEmptyValue(existing) : existing != null) return existing;
    const created = typeof factory === 'function' ? await factory() : factory;
    const value = created == null ? {} : created;
    await writeDocument(name, value);
    return value;
  }

  async function ensureCollection(name, factory) {
    const existing = await readCollection(name);
    if (existing.length) return existing;
    const created = typeof factory === 'function' ? await factory() : factory;
    const items = Array.isArray(created) ? created : [];
    await writeCollection(name, items);
    return items;
  }

  return {
    readDocument,
    writeDocument,
    readCollection,
    writeCollection,
    upsertCollectionItem,
    deleteCollectionItem,
    ensureDocument,
    ensureCollection,
    seedDir: seedRoot,
    runtimeDir: runtimeRoot,
    isServerless,
  };
}

export function defaultTmpDir(folder) {
  return path.join(tmpdir(), 'asas', folder);
}
