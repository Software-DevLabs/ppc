import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { usePublishedPosts } from '@/lib/queries';
import { formatDate } from '@/lib/site';

export default function Blog() {
  const { data: postsData, isLoading: postsLoading } = usePublishedPosts();
  const posts = postsData ?? (postsLoading ? null : []);
  const [tag, setTag] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const tags = useMemo(() => {
    if (!posts) return [];
    const set = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => t && set.add(t)));
    return [...set];
  }, [posts]);

  const visible = useMemo(() =>
    posts ? (tag ? posts.filter(p => (p.tags || []).includes(tag)) : posts) : [],
    [posts, tag]);

  const chipCls = active =>
    `border px-4 py-2 font-body text-sm transition-colors ${active
      ? 'bg-cobalt text-white border-cobalt'
      : 'border-border text-muted-foreground hover:border-cobalt hover:text-foreground'}`;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-10">
        <span className="font-body text-xs text-muted-foreground">المدونة / 002</span>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.3] mt-4">مقالات وتجارب</h1>
        <p className="max-w-md text-sm md:text-base leading-relaxed text-muted-foreground mt-6">
          أفكار وتجارب ودروس من داخل المختبر.
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10" role="group" aria-label="تصفية حسب الوسم">
            <button type="button" onClick={() => setTag(null)} aria-pressed={tag === null} className={chipCls(tag === null)}>الكل</button>
            {tags.map(t => (
              <button key={t} type="button" onClick={() => setTag(tag === t ? null : t)} aria-pressed={tag === t} className={chipCls(tag === t)}>{t}</button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pb-24">
        <div className="border-t border-border">
          {posts === null ? (
            <div className="py-10 space-y-0" aria-label="جارٍ التحميل">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-card animate-pulse border-b border-border" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="py-24 text-center">
              <div className="font-mono text-xs text-muted-foreground mb-3" dir="ltr">404 / EMPTY</div>
              <h2 className="text-3xl font-light">لا توجد مقالات منشورة بعد</h2>
              <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" aria-hidden="true" />
                ستظهر المقالات هنا بعد نشرها.
              </p>
            </div>
          ) : (
            visible.map((post, i) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group relative block border-b border-border overflow-hidden"
                aria-label={`قراءة مقال ${post.title}`}
              >
                <div className="relative z-10 py-7 md:py-8 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-mono text-xs tracking-widest text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="col-span-10 md:col-span-6">
                    <h2 className="text-xl md:text-3xl font-light tracking-tight group-hover:text-cobalt transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{post.excerpt}</p>
                    )}
                    {(post.tags || []).length > 0 && (
                      <p className="font-mono text-[10px] text-muted-foreground mt-2" dir="auto">
                        {post.tags.slice(0, 4).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="hidden md:block md:col-span-3">
                    <span className="font-body text-xs text-muted-foreground">
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                  </div>
                  {post.cover_url ? (
                    <div className="hidden md:block md:col-span-1">
                      <div className="w-20 h-14 border border-border overflow-hidden">
                        <img
                          src={post.cover_url}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:block md:col-span-1" aria-hidden="true" />
                  )}
                  <div className="hidden md:flex md:col-span-1 md:justify-end">
                    <ArrowLeft className="w-5 h-5 text-cobalt group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
