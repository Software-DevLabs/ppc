import React from 'react';

export default function StatusBadge({ type, children }) {
  const styles = {
    published: 'border-emerald-500/40 text-emerald-400',
    draft: 'border-border text-muted-foreground',
    featured: 'border-cobalt/50 text-cobalt',
  };
  return (
    <span className={`inline-block border rounded-full px-2 py-0.5 font-mono text-[10px] ${styles[type]}`}>
      {children}
    </span>
  );
}
