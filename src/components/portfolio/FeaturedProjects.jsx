import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { projectsApi } from '@/api/projects';
import DbProjectCard from './DbProjectCard';
import EmptyState from './EmptyState';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    projectsApi.getAll({ published: true })
      .then(list => setProjects([...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))))
      .catch(() => setProjects([]));
  }, []);

  return (
    <section className="py-24 md:py-32 px-6 md:px-8 border-t border-border" aria-label="المشاريع المميزة">
      <div className="max-w-7xl mx-auto">
        <span className="font-mono text-xs tracking-widest text-muted-foreground block mb-4">أعمال مختارة</span>
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <h2 className="font-body text-4xl md:text-6xl font-light tracking-tight text-foreground">
            مشاريع <span className="text-muted-foreground">أفتخر بها</span>
          </h2>
          <Link to="/projects"
            className="hidden md:inline-flex items-center gap-2 font-mono text-sm text-cobalt hover:opacity-70 transition-opacity">
            كل المشاريع <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        {projects === null ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-[16/10] bg-card animate-pulse border border-border" />
            <div className="aspect-[16/10] bg-card animate-pulse border border-border" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState icon={FolderOpen} title="لا توجد مشاريع منشورة بعد"
            description="ستظهر المشاريع هنا بعد إضافتها من لوحة التحكم." />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.slice(0, 6).map(p => <DbProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
