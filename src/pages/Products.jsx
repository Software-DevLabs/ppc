import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import Ver9Header from '@/components/layout/Ver9Header';
import HalftoneWordmarkFooter from '@/components/halftone/HalftoneWordmarkFooter';
import MaskText from '@/components/ver10/MaskText';
import ArrowLink from '@/components/ver10/ArrowLink';
import RoundTag from '@/components/ver10/RoundTag';
import LiquidButton from '@/components/ver10/LiquidButton';
import VelocityMarquee from '@/components/ver10/VelocityMarquee';
import PageLoader from '@/components/warmup/PageLoader';
import { CONTACT_EMAIL } from '@/lib/site';

const A = (name) => `/products_ogi/${name}`;

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const VIEW = { once: true, amount: 0.35 };

const R = ({ children, className = '' }) => (
  <motion.div
    variants={rise}
    initial="hidden"
    whileInView="show"
    viewport={VIEW}
    className={className}
  >
    {children}
  </motion.div>
);

/* ochi section head — big masked title + mono kicker on a hairline */
const SectionHead = ({ title, kicker }) => (
  <div className="border-b border-white/10 pb-8 mb-14 flex items-end justify-between">
    <MaskText className="text-3xl md:text-5xl font-medium text-[#F2F2F0]">
      <span>{title}</span>
    </MaskText>
    <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86] hidden md:block">{kicker}</span>
  </div>
);

/* hero media: grainy banner + terminal window, brand strip on the right edge */
const Hero = () => (
  <section className="pt-40 pb-16 border-b border-white/10" dir="ltr">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
      <R>
        <p className="font-mono text-xs tracking-[0.4em] uppercase text-[#9A9A96]">OGI Code</p>
        <h1 className="mt-6 text-[clamp(2rem,4.4vw,3.9rem)] font-medium leading-[1.15] text-[#F2F2F0] tracking-tight">
          Improve Your Projects With
          <br />
          OGI CODE
        </h1>
      </R>

      <div className="relative mt-12">
        <R>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src={A('main.png')}
              alt="OGI Agent terminal — Welcome to agent, /help lists the commands, model gemma4:31b-cloud"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              className="w-full h-auto object-cover"
            />
          </div>
        </R>

        {/* vertical wordmark riding the right edge */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
          className="absolute top-9 -right-1 md:-right-3 hidden sm:flex flex-col items-end font-mono font-bold text-white text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.12] tracking-tight select-none"
        >
          <span className="bg-[#0d0d0d] px-2 py-0.5">OG</span>
          <span className="bg-[#0d0d0d] px-2 py-0.5">I</span>
          <span className="bg-[#0d0d0d] px-2 py-0.5">CO</span>
          <span className="bg-[#0d0d0d] px-2 py-0.5">DE</span>
        </motion.div>
      </div>

      {/* CTA pill, right-aligned like the reference */}
      <div className="mt-8 flex justify-end">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-black rounded-full px-8 h-11 font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            Request Access
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

/* centered claim */
const BuildClaim = () => (
  <section className="py-24 md:py-32" dir="ltr">
    <R className="max-w-3xl w-full mx-auto px-6">
      <h2 className="text-center text-[clamp(1.8rem,3.4vw,3rem)] font-medium text-[#F2F2F0] tracking-tight">
        The best way to build with agents
      </h2>
    </R>
  </section>
);

const BODY_COPY =
  'Give OGI your toughest engineering problems, from hard-to-find bugs to complex refactors and new features. OGI works efficiently, delivering high-quality results with fewer tokens.';

/* two alternating feature rows */
const EngineeringRow = () => (
  <section className="pb-20" dir="ltr">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <div className="lg:col-span-4">
        <R>
          <h3 className="text-2xl md:text-[1.75rem] font-medium text-[#F2F2F0] leading-snug">
            Built to drive real engineering work
          </h3>
          <p className="mt-5 text-sm text-[#9A9A96] leading-relaxed">{BODY_COPY}</p>
        </R>
      </div>
      <div className="lg:col-span-8">
        <R>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img src={A('Featur1.png')} alt="OGI Agent planning and writing code in the terminal" loading="lazy" className="w-full h-auto object-cover" />
          </div>
        </R>
      </div>
    </div>
  </section>
);

const CommandsRow = () => (
  <section className="py-20" dir="ltr">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <div className="lg:col-span-7">
        <R>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img src={A('Featur2.png')} alt="OGI Agent /help command list in the terminal" loading="lazy" className="w-full h-auto object-cover" />
          </div>
        </R>
      </div>
      <div className="lg:col-span-5">
        <R>
          <h3 className="text-2xl md:text-[1.75rem] font-medium text-[#F2F2F0] leading-snug">
            Use diff Commands to customize Agent Actions
          </h3>
          <p className="mt-5 text-sm text-[#9A9A96] leading-relaxed">{BODY_COPY}</p>
        </R>
      </div>
    </div>
  </section>
);

/* ============ velocity marquee interlude ============ */
const MarqueeBand = () => {
  const items = [
    'REAL FILES', 'REAL TERMINAL', 'REAL BROWSER', 'DIFFS FIRST',
    '37 TOOLS', 'FOUR GATES', 'BACKUPS + UNDO', 'SHIP GATE', 'LOCAL MODELS', 'GITHUB PUSH',
  ];
  return (
    <section className="border-y border-white/10 py-8 bg-[#0a0807] overflow-hidden" aria-label="OGI in one line">
      <VelocityMarquee baseVelocity={1.2}>
        <div className="flex items-center gap-10 px-5" dir="ltr">
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

/* ============ masked statement + facts as hairline rows ============ */
const FACTS = [
  { k: 'Runs', v: 'on your machine, against real files and a real Chrome.' },
  { k: 'Model', v: 'any tag ollama serve answers — local or :cloud.' },
  { k: 'Network', v: 'only the sites you point at, plus api.github.com.' },
  { k: 'Not', v: 'a chatbot wrapper, a hosted sandbox, or a framework you must learn.' },
];

const RunsLocal = () => (
  <section className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-28 md:py-36" dir="ltr">
    <MaskText className="max-w-5xl font-medium text-[clamp(1.6rem,3.6vw,3.2rem)] leading-[1.5] text-[#F2F2F0]">
      <span>A working agent on your own machine —</span>
      <span>real files, a real terminal, a real browser.</span>
      <span>Nothing leaves except what you approve.</span>
    </MaskText>

    <div className="mt-16 flex justify-between border-b border-white/10 pb-6">
      <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86]">WHAT IT IS</span>
      <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86]">LOCAL FIRST</span>
    </div>
    {FACTS.map((f, i) => (
      <R key={f.k} className="border-b border-white/10">
        <div className="flex flex-col sm:grid sm:grid-cols-[64px_150px_1fr] sm:items-baseline gap-2 sm:gap-6 md:gap-10 py-7">
          <span className="flex items-baseline gap-4">
            <span className="font-mono text-xs text-[#8A8A86]">0{i + 1}</span>
            <span className="sm:hidden font-mono text-sm text-[#F2F2F0] uppercase tracking-[0.2em]">{f.k}</span>
          </span>
          <span className="hidden sm:block font-mono text-sm text-[#F2F2F0] uppercase tracking-[0.2em]">{f.k}</span>
          <span className="text-lg md:text-xl text-[#B9B9B4] leading-relaxed">{f.v}</span>
        </div>
      </R>
    ))}
  </section>
);

/* ============ modes as accordion rows (services pattern) ============ */
const MODES = [
  {
    n: '01',
    cmd: 'agent',
    title: 'The full screen',
    desc: 'Talk, watch it work, approve writes and commands as they come. /help lists everything; every write shows as a diff first.',
    tags: 'TUI · /help · @files · diffs',
  },
  {
    n: '02',
    cmd: 'agent do "task"',
    title: 'One unattended run',
    desc: 'It asks nothing — your approval tier decides — and exits when done. --json makes it pipeable into scripts and CI.',
    tags: '--json · one run · exits',
  },
  {
    n: '03',
    cmd: 'agent factory "task"',
    title: 'The factory line',
    desc: 'A foreman plans stations, scout reads, builder writes, verifier probes, review rounds return comments, the ship gate holds the merge until it passes.',
    tags: 'foreman · stations · review · gate',
  },
];

const WorkModes = () => {
  const [open, setOpen] = useState('01');
  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

  return (
    <section id="modes" className="w-full pb-10" dir="ltr">
      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
        <div className="border-b border-white/10 pb-8 mb-2 flex items-end justify-between">
          <MaskText className="text-3xl md:text-5xl font-medium text-[#F2F2F0]">
            <span>Two ways to work?</span>
          </MaskText>
          <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86] hidden md:block">RUN IT — OR RUN IT ALL THE WAY</span>
        </div>
      </div>

      {MODES.map((m) => {
        const isOpen = open === m.n;
        return (
          <div key={m.n} className="border-b border-white/10">
            <button
              type="button"
              onClick={() => toggle(m.n)}
              className="w-full max-w-[1600px] mx-auto flex items-center justify-between py-6 px-6 md:px-10 gap-6 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-baseline gap-5 md:gap-8 min-w-0">
                <span className="font-mono text-xs text-[#8A8A86] shrink-0">{m.n}</span>
                <span className={`font-mono text-sm md:text-base whitespace-nowrap transition-colors duration-300 ${isOpen ? 'text-[#F2F2F0]' : 'text-[#B9B9B4]'}`}>
                  ${m.cmd}
                </span>
                <span className={`hidden lg:block text-xl md:text-2xl font-medium truncate transition-colors duration-300 ${isOpen ? 'text-[#F2F2F0]' : 'text-[#8A8A86]'}`}>
                  {m.title}
                </span>
              </div>
              <span className={`font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 shrink-0 ${isOpen ? 'text-[#F2F2F0]' : 'text-[#8A8A86]'}`}>
                {isOpen ? 'close —' : 'read +'}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.55 }}
                >
                  <div className="flex justify-between px-6 md:px-10">
                    <div className="w-[20%] hidden md:block" />
                    <div className="w-full md:w-[55%] flex flex-col gap-5 py-5 pb-10" dir="ltr">
                      <p className="text-lg md:text-2xl font-medium text-[#F2F2F0] lg:hidden">{m.title}</p>
                      <p className="text-sm text-[#B9B9B4] leading-relaxed">{m.desc}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <RoundTag title={m.tags} />
                        <ArrowLink href="/products" title="Request access" />
                      </div>
                    </div>
                    <div className="w-[20%] hidden md:block" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </section>
  );
};

/* ============ approvals — tiers rows + gate tiles ============ */
const TIERS = [
  { t: 'ask', body: 'Every write and every outward action stops for you.' },
  { t: 'auto', body: 'Writes inside the workspace flow on their own; outward actions still ask.' },
  { t: 'full', body: 'Approvals off for the run. Empirical — you will not like all of it.' },
];

const GATES = ['Reaches the machine', 'Cannot be re-created', 'Leaves the project', 'Acts outward'];

const Approvals = () => (
  <section className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-24 border-t border-white/10" dir="ltr">
    <SectionHead title="Everything is reviewed, by default" kicker="DIFF FIRST · CURSOR ON NO" />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86] uppercase pb-4">Approval tiers</p>
        {TIERS.map((t, i) => (
          <R key={t.t} className="border-b border-white/10">
            <div className="flex items-baseline gap-8 md:gap-12 py-6">
              <span className="font-mono text-sm text-[#F2F2F0] w-20 md:w-28 shrink-0">{t.t === 'ask' ? 'ask · default' : t.t}</span>
              <span className="text-base md:text-lg text-[#B9B9B4] leading-relaxed">{t.body}</span>
            </div>
          </R>
        ))}
      </div>

      <div className="lg:col-span-5">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86] uppercase pb-4">Asks whatever the tier</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GATES.map((g, i) => (
            <R key={g}>
              <div className="rounded-xl border border-white/10 bg-[#111010] p-6 relative overflow-hidden h-full">
                <span
                  aria-hidden="true"
                  className="inline-block w-0 h-0 border-y-[7px] border-y-transparent border-b-[12px] border-b-[#3056F5]"
                />
                <p className="mt-5 text-lg font-medium text-[#F2F2F0] leading-snug">{g}</p>
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#8A8A86] absolute bottom-4 right-5">0{i + 1}</span>
              </div>
            </R>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ============ safety + requirements as tiles (ratings pattern) ============ */
const SAFETY = [
  '.agent/log keeps the whole run — steps, outputs, pushes, timing.',
  'Writes back up before they apply — agent undo returns the file.',
  'Secret files are denied. Never read, never sent, never allowed.',
  'Background promises are refused. Long work gets stations, not hope.',
];

const REQ = ['Bun 1.2+', 'Ollama 0.40+', 'Git bash.exe', 'Chrome or Edge'];

const SafetyStrip = () => {
  const tileBase = 'rounded-xl border border-white/10 bg-[#111010] relative overflow-hidden p-8 md:p-10';

  return (
    <section className="px-6 md:px-10 py-6 max-w-[1600px] w-full mx-auto" dir="ltr">
      <div className="flex flex-col md:flex-row gap-3 items-stretch">
        <div className={`${tileBase} md:w-[49.5%]`} dir="ltr">
          <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86]">WATCH IT · STOP IT · UNDO IT</span>
          <div className="mt-8 flex flex-col gap-5">
            {SAFETY.map((s, i) => (
              <R key={s}>
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-xs text-[#8A8A86] shrink-0">0{i + 1}</span>
                  <p className="text-sm text-[#B9B9B4] leading-relaxed">{s}</p>
                </div>
              </R>
            ))}
          </div>
          <p className="mt-8 font-mono text-[11px] tracking-[0.2em] text-[#8A8A86] uppercase">Ctrl+C cleans mid-write · budget runs out · it stops</p>
        </div>

        <div className={`${tileBase} md:w-[50%] flex flex-col`} dir="ltr">
          <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86]">ON YOUR MACHINE</span>
          <div className="mt-8 flex flex-col">
            {REQ.map((r) => (
              <div key={r} className="flex items-center justify-between border-b border-white/10 py-4 last:border-0">
                <span className="font-mono text-sm text-[#F2F2F0]">{r}</span>
                <span aria-hidden="true" className="font-mono text-xs text-[#8A8A86]">✓</span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-10 flex items-center justify-between">
            <code className="font-mono text-xs text-[#B9B9B4]">bun link → agent doctor</code>
            <ArrowLink href="/contact" title="Request access" />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============ workflow integrations ============ */
const INTEGRATIONS = [
  { src: 'white-notion-logo_svgstack_com_37371793049268.png', alt: 'Notion' },
  { src: 'slack-logo_svgstack_com_31371793049322.png', alt: 'Slack' },
  { src: 'microsoft-excel-logo_svgstack_com_31681793049388.png', alt: 'Microsoft Excel' },
  { src: 'whatsapp-app-symbol_svgstack_com_15461793049449.png', alt: 'WhatsApp' },
  { src: 'telegram-app-icon_svgstack_com_32291793049492.png', alt: 'Telegram' },
];

const Integrations = () => (
  <section className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-24" dir="ltr">
    <SectionHead title="Bring OGI into your workflows" kicker="INTEGRATIONS" />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8"
    >
      {INTEGRATIONS.map((l) => (
        <img key={l.alt} src={A(l.src)} alt={l.alt} title={l.alt} loading="lazy" className="h-9 md:h-10 object-contain" />
      ))}
    </motion.div>
  </section>
);

/* ============ the toolbox — 37 tools graded by blast radius ============ */
const GRADES = [
  { g: 'read', body: 'Read files, search code, map the workspace. The cheap stuff — it flows at auto.', chip: 'FLOWS AT AUTO' },
  { g: 'compute', body: 'Run commands and scripts in the shell. Gated once it can bite.', chip: 'GATED WHEN IT BITES' },
  { g: 'write', body: 'Edit and write files — every change as a diff first, with a backup after.', chip: 'DIFF FIRST' },
  { g: 'outward', body: 'Push to GitHub, open http, anything that leaves the project. Always asks.', chip: 'ALWAYS ASKS' },
];

const ToolsSection = () => (
  <section className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-24" dir="ltr">
    <SectionHead title="37 tools, graded by blast radius" kicker="THE TOOLBOX" />
    <R>
      <p className="max-w-2xl text-sm text-[#9A9A96] leading-relaxed">
        Every tool call is graded — read, compute, write, outward. Heavier effects need stronger tiers, so the agent can do a lot without ever being able to do too much.
      </p>
    </R>
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {GRADES.map((t, i) => (
        <R key={t.g}>
          <div className="rounded-xl border border-white/10 bg-[#111010] p-8 h-full relative overflow-hidden flex flex-col">
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#8A8A86]">0{i + 1}</span>
            <p className="mt-4 font-mono text-lg text-[#F2F2F0]">{t.g}</p>
            <p className="mt-3 text-sm text-[#B9B9B4] leading-relaxed">{t.body}</p>
            <span className="mt-6 font-mono text-[10px] tracking-[0.25em] text-[#8A8A86]">{t.chip}</span>
          </div>
        </R>
      ))}
    </div>
  </section>
);

/* ============ how a factory run goes — numbered hairline steps ============ */
const FACTORY_STEPS = [
  { k: 'brief', v: 'agent factory "…" opens the line — the foreman turns your task into a written brief and a station plan.' },
  { k: 'scout', v: 'A read-only station maps the code first, so nobody works blind.' },
  { k: 'build', v: 'Builder stations take files one by one — edits land as diffs, each with a backup.' },
  { k: 'verify', v: 'The verifier runs checks and probes. A failure loops back to build, not to hope.' },
  { k: 'review', v: "A reviewer weighs the result and can send comments around for another pass." },
  { k: 'gate', v: "Nothing merges until the ship gate passes — and every step lands in the log." },
];

const FactoryWalk = () => (
  <section className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-24 border-t border-white/10" dir="ltr">
    <SectionHead title="How a factory run goes" kicker="BRIEF → BUILD → VERIFY → GATE" />
    {FACTORY_STEPS.map((s, i) => (
      <R key={s.k} className="border-b border-white/10">
        <div className="grid grid-cols-[64px_1fr] md:grid-cols-[64px_220px_1fr] md:items-baseline gap-x-6 md:gap-x-10 gap-y-2 py-7">
          <span className="font-mono text-xs text-[#8A8A86]">0{i + 1}</span>
          <span className="font-mono text-sm text-[#F2F2F0] uppercase tracking-[0.2em]">{s.k}</span>
          <span className="text-lg md:text-xl text-[#B9B9B4] leading-relaxed">{s.v}</span>
        </div>
      </R>
    ))}
  </section>
);

/* ============ closing CTA ============ */
const CTA = () => (
  <section className="border-t border-white/10" dir="ltr">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-28 md:py-36 text-center">
      <MaskText className="font-semibold tracking-tight text-[clamp(2.6rem,8vw,7rem)] text-[#F2F2F0]">
        <span>Hand over the boring parts.</span>
      </MaskText>
      <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
        <LiquidButton className="bg-white rounded-full px-8 py-4 cursor-pointer group uppercase text-sm tracking-wide text-black">
          <Link
            to="/contact"
            className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-black"
          >
            Request access
          </Link>
          <ArrowUpRight className="w-4 h-4 relative z-[10]" />
        </LiquidButton>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-sm text-[#9A9A96] hover:text-white border-b border-white/20 hover:border-white transition-colors"
        >
          or write us directly
        </a>
      </div>
    </div>
  </section>
);

/* ============ terminal-agent band — github pill + showcase window ============ */
const GITHUB_URL = 'https://github.com/';

const TerminalAgent = () => (
  <section className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-24" dir="ltr">
    <div className="relative rounded-2xl border border-[#3f3f3f] bg-[#1c1c1c] overflow-hidden grid grid-cols-1 md:grid-cols-[43%_57%]">
      <div className="p-10 md:p-12 flex flex-col justify-center">
        <R>
          <h2 className="text-[clamp(1.6rem,2.45vw,2.85rem)] font-medium text-[#F2F2F0] tracking-tight leading-tight">
            Terminal–Agent, AI–powered
          </h2>
          <p className="mt-6 max-w-lg text-base md:text-lg text-[#A8A8A4] leading-relaxed">
            Work with OGI around your codebase from the terminal. Turn ideas into working
            software – from building and debugging to shipping.
          </p>
        </R>
        <div className="mt-20 md:mt-32 flex justify-center">
          <R>
            <span className="group rounded-full border border-white/25 p-[6px] shadow-[0_14px_44px_rgba(242,242,240,0.08)] transition-colors duration-500 hover:border-white/50">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-5 rounded-full bg-[#F2F2F0] text-black pl-9 pr-12 py-[18px] transition-transform duration-500 hover:-translate-y-1"
              >
                <ArrowUpLeft className="w-6 h-6" strokeWidth={2} />
                <span className="font-semibold text-xl md:text-2xl whitespace-nowrap">Github / Repo</span>
              </a>
            </span>
          </R>
        </div>
      </div>

      <div className="p-3 md:p-6 lg:p-9">
        <img
          src={A('beforeffooter.png')}
          alt="OGI Agent terminal writing a python game of life — plan, diffs and approvals live in the TUI"
          loading="lazy"
          className="block w-full h-auto object-contain rounded-xl md:rounded-2xl"
        />
      </div>

      {/* divider floats free between the text column and the image, touching neither */}
      <div aria-hidden="true" className="hidden md:block absolute left-[43%] top-8 bottom-8 z-10 w-px pointer-events-none">
        <span className="absolute inset-y-0 left-0 border-l border-dashed border-white/25" />
        <span className="absolute -top-[22px] -left-[6px] font-mono text-lg leading-none text-white/40 select-none">+</span>
        <span className="absolute -bottom-[22px] -left-[6px] font-mono text-lg leading-none text-white/40 select-none">+</span>
      </div>
    </div>
  </section>
);

/* halftone wordmark footer — real links only */
const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/products', label: 'OGI Agent' },
      { href: '/contact', label: 'Request Access' },
      { href: '/projects', label: 'Client Work' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { href: '/', label: 'Home' },
      { href: '/projects', label: 'Projects' },
      { href: '/blog', label: 'Blog' },
      { href: '/about', label: 'About' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
      { href: '/contact', label: 'Start a Project' },
    ],
  },
];

export default function Products() {
  return (
    <div className="v9-scope bg-[#0a0807] min-h-screen text-[#F2F2F0] font-body antialiased overflow-x-hidden">
      <PageLoader
        label="ogi agent"
        critical={[A('main.png'), A('Featur1.png'), A('Featur2.png')]}
        warm={[A('beforeffooter.png')]}
      />
      <Ver9Header />
      <main>
        <Hero />
        <BuildClaim />
        <EngineeringRow />
        <CommandsRow />
        <MarqueeBand />
        <RunsLocal />
        <WorkModes />
        <ToolsSection />
        <FactoryWalk />
        <Approvals />
        <SafetyStrip />
        <Integrations />
        <CTA />
        <TerminalAgent />
      </main>
      <HalftoneWordmarkFooter
        wordmark="ogi agent"
        label="Software DevLabs"
        meta="©2026 · OGI Agent — Runs on your machine"
        columns={FOOTER_COLUMNS}
      />
    </div>
  );
}
