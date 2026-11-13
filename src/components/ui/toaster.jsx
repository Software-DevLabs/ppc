import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map(t => (
          <div key={t.id}
            className={`px-4 py-3 border font-body text-sm shadow-lg transition-all ${t.variant === 'destructive' ? 'bg-destructive text-destructive-foreground border-destructive' : 'bg-card text-foreground border-border'}`}>
            {t.title && <div className="font-medium">{t.title}</div>}
            {t.description && <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function Toaster() {
  return null;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { toast: ({ title }) => console.log('Toast:', title) };
  }
  return ctx;
}
