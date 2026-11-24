/** Strip plot/sector detail from public project copy. */

export function stripDetailedLocation(text) {
  if (!text) return '';
  let value = String(text);
  value = value.replace(/\b(?:Sector|Plot)\s+[A-Za-z0-9._/-]+/gi, '');
  value = value.replace(/\b(?:SW|SE|SHM|SH|RD|ME|MZ|EB|FRM|MSH|SEC|ROW|SDN|MEZ)\d+(?:_\d+)?(?:-[A-Z0-9]+)?\b/gi, '');
  value = value.replace(/\b(?:Z|E|W|C|L)\d{1,3}(?:_\d+)?[A-Z]?\b/g, '');
  value = value.replace(/على\s+القطع(?:ة)?\s+[A-Za-z0-9._/-]+/g, '');
  value = value.replace(/(?:ال)?قطع(?:ة)?\s+[A-Za-z0-9._/-]+/g, '');
  value = value.replace(/(?:ال)?قطاع\s+[A-Za-z0-9._/-]+/g, '');
  value = value.replace(/\bon\s+Plot\s+[A-Za-z0-9._/-]+/gi, '');
  value = value.replace(/\bon,\s*/gi, '');
  value = value.replace(/\s*[·,،/]\s*(?=[.,،]|$)/g, '');
  value = value.replace(/\s{2,}/g, ' ');
  value = value.replace(/\s+([.,،])/g, '$1');
  value = value.replace(/\s*—\s*$/g, '');
  return value.trim();
}

export function placeOnlyTitle(title) {
  return stripDetailedLocation(title).replace(/\s{2,}/g, ' ').trim();
}

export function sanitizePublicProject(project = {}) {
  return {
    ...project,
    title: placeOnlyTitle(project.title),
    titleAr: placeOnlyTitle(project.titleAr),
    description: stripDetailedLocation(project.description),
    descriptionAr: stripDetailedLocation(project.descriptionAr),
    scope: project.scope ? stripDetailedLocation(project.scope) : project.scope,
    location: '',
    locationAr: '',
  };
}
