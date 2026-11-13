import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { blogApi } from '@/api/blog';
import EmptyState from './EmptyState';
import { formatDate } from '@/lib/site';

export default function BlogSection() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    blogApi.getAll({ published: true })
      .then(list => setPosts([...list].sort((a, b) =>
        new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))))
      .catch(() => setPosts([]));
  }, []);

  return (
    <section className="py-24 md:py-32 px-6 md:px-8 border-t border-border" aria-label="أحدث المقالات">
      <div className="max-w-7xl mx-auto">
        <span className="font-mono text-xs tracking-widest text-muted-foreground block mb-4">المدونة</span>
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <h2 className="font-body text-4xl md:text-6xl font-light tracking-tight text-foreground">
            آخر <span className="text-muted-foreground">ما أكتبه</span>
          </h2>
          <Link to="/blog" className="hidden md:inline-flex items-center gap-2 font-mono text-sm text-cobalt hover:opacity-70">
            كل المقالات <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        {posts === null ? (
          <div className="space-y-4">
            <div className="h-24 bg-card animate-pulse border border-border" />
            <div className="h-24 bg-card animate-pulse border border-border" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState icon={FileText} title="لا توجد مقالات منشورة بعد"
            description="ستظهر المقالات هنا بعد نشرها من لوحة التحكم." />
        ) : (
          <div className="space-y-4">
            {posts.slice(0, 3).map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`}
                className="group flex gap-6 items-center border border-border bg-card p-4 md:p-5 hover:border-cobalt/60 transition-colors"
                aria-label={`قراءة مقال ${post.title}`}>
                {post.cover_url && (
                  <img src={post.cover_url} alt={`غلاف ${post.title}`}
                    className="w-24 h-20 object-cover hidden sm:block" loading="lazy" />
                )}
                <div className="min-w-0">
                  <h3 className="font-body text-lg text-foreground mb-1 group-hover:text-cobalt transition-colors">{post.title}</h3>
                  {post.excerpt && (
                    <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">{post.excerpt}</p>
                  )}
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
