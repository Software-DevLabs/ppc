import React, { useState } from 'react';
import { ArrowRight, Save } from 'lucide-react';
import { blogApi } from '@/api/blog';
import { slugify, validatePost, LIMITS } from '@/lib/validation';
import { Field, Switch, inputCls } from '@/components/dashboard/FormPrimitives';
import Markdown from '@/components/portfolio/Markdown';

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '',
  cover_url: '', tags: '', published: false,
};

export default function BlogForm({ initial, onDone, onCancel }) {
  const [values, setValues] = useState(
    initial ? { ...initial, tags: (initial.tags || []).join(', ') } : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [slugLocked, setSlugLocked] = useState(!!initial);
  const [tab, setTab] = useState('edit');

  const set = (key, val) => setValues(v => ({ ...v, [key]: val }));

  const onTitle = (title) => {
    setValues(v => ({ ...v, title, slug: slugLocked ? v.slug : slugify(title) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...values,
      title: values.title.trim(),
      slug: values.slug.trim(),
      tags: values.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    if (payload.published && !initial?.published_at) {
      payload.published_at = new Date().toISOString();
    }
    const errs = validatePost(payload);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      if (initial) await blogApi.update(initial.id, payload);
      else await blogApi.create(payload);
      onDone();
    } catch (err) {
      const msg = err.response?.data?.error || 'تعذّر الحفظ';
      if (msg.includes('Slug')) setErrors({ slug: 'هذا المعرّف مستخدم بالفعل' });
      else setErrors({ _form: msg });
    } finally {
      setSaving(false);
    }
  };

  const tabBtn = (active) =>
    `px-4 py-2 font-mono text-xs border transition-colors ${
      active ? 'border-cobalt text-cobalt bg-cobalt/10' : 'border-border text-muted-foreground hover:text-foreground'
    }`;

  return (
    <form onSubmit={submit} className="max-w-3xl" noValidate>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-body text-2xl font-light text-foreground">
          {initial ? 'تعديل مقال' : 'مقال جديد'}
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

      <div className="space-y-5">
        <Field label="العنوان" error={errors.title}>
          <input className={inputCls} value={values.title} onChange={e => onTitle(e.target.value)}
            required maxLength={LIMITS.title} placeholder="عنوان المقال" />
        </Field>

        <Field label="المعرّف (slug)" error={errors.slug} hint="يظهر في الرابط: /blog/slug">
          <input dir="ltr" className={`${inputCls} text-left`} value={values.slug}
            onChange={e => { setSlugLocked(true); set('slug', e.target.value); }}
            required maxLength={LIMITS.slug} placeholder="my-post" />
        </Field>

        <Field label="مقتطف" error={errors.excerpt}>
          <textarea rows={2} className={inputCls} value={values.excerpt}
            onChange={e => set('excerpt', e.target.value)} maxLength={LIMITS.excerpt}
            placeholder="ملخص قصير" />
        </Field>

        <Field label="الوسوم" error={errors.tags} hint={`افصل بفواصل — حتى ${LIMITS.tagsMax} وسم`}>
          <input className={inputCls} value={values.tags} onChange={e => set('tags', e.target.value)}
            placeholder="React, ذكاء اصطناعي" />
        </Field>

        <Field label="رابط صورة الغلاف" error={errors.cover_url}>
          <input dir="ltr" className={`${inputCls} text-left`} value={values.cover_url}
            onChange={e => set('cover_url', e.target.value)} placeholder="https://..." />
        </Field>

        <div>
          <span className="font-mono text-xs text-muted-foreground block mb-2">المحتوى (Markdown)</span>
          <div className="flex gap-1 mb-2" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'edit'}
              onClick={() => setTab('edit')} className={tabBtn(tab === 'edit')}>تحرير</button>
            <button type="button" role="tab" aria-selected={tab === 'preview'}
              onClick={() => setTab('preview')} className={tabBtn(tab === 'preview')}>معاينة</button>
          </div>
          {tab === 'edit' ? (
            <textarea rows={14} className={`${inputCls} font-mono leading-relaxed`}
              value={values.content} onChange={e => set('content', e.target.value)}
              placeholder="# عنوان المقال..." aria-label="محتوى المقال" />
          ) : (
            <div className="border border-border bg-card p-6 min-h-[280px]">
              <Markdown content={values.content} />
            </div>
          )}
          {errors.content && <span className="block mt-1 text-xs text-destructive" role="alert">{errors.content}</span>}
        </div>

        <div className="pt-2">
          <Switch checked={values.published} onChange={v => set('published', v)} label="منشور (يظهر للعموم)" />
        </div>
      </div>

      <div className="flex gap-3 mt-10">
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 bg-cobalt text-gallery px-6 py-2.5 font-mono text-sm font-bold hover:opacity-90 disabled:opacity-50">
          <Save className="w-4 h-4" aria-hidden="true" /> {saving ? 'جارٍ الحفظ...' : 'حفظ المقال'}
        </button>
        <button type="button" onClick={onCancel}
          className="border border-border px-6 py-2.5 font-mono text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          إلغاء
        </button>
      </div>
    </form>
  );
}
