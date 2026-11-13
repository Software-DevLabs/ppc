import React from 'react';

export default function IconBtn({ title, onClick, disabled, danger, children }) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} disabled={disabled}
      className={`p-2 border border-border text-muted-foreground transition-colors disabled:opacity-40 ${danger ? 'hover:border-destructive hover:text-destructive' : 'hover:border-cobalt hover:text-cobalt'}`}>
      {children}
    </button>
  );
}
