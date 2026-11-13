import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { LogOut, Mail, ShieldCheck } from 'lucide-react';
import { ADMIN_EMAILS, CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

function InfoCard({ title, children }) {
  return (
    <div className="border border-border bg-card p-6">
      <h2 className="font-mono text-xs text-muted-foreground block mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value, ltr }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-b-0">
      <span className="font-body text-sm text-muted-foreground">{label}</span>
      <span className="font-body text-sm text-foreground" dir={ltr ? 'ltr' : undefined}>{value}</span>
    </div>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  return (
    <div className="max-w-2xl space-y-6">
      <InfoCard title="الحساب">
        <Row label="البريد الإلكتروني" value={user?.email} ltr />
        <Row label="الاسم" value={user?.name} />
        <Row label="طريقة الدخول" value="Google OAuth" ltr />
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-cobalt shrink-0" aria-hidden="true" />
          <span>هذا الحساب مصرّح له بإدارة المحتوى (<span dir="ltr">{ADMIN_EMAILS.join('، ')}</span>)</span>
        </div>
      </InfoCard>
      <InfoCard title="الموقع">
        <Row label="الاسم" value={SITE_NAME} />
        <div className="flex items-center justify-between gap-4 py-2">
          <span className="font-body text-sm text-muted-foreground">بريد التواصل</span>
          <a href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 font-body text-sm text-cobalt hover:opacity-70" dir="ltr">
            <Mail className="w-3.5 h-3.5" aria-hidden="true" /> {CONTACT_EMAIL}
          </a>
        </div>
      </InfoCard>
      <div>
        <button onClick={logout}
          className="inline-flex items-center gap-2 border border-destructive text-destructive px-5 py-2.5 font-mono text-xs hover:bg-destructive/10 transition-colors">
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" /> تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
