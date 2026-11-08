import {notFound} from 'next/navigation';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SiteTour from '@/components/SiteTour';
import WhatsApp from '@/components/WhatsApp';
import ThemeFab from '@/components/theme/ThemeFab';
import FloatingUtilities from '@/components/FloatingUtilities';
import AIAssistantMount from '@/components/ai-assistant/AIAssistantMount';
import SiteMotion from '@/components/SiteMotion';
import AnchorScrollRoot from '@/components/AnchorScrollRoot';
import {t} from '@/lib/i18n/ui';
import {
  getPublicCompany,
  getPublicFooter,
  getPublicNavigation,
  getPublicServices,
  getPublicSettings,
} from '@/lib/cms/public-data';
import {normalizeBranding} from '@/lib/cms/branding';
import {getSeoSettings} from '@/lib/cms/seo-store';
import {buildOrganizationJsonLd, buildWebSiteJsonLd} from '@/lib/cms/seo/schema-builders';
import CookieConsent from '@/components/cookies/CookieConsent';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'ar'}];
}

export default async function LocaleLayout({children, params}) {
  const {locale} = await params;
  if (!['en', 'ar'].includes(locale)) notFound();
  const ar = locale === 'ar';

  const [company, navItems, allServices, seoSettings, siteSettings, footerDoc] = await Promise.all([
    getPublicCompany(),
    getPublicNavigation(),
    getPublicServices(),
    getSeoSettings(),
    getPublicSettings(),
    getPublicFooter(),
  ]);

  const branding = normalizeBranding(siteSettings?.branding);
  const featuredServices = (allServices || []).filter((service) => service.featured).slice(0, 7);
  const social = siteSettings?.socialLinks || {};
  const sameAs = [
    ...(Array.isArray(seoSettings.sameAs) ? seoSettings.sameAs : []),
    social.linkedin,
    social.instagram,
    social.facebook,
    social.youtube,
  ].filter((url, index, list) => url && list.indexOf(url) === index);
  const footerLinks = footerDoc?.companyLinks;
  const footerCta = footerDoc?.cta;

  const schemas = [];
  if (seoSettings.organizationJsonLd !== false) {
    schemas.push(
      buildOrganizationJsonLd(
        {
          ...seoSettings,
          sameAs,
          defaultOgImage:
            seoSettings.defaultOgImage || branding.defaultOgImage || branding.primaryLogo,
        },
        company,
        branding,
      ),
      buildWebSiteJsonLd(seoSettings.canonicalBase || `https://${company.website}`),
    );
  }

  const gtmId = seoSettings.googleTagManagerId || '';
  const gaId = seoSettings.googleAnalyticsId || '';
  const metaPixelId = seoSettings.metaPixelId || '';

  return (
    <div dir={ar ? 'rtl' : 'ltr'} lang={locale} data-locale={locale}>
      {schemas.map((schema, index) => (
        <Script
          key={`asas-schema-${index}`}
          id={`asas-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
        />
      ))}
      <a className="skip" href="#main">
        {t('skipToContent', locale)}
      </a>
      <Header
        locale={locale}
        navItems={navItems || undefined}
        companyData={company}
        branding={branding}
      />
      <AnchorScrollRoot />
      <SiteMotion locale={locale} />
      <main id="main">{children}</main>
      <Footer
        locale={locale}
        companyData={company}
        featuredServices={featuredServices}
        companyLinks={footerLinks}
        footerCta={footerCta}
        branding={branding}
      />
      <FloatingUtilities locale={locale} />
      <ThemeFab locale={locale} />
      <AIAssistantMount locale={locale} />
      <SiteTour locale={locale} />
      <WhatsApp locale={locale} companyData={company} />
      <CookieConsent locale={locale} gaId={gaId} gtmId={gtmId} metaPixelId={metaPixelId} />
    </div>
  );
}
