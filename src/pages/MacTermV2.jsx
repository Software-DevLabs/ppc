import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowUpLeft, ArrowUpRight, Github, Grid2x2, Sparkles } from 'lucide-react';
import HalftoneWordmarkFooter from '@/components/halftone/HalftoneWordmarkFooter';
import HoverPlayCard from '@/components/macterm/HoverPlayCard';
import PageLoader from '@/components/warmup/PageLoader';
import MaskText from '@/components/ver10/MaskText';
import RoundTag from '@/components/ver10/RoundTag';
import VelocityMarquee from '@/components/ver10/VelocityMarquee';
import { CONTACT_EMAIL } from '@/lib/site';

const VIDEO_URL = import.meta.env.VITE_MACTERM_VIDEO_URL || '/macterm/overview.mp4';
const M = (name) => `/macterm/${name}`;

const REPO = 'https://github.com/Software-DevLabs/terminal';

/* minimal brand bar — logo mark + wordmark, single github icon */
const BrandBar = () => (
  <header className="absolute inset-x-0 top-0 z-[90]">
    <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
      <a href="/" className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Software DevLabs"
          className="h-7 w-7 md:h-8 md:w-8 object-contain"
        />
        <span className="text-sm md:text-base font-medium tracking-tight text-[#F2F2F0]">
          Software DevLabs
        </span>
      </a>
      <a
        href={REPO}
        target="_blank"
        rel="noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#F2F2F0] transition-colors duration-300 hover:border-white/60 hover:bg-white/5"
        aria-label="Github"
      >
        <Github className="h-4 w-4" strokeWidth={1.75} />
      </a>
    </div>
  </header>
);

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

/* template "from side" reveal — content slides in horizontally on scroll-into-view */
const SlideIn = ({ from = 'left', children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, x: from === 'left' ? -56 : 56 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={VIEW}
    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* template TextHover — label rolls up out of a mask while its twin rolls in */
const Roll = ({ children }) => (
  <span className="relative block overflow-hidden align-bottom">
    <span className="block transition-transform duration-500 ease-in-out group-hover:-translate-y-[110%]">
      {children}
    </span>
    <span className="absolute inset-0 translate-y-[110%] transition-transform duration-500 ease-in-out group-hover:translate-y-0">
      {children}
    </span>
  </span>
);

/* ochi sheet system — opaque rounded-top panels climbing a z-ladder;
   each new sheet slithers up over the previous one, footer is the last sheet */
const Sheet = ({ z, tone, className = '', children }) => (
  <section
    className={`relative w-full rounded-t-[24px] -mt-[24px] pb-20 md:pb-28 ${className}`}
    style={{ zIndex: z, backgroundColor: tone }}
  >
    {children}
  </section>
);

const Shell = ({ children, className = '' }) => (
  <div className={`max-w-[1600px] w-full mx-auto px-6 md:px-10 ${className}`}>{children}</div>
);

/* framer port of the template's locomotive parallax — element drifts
   across its full viewport pass while scrollYProgress runs 0 -> 1 */
const Drift = ({ children, from = 0, to = -60, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

/* media frame — static, no hover zoom */
const ZoomFrame = ({ src, alt, className = '' }) => (
  <div className={className}>
    <div className="rounded-2xl overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block w-full h-auto"
      />
    </div>
  </div>
);

const SectionHead = ({ title, kicker }) => (
  <div className="border-b border-white/10 pb-8 mb-14 flex items-end justify-between">
    <MaskText className="text-3xl md:text-5xl font-medium text-[#F2F2F0]">
      <span>{title}</span>
    </MaskText>
    <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86] hidden md:block">{kicker}</span>
  </div>
);

/* sticky pinned hero — later sheets bury it as they scroll over */
const HERO = () => (
  <section
    className="sticky top-0 flex min-h-[92svh] flex-col justify-center px-6 md:px-10 pt-32 pb-20"
    style={{ zIndex: 0 }}
  >
    <div className="max-w-[1600px] w-full mx-auto">
      <R>
        <p className="font-mono text-xs tracking-[0.4em] uppercase text-[#9A9A96]">MacTerm</p>
        <h1 className="mt-6 text-[clamp(2.6rem,6.5vw,6rem)] font-medium leading-[1.05] text-[#F2F2F0] tracking-tight">
          <span className="block">Terminal Mac, Tmux</span>
          <span className="flex flex-wrap items-center gap-x-5">
            For Windows
            {/* template hero move — inline image chip pops open inside the headline */}
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.9, ease: [0.86, 0, 0.07, 0.995] }}
              className="overflow-hidden"
              aria-hidden="true"
            >
              <img
                src={M('bluetex.png')}
                className="block h-[0.68em] w-[1.7em] rounded-full border border-white/25 object-cover"
              />
            </motion.span>
          </span>
        </h1>
      </R>
      <R>
        <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-[#A8A8A4]">
          A macOS-style terminal for Windows with real tabs, tmux-style panes, themes,
          and a built-in code workspace.
        </p>
      </R>
    </div>
    <div className="absolute bottom-14 right-6 md:right-10 h-7 w-40 overflow-hidden" aria-hidden="true">
      <motion.p
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: '100%', opacity: 0.5 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: [0.3, 0.86, 0.36, 0.95] }}
        className="font-mono text-xs uppercase tracking-[0.35em] text-[#9A9A96]"
      >
        scroll down
      </motion.p>
    </div>
  </section>
);

const Claim = () => (
  <div className="py-16 md:py-24">
    <R>
      <h2 className="mx-auto max-w-5xl text-center text-[clamp(1.8rem,4vw,3.4rem)] font-medium leading-tight text-[#F2F2F0] tracking-tight">
        The best way to manage CLI working
      </h2>
    </R>
  </div>
);

const SplitTerminal = () => (
  <section className="pb-24">
    <div className="grid grid-cols-1 md:grid-cols-[43%_57%] gap-10 items-center">
      <SlideIn from="left" className="order-2 md:order-1">
        <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-[#F2F2F0]">
          Split-Screen Terminal
        </h3>
        <p className="mt-5 max-w-md text-base md:text-lg leading-relaxed text-[#A8A8A4]">
          Split the terminal horizontally or vertically to run multiple shell sessions
          side by side, with resizable panes, nested layouts, and quick keyboard
          navigation.
        </p>
      </SlideIn>
      <SlideIn from="right" className="order-1 md:order-2">
        <ZoomFrame
          src={M('featur1.png')}
          alt="macterm split into three panes — one on the left, two stacked on the right"
        />
      </SlideIn>
    </div>
  </section>
);

const CodeWorkspace = () => (
  <section>
    <div className="grid grid-cols-1 md:grid-cols-[57%_43%] gap-10 items-center">
      <SlideIn from="left">
        <ZoomFrame
          src={M('Featur2.png')}
          alt="the macterm code workspace — file explorer beside a CodeMirror editor over the shell's cwd"
        />
      </SlideIn>
      <SlideIn from="right">
        <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-[#F2F2F0]">
          Switch Fast to code workspace
        </h3>
        <p className="mt-5 max-w-md text-base md:text-lg leading-relaxed text-[#A8A8A4]">
          Press Shift + Alt + W to switch instantly from your terminal to a built-in
          code workspace, where you can browse project files, edit code, and search
          across your project without leaving macterm.
        </p>
      </SlideIn>
    </div>
  </section>
);

const API = [
  ['/health', 'GET', 'Host version and live session summary'],
  ['/config', 'GET', 'Runtime config and machine identity'],
  ['/pty', 'WS', 'Shell I/O, resize, clear-history, kill'],
  ['/workspace/system', 'POST', 'Elevated state and elevation capability'],
  ['/workspace/list · read · write', 'POST', 'Filesystem work inside the workspace root'],
  ['/workspace/find · search', 'POST', 'Filename filter and content search'],
  ['/workspace/elevate', 'POST', 'Relaunch through the Windows UAC prompt'],
];

const ApiSurface = () => (
  <section className="pb-24">
    <SectionHead title="Local API surface" kicker="SAME TOKEN, EVERY ROUTE" />
    <div className="border-t border-white/10">
      {API.map(([path, method, what]) => (
        <div
          key={path}
          className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-8 py-5 border-b border-white/10"
        >
          <span className="font-mono text-sm md:text-base text-[#F2F2F0]">{path}</span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#8A8A86] uppercase w-16">
            {method}
          </span>
          <span className="text-sm md:text-base text-[#A8A8A4] md:flex-1 md:text-right">{what}</span>
        </div>
      ))}
    </div>
  </section>
);

const LIMITS = [
  ['2,000', 'entries per directory listing'],
  ['2 MB / 8 MB', 'file preview / file save ceiling'],
  ['500 hits · 30,000 files', 'content search, 8 s budget'],
  ['10,000', 'lines of scrollback kept by xterm'],
];

const Limits = () => (
  <section>
    <SectionHead title="Bounded by design" kicker="HARD CAPS FROM THE README" />
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {LIMITS.map(([n, l]) => (
        <div key={n} className="rounded-xl border border-white/10 bg-[#151515] p-6">
          <p className="font-mono text-xl md:text-2xl text-[#F2F2F0]">{n}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#A8A8A4]">{l}</p>
        </div>
      ))}
    </div>
  </section>
);

const CHORDS = [
  'ctrl + shift + e',
  'ctrl + shift + o',
  'alt + ←',
  'shift + alt + w',
  'ctrl + shift + k',
  'ctrl + shift + l',
  'ctrl + ,',
];

const HIGHLIGHTS = [
  {
    k: '01',
    title: 'Terminal',
    tag: 'ConPTY',
    body: 'Real Windows shells through ConPTY, hosted by a local Node process — every pane is a real PowerShell or cmd.exe. xterm.js 6 with WebGL rendering, Unicode 11 widths, WebLinks and search. Ctrl + Shift + K clears the screen and the replay buffer, so cleared output never comes back. Layout, tabs, panes, per-pane cwd, theme and font size survive restarts.',
  },
  {
    k: '02',
    title: 'Window & tabs',
    tag: 'Frameless',
    body: 'A frameless native window with macOS traffic lights and rounded corners. Drag the titlebar to move, double-click to zoom. Tabs carry live shell titles, pane-count badges and middle-click close; unfocused windows dim the traffic lights instead of hiding them, and the chrome switches light or dark with the active theme.',
  },
  {
    k: '03',
    title: 'Panes',
    tag: 'tmux-style',
    body: 'Split right or down, then split again in any direction to build nested layouts. Drag handles to resize — proportions stay normalized on window resize. Alt + Arrow moves focus to the nearest pane in that direction, with focus cycling, pane zoom, equalize and close-pane commands built in.',
  },
  {
    k: '04',
    title: 'Settings & themes',
    tag: 'Basic · Homebrew',
    body: 'Two built-in themes — Basic (light) and Homebrew (dark) — cycled with Ctrl + Shift + L. Window transparency steps from 100% down to 30% with Alt + = and Alt + -, fading the whole window while text stays opaque. The settings panel on Ctrl + , includes a shortcut recorder that rejects bare keys and duplicates and can reset actions to their defaults.',
  },
  {
    k: '05',
    title: 'Administrator mode',
    tag: 'UAC',
    body: 'The titlebar shield relaunches the installed app through the Windows UAC prompt. After elevation, macterm reopens with the layout and workspace state preserved. The shield only appears when the app can actually elevate itself.',
  },
];

const Highlights = () => {
  const [open, setOpen] = useState(0);
  return (
    <section className="pb-24">
      <SectionHead title="Highlights" kicker="WHAT A DAILY TERMINAL NEEDS" />
      <div>
        {HIGHLIGHTS.map((h, i) => (
          <div key={h.title} className="border-b border-white/10">
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center gap-5 md:gap-7 py-6 text-left group"
            >
              <span className="font-mono text-xs text-[#8A8A86]">{h.k}</span>
              <span className="flex-1 text-2xl md:text-3xl font-medium text-[#F2F2F0] tracking-tight">
                <Roll>{h.title}</Roll>
              </span>
              <span className="hidden md:block">
                <RoundTag title={h.tag} />
              </span>
              <span
                className={`w-9 h-9 shrink-0 rounded-full border border-white/15 flex items-center justify-center text-lg text-[#A8A8A4] transition-all duration-300 ${
                  open === i ? 'rotate-45 border-white/40 text-[#F2F2F0]' : ''
                }`}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-8 pl-9 md:pl-[4.25rem] max-w-3xl text-base md:text-lg leading-relaxed text-[#A8A8A4]">
                    {h.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

const SHORTCUT_GROUPS = [
  {
    title: 'Tabs',
    items: [
      ['Ctrl + Shift + T', 'New tab'],
      ['Ctrl + Shift + W', 'Close active tab'],
      ['Ctrl + Alt + Left / Right', 'Previous / next tab'],
      ['Middle click', 'Close that tab'],
    ],
  },
  {
    title: 'Panes',
    items: [
      ['Ctrl + Shift + E', 'Split right'],
      ['Ctrl + Shift + O', 'Split down'],
      ['Alt + Arrows', 'Focus the nearest pane'],
      ['Ctrl + Shift + Space', 'Cycle focus'],
      ['Ctrl + Shift + Z', 'Zoom the active pane'],
      ['Ctrl + Shift + U', 'Equalize pane sizes'],
      ['Ctrl + Shift + X', 'Close the active pane'],
    ],
  },
  {
    title: 'Terminal & appearance',
    items: [
      ['Ctrl + Shift + F', 'Find in scrollback'],
      ['Ctrl + Shift + K', 'Clear screen + scrollback'],
      ['Ctrl + Shift + L', 'Cycle themes'],
      ['Ctrl + Shift + = / - / 0', 'Font size up / down / reset'],
      ['Alt + = / -', 'Window transparency'],
      ['Ctrl + ,', 'Open settings'],
      ['Ctrl + Shift + H', 'Shortcut sheet'],
    ],
  },
  {
    title: 'Workspace',
    items: [
      ['Shift + Alt + W', 'Open / close the workspace'],
      ['Ctrl + S', 'Save the active file'],
      ['Ctrl + Shift + F', 'Search file contents'],
      ['Enter / Shift + Enter', 'Find bar — next / previous'],
      ['Esc', 'Close the find bar'],
    ],
  },
];

const Shortcuts = () => (
  <section>
    <SectionHead title="Keyboard shortcuts" kicker="DEFAULTS — REBIND IN CTRL + ," />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
      {SHORTCUT_GROUPS.map((g) => (
        <div key={g.title} className="py-8 border-b border-white/10">
          <h4 className="font-mono text-xs tracking-[0.3em] uppercase text-[#8A8A86]">
            {g.title}
          </h4>
          <ul className="mt-5">
            {g.items.map(([key, label]) => (
              <li
                key={key + label}
                className="flex items-baseline justify-between gap-6 py-2.5 border-b border-white/5 last:border-0"
              >
                <span className="font-mono text-sm text-[#F2F2F0] whitespace-nowrap">{key}</span>
                <span className="text-sm text-[#A8A8A4] text-right">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

/* second velocity strip — the chords ride by full-bleed under the shortcuts */
const ChordMarquee = () => (
  <div className="mt-24 border-t border-white/10 py-12 overflow-hidden" dir="ltr">
    <VelocityMarquee baseVelocity={2}>
      <span className="flex items-center gap-10 pr-10 whitespace-nowrap font-mono text-[5.5vw] md:text-[3.4vw] leading-none tracking-tight text-[#cfcfcf]">
        {CHORDS.map((c) => (
          <React.Fragment key={c}>
            {c}
            <Sparkles className="w-7 h-7 shrink-0 text-[#2E5BFF]" strokeWidth={1.5} />
          </React.Fragment>
        ))}
      </span>
    </VelocityMarquee>
  </div>
);

const FACTS = [
  ['Runs', 'PowerShell and cmd.exe as real ConPTY sessions'],
  ['Renders', 'xterm.js 6 — WebGL, Unicode 11, search, WebLinks'],
  ['Follows', 'OSC 7 — new panes, tabs and the workspace open in your cwd'],
  ['Stack', 'Tauri 2 · React 19 · CodeMirror 6 · local Node host'],
];

const RunsReal = () => (
  <section className="pb-24">
    <MaskText className="max-w-4xl text-[clamp(1.8rem,3.6vw,3.1rem)] font-medium leading-tight text-[#F2F2F0] tracking-tight">
      <span>
        Every pane is a real shell. macterm is not a mock — it runs PowerShell and
        cmd.exe through ConPTY, hosted by a local Node process on your machine.
      </span>
    </MaskText>
    <div className="mt-14 border-t border-white/10">
      {FACTS.map(([k, v], i) => (
        <div
          key={k}
          className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 py-6 border-b border-white/10"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8A8A86]">
            {`${String(i + 1).padStart(2, '0')} · ${k}`}
          </span>
          <span className="text-base md:text-lg text-[#F2F2F0]">{v}</span>
        </div>
      ))}
    </div>
  </section>
);

const STATS = [
  ['2', 'built-in themes — Basic & Homebrew'],
  ['30%', 'minimum window opacity, stepped by 5%'],
  ['0.1.0', 'current release — actively developed'],
  ['127.0.0.1', 'the only address the host answers on'],
];

/* template Archive card — masked numbers on raised tiles */
const Stats = () => (
  <section className="pb-24">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {STATS.map(([n, l]) => (
        <div
          key={n}
          className="rounded-xl border border-white/10 bg-[#171717] p-8 relative overflow-hidden"
        >
          <MaskText className="text-5xl md:text-[3.4rem] font-medium text-[#F2F2F0] tracking-tight">
            <span>{n}</span>
          </MaskText>
          <p className="mt-4 text-sm leading-relaxed text-[#A8A8A4]">{l}</p>
        </div>
      ))}
    </div>
  </section>
);

const SECURITY = [
  ['Loopback only', 'The host binds 127.0.0.1 — never reachable from the network'],
  ['Per-launch token', 'Every /pty and /workspace request needs the launch token'],
  ['Origin gate', 'Browser requests must come from 127.0.0.1 or localhost'],
  ['Containment', 'Workspace paths resolve under the root — escaping symlinks are rejected'],
  ['Bounded work', 'Size and time caps on listings, reads, writes and searches'],
];

const Security = () => (
  <section className="pb-24">
    <SectionHead title="Locked to your machine" kicker="SECURITY MODEL" />
    <div className="border-t border-white/10">
      {SECURITY.map(([k, v], i) => (
        <div
          key={k}
          className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 py-6 border-b border-white/10"
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8A8A86]">
            {`${String(i + 1).padStart(2, '0')} · ${k}`}
          </span>
          <span className="text-base md:text-lg text-[#F2F2F0]">{v}</span>
        </div>
      ))}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 py-6">
        <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#8A8A86]">
          Requires
        </span>
        <span className="text-base md:text-lg text-[#F2F2F0]">
          Windows 10 · 11 — Node 24 — Bun 1.x — WebView2 runtime
        </span>
      </div>
    </div>
  </section>
);

const GetStarted = () => (
  <section>
    <SectionHead title="Get started" kicker="FROM SOURCE — BUN 1.X" />
    <div className="flex flex-wrap gap-4">
      {['bun install', 'bun run dev'].map((cmd) => (
        <span
          key={cmd}
          className="rounded-xl border border-white/15 bg-[#111010] px-6 py-4 font-mono text-base md:text-lg text-[#F2F2F0]"
        >
          {cmd}
        </span>
      ))}
    </div>
    <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-[#A8A8A4]">
      The NSIS installer bundles the Node runtime, so the installed app needs no Node
      on the target machine. It is unsigned — SmartScreen may ask on first launch.
    </p>
    <div className="mt-8">
      <a href={`${REPO}/releases`} target="_blank" rel="noreferrer" className="group w-fit flex items-center gap-1.5">
        <span className="rounded-[50px] border border-white/25 group-hover:bg-[#F2F2F0] py-1 px-3 transition-colors duration-300">
          <span className="text-xs font-normal text-[#B9B9B4] group-hover:text-black uppercase transition-colors duration-300 whitespace-nowrap">
            Grab the installer
          </span>
        </span>
        <span className="w-[30px] h-[30px] hidden sm:flex items-center justify-center border border-white/25 rounded-[50px] group-hover:bg-[#F2F2F0] transition-all duration-300 scale-0 group-hover:scale-100">
          <ArrowUpRight strokeWidth={1.5} className="w-4 h-4 text-[#F2F2F0] group-hover:text-black transition-colors duration-300" />
        </span>
      </a>
    </div>
  </section>
);

const Overview = () => (
  <Shell>
    <R>
      <h2 className="text-center text-[clamp(1.8rem,4vw,3.4rem)] font-medium leading-tight text-[#F2F2F0] tracking-tight">
        Overview
      </h2>
    </R>
    <Drift from={40} to={-40} className="mt-12 md:mt-16">
      <div className="mx-auto max-w-6xl rounded-2xl overflow-hidden">
        <div
          className="p-4 md:p-8 lg:p-12 bg-cover bg-center"
          style={{ backgroundImage: `url(${M('bluetex.png')})` }}
        >
          <HoverPlayCard
            src={VIDEO_URL}
            className="rounded-xl md:rounded-2xl"
          />
        </div>
      </div>
    </Drift>
  </Shell>
);

const BAND_LINES = [
  'Quick access with Shift + Alt + W',
  'Built-in file explorer',
  'Code editor with syntax highlighting',
  'Fast project-wide search',
];

const Pill = ({ href, icon: Icon, label }) => (
  <span className="group rounded-full border border-white/40 p-[5px] shadow-[0_14px_44px_rgba(242,242,240,0.1)] transition-colors duration-300 hover:border-white/70">
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-4 rounded-full bg-[#F2F2F0] text-black pl-8 pr-10 py-[13px] transition-transform duration-300 hover:-translate-y-1"
    >
      <Icon className="w-6 h-6" strokeWidth={2} />
      <span className="font-semibold text-xl md:text-2xl whitespace-nowrap">{label}</span>
    </a>
  </span>
);

const FluencyBand = () => (
  <Shell>
    <div className="relative rounded-2xl border border-[#3f3f3f] bg-[#1c1c1c] overflow-hidden grid grid-cols-1 md:grid-cols-[57%_43%]">
      <SlideIn from="left">
        <div className="p-2 md:p-3 h-full">
          <div className="h-full rounded-xl overflow-hidden">
            <img
              src={M('beforefooter.png')}
              alt="macterm running three live PowerShell panes split right and down, on a blue backdrop"
              loading="lazy"
              className="block w-full h-full object-cover"
            />
          </div>
        </div>
      </SlideIn>

      <div className="hidden md:block absolute left-[57%] top-6 bottom-6 z-10 w-px pointer-events-none">
        <span className="absolute inset-y-0 left-0 w-px border-l border-dashed border-white/30" />
        <span className="absolute -top-3 -left-[6px] font-mono text-lg text-white/50">+</span>
        <span className="absolute -bottom-3 -left-[6px] font-mono text-lg text-white/50">+</span>
      </div>

      <SlideIn from="right">
        <div className="p-8 md:p-10 lg:p-12 flex flex-col h-full">
          <h3 className="text-[clamp(2rem,2.9vw,3.1rem)] font-medium tracking-tight leading-[1.12] text-[#F2F2F0]">
            Terminal–Fluency, Fast your working
          </h3>
          <ul className="mt-6 space-y-2.5 text-lg md:text-xl text-[#F2F2F0]">
            {BAND_LINES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-auto pt-10 flex flex-wrap justify-center gap-5">
            <Pill href={`${REPO}/releases`} icon={Grid2x2} label="Download" />
            <Pill href={REPO} icon={ArrowUpLeft} label="Github / Repo" />
          </div>
        </div>
      </SlideIn>
    </div>
  </Shell>
);

/* template Ready.tsx — full-viewport final CTA sheet; a giant outline
   wordmark drifts -700px across the sheet as it scrolls past */
const Ready = () => (
  <Sheet z={55} tone="#1a1a1a" className="pb-0">
    <div className="relative min-h-[92svh] flex flex-col justify-center overflow-hidden">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <Drift from={140} to={-700}>
          <span
            className="block text-[24vw] leading-none font-medium tracking-tight text-transparent"
            style={{ WebkitTextStroke: '1.5px rgba(242,242,240,0.09)' }}
          >
            macterm
          </span>
        </Drift>
      </div>
      <Shell className="relative">
        <MaskText className="text-[clamp(2.8rem,8vw,7.5rem)] font-medium leading-[1.02] text-[#F2F2F0] tracking-tight">
          <span>Ready to run</span>
        </MaskText>
        <MaskText className="text-[clamp(2.8rem,8vw,7.5rem)] font-medium leading-[1.02] text-[#F2F2F0] tracking-tight">
          <span>macterm?</span>
        </MaskText>
        <div className="mt-12 flex flex-wrap gap-5">
          <Pill href={`${REPO}/releases`} icon={Grid2x2} label="Download" />
          <Pill href={REPO} icon={ArrowUpLeft} label="Github / Repo" />
        </div>
      </Shell>
    </div>
  </Sheet>
);

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'MacTerm', href: '/macterm' },
      { label: 'Request Access', href: '/contact' },
      { label: 'Client Work', href: '/projects' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      { label: 'Start a Project', href: '/contact' },
    ],
  },
];

export default function MacTermV2() {
  return (
    <div dir="ltr" className="bg-[#0a0807] text-[#F2F2F0] min-h-screen">
      <PageLoader
        label="macterm"
        critical={[M('main.png'), M('featur1.png'), M('Featur2.png')]}
        video={VIDEO_URL}
        warm={[M('beforefooter.png'), M('bluetex.png')]}
      />
      <BrandBar />
      <main>
        <HERO />

        {/* sheet 1 — hero image, claim, feature rows */}
        <Sheet z={10} tone="#0d0d0d" className="pt-16 md:pt-20">
          <Shell>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={M('main.png')}
                alt="macterm windows on a blue backdrop — split panes on the left, the agent session writing game_of_life.py in front"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                className="block w-full h-auto"
              />
            </div>
          </Shell>
          <Shell>
            <Claim />
            <SplitTerminal />
            <CodeWorkspace />
          </Shell>
        </Sheet>

        {/* sheet 2 — velocity-reactive marquee band */}
        <Sheet z={20} tone="#141414" className="pb-0">
          <div className="py-16 md:py-24 border-y border-white/10 overflow-hidden" dir="ltr">
            <VelocityMarquee baseVelocity={2.5}>
              <span className="flex items-center gap-12 pr-12 whitespace-nowrap text-[17vw] md:text-[12vw] leading-[0.95] font-medium tracking-tight text-[#F2F2F0]">
                macterm
                <Sparkles className="w-[6vw] h-[6vw] shrink-0 text-[#2E5BFF]" strokeWidth={1.5} />
                real conpty shells
                <Sparkles className="w-[6vw] h-[6vw] shrink-0 text-[#2E5BFF]" strokeWidth={1.5} />
              </span>
            </VelocityMarquee>
          </div>
        </Sheet>

        {/* sheet 3 — highlights accordion + shortcuts ledger + chord strip */}
        <Sheet z={30} tone="#0c0c0c" className="pt-16 md:pt-20">
          <Shell>
            <Highlights />
            <Shortcuts />
          </Shell>
          <ChordMarquee />
        </Sheet>

        {/* sheet 4 — overview video, drifting across the viewport pass */}
        <Sheet z={35} tone="#101010" className="pt-16 md:pt-24">
          <Overview />
        </Sheet>

        {/* sheet 5 — under the hood: api surface, hard limits */}
        <Sheet z={40} tone="#0d0d0d" className="pt-16 md:pt-20">
          <Shell>
            <ApiSurface />
            <Limits />
          </Shell>
        </Sheet>

        {/* sheet 6 — real shells, stats, security, get started */}
        <Sheet z={45} tone="#131313" className="pt-16 md:pt-20">
          <Shell>
            <RunsReal />
            <Stats />
            <Security />
            <GetStarted />
          </Shell>
        </Sheet>

        {/* sheet 7 — terminal fluency feature row */}
        <Sheet z={50} tone="#161616" className="pt-16 md:pt-20">
          <FluencyBand />
        </Sheet>

        {/* sheet 8 — full-viewport ready CTA with the drifting wordmark */}
        <Ready />

        {/* footer — final sheet, rises from behind ready */}
        <div
          className="relative z-[70] rounded-t-[24px] overflow-hidden -mt-[24px]"
          style={{ backgroundColor: '#0a0807' }}
        >
          <HalftoneWordmarkFooter
            wordmark="macterm"
            label="Software DevLabs"
            meta="©2026 · MacTerm — Terminal Mac, Tmux for Windows"
            columns={FOOTER_COLUMNS}
          />
        </div>
      </main>
    </div>
  );
}
