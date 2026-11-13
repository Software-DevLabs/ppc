import React from 'react';
import { Link } from 'react-router-dom';
import { useAllPosts, useAllProjects } from '@/lib/queries';

function StatCard({ label, value, hint }) {
  return (
    <div className="border border-border bg-card p-6 hover:border-cobalt/50 hover:-translate-y-0.5 transition-all duration-300">
      <span className="font-mono text-xs text-muted-foreground block mb-3">{label}</span>
      <span className="font-body text-4xl font-light text-foreground block">{value}</span>
      {hint && <span className="font-mono text-[10px] text-muted-foreground block mt-2">{hint}</span>}
    </div>
  );
}

export default function Overview() {
  const { data: projectsData, isLoading: projectsLoading, isError: projectsError } = useAllProjects();
  const { data: postsData, isLoading: postsLoading, isError: postsError } = useAllPosts();
  const loading = (projectsLoading && !projectsData) || (postsLoading && !postsData);
  const errored = projectsError || postsError;
  const data = (projectsData && postsData)
    ? { projects: projectsData, posts: postsData }
    : (loading && !errored ? null : { projects: projectsData ?? [], posts: postsData ?? [] });

  if (!data) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-card animate-pulse border border-border" />)}
      </div>
    );
  }

  const p = data.projects;
  const b = data.posts;

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard label="إجمالي المشاريع" value={p.length}
          hint={`${p.filter(x => x.published).length} منشور · ${p.filter(x => !x.published).length} مسودة`} />
        <StatCard label="مشاريع مميزة" value={p.filter(x => x.featured).length} />
        <StatCard label="إجمالي المقالات" value={b.length}
          hint={`${b.filter(x => x.published).length} منشور · ${b.filter(x => !x.published).length} مسودة`} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/projects"
          className="inline-flex items-center gap-2 bg-cobalt text-gallery px-5 py-2.5 font-mono text-xs hover:opacity-90 transition-opacity">
          إدارة المشاريع
        </Link>
        <Link to="/dashboard/blog"
          className="inline-flex items-center gap-2 border border-border px-5 py-2.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
          إدارة المدونة
        </Link>
      </div>
      <p className="font-body text-sm text-muted-foreground leading-relaxed mt-10 max-w-2xl">
        تلميح: المسودات لا تظهر أبدًا في الموقع العام — تظهر المشاريع والمقالات فورًا بعد تفعيل خيار "منشور".
      </p>
    </div>
  );
}
