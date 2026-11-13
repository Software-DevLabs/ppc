import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Search, X } from 'lucide-react';
import { usePublishedProjects } from '@/lib/queries';
import { matchesQuery } from '@/lib/search';

export default function Projects() {
  const { data: projectsData, isLoading: projectsLoading } = usePublishedProjects();
  const projects = projectsData ?? (projectsLoading ? null : []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const categories = useMemo(() => {
    if (!projects) return [];
    return [...new Set(projects.map(p => p.category).filter(Boolean))];
  }, [projects]);

  const haystacks = useMemo(() => {
    const map = {};
    (projects || []).forEach(p => {
      map[p.id] = [p.title, p.short_description, p.category, (p.skills || []).join(' ')].join(' ');
    });
    return map;
  }, [projects]);

  const visible = useMemo(() => {
    if (!projects) return [];
    return projects.filter(p =>
      (!category || p.category === category) && matchesQuery(query, haystacks[p.id] || '')
    );
  }, [projects, category, query, haystacks]);

  const chipCls = active =>
    `border px-4 py-2 font-body text-sm transition-colors ${active
      ? 'bg-cobalt text-white border-cobalt'
      : 'border-border text-muted-foreground hover:border-cobalt hover:text-foreground'}`;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-10">
        <span className="font-body text-xs text-muted-foreground">أعمال مختارة / 001</span>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.3] mt-4">المشاريع</h1>
        <p className="max-w-md text-sm md:text-base leading-relaxed text-muted-foreground mt-6">
          مختارات من المنتجات البرمجية والواجهات والأنظمة التقنية التي طورها المختبر.
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث في المشاريع..."
              aria-label="البحث في المشاريع"
              className="w-full h-12 bg-transparent border border-border pr-11 pl-4 outline-none focus:border-cobalt transition-colors font-body text-sm placeholder:text-muted-foreground/60"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="مسح البحث"
                className="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
          {(query || category) && (
            <button
              type="button"
              onClick={() => { setQuery(''); setCategory(null); }}
              className="md:w-auto px-5 border border-border font-body text-sm text-muted-foreground hover:border-cobalt hover:text-foreground transition-colors"
            >
              مسح
            </button>
          )}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5" role="group" aria-label="تصفية حسب التصنيف">
            <button type="button" onClick={() => setCategory(null)} aria-pressed={category === null} className={chipCls(category === null)}>
              الكل
            </button>
            {categories.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(category === c ? null : c)}
                aria-pressed={category === c}
                className={chipCls(category === c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pb-24">
        {projects === null ? (
          <div className="grid md:grid-cols-3 gap-6" aria-label="جارٍ التحميل">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-border p-4">
                <div className="aspect-[4/3] bg-card animate-pulse border border-border" />
                <div className="h-6 bg-card animate-pulse mt-5" />
                <div className="h-4 w-2/3 bg-card animate-pulse mt-2" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-24 text-center">
            <div className="font-mono text-xs text-muted-foreground mb-3" dir="ltr">404 / NO MATCH</div>
            <h2 className="text-3xl font-light">
              {projects.length === 0 ? 'لا توجد مشاريع منشورة بعد' : 'لا توجد نتائج مطابقة'}
            </h2>
            <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-2">
              <FolderOpen className="w-4 h-4" aria-hidden="true" />
              {projects.length === 0 ? 'أضف مشاريعك من لوحة التحكم.' : 'جرّب كلمات مختلفة أو أزل التصفية.'}
            </p>
          </div>
        ) : (
          <>
            <p className="font-body text-xs text-muted-foreground mb-8">
              {visible.length} {visible.length === 1 ? 'مشروع' : 'مشاريع'}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {visible.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.slug}`}
                  className="group border border-border bg-card p-4 hover:border-cobalt transition-colors"
                  aria-label={`عرض مشروع ${p.title}`}
                >
                  <div className="border border-border overflow-hidden aspect-[4/3] bg-secondary">
                    {p.banner_url ? (
                      <img
                        src={p.banner_url}
                        alt={`غلاف ${p.title}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                        <img src="/logo.png" alt="" className="w-14 h-14 opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="px-1 pt-5 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs tracking-widest text-muted-foreground">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {p.featured && (
                        <span className="font-body text-xs text-cobalt">★ مميز</span>
                      )}
                    </div>
                    <h2 className="text-xl font-medium tracking-tight mt-2 group-hover:text-cobalt transition-colors">
                      {p.title}
                    </h2>
                    {p.category && (
                      <p className="font-body text-xs text-muted-foreground mt-1">{p.category}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-mono text-[10px] text-muted-foreground truncate">
                        {(p.skills || []).slice(0, 3).join(' · ')}
                      </span>
                      <ArrowLeft className="w-4 h-4 shrink-0 text-cobalt group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
