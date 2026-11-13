import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { SITE_NAME, SKILLS, CONTACT_EMAIL, LOGO_URL } from '@/lib/site';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" aria-label="الترحيب">
      <div className="relative z-10 px-6 md:px-8 lg:px-12 pt-32 pb-24 max-w-7xl mx-auto w-full">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="flex items-center gap-3 mb-12">
            <img src={LOGO_URL} alt={`شعار ${SITE_NAME}`} className="w-11 h-11 rounded-lg" />
            <span className="font-mono text-xs tracking-widest text-muted-foreground" dir="ltr">{SITE_NAME}</span>
          </motion.div>
          <motion.span variants={item} className="font-mono text-xs tracking-widest text-cobalt block mb-6">
            مطوّر برمجيات Full-Stack
          </motion.span>
          <motion.h1 variants={item}
            className="font-body text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.15] text-foreground max-w-4xl">
            أبني أنظمة ويب<br />
            <span className="animated-gradient-text">ذكية وسريعة</span>
          </motion.h1>
          <motion.p variants={item}
            className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mt-8">
            مطوّر Full-Stack بخبرة في بناء تطبيقات الويب، تصميم وكلاء الذكاء الاصطناعي، وهندسة الأنظمة.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-2 mt-8 max-w-2xl">
            {SKILLS.map(s => (
              <span key={s}
                className="font-mono text-[11px] border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:border-cobalt/50 hover:text-foreground transition-colors">
                {s}
              </span>
            ))}
          </motion.div>
          <motion.div variants={item} className="flex flex-wrap gap-4 mt-10">
            <Link to="/projects"
              className="inline-flex items-center gap-2 bg-cobalt text-gallery font-mono text-sm font-bold px-7 py-3.5 hover:opacity-90 hover:-translate-y-0.5 transition-all">
              تصفّح المشاريع <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 border border-border text-foreground font-mono text-sm font-bold px-7 py-3.5 hover:border-cobalt hover:text-cobalt hover:-translate-y-0.5 transition-all">
              راسلني <Mail className="w-4 h-4" aria-hidden="true" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
