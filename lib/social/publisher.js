import {isPlatformConnected} from './connections';

function env(name) {
  return String(process.env[name] || '').trim();
}

function captionFor(post) {
  const text = [post.caption, post.captionAr].filter(Boolean).join('\n\n');
  return post.link ? `${text}\n${post.link}`.trim() : text.trim();
}

async function postJson(url, {token, body, extraHeaders = {}}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error?.message || data.message || `HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return data;
}

async function publishFacebook(post) {
  const pageId = env('META_PAGE_ID');
  const token = env('META_PAGE_ACCESS_TOKEN');
  const params = new URLSearchParams({
    access_token: token,
    message: captionFor(post),
  });
  if (post.link) params.set('link', post.link);
  if (post.mediaUrl && !post.link) params.set('url', post.mediaUrl);
  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed`, {
    method: 'POST',
    body: params,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error?.message || 'Facebook publish failed');
  return {id: data.id, url: data.id ? `https://facebook.com/${data.id}` : ''};
}

async function publishInstagram(post) {
  if (!post.mediaUrl) throw new Error('Instagram needs a public image URL');
  const igUser = env('META_IG_USER_ID');
  const token = env('META_PAGE_ACCESS_TOKEN');
  const create = await fetch(
    `https://graph.facebook.com/v21.0/${igUser}/media?` +
      new URLSearchParams({
        image_url: post.mediaUrl,
        caption: captionFor(post),
        access_token: token,
      }),
    {method: 'POST'},
  );
  const created = await create.json().catch(() => ({}));
  if (!create.ok || created.error) throw new Error(created.error?.message || 'Instagram container failed');
  const publish = await fetch(
    `https://graph.facebook.com/v21.0/${igUser}/media_publish?` +
      new URLSearchParams({
        creation_id: created.id,
        access_token: token,
      }),
    {method: 'POST'},
  );
  const published = await publish.json().catch(() => ({}));
  if (!publish.ok || published.error) throw new Error(published.error?.message || 'Instagram publish failed');
  return {id: published.id};
}

async function publishLinkedIn(post) {
  const token = env('LINKEDIN_ACCESS_TOKEN');
  const author = env('LINKEDIN_ORG_URN');
  const commentary = captionFor(post);
  const body = {
    author,
    commentary,
    visibility: 'PUBLIC',
    distribution: {feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: []},
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  };
  if (post.link) {
    body.content = {article: {source: post.link, title: post.caption || 'ASAS', description: post.captionAr || ''}};
  }
  const data = await postJson('https://api.linkedin.com/rest/posts', {
    token,
    body,
    extraHeaders: {
      'LinkedIn-Version': '202401',
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });
  return {id: data.id};
}

async function publishX(post) {
  const token = env('X_BEARER_TOKEN');
  const data = await postJson('https://api.twitter.com/2/tweets', {
    token,
    body: {text: captionFor(post).slice(0, 280)},
  });
  return {id: data.data?.id};
}

const ADAPTERS = {
  facebook: publishFacebook,
  instagram: publishInstagram,
  linkedin: publishLinkedIn,
  x: publishX,
};

export async function publishSocialPost(post) {
  const targets = Array.isArray(post.platforms) && post.platforms.length ? post.platforms : [];
  const results = [];

  for (const platform of targets) {
    if (!isPlatformConnected(platform)) {
      results.push({
        platform,
        status: 'waiting_for_api',
        error: 'API not linked',
      });
      continue;
    }
    const adapter = ADAPTERS[platform];
    if (!adapter) {
      results.push({
        platform,
        status: 'waiting_for_api',
        error: 'This network has no feed adapter yet — connect the official API first',
      });
      continue;
    }
    try {
      const published = await adapter(post);
      results.push({platform, status: 'published', ...published});
    } catch (error) {
      results.push({platform, status: 'failed', error: error.message || 'Publish failed'});
    }
  }

  const publishedCount = results.filter((item) => item.status === 'published').length;
  const waiting = results.some((item) => item.status === 'waiting_for_api');
  const failed = results.some((item) => item.status === 'failed');
  let status = 'draft';
  if (publishedCount && !waiting && !failed) status = 'published';
  else if (publishedCount) status = 'partial';
  else if (waiting && !failed) status = 'waiting_for_api';
  else if (failed) status = 'failed';

  return {
    ...post,
    results,
    status,
    publishedAt: publishedCount ? new Date().toISOString() : post.publishedAt || null,
    updatedAt: new Date().toISOString(),
  };
}
