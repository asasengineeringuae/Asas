import GalleryExperience from '@/components/gallery/GalleryExperience';
import {getPublicGallery, getPublicProjects} from '@/lib/cms/public-data';
import {staticPageMetadata} from '@/lib/cms/seo/page-meta';

export const generateMetadata = staticPageMetadata({
  path: 'gallery',
  type: 'gallery',
  titleEn: 'Gallery',
  titleAr: 'معرض الصور',
  descriptionEn: 'ASAS visual archive — projects, places and moments behind the engineering work.',
  descriptionAr: 'أرشيف أساس البصري — مشاريع وأماكن ولحظات من عمل الاستشارات الهندسية.',
  schemaType: 'CreativeWork',
});

export const dynamic = 'force-dynamic';

export default async function GalleryPage({params}) {
  const {locale} = await params;
  const [items, projects] = await Promise.all([getPublicGallery(), getPublicProjects()]);
  return <GalleryExperience locale={locale} items={items} projects={projects} />;
}
