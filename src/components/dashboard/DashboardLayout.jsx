import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LogOut, Menu as MenuIcon, ShieldAlert, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import SidebarNav, { NAV_ITEMS } from '@/components/dashboard/SidebarNav';
import { isAdmin, LOGO_URL } from '@/lib/site';

function Spinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-border border-t-cobalt rounded-full animate-spin" />
    </div>
  );
}

function Unauthorized({ email, onSignOut }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-6" aria-hidden="true" />
        <h1 className="font-body text-2xl text-foreground mb-3">غير مصرّح بالوصول</h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
          لوحة التحكم متاحة لحساب المدير فقط. أنت مسجّل الدخول بـ
          {email ? <span className="font-mono text-xs" dir="ltr"> {email}</span> : null}.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-2 border border-destructive text-destructive px-5 py-2.5 font-mono text-xs font-bold hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" /> تسجيل الخروج
          </button>
          <Link
            to="/"
            className="border border-border text-muted-foreground px-5 py-2.5 font-mono text-xs hover:text-foreground transition-colors"
          >
            العودة إلى الموقع
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, isAuthenticated, isLoadingAuth, logout, navigateToLogin } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  const activeItem = NAV_ITEMS.find(n => n.end ? pathname === n.to : pathname.startsWith(n.to));
  const pageTitle = activeItem?.label ?? 'لوحة التحكم';

  if (isLoadingAuth) return <Spinner />;

  if (!isAuthenticated) {
    navigateToLogin();
    return null;
  }

  if (!isAdmin(user?.email)) {
    return <Unauthorized email={user?.email} onSignOut={logout} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <aside className="hidden md:block fixed inset-y-0 right-0 w-60 border-l border-border bg-sidebar z-40">
        <SidebarNav email={user?.email} onSignOut={logout} />
      </aside>

      <div className="md:pr-60">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setDrawerOpen(true)}
              aria-label="فتح القائمة"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <img src={LOGO_URL} alt="" className="md:hidden w-7 h-7 rounded" aria-hidden="true" />
            <h1 className="font-body text-lg font-medium truncate">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-mono text-xs text-muted-foreground" dir="ltr">
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-xs font-bold text-muted-foreground hover:border-cobalt hover:text-cobalt transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" /> خروج
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 w-72 max-w-[85%] bg-sidebar border-l border-border">
            <button
              className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-foreground z-10"
              onClick={() => setDrawerOpen(false)}
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarNav email={user?.email} onSignOut={logout} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
