import React from 'react';

export const inputCls =
  'w-full bg-card border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-cobalt focus:border-cobalt transition-colors';

export function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="font-mono text-xs text-muted-foreground block mb-2">{label}</span>
      {children}
      {hint && !error && <span className="block mt-1 text-[11px] text-muted-foreground/70">{hint}</span>}
      {error && <span className="block mt-1 text-xs text-destructive" role="alert">{error}</span>}
    </label>
  );
}

export function Switch({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-cobalt" />
      <span className="font-body text-sm text-foreground">{label}</span>
    </label>
  );
}
