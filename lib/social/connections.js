import {SOCIAL_PLATFORMS} from './platforms';

function envValue(name) {
  return String(process.env[name] || '').trim();
}

export function getSocialConnections() {
  return SOCIAL_PLATFORMS.map((platform) => {
    const missing = platform.env.filter((key) => !envValue(key));
    return {
      id: platform.id,
      label: platform.label,
      connected: missing.length === 0,
      missing,
      env: platform.env,
      supports: platform.supports,
      docs: platform.docs,
    };
  });
}

export function connectedPlatformIds() {
  return getSocialConnections()
    .filter((item) => item.connected)
    .map((item) => item.id);
}

export function isPlatformConnected(id) {
  return getSocialConnections().some((item) => item.id === id && item.connected);
}
