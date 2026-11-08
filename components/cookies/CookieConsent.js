'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import Script from 'next/script';
import {t} from '@/lib/i18n/ui';
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_SETTINGS_EVENT,
  readConsent,
  writeConsent,
} from '@/lib/cookies/consent';

export default function CookieConsent({
  locale = 'en',
  gaId = '',
  gtmId = '',
  metaPixelId = '',
}) {
  const [consent, setConsent] = useState(null);
  const [ready, setReady] = useState(false);
  const [manage, setManage] = useState(false);
  const [draft, setDraft] = useState({analytics: false, marketing: false});

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setDraft({
      analytics: Boolean(stored?.analytics),
      marketing: Boolean(stored?.marketing),
    });
    setReady(true);
    const onOpen = () => {
      const current = readConsent();
      setDraft({
        analytics: Boolean(current?.analytics),
        marketing: Boolean(current?.marketing),
      });
      setManage(true);
    };
    const onChange = (event) => setConsent(event.detail);
    window.addEventListener(COOKIE_SETTINGS_EVENT, onOpen);
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => {
      window.removeEventListener(COOKIE_SETTINGS_EVENT, onOpen);
      window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
    };
  }, []);

  const save = useCallback((next) => {
    const stored = writeConsent(next);
    setConsent(stored);
    setManage(false);
  }, []);

  if (!ready) return null;

  const showBanner = !consent;
  const showPanel = manage;
  if (!showBanner && !showPanel && !consent?.analytics && !consent?.marketing) {
    return null;
  }

  return (
    <>
      {consent?.analytics && gtmId ? (
        <Script id="asas-gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}</Script>
      ) : null}
      {consent?.analytics && gaId && !gtmId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="asas-ga" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}</Script>
        </>
      ) : null}
      {consent?.marketing && metaPixelId ? (
        <Script id="asas-meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${metaPixelId}');fbq('track','PageView');
        `}</Script>
      ) : null}

      {(showBanner || showPanel) && (
        <div className={`cookie-consent${showPanel ? ' cookie-consent--manage' : ''}`} role="dialog" aria-labelledby="cookie-consent-title">
          <div className="cookie-consent-inner">
            <div className="cookie-consent-copy">
              <p id="cookie-consent-title" className="cookie-consent-kicker">
                {t('cookieTitle', locale)}
              </p>
              <p>
                {t('cookieBody', locale)}{' '}
                <Link href={`/${locale}/privacy`}>{t('privacy', locale)}</Link>
              </p>
            </div>

            {showPanel && (
              <div className="cookie-consent-options">
                <label className="cookie-opt">
                  <input type="checkbox" checked disabled readOnly />
                  <span>
                    <strong>{t('cookieNecessary', locale)}</strong>
                    <em>{t('cookieNecessaryHint', locale)}</em>
                  </span>
                </label>
                <label className="cookie-opt">
                  <input
                    type="checkbox"
                    checked={draft.analytics}
                    onChange={(e) => setDraft((prev) => ({...prev, analytics: e.target.checked}))}
                  />
                  <span>
                    <strong>{t('cookieAnalytics', locale)}</strong>
                    <em>{t('cookieAnalyticsHint', locale)}</em>
                  </span>
                </label>
                <label className="cookie-opt">
                  <input
                    type="checkbox"
                    checked={draft.marketing}
                    onChange={(e) => setDraft((prev) => ({...prev, marketing: e.target.checked}))}
                  />
                  <span>
                    <strong>{t('cookieMarketing', locale)}</strong>
                    <em>{t('cookieMarketingHint', locale)}</em>
                  </span>
                </label>
              </div>
            )}

            <div className="cookie-consent-actions">
              {showPanel ? (
                <>
                  <button type="button" className="cookie-btn cookie-btn-ghost" onClick={() => setManage(false)}>
                    {t('close', locale)}
                  </button>
                  <button
                    type="button"
                    className="cookie-btn cookie-btn-primary"
                    onClick={() => save({analytics: draft.analytics, marketing: draft.marketing})}
                  >
                    {t('cookieSave', locale)}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="cookie-btn cookie-btn-ghost" onClick={() => setManage(true)}>
                    {t('cookieManage', locale)}
                  </button>
                  <button
                    type="button"
                    className="cookie-btn cookie-btn-ghost"
                    onClick={() => save({analytics: false, marketing: false})}
                  >
                    {t('cookieReject', locale)}
                  </button>
                  <button
                    type="button"
                    className="cookie-btn cookie-btn-primary"
                    onClick={() => save({analytics: true, marketing: true})}
                  >
                    {t('cookieAccept', locale)}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
