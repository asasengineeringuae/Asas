import {createPageGateway} from '@/lib/routing/gateway';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const {generateMetadata, Page} = createPageGateway((params) => {
  const parts = params.path || [];
  if (parts.length === 1) {
    return {load: () => import('../view.js'), params: {publicId: parts[0]}};
  }
  return null;
});

export {generateMetadata};
export default Page;
