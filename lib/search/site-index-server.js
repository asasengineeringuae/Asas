import {mapCollections, rankSearch} from '@/lib/search/site-index';
import {
  getPublicBlogPosts,
  getPublicOpenJobs,
  getPublicProjects,
  getPublicSectors,
  getPublicServices,
} from '@/lib/cms/public-data';

export async function getLiveSearchIndex() {
  const [projectItems, serviceItems, sectorItems, jobItems, postItems] = await Promise.all([
    getPublicProjects(),
    getPublicServices(),
    getPublicSectors(),
    getPublicOpenJobs(),
    getPublicBlogPosts(),
  ]);
  return mapCollections({projectItems, serviceItems, sectorItems, jobItems, postItems});
}

export async function searchSiteLive(query, {limit = 24} = {}) {
  return rankSearch(query, await getLiveSearchIndex(), {limit});
}
