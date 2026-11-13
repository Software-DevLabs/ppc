import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { SKILLS, CONTACT_EMAIL } from '@/lib/site';

function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="bg-background text-foreground font-body">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-16">
        <span className="font-body text-xs text-muted-foreground">من نحن / 003</span>
        <h1 className="text-4xl md:text-7xl font-light tracking-tight mt-4 leading-[1.5] max-w-5xl">
          مطوّر يحوّل الأفكار<br />إلى <span className="text-cobalt">منتجات تعمل.</span>
        </h1>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <FadeIn className="md:col-span-4">
            <div className="border border-border bg-card p-4 h-full">
              <div className="border border-border bg-secondary aspect-square flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="شعار Software Dev Labs" className="w-1/2" decoding="async" />
              </div>
            </div>
          </FadeIn>
          <FadeIn className="md:col-span-8 flex flex-col justify-center" delay={0.15}>
            <p className="text-2xl md:text-4xl font-light leading-[1.6] tracking-tight">
              مطوّر برمجيات Full-Stack، أبني تطبيقات ويب متكاملة بأحدث التقنيات — من الفكرة حتى الإنتاج.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground mt-6 max-w-2xl">
              خبرتي تمتد إلى بناء وكلاء الذكاء الاصطناعي وهندسة الأنظمة، وإلى التصميم — ما يجعلني قادرًا على تسليم منتج كامل.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pb-24">
        <FadeIn>
          <span className="font-body text-xs text-muted-foreground">الأدوات والتقنيات / 004</span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mt-4 mb-10">ماذا أستخدم</h2>
        </FadeIn>
        <div className="border-t border-border">
          {SKILLS.map((s, i) => (
            <FadeIn key={s} delay={Math.min(i * 0.03, 0.3)}>
              <div className="py-4 border-b border-border grid grid-cols-12 gap-4 items-center group hover:bg-card transition-colors">
                <span className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground" dir="ltr">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="col-span-10 md:col-span-11 font-mono text-sm group-hover:text-cobalt transition-colors" dir="auto">
                  {s}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="flex flex-wrap gap-4 mt-12">
          <Link to="/projects" className="inline-flex items-center gap-2 bg-cobalt text-white font-body text-sm font-bold px-7 py-3.5 hover:opacity-90 transition-opacity">
            شاهد مشاريعي <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 border border-border font-body text-sm font-bold px-7 py-3.5 hover:border-cobalt hover:text-cobalt transition-colors">
            راسلني <Mail className="w-4 h-4" aria-hidden="true" />
          </a>
        </FadeIn>
      </div>
    </div>
  );
}
