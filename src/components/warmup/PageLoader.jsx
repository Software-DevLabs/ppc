import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* warm the browser cache for below-the-fold media so nothing pops in late */
export function prewarm(urls) {
  const kick = () => {
    urls.filter(Boolean).forEach((u) => {
      try {
        if (/\.mp4$/.test(u)) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.as = 'video';
          link.href = u;
          document.head.appendChild(link);
        } else {
          const img = new Image();
          img.src = u;
        }
      } catch {
        /* warming is best effort */
      }
    });
  };
  if (typeof window === 'undefined') return;
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(kick, { timeout: 2500 });
  } else {
    window.setTimeout(kick, 1400);
  }
}

const pad3 = (n) => String(n).padStart(3, '0');

/* full-screen asset loader — counts the critical set (above-the-fold media
   plus the video's first frame) and reveals the page once it is safe,
   with a hard cap so a stalled file can never hang the site */
const PageLoader = ({ critical = [], warm = [], video, minMs = 700, capMs = 3500, label = 'macterm' }) => {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  const criticalKey = critical.join('|');
  const warmKey = warm.join('|');

  useEffect(() => {
    if (!ready || gone) return;
    const t = window.setTimeout(() => {
      setGone(true);
      prewarm(warm);
    }, 260);
    return () => window.clearTimeout(t);
  }, [ready, gone, warmKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let alive = true;
    let loaded = 0;
    const total = critical.filter(Boolean).length + 1;
    const bump = () => {
      if (!alive) return;
      loaded += 1;
      setPct(Math.min(98, Math.round((loaded / total) * 98)));
    };

    const tickets = critical.filter(Boolean).map((src) => {
      const img = new Image();
      img.onload = img.onerror = bump;
      img.src = src;
      if (img.complete) bump();
      return img;
    });

    let vid = null;
    if (video) {
      vid = document.createElement('video');
      vid.preload = 'auto';
      vid.muted = true;
      vid.src = video;
      vid.onloadeddata = () => {
        if (alive) {
          loaded += 1;
          setPct(98);
        }
      };
      vid.onerror = () => bump();
    } else {
      bump();
    }

    const t0 = performance.now();

    const check = () => {
      if (!alive || ready) return;
      const elapsed = performance.now() - t0;
      const done = loaded >= total;
      if ((done && elapsed >= minMs) || elapsed >= capMs) {
        setPct(100);
        setReady(true);
        window.clearInterval(iv);
      } else if (done) {
        setPct(100);
      }
    };
    const iv = window.setInterval(check, 120);

    return () => {
      alive = false;
      window.clearInterval(iv);
      tickets.forEach((im) => {
        im.onload = null;
        im.onerror = null;
      });
      if (vid) {
        vid.onloadeddata = null;
        vid.onerror = null;
      }
    };
  }, [criticalKey, video, minMs, capMs]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] bg-[#0a0807] flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%', transition: { duration: 0.65, ease: [0.83, 0, 0.17, 1] } }}
        >
          <p className="font-mono text-xs tracking-[0.35em] uppercase text-[#8A8A86]">{label}</p>
          <p className="mt-5 font-mono text-6xl md:text-7xl tabular-nums text-[#F2F2F0]">{pad3(pct)}</p>
          <div className="mt-7 h-px w-56 bg-white/15 overflow-hidden">
            <div
              className="h-full bg-[#F2F2F0] transition-[width] duration-200 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-6 font-mono text-[10px] tracking-[0.3em] uppercase text-[#5f5f5b]">
            warming media
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
