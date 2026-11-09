export const projectKinds = {
  built: {en: 'Built Project', ar: 'مشروع منفَّذ'},
  study: {en: 'Planning Study', ar: 'دراسة تخطيطية'},
  interior: {en: 'Interior Fit-out', ar: 'تجهيز داخلي'},
};

export const projectCategories = [
  {slug: 'all', title: 'All', titleAr: 'الكل'},
  {slug: 'towers', title: 'Towers & High-Rise', titleAr: 'الأبراج والمباني العالية'},
  {slug: 'buildings', title: 'Buildings', titleAr: 'المباني'},
  {slug: 'labour-community', title: 'Labour Community', titleAr: 'مجمع العمال'},
  {slug: 'industrial', title: 'Industrial', titleAr: 'الصناعي'},
  {slug: 'infrastructure', title: 'Infrastructure', titleAr: 'البنية التحتية'},
  {slug: 'mosques', title: 'Mosques', titleAr: 'المساجد'},
  {slug: 'education', title: 'Schools', titleAr: 'المدارس'},
  {slug: 'compound-villas', title: 'Compound Villas', titleAr: 'مجمعات الفلل'},
  {slug: 'private-villas', title: 'Private Villas', titleAr: 'الفلل الخاصة'},
  {slug: 'residential-villas', title: 'Residential Villas', titleAr: 'الفلل السكنية'},
  {slug: 'interior-design', title: 'Interior Design', titleAr: 'التصميم الداخلي'},
];

export function projectHeroVisualsFrom(projects = []) {
  const labor = projects.find((project) => project.slug === 'labor-community-meg');
  const fourTowers = projects.find((project) => project.slug === 'four-towers-al-nahda');
  const first = projects.find((project) => project.image);
  const left = labor?.image || fourTowers?.image || first?.image;
  const right = fourTowers?.image || labor?.image || left;
  return [
    left ? {src: left, crop: '50% 40%', projectPhoto: true} : null,
    right ? {src: right, crop: '50% 45%', projectPhoto: true} : null,
  ].filter(Boolean);
}
