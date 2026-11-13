import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { ArrowLeft, ArrowUpLeft, Bot, Code2, Mail, PenTool, Search, Server } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import VoxelSphere from '@/components/VoxelSphere';
import { usePublishedProjects, usePublishedPosts } from '@/lib/queries';
import { matchesQuery } from '@/lib/search';
import { CONTACT_EMAIL, SKILLS, formatDate } from '@/lib/site';

const SERVICES = [
  {
    n: '01',
    icon: Code2,
    title: 'هندسة المنتجات',
    desc: 'من البنية المعمارية حتى الإنتاج، نبني منتجات رقمية موثوقة حول متطلبات العمل الحقيقية.',
    tags: 'React · APIs · SaaS',
  },
  {
    n: '02',
    icon: Bot,
    title: 'أنظمة الذكاء الاصطناعي',
    desc: 'سير عمل مدعوم بالذكاء الاصطناعي، وواجهات ذكية، ووكلاء وأنظمة أتمتة.',
    tags: 'LLM · Agents · RAG',
  },
  {
    n: '03',
    icon: Server,
    title: 'البنية التحتية',
    desc: 'بنية سحابية، وواجهات برمجية، وقواعد بيانات، وأنظمة نشر ومنصات للمطورين.',
    tags: 'Cloud · Docker · DBs',
  },
  {
    n: '04',
    icon: PenTool,
    title: 'تصميم الواجهات',
    desc: 'واجهات دقيقة وعملية مصممة حول الوضوح والتفاعل.',
    tags: 'UI · UX · Systems',
  },
];

function SkillsMarquee() {
  const items = [...SKILLS, ...SKILLS];
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const SPEED = 60; // px per second, left -> right

  useAnimationFrame((_, delta) => {
    const half = (trackRef.current?.scrollWidth || 0) / 2;
    if (!half) return;
    let v = x.get() + (SPEED * delta) / 1000;
    if (v >= half) v -= half; // seamless wrap: copy 2 lands exactly on copy 1
    x.set(v);
  });

  return (
    <div
      className="border-y border-border overflow-hidden py-5"
      dir="rtl"
      aria-label="المهارات"
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center">
        {items.map((s, i) => (
          <span key={i} className="flex items-center gap-10 pe-10 whitespace-nowrap">
            <span className="font-mono text-sm text-muted-foreground">{s}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt shrink-0" aria-hidden="true" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const PAGE_SIZE = 6;

export default function Ver2() {
  const { data: projectsData, isLoading: projectsLoading } = usePublishedProjects();
  const { data: postsData, isLoading: postsLoading } = usePublishedPosts(4);
  // null = still loading (skeleton), [] = loaded but empty. Warmed at boot,
  // so navigation usually finds the cache ready — no spinner.
  const projects = projectsData ?? (projectsLoading ? null : []);
  const posts = postsData ?? (postsLoading ? null : []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Deep links from other pages (e.g. /#services) land on the section,
  // not the top — the layout's smooth-scroller owns window scroll.
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
    }
  }, []);

  useEffect(() => { setLimit(PAGE_SIZE); }, [query, category]);

  const categories = useMemo(() => {
    if (!projects) return [];
    return [...new Set(projects.map(p => p.category).filter(Boolean))];
  }, [projects]);

  const haystacks = useMemo(() => {
    const map = {};
    (projects || []).forEach(p => {
      map[p.id] = [p.title, p.short_description, p.category, (p.skills || []).join(' ')].join(' ');
    });
    return map;
  }, [projects]);

  const visible = useMemo(() => {
    if (!projects) return [];
    return projects.filter(p =>
      (!category || p.category === category) && matchesQuery(query, haystacks[p.id] || '')
    );
  }, [projects, category, query, haystacks]);

  const paged = visible.slice(0, limit);

  const chipCls = active =>
    `border px-4 py-2 font-body text-sm transition-colors ${active
      ? 'bg-cobalt text-white border-cobalt'
      : 'border-border text-muted-foreground hover:border-cobalt hover:text-foreground'}`;

  // Scroll-triggered entrance used across landing sections.
  const Reveal = ({ children, delay = 0, className }) => (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );

  return (
    <div id="top" className="min-h-screen bg-background text-foreground font-body antialiased">
      <SiteHeader />

      {/* ============ HERO ============ */}
      <section className="ver2-grid min-h-screen pt-[78px] flex flex-col justify-between">
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
          className="max-w-[1600px] w-full mx-auto px-6 md:px-10 pt-16 md:pt-24"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-2 h-2 bg-cobalt rounded-full" aria-hidden="true" />
            <span className="font-body text-xs text-muted-foreground">
              استوديو برمجيات مستقل
            </span>
          </motion.div>
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
            className="ver2-hero font-light max-w-[1400px]"
          >
            نبني
            <br />
            أنظمة <span className="text-cobalt">رقمية.</span>
          </motion.h1>
        </motion.div>

        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 pb-10 md:pb-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-7"
            >              <p className="text-lg md:text-xl font-light leading-relaxed max-w-xl">
                مختبر البرمجيات يصمم ويهندس المنتجات الرقمية والمنصات والأنظمة للأفكار الطموحة.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 bg-cobalt text-white font-body text-sm font-bold px-7 py-3.5 hover:opacity-90 hover:-translate-y-0.5 transition-all"
                >
                  تصفّح المشاريع <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </Link>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 border border-border font-body text-sm font-bold px-7 py-3.5 hover:border-cobalt hover:text-cobalt hover:-translate-y-0.5 transition-all"
                >
                  راسلني <Mail className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-5"
            >
              <div className="mx-auto w-full max-w-[380px]">
                <VoxelSphere speed={0.005} label="مجسّم بكسل ثلاثي الأبعاد — اسحب لتدويره" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ SKILLS MARQUEE ============ */}
      <SkillsMarquee />

      {/* ============ PROJECTS ============ */}
      <section id="projects" className="border-t border-border scroll-mt-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="px-6 md:px-10 py-16 md:py-24">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <span className="font-body text-xs text-muted-foreground">
                أعمال مختارة / 001
              </span>
              <h2 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.3] mt-4">المشاريع</h2>
            </div>
            <p className="max-w-md text-sm md:text-base leading-relaxed text-muted-foreground">
              مختارات من المنتجات البرمجية والواجهات والأنظمة التقنية التي طورها المختبر.
            </p>
          </Reveal>
            <Link
              to="/projects"
              className="hidden md:inline-flex items-center gap-2 font-body text-sm font-bold text-cobalt hover:opacity-70 transition-opacity mt-6"
            >
              كل المشاريع <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Link>

            <div className="mt-14 flex flex-col md:flex-row gap-4">
              <div className="relative max-w-xl flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="ابحث في المشاريع..."
                  aria-label="البحث في المشاريع"
                  className="w-full h-12 bg-transparent border border-border pr-11 pl-4 outline-none focus:border-cobalt transition-colors font-body text-sm placeholder:text-muted-foreground/60"
                />
              </div>
              <button
                type="button"
                onClick={() => { setQuery(''); setCategory(null); }}
                className="hidden md:block px-5 border border-border font-body text-sm text-muted-foreground hover:border-cobalt hover:text-foreground transition-colors"
              >
                مسح
              </button>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5" role="group" aria-label="تصفية حسب التصنيف">
                <button type="button" onClick={() => setCategory(null)} aria-pressed={category === null} className={chipCls(category === null)}>
                  الكل
                </button>
                {categories.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(category === c ? null : c)}
                    aria-pressed={category === c}
                    className={chipCls(category === c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 md:px-10 pb-4">
            {projects === null ? (
              <div className="grid md:grid-cols-3 gap-6" aria-label="جارٍ التحميل">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border border-border p-4">
                    <div className="aspect-[4/3] bg-card animate-pulse border border-border" />
                    <div className="h-6 bg-card animate-pulse mt-5" />
                    <div className="h-4 w-2/3 bg-card animate-pulse mt-2" />
                  </div>
                ))}
              </div>
            ) : paged.length === 0 ? (
              <div className="py-24">
                <div className="font-mono text-xs text-muted-foreground mb-3" dir="ltr">404 / NO MATCH</div>
                <h3 className="text-3xl font-light">لا توجد مشاريع مطابقة.</h3>
                <p className="text-sm text-muted-foreground mt-3">جرّب بحثًا أو تصنيفًا آخر.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {paged.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 0.07} className="h-full">
                  <Link
                    to={`/projects/${p.slug}`}
                    className="group block h-full border border-border bg-card p-4 hover:border-cobalt transition-colors"
                    aria-label={`عرض مشروع ${p.title}`}
                  >
                    <div className="border border-border overflow-hidden aspect-[4/3] bg-secondary">
                      {p.banner_url ? (
                        <img
                          src={p.banner_url}
                          alt={`غلاف ${p.title}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                          <img src="/logo.png" alt="" className="w-14 h-14 opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="px-1 pt-5 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs tracking-widest text-muted-foreground">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {p.featured && (
                          <span className="font-body text-xs text-cobalt">★ مميز</span>
                        )}
                      </div>
                      <h3 className="text-xl font-medium tracking-tight mt-2 group-hover:text-cobalt transition-colors">
                        {p.title}
                      </h3>
                      {p.category && (
                        <p className="font-body text-xs text-muted-foreground mt-1">
                          {p.category}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-mono text-[10px] text-muted-foreground truncate">
                          {(p.skills || []).slice(0, 3).join(' · ')}
                        </span>
                        <ArrowLeft className="w-4 h-4 shrink-0 text-cobalt group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                  </Reveal>
                ))}
              </div>
            )}

            {visible.length > PAGE_SIZE && (
              <div className="flex justify-center py-14">
                {limit < visible.length ? (
                  <button
                    type="button"
                    onClick={() => setLimit(l => l + PAGE_SIZE)}
                    className="border border-border px-10 py-4 font-body text-sm text-foreground hover:border-cobalt hover:text-cobalt transition-colors"
                  >
                    أظهر المزيد
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setLimit(PAGE_SIZE)}
                    className="border border-border px-10 py-4 font-body text-sm text-muted-foreground hover:border-cobalt hover:text-cobalt transition-colors"
                  >
                    عرض أقل
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="services" className="border-b border-border scroll-mt-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <Reveal className="md:col-span-5 md:sticky md:top-28 self-start">
              <span className="font-body text-xs text-muted-foreground">
                ماذا نفعل / 002
              </span>
              <h2 className="text-5xl md:text-7xl font-light tracking-tight mt-4 leading-[1.4]">
                نبني.
                <br />
                نُطلق.
                <br />
                <span className="text-cobalt">نوسّع.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-sm mt-6">
                أربع قدرات أساسية تغطي دورة المنتج كاملة — من الفكرة حتى النمو.
              </p>
            </Reveal>
            <div className="md:col-span-7">
              <div className="border-t border-border">
                {SERVICES.map(s => {
                  const Icon = s.icon;
                  return (
                    <Reveal key={s.n} className="group relative overflow-hidden border-b border-border">
                      <div
                        className="absolute inset-0 bg-charcoal scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)]"
                        aria-hidden="true"
                      />
                      <div className="relative z-10 py-8 grid grid-cols-12 gap-4 items-center">
                        <span className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground group-hover:text-white/40 transition-colors" dir="ltr">{s.n}</span>
                        <span className="hidden md:flex col-span-1" aria-hidden="true">
                          <span className="w-12 h-12 border border-border flex items-center justify-center text-muted-foreground group-hover:border-white/30 group-hover:text-white group-hover:bg-white/5 transition-colors">
                            <Icon className="w-5 h-5" />
                          </span>
                        </span>
                        <div className="col-span-10 md:col-span-7">
                          <h3 className="text-2xl md:text-3xl font-light tracking-tight group-hover:text-white transition-colors">{s.title}</h3>
                          <p className="text-sm text-muted-foreground group-hover:text-white/60 transition-colors mt-2 max-w-xl leading-relaxed">{s.desc}</p>
                        </div>
                        <span className="hidden lg:block col-span-2 font-mono text-[10px] tracking-widest text-muted-foreground group-hover:text-white/40 transition-colors" dir="ltr">{s.tags}</span>
                        <span className="col-span-12 md:col-span-1 flex md:justify-end" aria-hidden="true">
                          <ArrowLeft className="w-5 h-5 text-cobalt opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </span>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="bg-charcoal text-white scroll-mt-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-32">
          <Reveal className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-3">
              <span className="font-body text-xs text-white/40">
                من نحن / 003
              </span>
            </div>
            <div className="md:col-span-8 md:col-start-5">
                <p className="text-3xl md:text-5xl font-light leading-[1.8] tracking-tight">
                  مختبر البرمجيات استوديو هندسي مستقل يحوّل الأفكار المعقدة إلى{' '}
                  <span className="text-[#5868F2]">برمجيات قابلة للاستخدام.</span>
                </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ BLOG ============ */}
      <section id="blog" className="border-t border-border scroll-mt-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <Reveal>
            <div>
              <span className="font-body text-xs text-muted-foreground">
                المدونة / 004
              </span>
              <h2 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.3] mt-4">آخر ما أكتبه</h2>
            </div>
            </Reveal>
            <Link
              to="/blog"
              className="hidden md:inline-flex items-center gap-2 font-body text-sm font-bold text-cobalt hover:opacity-70 transition-opacity"
            >
              كل المقالات <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-12 border-t border-border">
            {posts === null ? (
              <div className="py-10 space-y-4" aria-label="جارٍ التحميل">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-card animate-pulse border-b border-border" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="py-16 text-muted-foreground">لا توجد مقالات منشورة بعد.</p>
            ) : (
              posts.map((post, i) => (
                <Reveal key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group relative block border-b border-border overflow-hidden"
                  aria-label={`قراءة مقال ${post.title}`}
                >
                  <div className="relative z-10 py-6 md:py-7 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2 md:col-span-1">
                      <span className="font-mono text-xs tracking-widest text-muted-foreground">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="col-span-10 md:col-span-7">
                      <h3 className="text-xl md:text-2xl font-light tracking-tight group-hover:text-cobalt transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{post.excerpt}</p>
                      )}
                    </div>
                    <div className="hidden md:block md:col-span-3">
                      <span className="font-body text-xs text-muted-foreground">
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                    </div>
                    <div className="hidden md:flex md:col-span-1 md:justify-end">
                      <ArrowLeft className="w-5 h-5 text-cobalt group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="bg-cobalt text-white scroll-mt-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-32">
          <Reveal className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8">
              <span className="font-body text-xs text-white/60">
                ابدأ مشروعًا / 005
              </span>
              <h2 className="ver2-hero mt-5">لنبنِ شيئًا.</h2>
              <p className="text-white/70 leading-relaxed max-w-xl mt-6">
                متاح لمشاريع تطوير الويب، بناء وكلاء ذكاء اصطناعي، وهندسة الأنظمة.
              </p>
            </div>
            <div className="md:col-span-4 md:flex md:items-end">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex items-center justify-between w-full border-t border-white/30 py-5"
              >
                <span className="font-mono text-xs tracking-widest" dir="ltr">{CONTACT_EMAIL}</span>
                <ArrowUpLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <SiteFooter />
    </div>
  );
}
