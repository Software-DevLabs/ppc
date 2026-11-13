import React from 'react';

export default function StatCard({ Icon, label, value, accent }) {
  return (
    <div className="border border-border bg-card p-5 flex items-center gap-4">
      <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${accent ? 'bg-cobalt/15 text-cobalt' : 'bg-secondary text-muted-foreground'}`} aria-hidden="true">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="font-mono text-2xl text-foreground leading-none">{value}</div>
        <div className="font-body text-xs text-muted-foreground mt-1.5">{label}</div>
      </div>
    </div>
  );
}
