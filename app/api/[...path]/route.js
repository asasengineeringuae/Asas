import {createHttpGateway} from '@/lib/routing/http-gateway';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const STATIC = {
  health: () => import('../health/handler'),
  chat: () => import('../chat/handler'),
  'careers/apply': () => import('../careers/apply/handler'),
  'ai/chat': () => import('../ai/chat/handler'),
  'ai/config': () => import('../ai/config/handler'),
  'ai/live-token': () => import('../ai/live-token/handler'),
  'public/search': () => import('../public/search/handler'),
  'public/enquiry': () => import('../public/enquiry/handler'),
  'public/card-event': () => import('../public/card-event/handler'),
  'public/card-qr': () => import('../public/card-qr/handler'),
  'public/card-view': () => import('../public/card-view/handler'),
  'public/vcard': () => import('../public/vcard/handler'),
  'admin/auth': () => import('../admin/auth/handler'),
  'admin/content': () => import('../admin/content/handler'),
  'admin/delivery': () => import('../admin/delivery/handler'),
  'admin/erp': () => import('../admin/erp/handler'),
  'admin/media': () => import('../admin/media/handler'),
  'admin/ops': () => import('../admin/ops/handler'),
  'admin/profile': () => import('../admin/profile/handler'),
  'admin/search': () => import('../admin/search/handler'),
  'admin/social': () => import('../admin/social/handler'),
  'admin/users': () => import('../admin/users/handler'),
  'admin/team': () => import('../admin/team/handler'),
  'admin/team/upload': () => import('../admin/team/upload/handler'),
  'admin/seo': () => import('../admin/seo/handler'),
  'admin/seo/audit': () => import('../admin/seo/audit/handler'),
  'admin/seo/pages': () => import('../admin/seo/pages/handler'),
  'admin/seo/redirects': () => import('../admin/seo/redirects/handler'),
  'admin/corporate/letterheads': () => import('../admin/corporate/letterheads/handler'),
  'admin/corporate/employee-cards/bulk': () => import('../admin/corporate/employee-cards/bulk/handler'),
};

function resolvePath(parts) {
  const key = parts.join('/');
  if (STATIC[key]) return {load: STATIC[key], params: {}};
  if (parts[0] === 'admin' && parts[1] === 'team' && parts.length === 3 && parts[2] !== 'upload') {
    return {load: () => import('../admin/team/[id]/handler'), params: {id: parts[2]}};
  }
  if (parts[0] === 'admin' && parts[1] === 'corporate' && parts[2] === 'letterheads' && parts.length === 4) {
    return {load: () => import('../admin/corporate/letterheads/[id]/handler'), params: {id: parts[3]}};
  }
  return null;
}

export const {GET, POST, PUT, PATCH, DELETE} = createHttpGateway(resolvePath);
