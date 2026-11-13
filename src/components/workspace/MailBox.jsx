import React, { useEffect, useMemo, useState } from 'react';
import { Inbox, MailPlus, RefreshCw, Send, Trash2 } from 'lucide-react';
import { mailApi } from '@/api/mail';
import { invalidateContent, useContactMessages, useMailThread, useMailThreads } from '@/lib/queries';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import { formatDate } from '@/lib/site';

function renderVars(template, name, email) {
  return (template || '').replace(/\{\{\s*(name|email)\s*\}\}/gi, (_, k) =>
    k.toLowerCase() === 'name' ? (name || email.split('@')[0]) : email
  );
}

export default function MailBox() {
  const { data: threadsData, isLoading: threadsLoading } = useMailThreads();
  const threads = threadsData?.threads ?? (threadsLoading ? null : []);
  const mailReady = threadsData?.mailReady ?? true;
  const mailEmail = threadsData?.mailEmail ?? null;
  const { data: sendersData } = useContactMessages();
  const senders = sendersData ?? [];
  const [selectedId, setSelectedId] = useState(null);
  const { data: threadData } = useMailThread(selectedId);
  const messages = threadData?.messages ?? [];
  const [syncing, setSyncing] = useState(false);

  const [compose, setCompose] = useState({ to: '', name: '', subject: '', html: '' });
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const gmail = new URLSearchParams(window.location.search).get('gmail');
    if (gmail === 'connected') setNotice({ type: 'ok', text: 'تم ربط بريد Gmail بنجاح' });
    else if (gmail === 'error') setNotice({ type: 'error', text: 'تعذّر ربط Gmail — حاول مجددًا' });
  }, []);

  const openThread = async (id) => {    setSelectedId(id);
    try {
      await mailApi.markRead(id);
      invalidateContent();
    } catch {}
  };

  const syncReplies = async () => {
    setSyncing(true);
    try {
      await mailApi.sync();
      invalidateContent();
      setNotice({ type: 'ok', text: 'تم فحص الردود' });
    } catch (err) {
      setNotice({ type: 'error', text: err.response?.data?.error || 'تعذّر فحص الردود' });
    } finally {
      setSyncing(false);
    }
  };

  const send = async (e) => {
    e.preventDefault();
    setNotice(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(compose.to.trim())) {
      return setNotice({ type: 'error', text: 'بريد المستلم غير صالح' });
    }
    if (!compose.subject.trim()) return setNotice({ type: 'error', text: 'الموضوع مطلوب' });
    if (!compose.html.trim()) return setNotice({ type: 'error', text: 'الصق قالب الرسالة أولًا' });
    setSending(true);
    try {
      const res = await mailApi.send({
        to: compose.to.trim(),
        name: compose.name.trim(),
        subject: compose.subject.trim(),
        html: compose.html,
      });
      setCompose({ to: '', name: '', subject: '', html: '' });
      setPreview(false);
      setNotice({ type: 'ok', text: 'تم إرسال الرسالة' });
      invalidateContent();
      openThread(res.threadId);
    } catch (err) {
      setNotice({ type: 'error', text: err.response?.data?.error || 'تعذّر الإرسال' });
    } finally {
      setSending(false);
    }
  };

  const removeThread = async () => {
    setDeleting(true);
    try {
      await mailApi.removeThread(confirmId);
      setConfirmId(null);
      if (selectedId === confirmId) setSelectedId(null);
      invalidateContent();
    } finally { setDeleting(false); }
  };

  const unreadTotal = useMemo(() => (threads || []).reduce((n, t) => n + (t.unread || 0), 0), [threads]);
  const selected = (threads || []).find(t => t.id === selectedId);
  const previewHtml = useMemo(
    () => renderVars(compose.html, compose.name.trim(), compose.to.trim() || 'client@example.com'),
    [compose.html, compose.name, compose.to]
  );

  const set = (key, val) => setCompose(c => ({ ...c, [key]: val }));

  return (
    <section className="border border-border bg-card p-6" aria-label="بريد العملاء">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-body text-lg text-foreground">
            بريد العملاء {unreadTotal > 0 && (
              <span className="bg-cobalt text-white font-mono text-[10px] px-2 py-0.5 rounded-full mr-2" dir="ltr">{unreadTotal}</span>
            )}
          </h2>
          <p className="font-body text-xs text-muted-foreground mt-1">
            راسل عملاءك المستهدفين بقوالب HTML — وردودهم تصل هنا فقط
            {mailReady && mailEmail && (
              <span className="block mt-1" dir="ltr">from: {mailEmail}</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={syncReplies}
          disabled={syncing}
          className="inline-flex items-center gap-2 border border-border px-4 py-2 font-body text-xs font-bold hover:border-cobalt hover:text-cobalt transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} aria-hidden="true" />
          {syncing ? 'جارٍ الفحص...' : 'فحص الردود'}
        </button>
      </div>

      {!mailReady && (
        <div className="border border-cobalt/40 bg-cobalt/5 px-4 py-4 mb-5 flex flex-wrap items-center justify-between gap-3" role="alert">
          <p className="font-body text-sm">
            اربط بريد Gmail للإرسال واستقبال الردود — {mailEmail || 'غير مربوط بعد'}.
          </p>
          <a
            href={`${import.meta.env.VITE_API_URL || ''}/api/mail/gmail/connect`}
            className="inline-flex items-center gap-2 bg-cobalt text-white px-5 py-2.5 font-body text-sm font-bold hover:opacity-90 transition-opacity"
          >
            ربط Gmail
          </a>
        </div>
      )}

      {notice && (
        <div
          className={`px-4 py-3 font-body text-sm mb-5 ${notice.type === 'ok' ? 'border border-cobalt/40 bg-cobalt/5 text-foreground' : 'border border-destructive text-destructive'}`}
          role={notice.type === 'ok' ? 'status' : 'alert'}
        >
          {notice.text}
        </div>
      )}

      {/* ---- composer ---- */}
      <form onSubmit={send} className="border border-border p-5 mb-6 space-y-4" noValidate>
        <h3 className="font-body text-sm font-bold text-foreground inline-flex items-center gap-2">
          <MailPlus className="w-4 h-4 text-cobalt" aria-hidden="true" /> رسالة جديدة
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="font-body text-xs text-muted-foreground block mb-1.5">إلى (بريد العميل) *</span>
            <input
              type="email" dir="ltr" value={compose.to} onChange={e => set('to', e.target.value)}
              placeholder="client@email.com" list="mail-senders"
              className="w-full bg-background border border-border px-3 py-2.5 font-mono text-xs text-left outline-none focus:border-cobalt transition-colors"
            />
            <datalist id="mail-senders">
              {senders.map(s => (
                <option key={s.id} value={s.email}>{s.name}</option>
              ))}
            </datalist>
          </label>
          <label className="block">
            <span className="font-body text-xs text-muted-foreground block mb-1.5">اسم العميل (للمتغير {'{{name}}'})</span>
            <input
              value={compose.name} onChange={e => set('name', e.target.value)}
              placeholder="اسم العميل" maxLength={120}
              className="w-full bg-background border border-border px-3 py-2.5 font-body text-sm outline-none focus:border-cobalt transition-colors"
            />
          </label>
          <label className="block">
            <span className="font-body text-xs text-muted-foreground block mb-1.5">الموضوع *</span>
            <input
              value={compose.subject} onChange={e => set('subject', e.target.value)}
              placeholder="موضوع الرسالة" maxLength={200}
              className="w-full bg-background border border-border px-3 py-2.5 font-body text-sm outline-none focus:border-cobalt transition-colors"
            />
          </label>
        </div>
        <label className="block">
          <span className="font-body text-xs text-muted-foreground block mb-1.5">
            قالب HTML (الصق قالبك هنا — يدعم {'{{name}}'} و {'{{email}}'})
          </span>
          <textarea
            rows={7} dir="ltr" value={compose.html} onChange={e => set('html', e.target.value)}
            placeholder="<h1>Hello {{name}}</h1>..."
            className="w-full bg-background border border-border px-3 py-2.5 font-mono text-xs text-left outline-none focus:border-cobalt transition-colors resize-y"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit" disabled={sending}
            className="inline-flex items-center gap-2 bg-cobalt text-white px-6 py-2.5 font-body text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" aria-hidden="true" /> {sending ? 'جارٍ الإرسال...' : 'إرسال'}
          </button>
          <button
            type="button" onClick={() => setPreview(p => !p)}
            className="border border-border px-4 py-2.5 font-body text-xs font-bold text-muted-foreground hover:text-foreground hover:border-cobalt transition-colors"
          >
            {preview ? 'إخفاء المعاينة' : 'معاينة القالب'}
          </button>
        </div>
        {preview && (
          <iframe
            title="معاينة القالب"
            sandbox=""
            srcDoc={previewHtml}
            className="w-full h-64 bg-white border border-border"
          />
        )}
      </form>

      {/* ---- threads ---- */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="border border-border divide-y divide-border max-h-[480px] overflow-y-auto" role="list" aria-label="المحادثات">
          {threads === null ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-20 bg-card animate-pulse" />)
          ) : threads.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="w-8 h-8 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
              <p className="font-body text-sm text-muted-foreground">لا محادثات بعد — أرسل أول رسالة بالأعلى.</p>
            </div>
          ) : (
            threads.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => openThread(t.id)}
                role="listitem"
                className={`w-full text-right p-4 transition-colors ${selectedId === t.id ? 'bg-cobalt/10' : 'hover:bg-card'} ${t.unread > 0 ? 'border-r-2 border-r-cobalt' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-body text-sm font-medium text-foreground truncate">
                    {t.client_name || t.client_email}
                  </span>
                  {t.unread > 0 && (
                    <span className="bg-cobalt text-white font-mono text-[10px] min-w-5 h-5 px-1 rounded-full inline-flex items-center justify-center shrink-0" dir="ltr">
                      {t.unread}
                    </span>
                  )}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground truncate mt-0.5" dir="ltr">{t.client_email}</div>
                <div className="font-body text-xs text-muted-foreground truncate mt-1">{t.preview || t.subject}</div>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2 border border-border p-5 min-h-[300px] max-h-[480px] overflow-y-auto" aria-live="polite">
          {!selected ? (
            <p className="font-body text-sm text-muted-foreground text-center pt-16">اختر محادثة لعرض الرسائل والردود.</p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-border pb-3 mb-4">
                <div className="min-w-0">
                  <h3 className="font-body text-sm font-bold text-foreground truncate">{selected.subject}</h3>
                  <p className="font-mono text-[11px] text-muted-foreground truncate" dir="ltr">{selected.client_email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmId(selected.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  aria-label="حذف المحادثة"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-4">
                {messages.map(m => (
                  <div key={m.id} className={`max-w-[85%] ${m.direction === 'out' ? 'mr-auto border border-cobalt/40 bg-cobalt/5 p-3' : 'ml-auto border border-border bg-background p-3'}`}>
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className={`font-body text-[11px] font-bold ${m.direction === 'out' ? 'text-cobalt' : 'text-foreground'}`}>
                        {m.direction === 'out' ? 'أنت' : (selected.client_name || selected.client_email)}
                      </span>
                      <span className="font-body text-[10px] text-muted-foreground">{formatDate(m.created_at)}</span>
                    </div>
                    <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">{m.body_text}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="font-body text-sm text-muted-foreground text-center pt-8">لا رسائل بعد.</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setCompose(c => ({
                    ...c,
                    to: selected.client_email,
                    name: selected.client_name || c.name,
                    subject: selected.subject.startsWith('Re:') ? selected.subject : `Re: ${selected.subject}`,
                  }));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-4 border border-border px-4 py-2 font-body text-xs font-bold hover:border-cobalt hover:text-cobalt transition-colors"
              >
                رد على هذه المحادثة
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        title="حذف المحادثة"
        message="سيتم حذف المحادثة وكل رسائلها نهائيًا. هل أنت متأكد؟"
        confirmLabel="حذف نهائي"
        busy={deleting}
        onConfirm={removeThread}
        onCancel={() => setConfirmId(null)}
      />
    </section>
  );
}
