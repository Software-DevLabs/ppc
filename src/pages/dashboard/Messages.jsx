import React, { useMemo, useState } from 'react';
import { CheckCheck, Inbox, Mail, MessageCircle, Search, Trash2 } from 'lucide-react';
import { contactApi } from '@/api/contact';
import { invalidateContent, useContactMessages } from '@/lib/queries';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import { formatDate } from '@/lib/site';

function normalizeDigits(s = '') {
  const eastern = '٠١٢٣٤٥٦٧٨٩';
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  return s
    .replace(/[٠-٩]/g, (d) => eastern.indexOf(d))
    .replace(/[۰-۹]/g, (d) => persian.indexOf(d));
}

function whatsappLink(contactMethod = '') {
  const digits = normalizeDigits(contactMethod).replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}

export default function Messages() {
  const { data: messagesData, isLoading: messagesLoading } = useContactMessages();
  const messages = messagesData ?? (messagesLoading ? null : []);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | unread
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const unread = useMemo(
    () => (messages || []).filter(m => !m.is_read).length,
    [messages]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (messages || []).filter(m => {
      if (filter === 'unread' && m.is_read) return false;
      if (!q) return true;
      return [m.name, m.email, m.contact_method, m.message]
        .join(' ').toLowerCase().includes(q);
    });
  }, [messages, search, filter]);

  const toggleRead = async (m) => {
    setBusyId(m.id);
    try {
      await contactApi.setRead(m.id, !m.is_read);
      invalidateContent();
    } finally { setBusyId(null); }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await contactApi.remove(confirmId);
      setConfirmId(null);
      invalidateContent();
    } finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-body text-2xl font-light text-foreground">رسائل التواصل</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {messages === null ? '...' : `${messages.length} رسائل · ${unread} غير مقروءة`}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 right-3 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو البريد..."
            aria-label="بحث في الرسائل"
            className="w-full bg-card border border-border pr-9 pl-3 py-2 font-body text-sm focus:outline-none focus:ring-1 focus:ring-cobalt focus:border-cobalt"
          />
        </div>
        <div className="flex gap-1" role="group" aria-label="تصفية">
          {[{ id: 'all', label: 'الكل' }, { id: 'unread', label: `غير المقروءة (${unread})` }].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`px-3 py-1.5 font-body text-sm border transition-colors ${filter === f.id ? 'border-cobalt text-cobalt bg-cobalt/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {messages === null ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-card animate-pulse border border-border" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="border border-border bg-card p-12 text-center">
          <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
          <p className="font-body text-foreground">لا توجد رسائل هنا بعد</p>
          <p className="font-body text-sm text-muted-foreground mt-2">رسائل الزوار من صفحة التواصل ستظهر هنا.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(m => {
            const wa = whatsappLink(m.contact_method);
            return (
              <article
                key={m.id}
                className={`border bg-card p-5 transition-colors ${m.is_read ? 'border-border' : 'border-cobalt'}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {!m.is_read && (
                      <span className="bg-cobalt text-white font-body text-[11px] px-2 py-0.5">جديدة</span>
                    )}
                    <h2 className="font-body text-lg font-medium text-foreground">{m.name}</h2>
                  </div>
                  <span className="font-body text-xs text-muted-foreground">{formatDate(m.created_at)}</span>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1 mb-3 font-body text-sm text-muted-foreground">
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-cobalt transition-colors" dir="ltr">
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" /> {m.email}
                  </a>
                  {m.contact_method && (
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> {m.contact_method}
                    </span>
                  )}
                </div>

                <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap border-t border-border pt-3">
                  {m.message}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent('رد على رسالتك')}`}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-xs font-bold hover:border-cobalt hover:text-cobalt transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" /> رد بالبريد
                  </a>
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-xs font-bold hover:border-cobalt hover:text-cobalt transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" /> واتساب
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleRead(m)}
                    disabled={busyId === m.id}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    {m.is_read ? 'تعليم كغير مقروءة' : 'تعليم كمقروءة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(m.id)}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-body text-xs text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> حذف
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="حذف الرسالة"
        message="سيتم حذف هذه الرسالة نهائيًا. هل أنت متأكد؟"
        confirmLabel="حذف نهائي"
        busy={deleting}
        onConfirm={remove}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
