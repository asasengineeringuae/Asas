import {createPageGateway} from '@/lib/routing/gateway';
import '../erp/erp.css';
import '../ops/operations.css';
import '../admin-inputs.css';

export const dynamic = 'force-dynamic';

const {generateMetadata, Page} = createPageGateway((params) => {
  const parts = params.path || [];
  const key = parts.join('/');
  const staticLoaders = {
    '': () => import('../view.js'),
    blog: () => import('../blog/view.js'),
    careers: () => import('../careers/view.js'),
    'careers/applications': () => import('../careers/applications/view.js'),
    clients: () => import('../clients/view.js'),
    'corporate/employee-cards': () => import('../corporate/employee-cards/view.js'),
    'corporate/employee-cards/new': () => import('../corporate/employee-cards/new/view.js'),
    'corporate/letterheads': () => import('../corporate/letterheads/view.js'),
    'crm/contacts': () => import('../crm/contacts/view.js'),
    'crm/enquiries': () => import('../crm/enquiries/view.js'),
    dashboard: () => import('../dashboard/view.js'),
    downloads: () => import('../downloads/view.js'),
    enquiries: () => import('../enquiries/view.js'),
    footer: () => import('../footer/view.js'),
    gallery: () => import('../gallery/view.js'),
    homepage: () => import('../homepage/view.js'),
    media: () => import('../media/view.js'),
    navigation: () => import('../navigation/view.js'),
    pages: () => import('../pages/view.js'),
    profile: () => import('../profile/view.js'),
    projects: () => import('../projects/view.js'),
    reports: () => import('../reports/view.js'),
    sectors: () => import('../sectors/view.js'),
    seo: () => import('../seo/view.js'),
    'seo/redirects': () => import('../seo/redirects/view.js'),
    'seo/sitemap': () => import('../seo/sitemap/view.js'),
    services: () => import('../services/view.js'),
    settings: () => import('../settings/view.js'),
    'settings/branding': () => import('../settings/branding/view.js'),
    'settings/contact': () => import('../settings/contact/view.js'),
    'settings/delivery': () => import('../settings/delivery/view.js'),
    'settings/social': () => import('../settings/social/view.js'),
    social: () => import('../social/view.js'),
    team: () => import('../team/view.js'),
    'team/new': () => import('../team/new/view.js'),
    testimonials: () => import('../testimonials/view.js'),
    users: () => import('../users/view.js'),
    videos: () => import('../videos/view.js'),
    login: () => import('../login/gate.js'),
    erp: () => import('../erp/view.js'),
    ops: () => import('../ops/view.js'),
    'ops/approvals': () => import('../ops/approvals/view.js'),
    'ops/attendance': () => import('../ops/attendance/view.js'),
    'ops/audit': () => import('../ops/audit/view.js'),
    'ops/clients': () => import('../ops/clients/view.js'),
    'ops/dashboard': () => import('../ops/dashboard/view.js'),
    'ops/departments': () => import('../ops/departments/view.js'),
    'ops/employees': () => import('../ops/employees/view.js'),
    'ops/leave': () => import('../ops/leave/view.js'),
    'ops/notifications': () => import('../ops/notifications/view.js'),
    'ops/org-chart': () => import('../ops/org-chart/view.js'),
    'ops/projects': () => import('../ops/projects/view.js'),
    'ops/reports': () => import('../ops/reports/view.js'),
    'ops/tasks': () => import('../ops/tasks/view.js'),
    'ops/workflows': () => import('../ops/workflows/view.js'),
    'ops/workload': () => import('../ops/workload/view.js'),
  };
  if (staticLoaders[key]) {
    return {load: staticLoaders[key], wrap: key === 'ops' || key.startsWith('ops/') ? 'ops' : null};
  }

  if (parts[0] === 'users' && parts.length === 2) {
    return {load: () => import('../users/[id]/view.js'), params: {id: parts[1]}};
  }
  if (parts[0] === 'team' && parts.length === 2 && parts[1] !== 'new') {
    return {load: () => import('../team/[id]/view.js'), params: {id: parts[1]}};
  }
  if (parts[0] === 'corporate' && parts[1] === 'employee-cards' && parts.length === 3 && parts[2] !== 'new') {
    return {load: () => import('../corporate/employee-cards/[id]/view.js'), params: {id: parts[2]}};
  }
  if (parts[0] === 'corporate' && parts[1] === 'letterheads' && parts.length === 3) {
    return {load: () => import('../corporate/letterheads/[id]/view.js'), params: {id: parts[2]}};
  }
  if (parts[0] === 'erp' && parts.length === 2) {
    return {load: () => import('../erp/[module]/view.js'), params: {module: parts[1]}};
  }
  if (parts[0] === 'ops' && parts[1] === 'projects' && parts.length === 3) {
    return {load: () => import('../ops/projects/[id]/view.js'), params: {id: parts[2]}, wrap: 'ops'};
  }
  return null;
});

export {generateMetadata};
export default Page;
