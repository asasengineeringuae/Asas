import {createPageGateway, matchStaticAndDynamic} from '@/lib/routing/gateway';

export const dynamic = 'force-dynamic';

const staticLoaders = {
  '': () => import('../view.js'),
  about: () => import('../about/view.js'),
  blog: () => import('../blog/view.js'),
  careers: () => import('../careers/view.js'),
  'company-profile': () => import('../company-profile/view.js'),
  contact: () => import('../contact/view.js'),
  downloads: () => import('../downloads/view.js'),
  gallery: () => import('../gallery/view.js'),
  portfolio: () => import('../portfolio/view.js'),
  privacy: () => import('../privacy/view.js'),
  'project-enquiry': () => import('../project-enquiry/view.js'),
  projects: () => import('../projects/view.js'),
  sectors: () => import('../sectors/view.js'),
  services: () => import('../services/view.js'),
  team: () => import('../team/view.js'),
  terms: () => import('../terms/view.js'),
  videos: () => import('../videos/view.js'),
};

const SLUG_LOADERS = {
  projects: () => import('../projects/[slug]/view.js'),
  sectors: () => import('../sectors/[slug]/view.js'),
  services: () => import('../services/[slug]/view.js'),
  team: () => import('../team/[slug]/view.js'),
  blog: () => import('../blog/[slug]/view.js'),
  careers: () => import('../careers/[slug]/view.js'),
  card: () => import('../card/[slug]/view.js'),
};

const {generateMetadata, Page} = createPageGateway((params) =>
  matchStaticAndDynamic(params, {
    staticLoaders,
    dynamics: [
      (parts) => {
        if (parts.length === 2 && SLUG_LOADERS[parts[0]]) {
          return {load: SLUG_LOADERS[parts[0]], params: {slug: parts[1]}};
        }
        return null;
      },
    ],
  }),
);

export {generateMetadata};
export default Page;
