import path from 'path';
import {createJsonDocuments, defaultTmpDir} from '@/lib/persist/json-documents';

const bag = createJsonDocuments({
  memoryKey: '__asasCmsDocs',
  seedDir: path.join(process.cwd(), 'content', 'cms'),
  localRuntimeDir: path.join(process.cwd(), '.data', 'cms'),
  tmpRuntimeDir: defaultTmpDir('cms'),
  blobPrefix: 'asas/cms',
  dualWriteSeed: true,
  atomicWrite: false,
  treatEmptyAsMissing: true,
  throwOnReadError: false,
  throwOnWriteError: false,
  async onWrite() {
    try {
      const {invalidateAiKnowledge} = await import('@/lib/ai/knowledge-cache');
      invalidateAiKnowledge();
    } catch {
      /* AI cache optional */
    }
  },
});

export const {
  readDocument,
  writeDocument,
  readCollection,
  writeCollection,
  upsertCollectionItem,
  deleteCollectionItem,
  ensureDocument,
  ensureCollection,
} = bag;

export const DATA_DIR = path.join(process.cwd(), '.data', 'cms');
export const SEED_DIR = path.join(process.cwd(), 'content', 'cms');
