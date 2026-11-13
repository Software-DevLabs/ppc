import React from 'react';
import { Activity } from 'lucide-react';
import { useActivities } from '@/lib/queries';

export default function ActivityFeed() {
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities();
  const activities = activitiesData ?? (activitiesLoading ? null : []);

  return (
    <section className="border border-border bg-card p-6" aria-label="سجل النشاط">
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-4 h-4 text-cobalt" aria-hidden="true" />
        <h2 className="font-body text-lg text-foreground">سجل النشاط</h2>
      </div>
      {activities === null ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-6 bg-secondary animate-pulse" />)}</div>
      ) : activities.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">لا توجد نشاطات بعد.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map(item => (
            <li key={item.id} className="flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-cobalt mt-2 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <span className="font-body text-sm text-foreground block">{item.action}</span>
                {item.detail && <span className="font-mono text-[11px] text-muted-foreground block truncate">{item.detail}</span>}
                <span className="font-mono text-[10px] text-muted-foreground/60 block mt-0.5">
                  {new Date(item.created_at).toLocaleString('ar', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
