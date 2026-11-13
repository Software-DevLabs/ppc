import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Bot, Server, PenTool, ChevronDown } from 'lucide-react';
import MaskText from './MaskText';
import ArrowLink from './ArrowLink';

/* Mirror of Ver2 SERVICES - same real studio capabilities */
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

/* Ochi "Clients" accordion pattern, filled with real services */
export default function ServicesAccordion() {
  const [active, setActive] = useState(SERVICES[0].n);
  const toggle = (id) => setActive((prev) => (prev === id ? null : id));

  return (
    <section id="services" className="w-full py-24" aria-label="خدماتنا">
      <div className="px-6 md:px-10 pb-10 border-b border-white/10 flex items-end justify-between">
        <MaskText className="text-3xl md:text-5xl font-medium text-[#F2F2F0]">
          <span>ماذا نفعل؟</span>
        </MaskText>
        <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86] hidden md:block">SERVICES</span>
      </div>

      {SERVICES.map((s, idx) => {
        const open = active === s.n;
        const Icon = s.icon;
        return (
          <div key={s.n} className={`py-2.5 ${idx === 0 ? 'border-b border-white/10' : 'border-b border-white/10'}`}>
            <div className="flex items-center justify-between py-2.5 px-6 md:px-10 gap-6">
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-xs text-[#8A8A86] shrink-0">{s.n}</span>
                <a
                  href={`#service-${s.n}`}
                  onClick={(e) => { e.preventDefault(); toggle(s.n); }}
                  className={`truncate text-sm md:text-base transition-opacity duration-200 ${open ? 'text-[#F2F2F0] opacity-100' : 'text-[#B9B9B4] opacity-80 hover:opacity-100'}`}
                >
                  {s.title}
                </a>
              </div>
              <div className="flex items-center gap-6">
                <Icon className={`w-4.5 h-4.5 w-[18px] h-[18px] shrink-0 transition-colors duration-300 ${open ? 'text-[#F2F2F0]' : 'text-[#8A8A86]'}`} />
                <button
                  aria-label={open ? 'إغلاق' : 'فتح'}
                  onClick={() => toggle(s.n)}
                  className={`text-[11px] text-[#8A8A86] hover:text-[#F2F2F0] uppercase transition-colors flex items-center gap-1`}
                >
                  {open ? 'إغلاق' : 'قراءة'}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            <div className="flex justify-between px-6 md:px-10">
              <div className="w-[20%] hidden sm:block" />
              <div className="sm:w-full md:w-[55%] overflow-hidden">
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.55 }}
                    >
                      <div className="flex flex-col gap-5 py-5">
                        <p className="text-sm text-[#B9B9B4] leading-relaxed">{s.desc}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-[11px] tracking-wider text-[#8A8A86]">{s.tags}</span>
                          <ArrowLink href="/contact" title="اطلب الخدمة" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-[20%] hidden md:block" />
            </div>
          </div>
        );
      })}
    </section>
  );
}
