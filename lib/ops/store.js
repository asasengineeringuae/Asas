import path from 'path';
import {randomUUID} from 'crypto';
import {createJsonDocuments, defaultTmpDir} from '@/lib/persist/json-documents';

function assertCollectionName(name) {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error('Invalid operations collection');
}

const bag = createJsonDocuments({
  memoryKey: '__asasOpsDocs',
  seedDir: path.join(process.cwd(), 'content', 'ops'),
  localRuntimeDir: path.join(process.cwd(), '.data', 'ops'),
  tmpRuntimeDir: defaultTmpDir('ops'),
  blobPrefix: 'asas/ops',
  dualWriteSeed: false,
  atomicWrite: true,
  treatEmptyAsMissing: false,
  throwOnReadError: true,
  throwOnWriteError: true,
});

export async function readOpsCollection(name, defaultValue = []) {
  assertCollectionName(name);
  const result = await bag.readDocument(name, defaultValue);
  if (!Array.isArray(result)) throw new Error('Invalid operations collection data');
  return result;
}

export async function writeOpsCollection(name, items) {
  assertCollectionName(name);
  if (!Array.isArray(items)) throw new Error('Operations collection must be an array');
  return bag.writeDocument(name, items);
}

export async function readOpsDocument(name, defaultValue = null) {
  assertCollectionName(name);
  return bag.readDocument(name, defaultValue);
}

export async function writeOpsDocument(name, doc) {
  assertCollectionName(name);
  return bag.writeDocument(name, doc);
}

export function nowIso() {
  return new Date().toISOString();
}

export function newOpsId(prefix) {
  return `${prefix}_${randomUUID()}`;
}

const queueKey = Symbol.for('asas.ops.mutation.queue');
export async function withOpsMutation(operation) {
  const previous = globalThis[queueKey] || Promise.resolve();
  let release;
  const turn = new Promise((resolve) => {
    release = resolve;
  });
  globalThis[queueKey] = turn;
  await previous;
  try {
    return await operation();
  } finally {
    release();
  }
}
