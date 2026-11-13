import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PageNotFound() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center">
        <h1 className="text-7xl font-light text-muted-foreground/40 mb-4">404</h1>
        <div className="h-0.5 w-16 bg-border mx-auto mb-8" />
        <h2 className="font-body text-2xl font-medium text-foreground mb-3">الصفحة غير موجودة</h2>
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
          الصفحة "<span dir="ltr">{location.pathname}</span>" غير موجودة.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground bg-card border border-border hover:border-cobalt hover:text-cobalt transition-colors"
        >
          <ArrowRight className="w-4 h-4" aria-hidden="true" /> العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  );
}
