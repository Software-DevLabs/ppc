import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpLeft, ArrowUpRight, Github, Grid2x2 } from 'lucide-react';
import HalftoneWordmarkFooter from '@/components/halftone/HalftoneWordmarkFooter';
import HoverPlayCard from '@/components/macterm/HoverPlayCard';
import PageLoader from '@/components/warmup/PageLoader';
import MaskText from '@/components/ver10/MaskText';
import RoundTag from '@/components/ver10/RoundTag';
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
        <Github className="w-4 h-4" strokeWidth={1.75} />
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

const SectionHead = ({ title, kicker }) => (
  <div className="border-b border-white/10 pb-8 mb-14 flex items-end justify-between">
    <MaskText className="text-3xl md:text-5xl font-medium text-[#F2F2F0]">
      <span>{title}</span>
    </MaskText>
    <span className="font-mono text-[11px] tracking-[0.3em] text-[#8A8A86] hidden md:block">{kicker}</span>
  </div>
);

const HERO = () => (
  <section className="pt-40 pb-16">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
      <R>
        <p className="font-mono text-xs tracking-[0.4em] uppercase text-[#9A9A96]">MacTerm</p>
        <h1 className="mt-6 text-[clamp(2rem,4.4vw,3.9rem)] font-medium leading-[1.15] text-[#F2F2F0] tracking-tight">
          Terminal Mac, Tmux
          <br />
          For Windows
        </h1>
      </R>

      <div className="relative mt-12">
        <R>
          <div className="rounded-2xl overflow-hidden">
            <img
              src={M('main.png')}
              alt="macterm windows on a blue backdrop — split panes on the left, the agent session writing game_of_life.py in front"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </R>
      </div>
    </div>
  </section>
);

const Claim = () => (
  <section className="py-20 md:py-28">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
      <R>
        <h2 className="mx-auto max-w-5xl text-center text-[clamp(1.8rem,4vw,3.4rem)] font-medium leading-tight text-[#F2F2F0] tracking-tight">
          The best way to manage CLI working
        </h2>
      </R>
    </div>
  </section>
);

const SplitTerminal = () => (
  <section className="pb-24">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-[43%_57%] gap-10 items-center">
        <R className="order-2 md:order-1">
          <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-[#F2F2F0]">
            Split-Screen Terminal
          </h3>
          <p className="mt-5 max-w-md text-base md:text-lg leading-relaxed text-[#A8A8A4]">
            Split the terminal horizontally or vertically to run multiple shell sessions
            side by side, with resizable panes, nested layouts, and quick keyboard
            navigation.
          </p>
        </R>
        <R className="order-1 md:order-2">
          <div className="rounded-2xl overflow-hidden">
            <img
              src={M('featur1.png')}
              alt="macterm split into three panes — one on the left, two stacked on the right"
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </R>
      </div>
    </div>
  </section>
);

const CodeWorkspace = () => (
  <section className="pb-24">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-[57%_43%] gap-10 items-center">
        <R>
          <div className="rounded-2xl overflow-hidden">
            <img
              src={M('Featur2.png')}
              alt="the macterm code workspace — file explorer beside a CodeMirror editor over the shell's cwd"
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </R>
        <R>
          <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-[#F2F2F0]">
            Switch Fast to code workspace
          </h3>
          <p className="mt-5 max-w-md text-base md:text-lg leading-relaxed text-[#A8A8A4]">
            Press Shift + Alt + W to switch instantly from your terminal to a built-in
            code workspace, where you can browse project files, edit code, and search
            across your project without leaving macterm.
          </p>
        </R>
      </div>
    </div>
  </section>
);

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
      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
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
                  {h.title}
                </span>
                <span className="hidden md:block">
                  <RoundTag title={h.tag} />
                </span>
                <span
                  className={`w-9 h-9 shrink-0 rounded-full border border-white/15 flex items-center justify-center text-lg text-[#A8A8A4] transition-transform duration-300 ${
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
  <section className="pb-24">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
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
    </div>
  </section>
);

const FACTS = [
  ['Runs', 'PowerShell and cmd.exe as real ConPTY sessions'],
  ['Renders', 'xterm.js 6 — WebGL, Unicode 11, search, WebLinks'],
  ['Follows', 'OSC 7 — new panes, tabs and the workspace open in your cwd'],
  ['Stack', 'Tauri 2 · React 19 · CodeMirror 6 · local Node host'],
];

const RunsReal = () => (
  <section className="pb-24">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
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
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
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
    </div>
  </section>
);

const GetStarted = () => (
  <section className="pb-24">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
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
    </div>
  </section>
);

const Overview = () => (
  <section className="pb-24">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
      <R>
        <h2 className="text-center text-[clamp(1.8rem,4vw,3.4rem)] font-medium leading-tight text-[#F2F2F0] tracking-tight">
          Overview
        </h2>
      </R>
      <R className="mt-12 md:mt-16">
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
      </R>
    </div>
  </section>
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
  <section className="pb-24">
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
      <div className="relative rounded-2xl border border-[#3f3f3f] bg-[#1c1c1c] overflow-hidden grid grid-cols-1 md:grid-cols-[57%_43%]">
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

        <div className="hidden md:block absolute left-[57%] top-6 bottom-6 z-10 w-px pointer-events-none">
          <span className="absolute inset-y-0 left-0 w-px border-l border-dashed border-white/30" />
          <span className="absolute -top-3 -left-[6px] font-mono text-lg text-white/50">+</span>
          <span className="absolute -bottom-3 -left-[6px] font-mono text-lg text-white/50">+</span>
        </div>

        <div className="p-8 md:p-10 lg:p-12 flex flex-col">
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
      </div>
    </div>
  </section>
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

export default function MacTerm() {
  return (
    <div dir="ltr" className="bg-[#0a0807] text-[#F2F2F0] min-h-screen overflow-x-hidden">
      <PageLoader
        label="macterm"
        critical={[M('main.png'), M('featur1.png'), M('Featur2.png')]}
        video={VIDEO_URL}
        warm={[M('beforefooter.png'), M('bluetex.png')]}
      />
      <BrandBar />
      <main>
        <HERO />
        <Claim />
        <SplitTerminal />
        <CodeWorkspace />
        <Highlights />
        <Shortcuts />
        <RunsReal />
        <Security />
        <GetStarted />
        <Overview />
        <FluencyBand />
      </main>
      <HalftoneWordmarkFooter
        wordmark="macterm"
        label="Software DevLabs"
        meta="©2026 · MacTerm — Terminal Mac, Tmux for Windows"
        columns={FOOTER_COLUMNS}
      />
    </div>
  );
}
