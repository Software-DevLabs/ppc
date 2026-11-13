import React, { useEffect, useState } from 'react';
import LogoLockup from '@/components/LogoLockup';

// Full-screen welcome gate for ver6: Arabic hello in pixel style,
// square-block loader, auto-dismisses (once per session, skippable).
const BLOCKS = 14;

export default function WelcomeGate() {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = reduced ? 200 : 6000;
    const started = Date.now();
    const timer = setInterval(() => {
      setProgress(Math.min(1, (Date.now() - started) / DURATION));
    }, 60);
    const dismiss = setTimeout(() => close(), DURATION + 150);
    return () => {
      clearInterval(timer);
      clearTimeout(dismiss);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const close = () => {
    setLeaving(true);
    setTimeout(() => setShow(false), 450);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="مرحبًا بك"
      onClick={close}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#1A1A1A] transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`}
      style={{ color: '#F5F5F5' }}
    >
      <div aria-hidden="true" className="scale-90 md:scale-100">
        <LogoLockup />
      </div>
      <p className="font-mono text-[11px] tracking-[0.3em] text-[#A0A0A0] mt-8" dir="ltr">
        WELCOME — V6
      </p>
      <h1 className="font-light tracking-tight leading-[1.4] mt-4" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}>
        أهلاً وسهلاً<span style={{ color: '#2E5BFF' }}>.</span>
      </h1>
      {/* square-block loader */}
      <div className="flex items-center gap-1.5 mt-10" dir="ltr" aria-hidden="true">
        {Array.from({ length: BLOCKS }).map((_, i) => (
          <span
            key={i}
            className="block h-2.5 w-2.5"
            style={{
              background: progress * BLOCKS > i ? '#2E5BFF' : '#3F3F3F',
              transition: 'background .2s ease',
            }}
          />
        ))}
      </div>
      <p className="font-body text-xs mt-6" style={{ color: '#A0A0A0' }}>
        انقر في أي مكان للدخول
      </p>
    </div>
  );
}
