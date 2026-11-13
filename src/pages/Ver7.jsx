import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpLeft, Menu } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import TiltCard from '@/components/TiltCard';
import { CONTACT_EMAIL } from '@/lib/site';
import { usePublishedProjects } from '@/lib/queries';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    n: '01',
    title: 'هندسة المنتجات',
    desc: 'نساعد الآخرين على اكتشاف غرض علامتهم وتميزها — وخطة اللعب التي تكسب ولاء العملاء.',
    tags: ['البحث والتحليل', 'استراتيجية المنتج', 'النماذج الأولية', 'ورش العمل'],
  },
  {
    n: '02',
    title: 'التصميم الرقمي',
    desc: 'تصميم تجارب رقمية جذابة تجمع استراتيجية العلامة والإبداع مع رؤى UX لتقديم وظائف وسهولة استخدام.',
    tags: ['الهوية', 'واجهات UI', 'تجربة UX', 'تصميم الويب', 'تصميم المنتج'],
  },
  {
    n: '03',
    title: 'التطوير',
    desc: 'بناء منتجات رقمية تجمع التصميم والتقنية واستراتيجية الأعمال لتقديم تجارب سلسة.',
    tags: ['تطوير الواجهات', 'GSAP', 'الحركة', 'Three.js', 'قواعد البيانات'],
  },
];

const STACK_TOP = ['React', 'NEXT.js', 'TS'];
const STACK_GRID = ['GSAP', 'Motion', 'Tailwind', 'Vercel', 'Vite', 'Framer', 'Neon'];

// Pinned horizontal rail — capability slides, each with its own animated orbital art.
const PROCESS = [
  {
    n: '01',
    en: 'DISCOVER',
    ar: 'الاكتشاف',
    desc: 'نبدأ بجلسات قصيرة لفهم الهدف، الجمهور، والقيود — ثم نحوّلها إلى اتجاه واضح.',
    accent: '#3B82F6',
  },
  {
    n: '02',
    en: 'DESIGN',
    ar: 'التصميم',
    desc: 'نظام بصري كامل: خطوط، ألوان، حركة، ومكوّنات — قبل كتابة سطر واحد.',
    accent: '#8B5CF6',
  },
  {
    n: '03',
    en: 'BUILD',
    ar: 'التطوير',
    desc: 'واجهات سريعة وأنظمة ثلاثية الأبعاد، مبنية على أساس نظيف قابل للتوسع.',
    accent: '#10B981',
  },
  {
    n: '04',
    en: 'SHIP',
    ar: 'الإطلاق',
    desc: 'نشر آلي، مراقبة أداء، وتحسين مستمر بعد الإطلاق — لا نختفي بعد التسليم.',
    accent: '#F59E0B',
  },
];

function BrandMark({ label }) {
  const marks = {
    React: (
      <svg viewBox="0 0 48 48" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <circle cx="24" cy="24" r="3.5" fill="currentColor" stroke="none" />
        <ellipse cx="24" cy="24" rx="20" ry="8" />
        <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)" />
        <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(120 24 24)" />
      </svg>
    ),
    Vercel: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden="true">
        <path d="M12 3 L22 20 H2 Z" />
      </svg>
    ),
  };
  return marks[label] || <span className="font-mono font-bold text-2xl tracking-tight" dir="ltr">{label}</span>;
}

export default function Ver7() {
  const { data: projectsData } = usePublishedProjects();
  const projects = projectsData || [];
  const [heroA, heroB] = [projects[0], projects[1]];
  const rootRef = useRef(null);
  const showcaseRef = useRef(null);
  const [reduced, setReduced] = useState(false);
  const [motionSuppressed, setMotionSuppressed] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    // ?motion=1 force-enables motion and remembers it; ?motion=0 clears it.
    // Needed because Windows animations can be off system-wide (MinAnimate=0),
    // which makes the browser report prefers-reduced-motion: reduce.
    const KEY = 'v7-motion';
    const flag = new URLSearchParams(window.location.search).get('motion');
    if (flag === '1') { try { localStorage.setItem(KEY, '1'); } catch { /* private mode */ } }
    if (flag === '0') { try { localStorage.removeItem(KEY); } catch { /* ignore */ } }
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch { /* ignore */ }
    const forced = flag === '1' || saved === '1';
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mq.matches && !forced;
    setReduced(isReduced);
    setMotionSuppressed(isReduced);
    if (mq.matches && !forced) {
      console.info('[ver7] prefers-reduced-motion: reduce is ON, so animations are disabled. Open /ver7?motion=1 once to preview them (it sticks).');
    }
  }, []);

  const enableMotion = () => {
    try { localStorage.setItem('v7-motion', '1'); } catch { /* private mode */ }
    setReduced(false);
    setMotionSuppressed(false);
  };

  useLayoutEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      // — Gentle dock float (extra motion, loops forever).
      gsap.to('.v7-dock', { y: -6, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });
    }, rootRef);
    // Safety net: force everything visible after 5s no matter what.
    const safety = setTimeout(() => {
      gsap.set(
        '.v7-title-word,.v7-hero-card,.v7-dock,.v7-work,.v7-service,.v7-service-inner,.v7-svc-shot,.v7-stack-cell,.v7-link-card,.v7-rise,.v7-split > span > span,.v7-sc-card,.v7-sc-img',
        { clearProps: 'all' }
      );
    }, 5000);
    return () => {
      clearTimeout(safety);
      ctx.revert();
    };
  }, [reduced]);

  useLayoutEffect(() => {
    if (reduced) return undefined;
    const offMagnetic = [];
    const ctx = gsap.context(() => {
      // — Scroll progress hairline.
      gsap.to('.v7-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      });
      // — Split title drifts apart + giant words parallax.
      gsap.utils.toArray('.v7-title-word').forEach((w, i) => {
        gsap.to(w, {
          xPercent: i === 0 ? -6 : 6,
          ease: 'none',
          scrollTrigger: { trigger: '.v7-hero', start: 'top top', end: 'bottom top', scrub: 1 },
        });
      });
      // .v7-rise owns the reveal; letting .v7-giant parallax the same element
      // gave it two conflicting triggers (y + autoAlpha vs yPercent).
      gsap.utils.toArray('.v7-giant:not(.v7-rise)').forEach((el) => {
        gsap.fromTo(el, { yPercent: 12 }, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });
      // — Hero image inner parallax.
      gsap.utils.toArray('.v7-hero-img').forEach((img) => {
        gsap.fromTo(img, { yPercent: -8 }, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: '.v7-cards', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });
      // — Headers rise in.
      gsap.utils.toArray('.v7-rise').forEach((el) => {
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
      // — Scrub-linked marquee band (scroll drives the strip sideways).
      const strip = rootRef.current.querySelector('.v7-strip');
      if (strip) {
        gsap.to(strip, {
          xPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: strip.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
      // — Word-split reveal on the services statement (SplitText-free, RTL safe).
      rootRef.current.querySelectorAll('.v7-split').forEach((el) => {
        if (el.dataset.split === '1') return;
        const words = (el.textContent || '').trim().split(/\s+/).filter(Boolean);
        if (!words.length) return;
        el.dataset.split = '1';
        el.dataset.origText = el.textContent || '';
        el.textContent = '';
        words.forEach((w) => {
          const mask = document.createElement('span');
          mask.className = 'inline-block overflow-hidden align-bottom';
          const inner = document.createElement('span');
          inner.className = 'inline-block will-change-transform';
          inner.textContent = w;
          mask.appendChild(inner);
          el.appendChild(mask);
          el.appendChild(document.createTextNode(' '));
        });
      });
      gsap.fromTo(
        '.v7-split > span > span',
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.045,
          scrollTrigger: { trigger: '.v7-split', start: 'top 88%', toggleActions: 'play none none none' },
        },
      );
      // — Magnetic buttons (fine pointers only, GPU-cheap quickTo).
      if (window.matchMedia('(pointer: fine)').matches) {
        rootRef.current.querySelectorAll('.v7-magnetic').forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
          const onMove = (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
          };
          const onLeave = () => { xTo(0); yTo(0); };
          el.addEventListener('pointermove', onMove);
          el.addEventListener('pointerleave', onLeave);
          offMagnetic.push(() => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
            el.style.transform = '';
          });
        });
      }
      // — Pinned horizontal showcase (scroll scrubs the track sideways).
      const scSec = showcaseRef.current;
      const scTrack = scSec && scSec.querySelector('.v7-sc-track');
      if (scTrack) {
        const distance = () => Math.max(0, scTrack.scrollWidth - window.innerWidth);
        // Counter + bar ride the SAME trigger as the pinned track, so they can never
        // drift out of sync with the scrub (separate triggers lagged behind).
        const barEl = scSec.querySelector('.v7-sc-bar');
        const countEl = scSec.querySelector('.v7-sc-count');
        const total = PROCESS.length;
        const setBarX = barEl ? gsap.quickTo(barEl, 'scaleX', { duration: 0.4, ease: 'power2.out' }) : null;
        const paintHud = (self) => {
          if (setBarX) setBarX(self.progress);
          if (countEl) {
            const n = Math.min(total, Math.max(1, Math.round(1 + self.progress * (total - 1))));
            countEl.textContent = `${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
          }
        };
        const scTween = gsap.to(scTrack, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: scSec,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: paintHud,
          },
        });
        paintHud(scTween.scrollTrigger);
        // inner art drifts on the horizontal scroll (GSAP containerAnimation)
        gsap.utils.toArray('.v7-step-art').forEach((art, i) => {
          gsap.fromTo(art, { xPercent: i % 2 ? 8 : -8 }, {
            xPercent: i % 2 ? -8 : 8,
            ease: 'none',
            scrollTrigger: {
              trigger: art.closest('.v7-sc-card'),
              containerAnimation: scTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          });
        });
        // Continuous orbital motion (ambient, loops forever)
        gsap.utils.toArray('.v7-orb-spin').forEach((g, i) => {
          gsap.to(g, { rotation: 360, duration: 16 + i * 3, repeat: -1, ease: 'none' });
        });
        gsap.utils.toArray('.v7-orb-spin2').forEach((g, i) => {
          gsap.to(g, { rotation: -360, duration: 24 + i * 3, repeat: -1, ease: 'none' });
        });
      }
      // — Services: Apple-style masked slide-up, row by row.
      gsap.utils.toArray('.v7-service').forEach((row) => {
        const inner = row.querySelector('.v7-service-inner');
        if (!inner) return;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' },
        });
        tl.from(inner, { yPercent: 100, duration: 1.15, ease: 'expo.out' })
          .from(
            row.querySelectorAll('.v7-svc-shot'),
            { yPercent: 60, opacity: 0, duration: 0.9, ease: 'power3.out' },
            '-=0.75',
          );
      });
      // — Cards + rows batch in.
      ScrollTrigger.batch('.v7-stack-cell, .v7-link-card', {
        start: 'top 90%',
        onEnter: (els) => gsap.fromTo(
          els,
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', overwrite: true },
        ),
      });
    }, rootRef);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    // restore word-split DOM (revert() only touches GSAP-created props, not our spans)
    const restore = () => {
      rootRef.current?.querySelectorAll('.v7-split[data-split]').forEach((el) => {
        el.textContent = el.dataset.origText || '';
        delete el.dataset.split;
      });
      offMagnetic.forEach((fn) => fn());
    };
    return () => {
      window.removeEventListener('load', onLoad);
      restore();
      ctx.revert();
    };
    // NOTE: no data deps here on purpose. Project cards are handled in their own
    // effect; letting this one re-run on query changes reset every from() tween
    // back to hidden and left sections stuck invisible.
  }, [reduced]);

  // Project cards arrive async -> (re)bind their reveals + remeasure everything.
  useLayoutEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.v7-work', {
        start: 'top 90%',
        onEnter: (els) => gsap.fromTo(
          els,
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', overwrite: true },
        ),
      });
    }, rootRef);
    const id = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => { clearTimeout(id); ctx.revert(); };
  }, [reduced, projects.length]);

  return (
    <div id="top" ref={rootRef} className="min-h-screen bg-[#F5F5F5] dark:bg-[#0B0B0D] text-[#171717] dark:text-[#F5F5F5] font-body antialiased">
      <div className="v7-progress fixed top-0 right-0 left-0 z-50 h-[3px] origin-right scale-x-0 bg-cobalt" aria-hidden="true" />
      {motionSuppressed && (
        <div className="fixed bottom-4 left-4 z-[60] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-white/15 bg-[#171717] py-2 ps-4 pe-2 text-white shadow-xl" role="status">
          <span className="font-body text-xs leading-tight">
            الحركة معطّلة حسب إعدادات النظام
            <span className="block font-mono text-[10px] text-white/50" dir="ltr">Animations off (system setting)</span>
          </span>
          <button
            type="button"
            onClick={enableMotion}
            className="shrink-0 rounded-full bg-cobalt px-4 py-1.5 font-body text-xs font-bold text-white hover:opacity-90"
          >
            تشغيل
          </button>
        </div>
      )}
      <SiteHeader />

      {/* ============ META + GIANT TITLE ============ */}
      <section className="v7-hero max-w-[1600px] mx-auto px-6 md:px-10 pt-[130px] md:pt-[150px]">
        <div className="v7-meta v7-anim-rise grid grid-cols-2 md:grid-cols-4 gap-4 items-start mb-8">
          <div>
            <p className="font-body text-sm font-bold">عن بُعد</p>
            <p className="font-body text-sm text-[#929292]">نعمل عالميًا</p>
          </div>
          <div>
            <p className="font-body text-sm font-bold">التخصص</p>
            <p className="font-body text-sm text-[#929292]">برمجيات</p>
          </div>
          <div>
            <p className="font-body text-sm font-bold">الحالة</p>
            <p className="font-body text-sm text-cobalt">متاح 2026</p>
          </div>
          <div className="flex md:justify-end">
            <Link
              to="/contact"
              className="v7-magnetic inline-flex items-center rounded-full bg-[#171717] dark:bg-[#F5F5F5] px-6 py-3 font-body text-sm font-bold text-white dark:text-black hover:opacity-85 transition-opacity"
            >
              ابدأ مشروعًا
            </Link>
          </div>
        </div>

        <h1 className="font-black tracking-[-0.06em] leading-[0.95]" aria-label="أعمال 26">
          <span className="block overflow-hidden">
            <span className="v7-title-word v7-mask-up block text-[clamp(4rem,13vw,12rem)]" style={{ animationDelay: '0.15s' }}>أعمال</span>
          </span>
          <span className="block overflow-hidden" dir="ltr">
            <span className="v7-title-word v7-mask-up block text-right font-mono text-[clamp(4rem,13vw,12rem)]" style={{ animationDelay: '0.27s' }}>’26</span>
          </span>
        </h1>

        {/* hero image cards */}
        <div className="v7-cards relative grid md:grid-cols-2 gap-5 mt-10 pb-20">
          {[heroA, heroB].map((p, i) => (
            <Link
              key={p?.id || i}
              to={p ? `/projects/${p.slug}` : '/projects'}
              className="v7-hero-card v7-anim-rise group relative block overflow-hidden rounded-[20px] bg-[#171717] aspect-[16/8]"
              style={{ animationDelay: `${0.5 + i * 0.12}s` }}
              aria-label={p ? `عرض مشروع ${p.title}` : 'عرض المشاريع'}
            >
              {p?.banner_url ? (
                <img
                  src={p.banner_url}
                  alt={`غلاف ${p.title}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="v7-hero-img h-[115%] w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                  <img src="/logo.png" alt="" className="w-20 h-20 opacity-40 grayscale" />
                </div>
              )}
              {p && (
                <span className="absolute bottom-4 right-4 rounded-full bg-black/55 px-4 py-1.5 font-body text-sm text-white backdrop-blur">
                  {p.title}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* scrub marquee band */}
      <div className="overflow-hidden border-y border-border py-4" dir="ltr" aria-hidden="true">
        <div className="v7-strip flex w-max whitespace-nowrap font-black tracking-[-0.04em] leading-none text-foreground/[0.12] dark:text-white/[0.1]" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}>
          {[0, 1].map((k) => (
            <span key={k} className="px-6">SOFTWARE DEVLABS — DESIGN — MOTION — GSAP —&nbsp;</span>
          ))}
        </div>
      </div>

      {/* ============ WORK CARDS ============ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-5">
          {projects.slice(0, 4).map((p) => (
            <TiltCard key={p.id} max={7} className="rounded-[20px]">
              <article className="v7-work h-full overflow-hidden rounded-[20px] bg-[#171717] text-white">
              {p.banner_url && (
                <img
                  src={p.banner_url}
                  alt={`غلاف ${p.title}`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/8] w-full object-cover grayscale"
                />
              )}
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 font-body text-sm font-bold">
                    <img src="/logo.png" alt="" className="w-5 h-5 rounded-full object-cover grayscale" aria-hidden="true" />
                    {p.title}
                  </span>
                  <span className="font-mono text-xs text-white/70" dir="ltr">
                    {(p.category || 'PROJECT').toUpperCase()} · 2026
                  </span>
                </div>
                <div className="mt-3 overflow-hidden" dir="ltr" aria-hidden="true">
                  <div className="v7-marquee-sm flex w-max whitespace-nowrap font-mono text-[11px] text-white/40">
                    {[0, 1].map((k) => (
                      <span key={k} className="px-4">
                        {(p.skills || []).join(' · ').toUpperCase() || 'DESIGN · CODE · MOTION'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
            </TiltCard>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/projects" className="font-body text-lg font-bold hover:text-cobalt transition-colors" dir="ltr">
            See all →
          </Link>
        </div>
      </section>

      {/* ============ PINNED HORIZONTAL CAPABILITY RAIL ============ */}
      <section
        ref={showcaseRef}
        dir="ltr"
        className="v7-showcase relative mx-3 my-6 flex min-h-[100svh] flex-col justify-center overflow-hidden rounded-[32px] bg-[#171717] py-20 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] md:mx-6 md:my-10 md:py-24"
      >
        <div className="mb-10 max-w-[1600px] mx-auto px-6 md:px-12">
          <p className="v7-rise font-mono text-xs tracking-[0.2em] text-white/50">HOW WE WORK — SCROLL HORIZONTALLY</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <h2 className="v7-giant font-black tracking-[-0.06em] leading-[0.9]" style={{ fontSize: 'clamp(2.2rem, 7.5vw, 7rem)' }}>
              PROCESS
            </h2>
            <span className="v7-sc-count font-mono text-sm text-white/60">01 / {String(PROCESS.length).padStart(2, '0')}</span>
          </div>
        </div>

        <div dir="ltr" className="v7-sc-track flex w-max gap-5 px-6 md:px-12" style={{ willChange: 'transform' }}>
          {PROCESS.map((s, i) => (
            <article
              key={s.n}
              className="v7-sc-card relative flex w-[84vw] shrink-0 flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#1B1B1E_0%,#0C0C0E_100%)] p-7 ring-1 ring-inset ring-white/[0.07] sm:w-[62vw] md:w-[44vw] lg:w-[33vw]"
            >
              <span
                className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full blur-3xl"
                style={{ background: s.accent, opacity: 0.22 }}
                aria-hidden="true"
              />
              <div className="v7-step-art relative mb-6 h-40 shrink-0 sm:h-48">
                <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
                  <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
                  <circle cx="100" cy="100" r="58" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                  <g className="v7-orb-spin" style={{ transformOrigin: '100px 100px', transformBox: 'view-box' }}>
                    <circle cx="100" cy="18" r="8" fill={s.accent} />
                    <circle cx="100" cy="182" r="5" fill="rgba(255,255,255,0.35)" />
                  </g>
                  <g className="v7-orb-spin2" style={{ transformOrigin: '100px 100px', transformBox: 'view-box' }}>
                    <circle cx="182" cy="100" r="6" fill="rgba(255,255,255,0.55)" />
                    <circle cx="18" cy="100" r="4" fill={s.accent} opacity="0.7" />
                  </g>
                  <circle cx="100" cy="100" r="34" fill={s.accent} opacity="0.16" />
                  <circle cx="100" cy="100" r="20" fill={s.accent} opacity="0.42" />
                </svg>
              </div>

              <div className="relative mt-auto">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-white/40">{s.n}</span>
                  <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-black tracking-[-0.04em] leading-none" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                  {s.en}
                </h3>
                <p className="mt-2 font-body text-lg font-bold" dir="auto">{s.ar}</p>
                <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-white/60" dir="auto">{s.desc}</p>
                <span className="absolute bottom-0 end-0 font-mono text-[11px] text-white/35">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="h-px w-full bg-white/15">
            <span className="v7-sc-bar block h-px w-full origin-left scale-x-0 bg-cobalt" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 pb-20 md:pb-28">
        <div className="rounded-[24px] bg-[#171717] text-white px-6 md:px-12 py-14 md:py-20">
          <p className="v7-rise font-mono text-xs tracking-[0.2em] text-white/50" dir="ltr">SERVICES |</p>
          <h2 className="v7-split v7-giant font-medium tracking-tight leading-[1.25] mt-6 max-w-6xl" style={{ fontSize: 'clamp(1.5rem, 3.6vw, 3rem)' }}>
            نتطور مع كل موجز ونُبنى للتأثير — تمتد عمليتنا عبر التصميم والتطوير واستراتيجية العلامة، لنوحّد الرؤية مع التنفيذ ونمنح كل مشروع الوضوح والأفضلية.
          </h2>
          <div className="mt-12 space-y-0">
            {SERVICES.map((s, i) => (
              <div key={s.n} className="v7-service overflow-hidden border-t border-white/10">
                <div className="v7-service-inner grid md:grid-cols-12 gap-4 items-start py-8">
                  <span className="md:col-span-1 font-mono text-xs text-white/50" dir="ltr">{s.n}</span>
                  <h3 className="md:col-span-3 text-3xl md:text-4xl font-medium tracking-tight">{s.title}</h3>
                <div className="md:col-span-5">
                  <p className="font-body text-sm leading-relaxed text-white/70 max-w-md">{s.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-4" dir="ltr">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-md bg-white/10 px-3 py-1.5 font-mono text-[10px] tracking-wider text-white/80">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-3 flex md:justify-end">
                  <span className="v7-svc-shot inline-block overflow-hidden rounded-xl">
                    <img src="/logo.png" alt="" loading="lazy" decoding="async" className="h-28 w-44 object-cover grayscale opacity-80" aria-hidden="true" />
                  </span>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MODERN TECH STACK ============ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 pb-20 md:pb-28">
        <h2 className="v7-giant v7-rise font-black tracking-[-0.06em] leading-[0.95] text-center" style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }} dir="ltr">
          MODERN
          <br />
          TECH STACK
        </h2>
        <p className="v7-rise font-mono text-xs tracking-[0.2em] mt-10 mb-0" dir="ltr">PROFESSIONAL AT</p>
        <div className="grid grid-cols-3 border-t border-l border-[#DCDCDC] dark:border-white/15 mt-6" dir="ltr">
          {STACK_TOP.map((label) => (
            <div key={label} className="v7-stack-cell flex items-center justify-center border-b border-r border-[#DCDCDC] dark:border-white/15 aspect-[16/10] hover:bg-black dark:hover:bg-white group transition-colors">
              <span className="group-hover:text-white dark:group-hover:text-black transition-colors">
                <BrandMark label={label} />
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 border-l border-[#DCDCDC] dark:border-white/15" dir="ltr">
          {STACK_GRID.map((label) => (
            <div key={label} className="v7-stack-cell flex items-center justify-center border-b border-r border-[#DCDCDC] dark:border-white/15 aspect-square hover:bg-black dark:hover:bg-white group transition-colors">
              <span className="font-mono text-xs md:text-sm font-bold group-hover:text-white dark:group-hover:text-black transition-colors" dir="ltr">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ LINK GRID ============ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <div className="relative">
          <div className="v7-giant pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
            <span className="font-black tracking-[-0.06em] text-[18vw] leading-none text-black/[0.07] dark:text-white/[0.08] blur-[2px]" dir="ltr">
              softwaredevlabs
            </span>
          </div>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { to: '/projects', en: 'Work', ar: 'المشاريع' },
              { to: '/blog', en: 'Lab', ar: 'المدونة' },
              { to: '/contact', en: 'Contact', ar: 'تواصل' },
              { to: '/about', en: 'About', ar: 'من نحن' },
              { to: '/projects', en: 'Github', ar: 'المشاريع' },
              { to: '/blog', en: 'Blog', ar: 'المقالات' },
            ].map((l) => (
              <Link
                key={l.en + l.ar}
                to={l.to}
                className="v7-link-card group flex min-h-[140px] items-end justify-between rounded-2xl bg-[#E9E9E7] dark:bg-[#1B1B1D] p-5 hover:bg-black dark:hover:bg-[#F5F5F5] transition-colors"
              >
                <span className="font-body text-lg font-bold group-hover:text-white dark:group-hover:text-black transition-colors">{l.ar}</span>
                <span className="font-mono text-sm text-black/40 dark:text-white/50 group-hover:text-white/60 dark:group-hover:text-black/60 transition-colors" dir="ltr">{l.en}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FLOATING DOCK ============ */}
      <div className="v7-dock v7-anim-fade fixed bottom-5 left-1/2 z-40 hidden w-max max-w-[92vw] 
-translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-[#171717] py-3 pl-4 pr-3 text-white shadow-2xl md:flex" style={{ animationDelay: '1s' }} dir="ltr">
        <img src="/logo.png" alt="" className="w-10 h-10 rounded-xl object-cover grayscale" aria-hidden="true" />
        <span className="min-w-0">
          <span className="block font-mono text-sm font-bold">Software DevLabs</span>
          <span className="block w-56 overflow-hidden whitespace-nowrap font-mono text-[11px] text-white/50">
            <span className="v7-marquee-sm inline-flex w-max">
              <span className="px-4">DESIGN ENGINEER · GSAP · MOTION · ARABIC ·&nbsp;</span>
              <span className="px-4" aria-hidden="true">DESIGN ENGINEER · GSAP · MOTION · ARABIC ·&nbsp;</span>
            </span>
          </span>
        </span>
        <Link to="/contact" aria-label="تواصل" className="ms-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-cobalt transition-colors">
          <ArrowUpLeft className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <SiteFooter />
    </div>
  );
}
