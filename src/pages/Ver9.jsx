import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowUpLeft, Send,
  Wrench, TrendingUp, Megaphone, User, Building2,
  ClipboardList, Code2, Palette, Layers, Rocket, Package,
  CircleCheck, ImageIcon, ImagePlay, Lightbulb, Plus, Mic, Paperclip,
} from 'lucide-react';
import Ver9Header from '@/components/layout/Ver9Header';
import SiteFooter from '@/components/layout/SiteFooter';
import { Marquee } from '@/components/ui/marquee';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CONTACT_EMAIL, SKILLS } from '@/lib/site';
import { contactApi } from '@/api/contact';
import { usePublishedProjects } from '@/lib/queries';

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* ---------------- TechBar ---------------- */
function TechBar() {
  const items = [...SKILLS, ...SKILLS];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#0a0807] py-4" dir="ltr" aria-label="التقنيات">
      <div className="marquee-track flex w-max items-center">
        {items.map((s, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="font-mono text-sm tracking-[0.14em] text-[#F0F0EE] px-6">{s}</span>
            <span className="w-2.5 h-2.5 bg-cobalt shrink-0" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Feature (ver9 wilderness skin) ---------------- */
const TagChip = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-black/10 border border-white/20 shrink-0">
    <Icon className="size-4 text-white" />
    <span className="text-sm font-medium text-white whitespace-nowrap">{label}</span>
  </div>
);

const row1Tags = [
  { icon: Wrench, label: 'Engineers' },
  { icon: TrendingUp, label: 'Sales' },
  { icon: Megaphone, label: 'Marketing' },
  { icon: User, label: 'HR' },
  { icon: Building2, label: 'Enterprises' },
];
const row2Tags = [
  { icon: ClipboardList, label: 'Project Managers' },
  { icon: Code2, label: 'Developers' },
  { icon: Palette, label: 'Designers' },
  { icon: Layers, label: 'Product Team' },
];
const row3Tags = [
  { icon: Rocket, label: 'Founders' },
  { icon: Package, label: 'Product Team' },
  { icon: Building2, label: 'Enterprises' },
  { icon: Wrench, label: 'Engineers' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

function Feature() {
  return (
    <section className="v9-scope" dir="ltr">
      <div className="max-w-7xl xl:px-16 lg:px-8 px-4 lg:py-20 sm:py-16 py-10 mx-auto w-full">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <motion.div
            className="flex flex-col items-center gap-4 text-center mb-7"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <Badge
                variant="outline"
                className="text-sm font-normal text-foreground px-3 py-1 rounded-full h-auto border-white/20"
              >
                Capabilities
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="xl:text-4xl text-3xl font-medium text-foreground max-w-2xl leading-tight"
            >
              Discover AI chatbot capabilities
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base lg:text-xl text-muted-foreground max-w-2xl"
            >
              Accelerate your workflows with AI-powered tools designed for
              speed, clarity, and scalability—built to support teams at every
              stage.
            </motion.p>
          </motion.div>

          {/* Row 1: Image left (tag overlay) + Content right */}
          <div className="bg-muted rounded-3xl p-2 flex flex-col md:flex-row gap-0 overflow-hidden border border-white/10">
            <motion.div
              className="relative rounded-2xl overflow-hidden md:w-1/2 h-72 md:h-auto min-h-[300px] shrink-0"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeLeft}
            >
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85"
                alt="AI workflow automation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex flex-col justify-center gap-4 py-10">
                <Marquee className="[--duration:20s] [--gap:0.75rem] p-0">
                  {row1Tags.map((tag, i) => (
                    <TagChip key={i} {...tag} />
                  ))}
                </Marquee>
                <Marquee reverse className="[--duration:16s] [--gap:0.75rem] p-0">
                  {row2Tags.map((tag, i) => (
                    <TagChip key={i} {...tag} />
                  ))}
                </Marquee>
                <Marquee className="[--duration:22s] [--gap:0.75rem] p-0">
                  {row3Tags.map((tag, i) => (
                    <TagChip key={i} {...tag} />
                  ))}
                </Marquee>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 flex flex-col justify-center gap-8 p-8 md:p-10"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              <motion.div variants={fadeRight} className="flex flex-col gap-3">
                <h3 className="text-2xl font-medium text-foreground leading-snug">
                  Automate complex workflows easily with AI-powered solutions
                </h3>
                <p className="text-base text-muted-foreground">
                  Simplify operations by automating repetitive and
                  time-consuming processes with intelligent AI designed for
                  efficiency and accuracy.
                </p>
              </motion.div>
              <motion.div variants={stagger} className="flex flex-col gap-3">
                {[
                  {
                    title: 'Smart Automation',
                    body: 'Execute tasks automatically with minimal manual input, reducing repetitive work and freeing up time for high-impact activities.',
                  },
                  {
                    title: 'Process Optimization',
                    body: 'Improve speed and consistency across workflows, streamlining operations for more reliable and efficient outcomes.',
                  },
                ].map(({ title, body }, i) => (
                  <motion.div
                    key={i}
                    variants={fadeRight}
                    className="flex gap-3 items-start"
                  >
                    <CircleCheck className="size-5 text-foreground shrink-0 mt-0.5" />
                    <p className="text-base text-muted-foreground">
                      <span className="font-medium text-foreground">{title}: </span>
                      {body}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Row 2: Content left + Image right (AI chat UI) */}
          <div className="bg-muted rounded-3xl p-2 flex flex-col md:flex-row gap-0 overflow-hidden border border-white/10">
            <motion.div
              className="flex-1 flex flex-col justify-center gap-8 p-8 md:p-10"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              <motion.div variants={fadeLeft} className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl font-medium text-foreground leading-snug">
                    Seamlessly integrate AI tools with your workflow systems
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Interact with AI in real time to generate content, automate
                    responses, and streamline tasks through a simple interface.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={stagger} className="flex flex-col gap-3">
                {[
                  {
                    title: 'AI-Powered Assistance',
                    body: 'Generate responses, ideas, and content instantly with intelligent, context-aware AI support, helping you work faster and make more informed decisions.',
                  },
                  {
                    title: 'Interactive Experience',
                    body: 'Engage with a dynamic and intuitive interface that makes creating, refining, and managing outputs effortless, giving you control over your workflow.',
                  },
                ].map(({ title, body }, i) => (
                  <motion.div
                    key={i}
                    variants={fadeLeft}
                    className="flex gap-3 items-start"
                  >
                    <CircleCheck className="size-5 text-foreground shrink-0 mt-0.5" />
                    <p className="text-base text-muted-foreground">
                      <span className="font-medium text-foreground">{title}: </span>
                      {body}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative rounded-2xl overflow-hidden md:w-1/2 h-72 md:h-auto min-h-[300px] shrink-0"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeRight}
            >
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85"
                alt="AI chat interface"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-gray-950/20 px-2 py-2.5 sm:p-4 rounded-3xl flex flex-col gap-3">
                  <div className="flex flex-wrap justify-center items-center gap-1">
                    <Button className="text-xs bg-white/20 border border-gray-200/40 h-auto px-2 xl:px-4 py-1.5 xl:py-2 rounded-full text-white cursor-pointer">
                      <ImageIcon className="size-3.5 mr-1.5" />
                      <span>Create Image</span>
                    </Button>
                    <Button className="text-xs bg-white/20 border border-gray-200/40 h-auto px-2 xl:px-4 py-1.5 xl:py-2 rounded-full text-white cursor-pointer">
                      <ImagePlay className="size-3.5 mr-1.5" />
                      <span>Generate Video</span>
                    </Button>
                    <Button className="text-xs bg-white/20 border border-gray-200/40 h-auto px-2 xl:px-4 py-1.5 xl:py-2 rounded-full text-white cursor-pointer">
                      <Lightbulb className="size-3.5 mr-1.5" />
                      <span>Deep Search</span>
                    </Button>
                  </div>
                  <div className="flex items-center gap-0 sm:gap-2 rounded-full border border-white/20 bg-white/10 px-1.5 sm:px-3 py-1.5 sm:py-2 shadow-sm">
                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-white/10 cursor-pointer">
                      <Plus className="h-4 w-4 text-white" />
                    </Button>
                    <input
                      placeholder="What would you like to design today?"
                      className="flex-1 min-w-0 border-none bg-transparent p-0 text-white text-sm outline-none placeholder:text-white/80"
                      aria-label="What would you like to design today?"
                    />
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-white/10 cursor-pointer">
                        <Mic className="h-4 w-4 text-white" />
                      </Button>
                      <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-white/10 cursor-pointer">
                        <Paperclip className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Brief Form (glass skin) ---------------- */
function Ver9BriefForm() {
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
        contactMethod: 'ver9 brief',
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
    'w-full bg-white/5 border border-white/20 focus:border-white/50 rounded-2xl px-4 py-3 font-body text-sm text-[#F7F3ED] outline-none transition-colors placeholder:text-[#F7F3ED]/40 backdrop-blur-sm';

  if (sent) {
    return (
      <div className="border border-white/15 bg-[var(--glass)] backdrop-blur-xl rounded-3xl text-[#F7F3ED] p-8 max-w-2xl" role="status">
        <p className="font-mono text-xs tracking-[0.2em] mb-3" dir="ltr">TRANSMITTED ✓</p>
        <h3 className="text-2xl font-light">وصل الموجز بنجاح.</h3>
        <p className="text-sm mt-2 opacity-70">سأرد عليك قريبًا — شكرًا {form.name.trim().split(' ')[0]}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5" noValidate>
      {error && (
        <div className="border border-[#b3352b] text-[#b3352b] px-4 py-3 text-sm font-bold rounded-2xl" role="alert">
          {error}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.18em] text-[#F7F3ED]/70 block mb-2" dir="ltr">NAME *</span>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="اسمك" maxLength={120} required className={inputCls} />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.18em] text-[#F7F3ED]/70 block mb-2" dir="ltr">EMAIL *</span>
          <input type="email" dir="ltr" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" maxLength={254} required className={`${inputCls} text-left`} />
        </label>
      </div>
      <label className="block">
        <span className="font-mono text-[11px] tracking-[0.18em] text-[#F7F3ED]/70 block mb-2" dir="ltr">PROJECT BRIEF *</span>
        <textarea rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="فكرة المشروع، المدة، الميزانية التقريبية..." maxLength={5000} required className={`${inputCls} resize-y`} />
      </label>
      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center gap-2 bg-[#F7F3ED] text-[#17110F] font-body text-sm font-bold px-8 py-4 rounded-full hover:bg-[#f1e8df] transition-colors duration-300 disabled:opacity-50"
      >
        <Send className="w-4 h-4" aria-hidden="true" /> {sending ? 'جارٍ الإرسال...' : 'إرسال الموجز'}
      </button>
    </form>
  );
}

/* ---------------- Page ---------------- */
export default function Ver9() {
  const { data: projectsData } = usePublishedProjects();
  const projects = projectsData || [];
  const work = projects;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div id="top" className="min-h-screen font-body antialiased v9-scope">
      {/* ============ SCENE · hero + nav ============ */}
      <div className="v9-scene relative">
        <Ver9Header />
        <div className="relative z-20 max-w-[1600px] mx-auto px-6 md:px-10 pt-[190px] md:pt-[220px] pb-24">
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={item} className="font-mono text-[11px] tracking-[0.22em] text-white/60" dir="ltr">
              WILDERNESS — 001
            </motion.p>
            <motion.h1
              variants={item}
              className="font-light tracking-tight leading-[1.35] mt-6 max-w-3xl text-[#F7F3ED]"
              style={{ fontSize: 'clamp(2.4rem, 9vw, 6.5rem)' }}
            >
              استكشف بلا حدود.
            </motion.h1>
            <motion.p variants={item} className="text-base md:text-lg leading-relaxed max-w-xl mt-8 text-white/70">
              رحلات غامرة بين الجبال والصحاري — مصممة بعناية لتُشبه المغامرة الحقيقية.
            </motion.p>
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mt-10 mb-12 md:mb-16">
              <Link
                to="/projects"
                className="group inline-flex items-center justify-center gap-2 bg-[#F7F3ED] text-[#17110F] font-body text-sm font-bold px-8 py-4 rounded-full hover:bg-[#f1e8df] transition-colors duration-300"
              >
                الأعمال المختارة <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 border border-white/30 font-body text-sm font-bold px-8 py-4 rounded-full text-[#F7F3ED] hover:border-white transition-colors"
              >
                ابدأ مشروعًا
              </a>
            </motion.div>
          </motion.div>
        </div>
        <div className="scroll-hint" aria-hidden="true">
          <span className="paren">(</span><span>scroll down</span><span className="paren">)</span>
        </div>
        <p className="scene-caption">استكشف مشاهد ملحمية، أماكن برّية، ورحلات صنعتها الطبيعة.</p>
      </div>

      {/* ============ TECH BAR ============ */}
      <TechBar />

      {/* ============ 02 · STATS BAND ============ */}
      <section className="bg-[#0a0807] text-[#F7F3ED] border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-24">
          <p className="font-mono text-[11px] tracking-[0.22em] text-white/50" dir="ltr">EXPEDITIONS — 002</p>
          <h2
            className="font-light tracking-tight leading-[1.25] mt-6 max-w-3xl"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
          >
            من القمم إلى الوديان،
            <br />
            رحلة واحدة متصلة.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mt-12">
            {[
              { v: `+${projects.length}`, label: 'مشروع منشور' },
              { v: '24', label: 'وجهة مختارة' },
              { v: '∞', label: 'تجريب' },
            ].map((s) => (
              <div key={s.label} className="border-t border-white/25 pt-3">
                <div className="font-mono text-2xl md:text-4xl" dir="ltr">{s.v}</div>
                <div className="font-body text-xs text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 03 · FEATURE ============ */}
      <Feature />

      {/* ============ 04 · SELECTED WORK ============ */}
      <section className="bg-[#0a0807] text-[#F7F3ED] border-y border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="flex items-end justify-between gap-6 mb-2">
            <p className="font-mono text-[11px] tracking-[0.22em] text-white/50" dir="ltr">SELECTED WORK — 004</p>
            <p className="font-mono text-[11px] text-white/50" dir="ltr">[{String(work.length).padStart(2, '0')}]</p>
          </div>
          <div className="mt-6">
            {work.length === 0 ? (
              <p className="py-16 text-white/60">تُنشر الأعمال هنا قريبًا.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {work.map((p, i) => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.slug}`}
                    className="group rounded-3xl border border-white/10 bg-white/5 p-4 hover:border-white/30 transition-colors duration-500 overflow-hidden"
                    aria-label={`عرض مشروع ${p.title}`}
                  >
                    <div className="rounded-2xl border border-white/10 overflow-hidden aspect-[4/3] bg-[#131010]">
                      {p.banner_url ? (
                        <img
                          src={p.banner_url}
                          alt={`غلاف ${p.title}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                          <img src="/logo.png" alt="" className="w-14 h-14 opacity-60" />
                        </div>
                      )}
                    </div>
                    <div className="px-1 pt-5 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs tracking-widest text-white/50" dir="ltr">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {p.featured && (
                          <span className="font-body text-xs text-cobalt">★ مميز</span>
                        )}
                      </div>
                      <h3 className="text-xl font-medium tracking-tight mt-2 text-[#F7F3ED] group-hover:text-[#2E5BFF] transition-colors">
                        {p.title}
                      </h3>
                      {p.category && (
                        <p className="font-body text-xs text-white/50 mt-1">{p.category}</p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-mono text-[10px] text-white/50 truncate" dir="auto">
                          {(p.skills || []).slice(0, 3).join(' · ')}
                        </span>
                        <ArrowLeft className="w-4 h-4 shrink-0 text-cobalt group-hover:-translate-x-1.5 transition-transform duration-500" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ 05 · STATEMENT ============ */}
      <section className="bg-[#0a0807] text-[#F7F3ED]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <p className="font-mono text-[11px] tracking-[0.22em] text-white/50" dir="ltr">STATEMENT — 005</p>
          <p className="font-light tracking-tight leading-[1.4] mt-6 max-w-5xl" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.6rem)' }}>
            نبني النظام البصري أولًا — ثم نستخدم الحركة والطباعة والصورة لتعزيزه، لا لاستبداله.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group inline-flex items-center gap-3 mt-10 border-b-2 border-cobalt pb-2 font-body text-lg font-bold text-[#2E5BFF] hover:opacity-80 transition-opacity"
          >
            مهتم بمشروع؟ لنبدأ
            <ArrowUpLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ============ 06 · BRIEF FORM ============ */}
      <section className="bg-[#0a0807] text-[#F7F3ED] border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <p className="font-mono text-[11px] tracking-[0.22em] text-white/50" dir="ltr">START A PROJECT — 006</p>
            <h2 className="font-light tracking-tight leading-[1.3] mt-6" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
              عندك فكرة؟
              <br />
              اكتب موجزها.
            </h2>
            <p className="text-white/60 leading-relaxed max-w-sm mt-6">
              يصل النموذج مباشرة إلى صندوق الوارد في لوحة التحكم.
            </p>
          </div>
          <div className="md:col-span-7">
            <Ver9BriefForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
