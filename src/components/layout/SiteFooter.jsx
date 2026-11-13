import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="bg-charcoal text-white/50">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8">
          {[
            { to: '/projects', label: 'المشاريع' },
            { to: '/blog', label: 'المدونة' },
            { to: '/about', label: 'من نحن' },
            { to: '/contact', label: 'تواصل' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="font-body text-sm hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4 border-t border-white/10 pt-7">
          <span className="font-body text-xs">© 2026 Software DevLabs</span>
          <span className="font-body text-xs">برمجيات · أنظمة · تصميم</span>
          <span className="font-body text-xs">صُنع بدقة.</span>
        </div>
      </div>
    </footer>
  );
}
