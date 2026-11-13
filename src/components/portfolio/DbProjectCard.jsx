import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LOGO_URL } from '@/lib/site';

export default function DbProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`}
      className="group block border border-border bg-card hover:border-cobalt/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-cobalt/10 transition-all duration-300"
      aria-label={`عرض تفاصيل المشروع ${project.title}`}>
      <div className="aspect-[16/10] overflow-hidden bg-secondary">
        {project.banner_url ? (
          <img src={project.banner_url} alt={`غلاف ${project.title}`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
            <img src={LOGO_URL} alt="" className="w-14 h-14 opacity-40" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-body text-xl font-medium text-foreground mb-2">{project.title}</h3>
        {project.short_description && (
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {project.short_description}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(project.skills || []).slice(0, 4).map(s => (
              <span key={s} className="font-mono text-[10px] border border-border rounded-full px-2 py-0.5 text-muted-foreground">{s}</span>
            ))}
          </div>
          <ArrowLeft className="w-4 h-4 text-cobalt group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
