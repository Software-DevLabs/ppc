import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronDown, FileText, Github, Globe } from 'lucide-react';
import { useProject } from '@/lib/queries';
import Markdown from '@/components/portfolio/Markdown';
import DemoPreview from '@/components/portfolio/DemoPreview';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, isLoading, isError } = useProject(slug);
  const [showDesc, setShowDesc] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => { setShowDesc(false); }, [slug]);

  const state = { loading: isLoading, project: isError ? null : (project ?? null) };

  if (state.loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-24">
        <div className="h-6 w-40 bg-card animate-pulse mb-6" />
        <div className="h-16 w-2/3 bg-card animate-pulse mb-8" />
        <div className="aspect-video bg-card animate-pulse border border-border" />
      </div>
    );
  }

  if (!state.project) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <span className="font-mono text-xs text-muted-foreground block mb-4" dir="ltr">404</span>
          <h1 className="font-body text-3xl md:text-5xl font-light mb-6">المشروع غير موجود</h1>
          <Link to="/projects" className="font-body text-sm font-bold text-cobalt inline-flex items-center gap-2 hover:opacity-70">
            <ArrowRight className="w-4 h-4" aria-hidden="true" /> رجوع إلى المشاريع
          </Link>
        </div>
      </div>
    );
  }

  const p = state.project;
  const facts = [
    p.category && { label: 'التصنيف', value: p.category },
    p.created_at && {
      label: 'السنة',
      value: String(new Date(p.created_at).getFullYear()),
      ltr: true,
    },
    (p.skills || []).length > 0 && {
      label: 'التقنيات',
      value: p.skills.join(' · '),
      mono: true,
    },
  ].filter(Boolean);
  return (
    <article className="bg-background text-foreground font-body">
      {/* header: title only */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-10">
        <Link to="/projects" className="font-body text-xs text-muted-foreground hover:text-cobalt inline-flex items-center gap-2 transition-colors">
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" /> المشاريع
        </Link>
        <div className="mt-8">
          <span className="font-body text-xs text-muted-foreground">مشروع / 01</span>
          <h1 className="text-4xl md:text-7xl font-light tracking-tight leading-[1.35] mt-4 max-w-5xl">{p.title}</h1>
        </div>
      </div>

      {/* 01 — actions under the title */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pb-10">

        {/* actions: description toggle + facts + links */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowDesc(v => !v)}
            aria-expanded={showDesc}
            className={`inline-flex items-center gap-2 px-6 py-3 font-body text-sm font-bold border transition-colors ${showDesc ? 'bg-cobalt text-white border-cobalt' : 'border-border hover:border-cobalt hover:text-cobalt'}`}
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            الوصف
            <ChevronDown className={`w-4 h-4 transition-transform ${showDesc ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {(facts.length > 0 || p.github_url || p.demo_url) && (
            <span className="flex flex-wrap items-center gap-x-6 gap-y-2 ms-auto">
              {facts.map(f => (
                <span key={f.label} className="font-body text-sm">
                  <span className="text-muted-foreground ml-2">{f.label}</span>
                  <span className={f.mono ? 'font-mono text-xs' : ''} dir={f.ltr ? 'ltr' : 'auto'}>{f.value}</span>
                </span>
              ))}
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-cobalt transition-colors" dir="ltr">
                  <Github className="w-4 h-4" aria-hidden="true" /> GitHub
                </a>
              )}
              {p.demo_url && (
                <a href={p.demo_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-cobalt text-white px-5 py-2.5 font-body text-sm font-bold hover:opacity-90 transition-opacity">
                  <Globe className="w-4 h-4" aria-hidden="true" /> عرض مباشر
                </a>
              )}
            </span>
          )}
        </div>
      </div>

      {/* 02 — description, only if the visitor asks for it */}
      <AnimatePresence initial={false}>
        {showDesc && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border"
          >
            <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-14">
              <span className="font-body text-xs text-muted-foreground">الوصف / 02</span>
              {p.short_description && (
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mt-6">{p.short_description}</p>
              )}
              {p.content?.trim() && (
                <div className="max-w-3xl mt-6"><Markdown content={p.content} /></div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 03 — live demo */}
      {p.demo_url && (
        <div className="border-t border-border">
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-14">
            <span className="font-body text-xs text-muted-foreground">عرض حي / 03</span>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight leading-[1.5] mt-3 mb-8">
              جرّب الموقع وهو يعمل
            </h2>
            <DemoPreview url={p.demo_url} />
          </div>
        </div>
      )}

      {/* footer nav */}
      <div className="border-t border-border">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10 flex flex-wrap items-center justify-between gap-4">
          <Link to="/projects" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-cobalt transition-colors">
            <ArrowRight className="w-4 h-4" aria-hidden="true" /> كل المشاريع
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-cobalt transition-colors">
            مشروع مشابه؟ تواصل <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
