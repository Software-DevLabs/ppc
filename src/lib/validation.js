const SLUG_RE = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;
const URL_RE = /^https?:\/\/\S+$/i;
// Internal DB-served uploads, e.g. /api/upload/123/file
const INTERNAL_UPLOAD_RE = /^\/api\/upload\/\d+\/file$/;

export const LIMITS = {
  title: 120, slug: 80, short: 220, excerpt: 300,
  content: 50000, skillsMax: 15, skillLength: 40,
  category: 60, tagsMax: 8, tagLength: 30,
};

export function slugify(text = '') {
  return text.toString().trim().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateSlug(slug) {
  return SLUG_RE.test(slug) && slug.length <= LIMITS.slug;
}

function urlError(value) {
  if (!value) return null;
  if (!URL_RE.test(value)) return 'رابط غير صالح (يجب أن يبدأ بـ http أو https)';
  if (value.length > 2048) return 'الرابط طويل جدًا';
  return null;
}

// Image fields: allow external http(s) OR internal DB uploads (/api/upload/:id/file)
function imageUrlError(value) {
  if (!value) return null;
  const v = value.trim();
  if (INTERNAL_UPLOAD_RE.test(v)) return null;
  return urlError(v);
}

function checkText(errors, values, key, label, max, required) {
  const value = (values[key] || '').trim();
  if (required && !value) errors[key] = `${label} مطلوب`;
  else if (value.length > max) errors[key] = `الحد الأقصى ${max} حرفًا`;
}

function checkSlug(errors, values) {
  const slug = (values.slug || '').trim();
  if (!slug) errors.slug = 'المعرّف (slug) مطلوب';
  else if (!validateSlug(slug)) errors.slug = 'استخدم حروفًا وأرقامًا وشرطات فقط';
}

export function validateProject(values) {
  const errors = {};
  checkText(errors, values, 'title', 'العنوان', LIMITS.title, true);
  checkSlug(errors, values);
  checkText(errors, values, 'short_description', 'الوصف المختصر', LIMITS.short, false);
  checkText(errors, values, 'content', 'المحتوى', LIMITS.content, false);
  ['github_url', 'demo_url'].forEach(k => {
    const e = urlError(values[k]);
    if (e) errors[k] = e;
  });
  const be = imageUrlError(values.banner_url);
  if (be) errors.banner_url = be;
  if (values.banner_aspect && !['16/9', '4/3', '1/1', '21/9'].includes(values.banner_aspect)) {
    errors.banner_url = 'مقاس الصورة غير صالح';
  }
  if (values.banner_fit && !['cover', 'contain'].includes(values.banner_fit)) {
    errors.banner_url = 'طريقة عرض الصورة غير صالحة';
  }
  const skills = values.skills || [];
  if (skills.length > LIMITS.skillsMax) errors.skills = `الحد الأقصى ${LIMITS.skillsMax} مهارة`;
  checkText(errors, values, 'category', 'التصنيف', LIMITS.category, false);
  return errors;
}

export function validatePost(values) {
  const errors = {};
  checkText(errors, values, 'title', 'العنوان', LIMITS.title, true);
  checkSlug(errors, values);
  checkText(errors, values, 'excerpt', 'المقتطف', LIMITS.excerpt, false);
  checkText(errors, values, 'content', 'المحتوى', LIMITS.content, false);
  const e = imageUrlError(values.cover_url);
  if (e) errors.cover_url = e;
  const tags = values.tags || [];
  if (tags.length > LIMITS.tagsMax) errors.tags = `الحد الأقصى ${LIMITS.tagsMax} وسوم`;
  return errors;
}
