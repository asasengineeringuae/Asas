/**
 * Vercel Blob (Hobby: 1 GB) — durable JSON + uploads when a store is linked.
 * Works with BLOB_READ_WRITE_TOKEN or Vercel OIDC (BLOB_STORE_ID).
 */

function blobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      (process.env.VERCEL && process.env.VERCEL_OIDC_TOKEN),
  );
}

export function isBlobConfigured() {
  return blobConfigured();
}

async function blobSdk() {
  return import('@vercel/blob');
}

export async function readPrivateJson(pathname) {
  if (!blobConfigured()) return undefined;
  try {
    const {get} = await blobSdk();
    const result = await get(pathname, {access: 'private', useCache: false});
    if (!result?.stream) return undefined;
    const text = await new Response(result.stream).text();
    if (!text) return undefined;
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export async function writePrivateJson(pathname, value) {
  if (!blobConfigured()) return false;
  const {put} = await blobSdk();
  await put(pathname, `${JSON.stringify(value, null, 2)}\n`, {
    access: 'private',
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  });
  return true;
}

export async function putPublicFile(pathname, body, contentType) {
  if (!blobConfigured()) return null;
  const {put} = await blobSdk();
  const blob = await put(pathname, body, {
    access: 'public',
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: contentType || undefined,
    multipart: Boolean(body?.length && body.length > 4 * 1024 * 1024),
  });
  return blob?.url || null;
}
