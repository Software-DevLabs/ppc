import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Bot, Code2, PenTool, Send, Server } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import VoxelSphere from '@/components/VoxelSphere';
import WelcomeGate from '@/components/WelcomeGate';
import { CONTACT_EMAIL, SKILLS } from '@/lib/site';
import { contactApi } from '@/api/contact';
import { usePublishedPosts, usePublishedProjects } from '@/lib/queries';

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function BriefMini() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) return setError('الاسم مطلوب');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return setError('البريد الإلكتروني غير صالح');
    if (!form.message.trim()) return setError('اكتب نبذة عن مشروعك أولًا');
    setSending(true);
    try {
      await contactApi.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        contactMethod: 'ver6 brief',
        message: form.message.trim(),
      });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'تعذّر الإرسال — حاول لاحقًا');
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    'w-full bg-[#242424] border border-[#3F3F3F] rounded-[20px] px-5 py-3.5 font-body text-sm text-[#F5F5F5] outline-none focus:border-cobalt transition-colors placeholder:text-[#A0A0A0]/60';

  if (sent) {
    return (
      <div className="rounded-[24px] border border-[#3F3F3F] bg-[#242424] p-8" role="status">
        <p className="font-mono text-xs text-cobalt" dir="ltr">TRANSMITTED ✓</p>
        <h3 className="text-2xl font-light text-[#F5F5F5] mt-3">وصلت رسالتك.</h3>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[28px] border border-[#3F3F3F] bg-[#242424] p-6 md:p-8 space-y-4" noValidate>
      {error && (
        <div className="rounded-[16px] border border-red-400/60 text-red-300 px-4 py-3 text-sm" role="alert">
          {error}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="الاسم" maxLength={120} required aria-label="الاسم" className={inputCls} />
        <input type="email" dir="ltr" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" maxLength={254} required aria-label="البريد الإلكتروني" className={`${inputCls} text-left`} />
      </div>
      <textarea rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="نبذة عن مشروعك..." maxLength={5000} required aria-label="نبذة عن المشروع" className={`${inputCls} resize-y`} />
      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F5F5F5] px-8 py-4 font-body text-sm font-bold text-[#1A1A1A] hover:bg-white transition-colors disabled:opacity-50"
      >
        <Send className="w-4 h-4" aria-hidden="true" /> {sending ? 'جارٍ الإرسال...' : 'إرسال'}
      </button>
    </form>
  );
}

export default function Ver6() {
  const { data: projectsData } = usePublishedProjects();
  const { data: postsData } = usePublishedPosts();
  const projects = projectsData || [];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div id="top" className="min-h-screen bg-[#1A1A1A] font-body antialiased snap-y snap-proximity v6-arrow" style={{ color: '#F5F5F5' }}>
      <WelcomeGate />
      <SiteHeader />

      {/* ============ HERO: logo rebuilt from squares ============ */}
      <section className="relative overflow-hidden pt-[150px] md:pt-[170px] pb-20 min-h-screen flex items-center snap-start">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <motion.div
            className="lg:col-span-7"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={item} className="font-mono text-[11px] tracking-[0.22em] text-[#A0A0A0]" dir="ltr">
              PIXEL × ROUND — 001
            </motion.p>
            <motion.h1
              variants={item}
              className="font-light tracking-tight leading-[1.3] mt-6"
              style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}
            >
              نبني خارج الشبكة.
            </motion.h1>
            <motion.p variants={item} className="text-base md:text-lg leading-relaxed max-w-xl mt-8" style={{ color: '#A0A0A0' }}>
              تجارب رقمية تشكّلها الهندسة والدقة وأنظمة بصرية غير تقليدية — مربعات حادة، وواجهات ناعمة.
            </motion.p>
            <motion.div variants={item} className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#F5F5F5] px-8 py-4 font-body text-sm font-bold text-[#1A1A1A] hover:bg-white transition-colors"
              >
                ابدأ الآن
              </Link>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-body text-sm font-bold transition-colors"
                style={{ background: '#242424', border: '1px solid #3F3F3F', color: '#F5F5F5' }}
              >
                لاحقًا
              </a>
            </motion.div>
          </motion.div>
          <div className="lg:col-span-5 flex lg:justify-end">
            <div className="w-full max-w-[520px]">
              <VoxelSphere />
            </div>
          </div>
        </div>
      </section>

      {/* ============ TECH STRIP ============ */}
      <div className="overflow-hidden border-y border-[#3F3F3F] bg-[#141414] py-3.5" dir="ltr" aria-label="التقنيات">
        <div className="marquee-track flex w-max items-center">
          {[...SKILLS, ...SKILLS].map((s, i) => (
            <span key={i} className="flex items-center whitespace-nowrap">
              <span className="font-mono text-xs tracking-[0.14em] text-[#A0A0A0] px-5">{s}</span>
              <span className="w-2 h-2 bg-cobalt shrink-0" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      {/* ============ WORK ============ */}
      <section id="work" className="border-t border-[#3F3F3F] scroll-mt-20 snap-start">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-mono text-[11px] tracking-[0.22em] text-[#A0A0A0]" dir="ltr">SELECTED WORK — 002</p>
              <h2 className="font-light tracking-tight leading-[1.3] mt-4" style={{ color: '#F5F5F5', fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                أعمال مختارة
              </h2>
            </div>
            <Link to="/projects" className="hidden md:inline-flex font-mono text-xs text-cobalt hover:opacity-70 transition-opacity" dir="ltr">
              VIEW ALL →
            </Link>
          </div>
          {projects.length === 0 ? (
            <p style={{ color: '#A0A0A0' }}>تُنشر الأعمال هنا قريبًا.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.slug}`}
                  className="group rounded-[28px] border border-[#3F3F3F] bg-[#242424] p-4 hover:border-cobalt/60 transition-colors"
                  aria-label={`عرض مشروع ${p.title}`}
                >
                  <div className="rounded-[20px] overflow-hidden aspect-[16/10] bg-[#1A1A1A]">
                    {p.banner_url ? (
                      <img src={p.banner_url} alt={`غلاف ${p.title}`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                        <img src="/logo.png" alt="" className="w-14 h-14 opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="px-2 pt-4 pb-1">
                    <h3 className="text-lg font-medium" style={{ color: '#F5F5F5' }}>{p.title}</h3>
                    <p className="font-mono text-[11px] mt-1.5" style={{ color: '#A0A0A0' }} dir="auto">
                      {[p.category, ...(p.skills || []).slice(0, 2)].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="border-t border-[#3F3F3F] snap-start">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <p className="font-mono text-[11px] tracking-[0.22em] text-[#A0A0A0]" dir="ltr">SERVICES — 003</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              { icon: Code2, title: 'هندسة المنتجات', desc: 'منتجات موثوقة من الفكرة حتى الإنتاج.' },
              { icon: Bot, title: 'أنظمة الذكاء الاصطناعي', desc: 'وكلاء وأتمتة ذكية لسير عملك.' },
              { icon: Server, title: 'البنية التحتية', desc: 'سحابة وقواعد بيانات ونشر.' },
              { icon: PenTool, title: 'تصميم الواجهات', desc: 'واجهات دقيقة حول الوضوح.' },
            ].map((s) => (
              <div key={s.title} className="group rounded-[20px] border border-[#3F3F3F] bg-[#242424] p-5 hover:border-cobalt/60 transition-colors">
                <span className="w-10 h-10 rounded-full border border-[#3F3F3F] flex items-center justify-center text-[#A0A0A0] group-hover:text-white group-hover:border-cobalt transition-colors" aria-hidden="true">
                  <s.icon className="w-4 h-4" />
                </span>
                <h3 className="font-body text-base font-medium mt-4" style={{ color: '#F5F5F5' }}>{s.title}</h3>
                <p className="font-body text-xs leading-relaxed mt-1.5" style={{ color: '#A0A0A0' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BRIEF FORM ============ */}
      <section className="border-t border-[#3F3F3F] snap-start">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#A0A0A0]" dir="ltr">START A PROJECT — 004</p>
            <h2 className="font-light tracking-tight leading-[1.35] mt-4" style={{ color: '#F5F5F5', fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}>
              عندك فكرة؟
              <br />
              اكتب موجزها.
            </h2>
            <div className="mt-8 max-w-[320px]" aria-hidden="false">
              <VoxelSphere shape="torus" speed={-0.006} tilt={0.55} label="حلقة بكسل ثلاثية الأبعاد — اسحب لتدويرها" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <BriefMini />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
