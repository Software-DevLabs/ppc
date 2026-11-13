import React, { useEffect, useState } from 'react';
import { ArrowUpLeft, CheckCircle2, Clock, Globe, Mail, Send } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/site';
import { contactApi } from '@/api/contact';

const ROWS = [
  { icon: Mail, title: 'البريد الإلكتروني', text: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, ltr: true },
  { icon: Globe, title: 'التعاون', text: 'متاح للعمل الحر والمشاريع عن بُعد.' },
  { icon: Clock, title: 'سرعة الرد', text: 'أردّ على الرسائل عادةً خلال 48 ساعة.' },
];

export default function Contact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [form, setForm] = useState({ name: '', email: '', contactMethod: '', message: '' });
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) return setError('الاسم مطلوب');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return setError('البريد الإلكتروني غير صالح');
    if (!form.message.trim()) return setError('اكتب رسالتك أولًا');
    setSending(true);
    try {
      await contactApi.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        contactMethod: form.contactMethod.trim(),
        message: form.message.trim(),
      });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'تعذّر إرسال الرسالة — حاول لاحقًا');
    } finally {
      setSending(false);
    }
  };

  const inputCls = 'w-full bg-transparent border border-border px-4 py-3 font-body text-sm outline-none focus:border-cobalt transition-colors placeholder:text-muted-foreground/60';
  return (
    <div className="bg-background text-foreground font-body">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-14">
        <span className="font-body text-xs text-muted-foreground">تواصل / 004</span>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight mt-4 leading-[1.4]">
          لنبنِ شيئًا<br />رائعًا معًا.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mt-6">
          عندك فكرة مشروع أو نظام تريد بناءه؟ راسلني مباشرة عبر البريد.
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pb-24">
        <div className="border-t border-border">
          {ROWS.map(row => {
            const Icon = row.icon;
            const body = (
              <div className="py-7 grid grid-cols-12 gap-4 items-center">
                <span className="col-span-2 md:col-span-1">
                  <Icon className="w-5 h-5 text-cobalt" aria-hidden="true" />
                </span>
                <span className="col-span-10 md:col-span-4 text-xl font-light">{row.title}</span>
                <span className={`col-span-10 col-start-3 md:col-span-7 md:col-start-auto text-muted-foreground ${row.ltr ? 'font-mono text-sm text-left' : ''}`} dir={row.ltr ? 'ltr' : undefined}>
                  {row.text}
                </span>
              </div>
            );
            return row.href ? (
              <a key={row.title} href={row.href} className="group block border-b border-border hover:bg-card transition-colors">
                {body}
              </a>
            ) : (
              <div key={row.title} className="border-b border-border">{body}</div>
            );
          })}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pb-24">
        <span className="font-body text-xs text-muted-foreground">نموذج التواصل / 005</span>
        <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-[1.4] mt-4 mb-4">
          أو راسلني من هنا مباشرة
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mb-10">
          املأ النموذج وسأتواصل معك — عبر البريد أو الطريقة التي تفضلها.
        </p>

        {sent ? (
          <div className="border border-cobalt bg-cobalt/5 p-8 max-w-2xl flex items-start gap-4" role="status">
            <CheckCircle2 className="w-6 h-6 text-cobalt shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="text-xl font-medium mb-2">وصلت رسالتك بنجاح</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                شكرًا {form.name.trim().split(' ')[0]} — سأرد عليك قريبًا.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="max-w-2xl space-y-5" noValidate>
            {error && (
              <div className="border border-destructive text-destructive px-4 py-3 text-sm" role="alert">
                {error}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block">
                <span className="font-body text-sm block mb-2">الاسم *</span>
                <input
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="اسمك الكريم"
                  maxLength={120}
                  required
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="font-body text-sm block mb-2">البريد الإلكتروني *</span>
                <input
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="you@email.com"
                  maxLength={254}
                  required
                  className={`${inputCls} text-left`}
                />
              </label>
            </div>
            <label className="block">
              <span className="font-body text-sm block mb-2">طريقة تواصل أخرى (واتساب / تيليجرام / ...)</span>
              <input
                value={form.contactMethod}
                onChange={e => set('contactMethod', e.target.value)}
                placeholder="مثال: واتساب 05xxxxxxxx — اختياري"
                maxLength={120}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="font-body text-sm block mb-2">رسالتك *</span>
              <textarea
                rows={6}
                value={form.message}
                onChange={e => set('message', e.target.value)}
                placeholder="احكِ لي عن مشروعك أو فكرتك..."
                maxLength={5000}
                required
                className={`${inputCls} resize-y`}
              />
            </label>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 bg-cobalt text-white font-body text-sm font-bold px-8 py-4 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              {sending ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
            </button>
          </form>
        )}
      </div>

      <section className="bg-cobalt text-white">        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <span className="font-body text-xs text-white/60">ابدأ الآن / 005</span>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mt-4">جاهز عندما تكون جاهزًا.</h2>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group flex items-center justify-between w-full max-w-2xl border-t border-white/30 py-5 mt-10"
          >
            <span className="font-mono text-sm tracking-widest" dir="ltr">{CONTACT_EMAIL}</span>
            <ArrowUpLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
