import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, Mail,
  CircleCheck, ImageIcon, ImagePlay, Lightbulb, Plus, Mic, Paperclip,
  Sparkles,
} from 'lucide-react';
import Ver9Header from '@/components/layout/Ver9Header';
import SiteFooter from '@/components/layout/SiteFooter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LiquidButton from '@/components/ver10/LiquidButton';
import VelocityMarquee from '@/components/ver10/VelocityMarquee';
import MaskText from '@/components/ver10/MaskText';
import Eyes from '@/components/ver10/Eyes';
import ChipsFlow from '@/components/ver10/ChipsFlow';
import LinkHover from '@/components/ver10/LinkHover';
import ArrowLink from '@/components/ver10/ArrowLink';
import RoundTag from '@/components/ver10/RoundTag';
import ServicesAccordion from '@/components/ver10/ServicesAccordion';
import AgentCardsSection from '@/components/ver10/AgentCardsSection';
import { CONTACT_EMAIL, SKILLS } from '@/lib/site';
import { usePublishedProjects } from '@/lib/queries';

/* ============ Ochi-style hero ============ */
const HeroImagePill = ({ src }) => (
  <motion.span
    initial={{ width: 0 }}
    animate={{ width: '1.45em' }}
    transition={{ ease: [0.86, 0, 0.07, 0.995], duration: 1, delay: 1.4 }}
    className="inline-flex overflow-hidden rounded-[0.18em] align-middle"
  >
    <img src={src} alt="عمل من مشاريعنا" className="w-full h-[0.72em] object-cover rounded-[0.18em]" />
  </motion.span>
);

const Hero = () => {
  const { data: projects = [] } = usePublishedProjects();
  const pill = projects[0]?.banner_url ||
    'https://images.unsplash.com/photo-1550751827-2bdab439c663?auto=format&fit=crop&w=640&q=80';

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-40 pb-0">
      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <MaskText className="font-semibold tracking-tight text-[clamp(2.9rem,10.5vw,9.5rem)] leading-[1.02]" lineClassName="text-[#F2F2F0]">
              <span>نبني أنظمة</span>
              <span className="flex items-center gap-[0.22em]">
                <HeroImagePill src={pill} />
                مذهلة.
              </span>
            </MaskText>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-3 pt-4 text-[#8A8A86]">
            <span className="font-mono text-[11px] tracking-[0.3em]">EST. SOFTWARE DEVLABS</span>
            <span className="w-14 border-t border-white/20" />
          </div>
        </div>

        <div className="mt-16 max-w-3xl">
          <MaskText className="text-xl md:text-2xl text-[#9A9A96] leading-relaxed" lineClassName="text-[#F2F2F0]">
            <span>مختبر البرمجيات يصمم ويهندس المنتجات الرقمية والمنصات.</span>
          </MaskText>
        </div>
      </div>

      {/* bottom strip — borders like ochi */}
      <div className="border-t border-white/10 mt-20">
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <p className="text-[#9A9A96] text-sm md:w-1/2">للشركات الناشئة والمؤسسات الطموحة</p>
          <div className="flex items-center justify-between md:w-1/2">
            <p className="text-[#9A9A96] text-sm">من الفكرة الأولى حتى الإطلاق</p>
            <div className="flex items-center gap-2">
              <LiquidButton
                className="border border-white/25 rounded-full px-5 py-2.5 cursor-pointer group uppercase text-sm tracking-wide text-[#F2F2F0]"
                labelClassName="transition-colors duration-300 group-hover:text-black"
              >
                <Link
                  to="/contact"
                  className="relative z-10 transition-colors duration-300 group-hover:text-black"
                >
                  ابدأ مشروعًا
                </Link>
                <ArrowUpRight className="w-4 h-4 relative z-[10] transition-colors duration-300 group-hover:text-black" />
              </LiquidButton>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label="مراسلة عبر البريد"
                className="w-[42px] h-[42px] border border-white/25 rounded-full flex items-center justify-center text-[#F2F2F0] group-hover:bg-white hover:bg-white transition-all duration-300 hover:text-black"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============ velocity marquee band ============ */
const MarqueeBand = () => {
  const items = ['هندسة المنتجات', 'أنظمة ذكية', ...SKILLS, 'تصميم واجهات', 'بنية تحتية'];
  return (
    <section className="border-y border-white/10 py-8 bg-[#0a0807]" aria-label="قدراتنا">
      <VelocityMarquee baseVelocity={1.5}>
        <div className="flex items-center gap-10 px-5">
          {items.map((it, i) => (
            <React.Fragment key={i}>
              <span className="text-[clamp(2.2rem,6vw,5.5rem)] font-semibold text-[#F2F2F0] whitespace-nowrap tracking-tight">
                {it}
              </span>
              <Sparkles className="w-8 h-8 text-white/25 shrink-0" />
            </React.Fragment>
          ))}
        </div>
      </VelocityMarquee>
    </section>
  );
};

/* ============ masked statement ============ */
const Statement = () => (
  <section className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-28 md:py-40">
    <MaskText
      className="max-w-5xl font-medium text-[clamp(1.6rem,3.6vw,3.2rem)] leading-[1.5] text-[#F2F2F0]"
    >
      <span>مختبر البرمجيات شريك هندسي للشركات الناشئة والطموحة،</span>
      <span>نحوّل الأفكار إلى منتجات ومنصات وأنظمة</span>
      <span>تُبنى حول متطلبات العمل الحقيقية.</span>
    </MaskText>
    <div className="mt-12 flex flex-col gap-3 w-fit">
      {[
        { title: 'المشاريع', href: '/projects' },
        { title: 'المدونة', href: '/blog' },
        { title: 'من نحن', href: '/about' },
        { title: 'تواصل معنا', href: '/contact' },
      ].map((item) => (
        <LinkHover key={item.href} href={item.href} title={item.title} className="text-lg" />
      ))}
    </div>
  </section>
);

/* ============ Feature (framer-motion component, RTL + dark) ============ */

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

const Feature = () => (
  <section id="feature" className="bg-[#0a0807]">
    <div className="max-w-7xl xl:px-16 lg:px-8 px-4 lg:py-20 sm:py-16 py-10 mx-auto w-full">
      <div className="flex flex-col gap-5">
        <motion.div
          className="flex flex-col items-center gap-4 text-center mb-7"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <Badge variant="outline" className="text-sm font-normal text-foreground px-3 py-1 rounded-full h-auto">
              قدرات
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} className="xl:text-4xl text-3xl font-medium text-foreground max-w-2xl leading-tight">
            اكتشف قدرات الذكاء الاصطناعي لدينا
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base lg:text-xl text-muted-foreground max-w-2xl">
            سرّع سير عملك بأدوات مدعومة بالذكاء الاصطناعي — صُممت للسرعة والوضوح والتوسّع، لتخدم فرقًا في كل مرحلة.
          </motion.p>
        </motion.div>

        {/* Row 1: image with tag marquee + content */}
        <div className="bg-muted rounded-3xl p-2 flex flex-col md:flex-row gap-0 overflow-hidden">
          <motion.div
            className="relative rounded-2xl overflow-hidden md:w-1/2 h-72 md:h-auto min-h-[300px] shrink-0"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeLeft}
          >
            <img src="https://cdn.21st.dev/assets/localized/468033ba9511428e13bf900759fb694f10d1ed1bf588879f76dc9a183273ce5a.jpg" alt="أتمتة سير العمل" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/20" />
            <ChipsFlow className="absolute inset-0" />
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
                أتمتة سير العمل المعقد بسهولة بفضل حلول الذكاء الاصطناعي
              </h3>
              <p className="text-base text-muted-foreground">
                بسّط عملياتك بأتمتة المهام المتكررة والمستغرقة للوقت عبر ذكاء اصطناعي مصمم للكفاءة والدقة.
              </p>
            </motion.div>
            <motion.div variants={stagger} className="flex flex-col gap-3">
              {[
                {
                  title: 'أتمتة ذكية',
                  body: 'نفّذ المهام تلقائيًا بأقل تدخل يدوي، لتوفير الوقت للأنشطة عالية الأثر.',
                },
                {
                  title: 'تحسين العمليات',
                  body: 'ارفع السرعة والاتساق عبر سير العمل، مع نتائج أكثر موثوقية وكفاءة.',
                },
              ].map(({ title, body }, i) => (
                <motion.div key={i} variants={fadeRight} className="flex gap-3 items-start">
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

        {/* Row 2: content + image with AI chat UI */}
        <div className="bg-muted rounded-3xl p-2 flex flex-col md:flex-row gap-0 overflow-hidden">
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
                  دمج سلس بين أدوات الذكاء الاصطناعي وأنظمة عملك
                </h3>
                <p className="text-base text-muted-foreground">
                  تفاعل مع الذكاء الاصطناعي لحظيًا لتوليد المحتوى، وأتمتة الردود، وتبسيط المهام عبر واجهة بسيطة.
                </p>
              </div>
            </motion.div>
            <motion.div variants={stagger} className="flex flex-col gap-3">
              {[
                {
                  title: 'مساعد مدعوم بالذكاء الاصطناعي',
                  body: 'أنشئ ردودًا وأفكارًا ومحتوى فوريًا بذكاء مدرك للسياق، لعمل أسرع وقرارات أفضل.',
                },
                {
                  title: 'تجربة تفاعلية',
                  body: 'واجهة ديناميكية تجعل إنشاء المخرجات وصقلها وإدارتها أبسط وأسرع.',
                },
              ].map(({ title, body }, i) => (
                <motion.div key={i} variants={fadeLeft} className="flex gap-3 items-start">
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
            <img src="https://cdn.21st.dev/assets/localized/9c63a565817f73c372e52a92c50bfa44a631f64ad8fde1e9fd398f5ff073dd5e.webp" alt="واجهة محادثة ذكاء اصطناعي" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/20" />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="w-full max-w-md bg-gray-950/20 px-2 py-2.5 sm:p-4 rounded-3xl flex flex-col gap-3">
                <div className="flex flex-wrap justify-center items-center gap-1" dir="ltr">
                  <Button className="text-xs bg-white/20 border border-gray-200/40 h-auto px-2 xl:px-4 py-1.5 xl:py-2 rounded-full text-white cursor-pointer">
                    <ImageIcon />
                    <span>إنشاء صورة</span>
                  </Button>
                  <Button className="text-xs bg-white/20 border border-gray-200/40 h-auto px-2 xl:px-4 py-1.5 xl:py-2 rounded-full text-white cursor-pointer">
                    <ImagePlay />
                    <span>إنشاء فيديو</span>
                  </Button>
                  <Button className="text-xs bg-white/20 border border-gray-200/40 h-auto px-2 xl:px-4 py-1.5 xl:py-2 rounded-full text-white cursor-pointer">
                    <Lightbulb />
                    <span>بحث معمّق</span>
                  </Button>
                </div>
                <div className="flex items-center gap-0 sm:gap-2 rounded-full border border-white/20 bg-white/10 px-1.5 sm:px-3 py-1.5 sm:py-2 shadow-sm">
                  <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-muted/10 cursor-pointer">
                    <Plus className="h-4 w-4 text-white" />
                  </Button>
                  <Input
                    placeholder="ما الذي تريد تصممه اليوم؟"
                    className="border-none bg-transparent! dark:bg-transparent! focus-visible:ring-0 focus-visible:ring-offset-0 text-white p-0 placeholder:text-white"
                  />
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-muted/10 cursor-pointer">
                      <Mic className="h-4 w-4 text-white" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-muted/10 cursor-pointer">
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

/* ============ eyes interlude ============ */
const EyesBand = () => (
  <section className="border-y border-white/10 py-20 bg-[#0a0807]">
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">
      <p className="text-2xl md:text-4xl font-medium text-[#F2F2F0]">نُراقب <span className="text-[#666]">كل التفاصيل.</span></p>
      <Eyes ballClassName="w-[104px] h-[104px]" />
      <p className="text-sm text-[#9A9A96] max-w-[220px]">من أول بيكسل إلى آخر سحابة — تنفيذ يتقن التفاصيل.</p>
    </div>
  </section>
);

/* ============ ochi-style project grid ============ */
const FeaturedProjects = () => {
  const { data: projects = [] } = usePublishedProjects();
  const shown = projects.slice(0, 4);

  return (
    <section className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-24" aria-label="مشاريع مختارة">
      <div className="border-b border-white/10 pb-8 mb-14 flex items-end justify-between">
        <MaskText className="text-3xl md:text-5xl font-medium text-[#F2F2F0]">
          <span>مشاريع مختارة</span>
        </MaskText>
        <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86] hidden md:block">FEATURED WORK</span>
      </div>

      <div className="flex flex-wrap justify-between gap-y-16">
        {shown.map((p, i) => {
          const alt = i % 2 === 0;
          return (
            <div key={p.id} className="w-full md:w-[49%]" dir="rtl">
              <div className="flex items-center gap-2.5 pb-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F2F2F0]" />
                <h3 className="text-sm uppercase font-medium text-[#F2F2F0]">{p.title}</h3>
              </div>
              <OchiCard project={p} side={alt} />
              <div className="flex items-center gap-2 mt-5 flex-wrap">
                {(p.skills || []).slice(0, 3).map((s) => (
                  <RoundTag key={s} title={s} />
                ))}
                {p.category && <span className="text-xs text-[#8A8A86] px-1">{p.category}</span>}
              </div>
            </div>
          );
        })}
        {shown.length === 0 && (
          <p className="w-full text-center text-[#9A9A96] py-16">لا توجد مشاريع منشورة بعد.</p>
        )}
      </div>

      <div className="w-full flex justify-center mt-20">
        <LiquidButton
          className="border border-white/25 rounded-full px-6 py-3 cursor-pointer group uppercase text-sm tracking-wide text-[#F2F2F0]"
        >
          <Link
            to="/projects"
            className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-black"
          >
            كل الأعمال <ArrowUpRight className="w-4 h-4" />
          </Link>
        </LiquidButton>
      </div>
    </section>
  );
};

const OchiCard = ({ project: p, side }) => {
  const [hovered, setHovered] = useState(false);
  const letters = Array.from(String(p.title || ''));

  return (
    <div className="relative w-full group">
      <Link
        to={`/projects/${p.slug}`}
        aria-label={`عرض مشروع ${p.title}`}
        className="rounded-xl overflow-hidden hover:scale-[0.95] transition-transform duration-1000 ease-[cubic-bezier(.4,0,.2,1)] block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={p.banner_url}
          alt={`غلاف ${p.title}`}
          loading="lazy"
          className="w-full aspect-[4/3] object-cover rounded-xl group-hover:scale-[1.09] transition-transform duration-1000 ease-[cubic-bezier(.4,0,.2,1)]"
        />
      </Link>
      {/* floating giant title letters (ochi signature) */}
      <div
        dir="ltr"
        style={side ? { left: '-6%' } : { left: '78%' }}
        className="absolute hidden md:flex w-fit top-1/2 -translate-y-1/2 overflow-visible z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(.4,0,.2,1)] pointer-events-none"
      >
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: '110%' }}
            animate={hovered ? { y: 0 } : { y: '110%' }}
            transition={{ delay: i * 0.02, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="text-[110px] leading-none inline-block font-bold text-white/[0.07] pointer-events-none select-none"
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

/* ============ ochi-style ratings bento, real studio numbers ============ */
const RatingsBand = () => {
  const { data: projects = [] } = usePublishedProjects();

  const tileBase = 'rounded-xl border border-white/10 bg-[#111010] relative overflow-hidden flex flex-col justify-between p-8';
  const pillClass = 'border border-white/25 rounded-full px-4 py-2 cursor-pointer group w-fit text-sm text-[#F2F2F0] tracking-wide';

  return (
    <section className="px-6 md:px-10 py-6 max-w-[1600px] w-full mx-auto" aria-label="نظرة سريعة">
      <div className="flex flex-col md:flex-row gap-3">
        <div className={`md:w-[49.5%] h-[42vh] md:h-[52vh] ${tileBase}`} dir="rtl">
          <Sparkles className="w-9 h-9 text-white/20" />
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              className="text-[clamp(3.2rem,7vw,6rem)] font-semibold text-[#F2F2F0] leading-none"
            >
              +{projects.length || 0}
            </motion.h3>
            <p className="text-sm text-[#9A9A96] mt-3">مشروع منشور وموثّق بالكامل</p>
            <div className="mt-5">
              <LiquidButton className={pillClass}>
                <Link to="/projects" className="relative z-10 transition-colors duration-300 group-hover:text-black">
                  شاهد الأعمال
                </Link>
              </LiquidButton>
            </div>
          </div>
        </div>

        <div className="md:w-[50%] flex flex-col gap-3 h-[42vh] md:h-[52vh]">
          <div className={`${tileBase} flex-1`} dir="rtl">
            <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86]">STACK</span>
            <div>
              <h3 className="text-[clamp(2rem,3.6vw,3rem)] font-semibold text-[#F2F2F0]">{SKILLS.length}+ تقنية</h3>
              <p className="text-sm text-[#9A9A96] mt-2">نعمل بها في الإنتاج يوميًا</p>
              <div className="mt-4">
                <ArrowLink href="#services" title="الخدمات" />
              </div>
            </div>
          </div>
          <div className={`${tileBase} flex-1`} dir="rtl">
            <Mail className="w-8 h-8 text-white/20" />
            <div>
              <p className="text-sm text-[#F2F2F0]" dir="ltr">{CONTACT_EMAIL}</p>
              <p className="text-sm text-[#9A9A96] mt-2">متاحون لمشاريع جديدة الآن</p>
              <div className="mt-4">
                <LiquidButton className="border border-white/25 rounded-full px-4 py-2 w-fit text-sm text-[#F2F2F0] tracking-wide cursor-pointer group">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="relative z-10 transition-colors duration-300 group-hover:text-black">
                    راسلنا عبر البريد
                  </a>
                </LiquidButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
const CTA = () => (
  <section className="border-t border-white/10 bg-[#0a0807]">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-28 md:py-36 text-center">
      <MaskText className="font-semibold tracking-tight text-[clamp(2.6rem,8vw,7rem)] text-[#F2F2F0]">
        <span>جاهز لبدء مشروعك؟</span>
      </MaskText>
      <div className="mt-12 flex items-center justify-center gap-4">
        <LiquidButton
          className="bg-white rounded-full px-8 py-4 cursor-pointer group uppercase text-sm tracking-wide text-black"
        >
          <Link
            to="/contact"
            className="relative z-10 transition-colors duration-300 group-hover:text-black"
          >
            ابدأ المشروع
          </Link>
          <ArrowUpRight className="w-4 h-4 relative z-[10]" />
        </LiquidButton>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-sm text-[#9A9A96] hover:text-white border-b border-white/20 hover:border-white transition-colors"
        >
          أو راسلنا مباشرة
        </a>
      </div>
    </div>
  </section>
);

export default function Ver10() {
  return (
    <div className="v9-scope bg-[#0a0807] min-h-screen text-[#F2F2F0] overflow-x-hidden">
      <Ver9Header />
      <main>
        <Hero />
        <MarqueeBand />
        <Statement />
        <Feature />
        <AgentCardsSection />
        <ServicesAccordion />
        <RatingsBand />
        <EyesBand />
        <FeaturedProjects />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}
