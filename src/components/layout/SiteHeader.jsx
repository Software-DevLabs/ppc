import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpLeft, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';

function BrandMark() {
  return (
    <img
      src="/logo.png"
      alt="Software DevLabs"
      className="w-11 h-11 object-contain"
      decoding="async"
    />
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const isHome = pathname === '/' || pathname === '/ver2';
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Section anchors only exist on the homepage — prefix them elsewhere.
  const anchor = (hash) => (isHome ? hash : `/${hash}`);
  const logoHref = isHome ? '#top' : '/';

  const links = [
    { to: '/projects', label: 'المشاريع' },
    { href: anchor('#services'), label: 'الخدمات' },
    { to: '/about', label: 'من نحن' },
    { to: '/blog', label: 'المدونة' },
  ];

  const renderNavLink = (l) => l.to ? (
    <Link key={l.to} to={l.to} className="ver2-nav-link font-body text-[15px] font-medium">
      {l.label}
    </Link>
  ) : (
    <a key={l.href} href={l.href} className="ver2-nav-link font-body text-[15px] font-medium">
      {l.label}
    </a>
  );

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 px-4 md:px-8 pt-4">
        <div className="max-w-[1600px] mx-auto border border-border bg-background/90 backdrop-blur-md">
          <div className="px-4 md:px-6 h-[68px] flex items-center justify-between">
            <a href={logoHref} className="flex items-center gap-4" aria-label="Software DevLabs - الرئيسية">
              <BrandMark />
              <span className="leading-none">
                <span className="block text-[17px] font-semibold tracking-tight">Software</span>
                <span className="block text-[17px]">
                  <span className="text-cobalt font-light">Dev</span>
                  <span className="font-light">Labs</span>
                </span>
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-9" aria-label="التنقل الرئيسي">
              {links.map(renderNavLink)}
            </nav>

            <div className="flex items-center gap-2">
              <Link to="/contact" className="hidden md:inline-flex items-center gap-3 font-body text-sm font-bold group">
                <span className="w-2 h-2 rounded-full bg-cobalt" aria-hidden="true" />
                ابدأ مشروعًا
                <ArrowUpLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                className="hidden md:block p-2 hover:text-cobalt transition-colors"
                aria-label="تبديل المظهر بين الفاتح والداكن"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button type="button" onClick={() => setOpen(v => !v)} className="md:hidden p-1" aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}>
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 bg-charcoal text-white md:hidden">
          <div className="h-full flex flex-col justify-center px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="font-body text-sm text-white/40">التنقل</div>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 text-white/70 hover:text-white transition-colors"
                aria-label="تبديل المظهر بين الفاتح والداكن"
              >
                {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </div>
            <div className="space-y-5">
              {[...links, { to: '/contact', label: 'تواصل', accent: true }].map(l => (
                l.to ? (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`block text-5xl font-light tracking-tight ${l.accent ? 'text-[#5868F2]' : ''}`}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block text-5xl font-light tracking-tight"
                  >
                    {l.label}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
