import React, { useState } from 'react';
import { ArrowRight, Save, Upload } from 'lucide-react';
import { projectsApi } from '@/api/projects';
import { uploadFile } from '@/api/upload';
import { slugify, validateProject, LIMITS } from '@/lib/validation';
import { Field, Switch, inputCls } from '@/components/dashboard/FormPrimitives';
import Markdown from '@/components/portfolio/Markdown';

const EMPTY = {
  title: '', slug: '', short_description: '', content: '',
  banner_url: '', banner_aspect: '16/9', banner_fit: 'cover',
  github_url: '', demo_url: '',
  skills: '', category: '', featured: false, published: false,
};

export const BANNER_ASPECTS = [
  { id: '16/9', label: '16:9', cls: 'aspect-video' },
  { id: '4/3', label: '4:3', cls: 'aspect-[4/3]' },
  { id: '1/1', label: '1:1', cls: 'aspect-square' },
  { id: '21/9', label: '21:9', cls: 'aspect-[21/9]' },
];

export const BANNER_FITS = [
  { id: 'cover', label: 'ملء' },
  { id: 'contain', label: 'احتواء' },
];

export function bannerAspectCls(aspect) {
  return (BANNER_ASPECTS.find(a => a.id === aspect) || BANNER_ASPECTS[0]).cls;
}

export function bannerFitCls(fit) {
  return fit === 'contain' ? 'object-contain' : 'object-cover';
}

// How the project will look to visitors — same language as the public page.
export function ProjectPreview({ values }) {
  return (
    <div className="border border-border bg-card">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <span className="font-body text-xs text-muted-foreground">معاينة الزائر — قبل النشر</span>
        <span className="font-mono text-[10px] text-cobalt" dir="ltr">PREVIEW</span>
      </div>
      <div className="p-6 md:p-8">
        <span className="font-body text-xs text-muted-foreground">مشروع</span>
        <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.35] mt-3">
          {values.title || 'عنوان المشروع'}
        </h1>
        {values.short_description && (
          <p className="text-muted-foreground leading-relaxed max-w-2xl mt-4">{values.short_description}</p>
        )}
        {(values.category || (values.skills || '').trim()) && (
          <p className="font-body text-xs text-muted-foreground mt-3">
            {[values.category, values.skills].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className={`border border-border overflow-hidden bg-secondary mt-6 ${bannerAspectCls(values.banner_aspect)}`}>
          {values.banner_url ? (
            <img
              src={values.banner_url}
              alt="معاينة الغلاف"
              className={`w-full h-full ${bannerFitCls(values.banner_fit)}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body text-sm">
              بدون صورة غلاف
            </div>
          )}
        </div>
        {values.content?.trim() ? (
          <div className="mt-6"><Markdown content={values.content} /></div>
        ) : (
          <p className="text-muted-foreground text-sm mt-6">بدون محتوى بعد.</p>
        )}
      </div>
    </div>
  );
}

export default function ProjectForm({ initial, onDone, onCancel }) {
  const [values, setValues] = useState(
    initial ? { ...initial, skills: (initial.skills || []).join(', ') } : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [slugLocked, setSlugLocked] = useState(!!initial);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState('edit');

  const set = (key, val) => setValues(v => ({ ...v, [key]: val }));

  const onTitle = (title) => {
    setValues(v => ({ ...v, title, slug: slugLocked ? v.slug : slugify(title) }));
  };

  const onBannerFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setErrors(er => ({ ...er, banner_url: 'نوع الصورة غير مدعوم (JPEG / PNG / WebP / GIF فقط)' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(er => ({ ...er, banner_url: 'حجم الصورة يتجاوز 5MB' }));
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      setValues(v => ({ ...v, banner_url: url }));
      setErrors(er => ({ ...er, banner_url: undefined }));
    } catch {
      setErrors(er => ({ ...er, banner_url: 'تعذّر رفع الصورة' }));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...values,
      title: values.title.trim(),
      slug: values.slug.trim(),
      skills: values.skills.split(',').map(s => s.trim()).filter(Boolean),
      category: (values.category || '').trim(),
    };
    const errs = validateProject(payload);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      if (initial) await projectsApi.update(initial.id, payload);
      else await projectsApi.create(payload);
      onDone();
    } catch (err) {
      const msg = err.response?.data?.error || 'تعذّر الحفظ';
      if (msg.includes('Slug')) setErrors({ slug: 'هذا المعرّف مستخدم بالفعل' });
      else setErrors({ _form: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-3xl" noValidate>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-body text-2xl font-light text-foreground">
          {initial ? 'تعديل مشروع' : 'مشروع جديد'}
        </h2>
        <button type="button" onClick={onCancel}
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-cobalt transition-colors">
          <ArrowRight className="w-4 h-4" aria-hidden="true" /> رجوع
        </button>
      </div>

      {errors._form && (
        <div className="border border-destructive text-destructive px-4 py-3 text-sm mb-6" role="alert">
          {errors._form}
        </div>
      )}

      <div className="flex gap-1 mb-8" role="tablist" aria-label="تحرير أو معاينة">
        {[{ id: 'edit', label: 'تحرير' }, { id: 'preview', label: 'معاينة قبل النشر' }].map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 font-body text-sm border transition-colors ${tab === t.id ? 'border-cobalt text-cobalt bg-cobalt/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'edit' ? (
      <div className="space-y-5">
        <Field label="العنوان" error={errors.title}>
          <input className={inputCls} value={values.title} onChange={e => onTitle(e.target.value)}
            required maxLength={LIMITS.title} placeholder="عنوان المشروع" />
        </Field>

        <Field label="المعرّف (slug)" error={errors.slug} hint="يظهر في الرابط: /projects/slug">
          <input dir="ltr" className={`${inputCls} text-left`} value={values.slug}
            onChange={e => { setSlugLocked(true); set('slug', e.target.value); }}
            required maxLength={LIMITS.slug} placeholder="my-project" />
        </Field>

        <Field label="وصف مختصر" error={errors.short_description}>
          <textarea rows={2} className={inputCls} value={values.short_description}
            onChange={e => set('short_description', e.target.value)} maxLength={LIMITS.short}
            placeholder="سطر أو سطران يظهران في بطاقة المشروع" />
        </Field>

        <Field label="المحتوى (Markdown)" error={errors.content}>
          <textarea rows={10} className={`${inputCls} font-mono leading-relaxed`}
            value={values.content} onChange={e => set('content', e.target.value)}
            placeholder="# عن المشروع..." />
        </Field>

        <Field label="صورة الغلاف" error={errors.banner_url} hint="ألصق رابطًا أو ارفع صورة (حتى 5MB)">
          <input dir="ltr" className={`${inputCls} text-left`} value={values.banner_url}
            onChange={e => set('banner_url', e.target.value)} placeholder="https://..." />
          <div className="flex items-center gap-3 mt-2">
            <label htmlFor="banner-upload"
              className="inline-flex items-center gap-2 border border-dashed border-border px-4 py-2 font-mono text-xs text-muted-foreground hover:border-cobalt hover:text-cobalt transition-colors cursor-pointer">
              <Upload className="w-4 h-4" aria-hidden="true" />
              {uploading ? 'جارٍ الرفع...' : 'رفع صورة'}
            </label>
            <input id="banner-upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden"
              onChange={onBannerFile} disabled={uploading} />
            {values.banner_url && (
              <img src={values.banner_url} alt="معاينة الغلاف"
                className="w-16 h-10 object-cover border border-border" loading="lazy" />
            )}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-3">
            <div>
              <span className="font-body text-xs text-muted-foreground block mb-1.5">مقاس الصورة</span>
              <div className="flex gap-1" role="group" aria-label="مقاس الصورة">
                {BANNER_ASPECTS.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => set('banner_aspect', a.id)}
                    aria-pressed={values.banner_aspect === a.id}
                    className={`px-3 py-1.5 font-mono text-xs border transition-colors ${values.banner_aspect === a.id ? 'border-cobalt text-cobalt bg-cobalt/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
                    dir="ltr"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="font-body text-xs text-muted-foreground block mb-1.5">طريقة العرض</span>
              <div className="flex gap-1" role="group" aria-label="طريقة عرض الصورة">
                {BANNER_FITS.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => set('banner_fit', f.id)}
                    aria-pressed={values.banner_fit === f.id}
                    className={`px-3 py-1.5 font-body text-xs border transition-colors ${values.banner_fit === f.id ? 'border-cobalt text-cobalt bg-cobalt/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="رابط GitHub" error={errors.github_url}>
            <input dir="ltr" className={`${inputCls} text-left`} value={values.github_url}
              onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/..." />
          </Field>
          <Field label="رابط العرض المباشر" error={errors.demo_url}>
            <input dir="ltr" className={`${inputCls} text-left`} value={values.demo_url}
              onChange={e => set('demo_url', e.target.value)} placeholder="https://..." />
          </Field>
        </div>

        <Field label="التصنيف">
          <input className={inputCls} value={values.category}
            onChange={e => set('category', e.target.value)} maxLength={LIMITS.category}
            placeholder="تصنيف المشروع" />
        </Field>

        <Field label="المهارات" error={errors.skills} hint={`افصل بفواصل — حتى ${LIMITS.skillsMax} مهارة`}>
          <input className={inputCls} value={values.skills}
            onChange={e => set('skills', e.target.value)} placeholder="React, TypeScript, PostgreSQL" />
        </Field>

        <div className="flex flex-wrap gap-8 pt-2">
          <Switch checked={values.published} onChange={v => set('published', v)} label="منشور (يظهر للعموم)" />
          <Switch checked={values.featured} onChange={v => set('featured', v)} label="مميز (يظهر أولًا)" />
        </div>
      </div>
      ) : (
        <ProjectPreview values={values} />
      )}

      <div className="flex gap-3 mt-10">
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 bg-cobalt text-gallery px-6 py-2.5 font-mono text-sm font-bold hover:opacity-90 disabled:opacity-50">
          <Save className="w-4 h-4" aria-hidden="true" /> {saving ? 'جارٍ الحفظ...' : 'حفظ المشروع'}
        </button>
        <button type="button" onClick={onCancel}
          className="border border-border px-6 py-2.5 font-mono text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          إلغاء
        </button>
      </div>
    </form>
  );
}
