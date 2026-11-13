import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePost } from '@/lib/queries';
import Markdown from '@/components/portfolio/Markdown';
import { formatDate } from '@/lib/site';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: postData, isLoading, isError } = usePost(slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const state = { loading: isLoading, post: isError ? null : (postData ?? null) };

  if (state.loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-24">
        <div className="h-6 w-40 bg-card animate-pulse mb-6" />
        <div className="h-16 w-2/3 bg-card animate-pulse mb-8" />
        <div className="h-64 bg-card animate-pulse border border-border" />
      </div>
    );
  }

  if (!state.post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <span className="font-mono text-xs text-muted-foreground block mb-4" dir="ltr">404</span>
          <h1 className="font-body text-3xl md:text-5xl font-light mb-6">المقال غير موجود</h1>
          <Link to="/blog" className="font-body text-sm font-bold text-cobalt inline-flex items-center gap-2 hover:opacity-70">
            <ArrowRight className="w-4 h-4" aria-hidden="true" /> رجوع إلى المدونة
          </Link>
        </div>
      </div>
    );
  }

  const post = state.post;
  return (
    <article className="bg-background text-foreground font-body">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-10">
        <Link to="/blog" className="font-body text-sm text-muted-foreground hover:text-cobalt inline-flex items-center gap-2 transition-colors">
          <ArrowRight className="w-4 h-4" aria-hidden="true" /> رجوع إلى المدونة
        </Link>
        <div className="mt-10 max-w-5xl">
          <span className="font-body text-xs text-muted-foreground">مقال / 002</span>
          <h1 className="text-3xl md:text-6xl font-light tracking-tight leading-[1.3] mt-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mt-6 font-body text-sm text-muted-foreground">
            <span>{formatDate(post.published_at || post.created_at)}</span>
            {(post.tags || []).length > 0 && (
              <span className="font-mono text-xs" dir="auto">{post.tags.join(' · ')}</span>
            )}
          </div>
        </div>
      </div>

      {post.cover_url && (
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 pb-10">
          <div className="border border-border bg-card p-4">
            <div className="aspect-video border border-border overflow-hidden bg-secondary">
              <img src={post.cover_url} alt={`غلاف ${post.title}`} className="w-full h-full object-cover" decoding="async" />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pb-24">
        <div className="max-w-3xl"><Markdown content={post.content} /></div>
        <div className="flex flex-wrap gap-4 mt-16">
          <Link to="/blog" className="inline-flex items-center gap-2 border border-border px-6 py-3 font-body text-sm font-bold hover:border-cobalt hover:text-cobalt transition-colors">
            <ArrowRight className="w-4 h-4" aria-hidden="true" /> كل المقالات
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 border border-border px-6 py-3 font-body text-sm font-bold hover:border-cobalt hover:text-cobalt transition-colors">
            ناقشني في الموضوع <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
