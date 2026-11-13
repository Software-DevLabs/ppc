import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { LOGO_URL, SITE_NAME } from '@/lib/site';
import { contactApi } from '@/api/contact';

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'نظرة عامة', end: true },
  { to: '/dashboard/projects', label: 'المشاريع' },
  { to: '/dashboard/blog', label: 'المدونة' },
  { to: '/dashboard/messages', label: 'الرسائل' },
  { to: '/dashboard/mail', label: 'البريد' },
  { to: '/dashboard/workspace', label: 'مساحة العمل' },
  { to: '/dashboard/settings', label: 'الإعدادات' },
];

export default function SidebarNav({ email, onSignOut, onNavigate }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let alive = true;
    const fetchCount = () => {
      contactApi.unreadCount()
        .then(r => { if (alive) setUnread(r.count || 0); })
        .catch(() => {});
    };
    fetchCount();
    const timer = setInterval(fetchCount, 30000);
    return () => { alive = false; clearInterval(timer); };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 flex items-center gap-3 border-b border-border">
        <img src={LOGO_URL} alt={`شعار ${SITE_NAME}`} className="w-9 h-9 rounded-md" />
        <div>
          <div className="font-body text-sm font-medium text-foreground">{SITE_NAME}</div>
          <div className="font-mono text-[10px] text-muted-foreground">لوحة التحكم</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1" aria-label="تنقّل لوحة التحكم">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 font-body text-sm transition-colors border-r-2 ${isActive ? 'bg-cobalt/15 text-cobalt border-cobalt' : 'text-muted-foreground hover:text-foreground hover:bg-card border-transparent'}`}>
            <span>{item.label}</span>
            {item.to === '/dashboard/messages' && unread > 0 && (
              <span className="bg-cobalt text-white font-mono text-[10px] min-w-5 h-5 px-1 rounded-full inline-flex items-center justify-center" dir="ltr">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="font-mono text-[10px] text-muted-foreground truncate mb-3" dir="ltr">{email}</div>
        <button onClick={onSignOut}
          className="w-full inline-flex items-center justify-center gap-2 border border-border px-3 py-2 font-mono text-xs font-bold text-muted-foreground hover:border-destructive hover:text-destructive transition-colors">
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" /> تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
