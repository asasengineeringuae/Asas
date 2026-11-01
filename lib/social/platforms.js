/** Social networks the studio can target. Publishing stays off until env APIs are linked. */

export const SOCIAL_PLATFORMS = [
  {
    id: 'facebook',
    label: 'Facebook Page',
    env: ['META_PAGE_ID', 'META_PAGE_ACCESS_TOKEN'],
    supports: ['text', 'link', 'image'],
    docs: 'https://developers.facebook.com/docs/pages-api/posts',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    env: ['META_IG_USER_ID', 'META_PAGE_ACCESS_TOKEN'],
    supports: ['image', 'caption'],
    docs: 'https://developers.facebook.com/docs/instagram-api/guides/content-publishing',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    env: ['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_ORG_URN'],
    supports: ['text', 'link', 'image'],
    docs: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api',
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    env: ['X_BEARER_TOKEN'],
    supports: ['text', 'link'],
    docs: 'https://developer.x.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    env: ['YOUTUBE_ACCESS_TOKEN'],
    supports: ['video'],
    docs: 'https://developers.google.com/youtube/v3/docs/videos/insert',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    env: ['TIKTOK_ACCESS_TOKEN'],
    supports: ['video'],
    docs: 'https://developers.tiktok.com/doc/content-posting-api-get-started',
  },
];

export function platformById(id) {
  return SOCIAL_PLATFORMS.find((item) => item.id === id) || null;
}
