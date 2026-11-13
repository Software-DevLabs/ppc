import React from 'react';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'تأكيد', busy = false, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-label={title}>
      <div className="bg-card border border-border max-w-sm w-full p-6">
        <h3 className="font-body text-lg text-foreground mb-2">{title}</h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} disabled={busy}
            className="border border-border px-4 py-2 font-mono text-xs font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            إلغاء
          </button>
          <button type="button" onClick={onConfirm} disabled={busy}
            className="bg-destructive text-destructive-foreground px-4 py-2 font-mono text-xs font-bold hover:opacity-90 disabled:opacity-50">
            {busy ? 'جارٍ التنفيذ...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
