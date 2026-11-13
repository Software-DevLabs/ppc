import React from 'react';
import { Calendar, FileSpreadsheet, HardDrive, Mail } from 'lucide-react';

const SERVICES = [
  { key: 'gmail', label: 'Gmail', desc: 'إرسال وقراءة البريد تلقائيًا', Icon: Mail },
  { key: 'googledrive', label: 'Google Drive', desc: 'رفع الملفات ومزامنتها', Icon: HardDrive },
  { key: 'googlesheets', label: 'Google Sheets', desc: 'تصدير البيانات إلى جداول', Icon: FileSpreadsheet },
  { key: 'googlecalendar', label: 'Google Calendar', desc: 'مواعيد وتذكيرات تلقائية', Icon: Calendar },
];

export default function GoogleServices() {
  return (
    <section className="border border-border bg-card p-6" aria-label="خدمات Google">
      <div className="mb-5">
        <h2 className="font-body text-lg text-foreground">خدمات Google</h2>
        <p className="font-mono text-[11px] text-muted-foreground mt-1">
          يمكن ربط هذه الخدمات عبر Google OAuth من إعدادات الحساب
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {SERVICES.map(({ key, label, desc, Icon }) => (
          <div key={key} className="border border-border p-4 flex items-start gap-3">
            <Icon className="w-5 h-5 text-cobalt shrink-0 mt-0.5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <span className="font-body text-sm font-medium text-foreground block">{label}</span>
              <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
