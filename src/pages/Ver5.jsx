import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpLeft, Send, Wrench, TrendingUp, Megaphone, User, Building2, ClipboardList, Code2, Palette, Layers, Rocket, Package, CircleCheck, ImageIcon, ImagePlay, Lightbulb, Plus, Mic, Paperclip } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import PixelField from '@/components/PixelField';
import LogoPixels from '@/components/LogoPixels';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Marquee } from '@/components/ui/marquee';
import { CONTACT_EMAIL, SKILLS } from '@/lib/site';
import { contactApi } from '@/api/contact';
import { usePublishedPosts, usePublishedProjects } from '@/lib/queries';

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function TechBar() {
  const items = [...SKILLS, ...SKILLS];
  return (
    <div className="overflow-hidden border-y-4 border-[#171717] bg-[#171717] py-4" dir="ltr" aria-label="التقنيات">
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

function PixelBriefForm() {
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
        contactMethod: 'ver5 brief',
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
    'w-full bg-[#F0F0EE] dark:bg-[#242424] border-2 border-[#171717] dark:border-white/25 px-4 py-3 font-body text-sm text-[#171717] dark:text-[#F5F5F5] outline-none focus:bg-white dark:focus:bg-[#1A1A1A] transition-colors placeholder:text-[#777] dark:placeholder:text-[#A0A0A0]/60';

  if (sent) {
    return (
      <div className="border-2 border-[#171717] dark:border-white/25 bg-[#171717] dark:bg-[#242424] text-[#F0F0EE] p-8 max-w-2xl" role="status">
        <p className="font-mono text-xs tracking-[0.2em] mb-3" dir="ltr">TRANSMITTED ✓</p>
        <h3 className="text-2xl font-light">وصل الموجز بنجاح.</h3>
        <p className="text-sm mt-2 opacity-70">سأرد عليك قريبًا — شكرًا {form.name.trim().split(' ')[0]}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5" noValidate>
      {error && (
        <div className="border-2 border-[#b3352b] text-[#b3352b] px-4 py-3 text-sm font-bold" role="alert">
          {error}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.18em] text-[#171717] dark:text-[#F5F5F5] block mb-2" dir="ltr">NAME *</span>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="اسمك" maxLength={120} required className={inputCls} />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.18em] text-[#171717] dark:text-[#F5F5F5] block mb-2" dir="ltr">EMAIL *</span>
          <input type="email" dir="ltr" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" maxLength={254} required className={`${inputCls} text-left`} />
        </label>
      </div>
      <label className="block">
        <span className="font-mono text-[11px] tracking-[0.18em] text-[#171717] dark:text-[#F5F5F5] block mb-2" dir="ltr">PROJECT BRIEF *</span>
        <textarea rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="فكرة المشروع، المدة، الميزانية التقريبية..." maxLength={5000} required className={`${inputCls} resize-y`} />
      </label>
      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center gap-2 bg-cobalt text-white font-body text-sm font-bold px-8 py-4 border-2 border-[#171717] hover:opacity-85 transition-opacity duration-500 disabled:opacity-50"
      >
        <Send className="w-4 h-4" aria-hidden="true" /> {sending ? 'جارٍ الإرسال...' : 'إرسال الموجز'}
      </button>
    </form>
  );
}

const TagChip = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-black/10 border border-white/20 shrink-0">
    <Icon className="size-4 text-white" />
    <span className="text-sm font-medium text-white whitespace-nowrap">
      {label}
    </span>
  </div>
);

const row1Tags = [
  { icon: Wrench, label: "Engineers" },
  { icon: TrendingUp, label: "Sales" },
  { icon: Megaphone, label: "Marketing" },
  { icon: User, label: "HR" },
  { icon: Building2, label: "Enterprises" },
];

const row2Tags = [
  { icon: ClipboardList, label: "Project Managers" },
  { icon: Code2, label: "Developers" },
  { icon: Palette, label: "Designers" },
  { icon: Layers, label: "Product Team" },
];

const row3Tags = [
  { icon: Rocket, label: "Founders" },
  { icon: Package, label: "Product Team" },
  { icon: Building2, label: "Enterprises" },
  { icon: Wrench, label: "Engineers" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

function Feature() {
  return (
    <section>
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
                className="text-sm font-normal text-foreground px-3 py-1 rounded-full h-auto"
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
          <div className="bg-muted rounded-3xl p-2 flex flex-col md:flex-row gap-0 overflow-hidden">
            {/* Image with tag pill overlay */}
            <motion.div
              className="relative rounded-2xl overflow-hidden md:w-1/2 h-72 md:h-auto min-h-[300px] shrink-0"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeLeft}
            >
              <img
                src="https://cdn.21st.dev/assets/localized/468033ba9511428e13bf900759fb694f10d1ed1bf588879f76dc9a183273ce5a.jpg"
                alt="AI workflow automation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-foreground/20" />
              {/* Marquee tag rows */}
              <div className="absolute inset-0 flex flex-col justify-center gap-4 py-10">
                <Marquee className="[--duration:20s] [--gap:0.75rem] p-0">
                  {row1Tags.map((tag, i) => (
                    <TagChip key={i} {...tag} />
                  ))}
                </Marquee>
                <Marquee
                  reverse
                  className="[--duration:16s] [--gap:0.75rem] p-0"
                >
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

            {/* Content */}
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
                    title: "Smart Automation",
                    body: "Execute tasks automatically with minimal manual input, reducing repetitive work and freeing up time for high-impact activities.",
                  },
                  {
                    title: "Process Optimization",
                    body: "Improve speed and consistency across workflows, streamlining operations for more reliable and efficient outcomes.",
                  },
                ].map(({ title, body }, i) => (
                  <motion.div
                    key={i}
                    variants={fadeRight}
                    className="flex gap-3 items-start"
                  >
                    <CircleCheck className="size-5 text-foreground shrink-0 mt-0.5" />
                    <p className="text-base text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {title}:{" "}
                      </span>
                      {body}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Row 2: Content left + Image right (AI chat UI) */}
          <div className="bg-muted rounded-3xl p-2 flex flex-col md:flex-row gap-0 overflow-hidden">
            {/* Content */}
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
                    title: "AI-Powered Assistance",
                    body: "Generate responses, ideas, and content instantly with intelligent, context-aware AI support, helping you work faster and make more informed decisions.",
                  },
                  {
                    title: "Interactive Experience",
                    body: "Engage with a dynamic and intuitive interface that makes creating, refining, and managing outputs effortless, giving you control over your workflow.",
                  },
                ].map(({ title, body }, i) => (
                  <motion.div
                    key={i}
                    variants={fadeLeft}
                    className="flex gap-3 items-start"
                  >
                    <CircleCheck className="size-5 text-foreground shrink-0 mt-0.5" />
                    <p className="text-base text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {title}:{" "}
                      </span>
                      {body}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Image with AI chat UI overlay */}
            <motion.div
              className="relative rounded-2xl overflow-hidden md:w-1/2 h-72 md:h-auto min-h-[300px] shrink-0"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeRight}
            >
              <img
                src="https://cdn.21st.dev/assets/localized/9c63a565817f73c372e52a92c50bfa44a631f64ad8fde1e9fd398f5ff073dd5e.webp"
                alt="AI chat interface"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-foreground/20" />
              {/* AI Chat UI mockup card */}
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-gray-950/20 px-2 py-2.5 sm:p-4 rounded-3xl flex flex-col gap-3">
                  {/* Action buttons */}
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
                  {/* Input field */}
                  <div className="flex items-center gap-0 sm:gap-2 rounded-full border border-white/20 bg-white/10 px-1.5 sm:px-3 py-1.5 sm:py-2 shadow-sm">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full h-8 w-8 hover:bg-muted/10 cursor-pointer"
                    >
                      <Plus className="h-4 w-4 text-white" />
                    </Button>
                    <Input
                      placeholder="What would you like to design today?"
                      className="border-none bg-transparent! dark:bg-transparent! focus-visible:ring-0 focus-visible:ring-offset-0 text-white p-0 placeholder:text-white"
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-8 w-8 hover:bg-muted/10 cursor-pointer"
                      >
                        <Mic className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-8 w-8 hover:bg-muted/10 cursor-pointer"
                      >
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

export default function Ver5() {
  const { data: projectsData } = usePublishedProjects();
  const { data: postsData } = usePublishedPosts();
  const projects = projectsData || [];
  const work = projects;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div id="top" className="min-h-screen font-body antialiased v5-round">
      <SiteHeader />

      {/* ============ 01 · HERO on light canvas + pixel landscape ============ */}
      <section className="relative overflow-hidden bg-[#F0F0EE] dark:bg-[#161616] text-[#171717] dark:text-[#F5F5F5]">
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 pt-[150px] md:pt-[170px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            className="lg:col-span-7"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={item} className="font-mono text-[11px] tracking-[0.22em] text-[#555] dark:text-[#A0A0A0] dark:text-[#A0A0A0]" dir="ltr">
              EXPERIMENTAL — 001
            </motion.p>
            <motion.h1
              variants={item}
              className="font-light tracking-tight leading-[1.35] mt-6 max-w-6xl"
              style={{ fontSize: 'clamp(2.4rem, 11vw, 8.5rem)' }}
            >
              نصمّم خارج الشبكة.
            </motion.h1>
            <motion.p variants={item} className="text-base md:text-lg leading-relaxed max-w-xl mt-8 text-[#333] dark:text-[#A0A0A0] dark:text-[#A0A0A0]">
              تجارب رقمية تُبنى بالهندسة والحروف المطبعية والأنظمة البصرية غير التقليدية.
            </motion.p>
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mt-10 mb-12 md:mb-16">
              <Link
                to="/projects"
                className="group inline-flex items-center justify-center gap-2 bg-[#171717] dark:bg-[#F5F5F5] text-[#F0F0EE] dark:text-[#171717] font-body text-sm font-bold px-8 py-4 hover:opacity-85 transition-opacity duration-500"
              >
                الأعمال المختارة <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 border border-[#171717]/30 dark:border-white/25 font-body text-sm font-bold px-8 py-4 hover:border-[#171717] dark:hover:border-white transition-colors"
              >
                ابدأ مشروعًا
              </a>
            </motion.div>
          </motion.div>
          <div className="lg:col-span-5 flex lg:justify-end overflow-hidden pb-4">
            <span className="dark:hidden"><LogoPixels cols={30} cell={13} gap={3} ink={[23, 23, 23]} /></span>
            <span className="hidden dark:block"><LogoPixels cols={30} cell={13} gap={3} ink={[240, 240, 240]} /></span>
          </div>
        </div>
        <PixelField variant="landscape" fg="#171717" cell={14} height={240} seed={11} className="relative z-0 block w-full dark:hidden" />
        <PixelField variant="landscape" fg="#F0F0F0" cell={14} height={240} seed={11} className="relative z-0 hidden w-full dark:block" />
      </section>

      {/* ============ TECH BAR ============ */}
      <TechBar />

      {/* ============ 02 · ELECTRIC BLUE BAND ============ */}
      <section className="bg-cobalt text-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <p className="font-mono text-[11px] tracking-[0.22em] text-white/60" dir="ltr">PIXEL SYSTEM — 002</p>
          <h2
            className="font-light tracking-tight leading-[1.25] mt-6"
            style={{ fontSize: 'clamp(2.2rem, 8vw, 7rem)' }}
          >
            بكسل فوق بكسل،
            <br />
            حتى تظهر الصورة.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mt-12">
            {[
              { v: `+${projects.length}`, label: 'مشروع منشور' },
              { v: `+${(postsData || []).length}`, label: 'مقال تقني' },
              { v: '∞', label: 'تجريب' },
            ].map((s) => (
              <div key={s.label} className="border-t border-white/25 pt-3">
                <div className="font-mono text-2xl md:text-4xl" dir="ltr">{s.v}</div>
                <div className="font-body text-xs text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 03 · PIXEL DISSOLVE into surface ============ */}
      <section className="bg-[#DCDCDC] dark:bg-[#1E1E1E] text-[#171717] dark:text-[#F5F5F5]">
        <PixelField variant="dissolve" fg="#2E5BFF" cell={12} height={130} seed={29} className="block w-full" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-10 pb-20 md:pb-28">
          <div className="flex items-end justify-between gap-6 mb-2">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#555] dark:text-[#A0A0A0]" dir="ltr">SELECTED WORK — 003</p>
            <p className="font-mono text-[11px] text-[#555] dark:text-[#A0A0A0]" dir="ltr">[{String(work.length).padStart(2, '0')}]</p>
          </div>
          <div className="mt-6">
            {work.length === 0 ? (
              <p className="py-16 text-[#333] dark:text-[#A0A0A0]">تُنشر الأعمال هنا قريبًا.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {work.map((p, i) => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.slug}`}
                    className="group v5-card border border-border bg-[#F0F0EE] dark:bg-[#242424] p-4 hover:border-cobalt transition-colors duration-500"
                    aria-label={`عرض مشروع ${p.title}`}
                  >
                    <div className="v5-frame border border-border overflow-hidden aspect-[4/3] bg-white dark:bg-[#1A1A1A]">
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
                        <span className="font-mono text-xs tracking-widest text-[#555] dark:text-[#A0A0A0]" dir="ltr">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {p.featured && (
                          <span className="font-body text-xs text-cobalt">★ مميز</span>
                        )}
                      </div>
                      <h3 className="text-xl font-medium tracking-tight mt-2 text-[#171717] dark:text-[#F5F5F5] group-hover:text-cobalt transition-colors">
                        {p.title}
                      </h3>
                      {p.category && (
                        <p className="font-body text-xs text-[#555] dark:text-[#A0A0A0] mt-1">{p.category}</p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-mono text-[10px] text-[#555] dark:text-[#A0A0A0] truncate" dir="auto">
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

      {/* ============ 04 · CAPABILITIES (Feature Component) ============ */}
      <Feature />

      {/* ============ 06 · STATEMENT ============ */}
      <section className="bg-background text-foreground">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground" dir="ltr">STATEMENT — 006</p>
          <p className="font-light tracking-tight leading-[1.4] mt-6 max-w-5xl" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.6rem)' }}>
            نبني النظام البصري أولًا — ثم نستخدم البكسل والحركة والطباعة لتعزيزه، لا لاستبداله.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group inline-flex items-center gap-3 mt-10 border-b-2 border-cobalt pb-2 font-body text-lg font-bold text-cobalt"
          >
            مهتم بمشروع؟ لنبدأ
            <ArrowUpLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ============ 07 · PIXEL BRIEF FORM ============ */}
      <section className="bg-[#F0F0EE] dark:bg-[#161616] text-[#171717] dark:text-[#F5F5F5] border-t-4 border-[#171717] dark:border-white/20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#555] dark:text-[#A0A0A0]" dir="ltr">START A PROJECT — 007</p>
            <h2 className="font-light tracking-tight leading-[1.3] mt-6" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
              عندك فكرة؟
              <br />
              اكتب موجزها.
            </h2>
            <p className="text-[#333] dark:text-[#A0A0A0] leading-relaxed max-w-sm mt-6">
              املأ النموذج بزوايا حادة — يصل مباشرة إلى صندوق الوارد في لوحة التحكم.
            </p>
            <PixelField variant="landscape" fg="#171717" cell={18} height={150} seed={99} className="block w-full mt-10 opacity-90 dark:hidden" />
            <PixelField variant="landscape" fg="#F0F0F0" cell={18} height={150} seed={99} className="hidden w-full mt-10 opacity-90 dark:block" />
          </div>
          <div className="md:col-span-7">
            <PixelBriefForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
