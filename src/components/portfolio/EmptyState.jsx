import React from 'react';

export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="border border-dashed border-border bg-card/50 px-6 py-16 text-center max-w-xl mx-auto">
      {Icon && <Icon className="w-10 h-10 text-muted-foreground/50 mx-auto mb-4" aria-hidden="true" />}
      <h3 className="font-body text-lg text-foreground mb-2">{title}</h3>
      {description && <p className="font-body text-sm text-muted-foreground leading-relaxed">{description}</p>}
      {children}
    </div>
  );
}
