export const COOKIE_CONSENT_KEY = 'asas-cookie-consent';
export const COOKIE_CONSENT_EVENT = 'asas-cookie-consent';
export const COOKIE_SETTINGS_EVENT = 'asas-open-cookie-settings';

export const defaultConsent = {
  v: 1,
  necessary: true,
  analytics: false,
  marketing: false,
};

export function readConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== 1) return null;
    return {
      ...defaultConsent,
      ...parsed,
      necessary: true,
    };
  } catch {
    return null;
  }
}

export function writeConsent(next) {
  const value = {
    ...defaultConsent,
    ...next,
    necessary: true,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, {detail: value}));
  return value;
}

export function openCookieSettings() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
