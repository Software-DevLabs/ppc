import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize,
  Minimize,
  Monitor,
  MoreHorizontal,
  Smartphone,
} from 'lucide-react';

// Live hosted site inside a browser-chrome frame (like a deploy preview):
// URL pill, external link, desktop/mobile widths, fullscreen.
export default function DemoPreview({ url }) {
  const [mobile, setMobile] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const boxRef = useRef(null);

  let domain = url;
  try {
    domain = new URL(url).hostname;
  } catch {}

  useEffect(() => {
    const onChange = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFs = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await boxRef.current?.requestFullscreen();
    } catch {}
  };

  return (
    <div ref={boxRef} className="border border-border bg-black">
      {/* browser bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10" dir="ltr">
        <img src="/logo.png" alt="" className="w-6 h-6 object-contain" aria-hidden="true" />
        <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 min-w-0 flex-1 max-w-md mx-auto">
          <ChevronLeft className="w-3.5 h-3.5 text-white/30 shrink-0" aria-hidden="true" />
          <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" aria-hidden="true" />
          <span className="font-mono text-[11px] text-white/70 truncate flex-1 text-center">{domain}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="فتح الموقع المباشر في تبويب جديد"
            className="text-white/50 hover:text-white transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <MoreHorizontal className="w-3.5 h-3.5 text-white/30 shrink-0" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setMobile(false)}
            aria-label="عرض سطح المكتب"
            aria-pressed={!mobile}
            className={`p-1.5 transition-colors ${!mobile ? 'text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Monitor className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setMobile(true)}
            aria-label="عرض الجوال"
            aria-pressed={mobile}
            className={`p-1.5 transition-colors ${mobile ? 'text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Smartphone className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={toggleFs}
            aria-label={isFs ? 'خروج من ملء الشاشة' : 'ملء الشاشة'}
            className="p-1.5 text-white/60 hover:text-white transition-colors"
          >
            {isFs ? <Minimize className="w-4 h-4" aria-hidden="true" /> : <Maximize className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* viewport */}
      <div className={`mx-auto bg-white transition-all ${mobile ? 'max-w-[390px] border-x border-white/10' : ''}`}>
        <iframe
          key={mobile ? 'm' : 'd'}
          src={url}
          title="معاينة حية للموقع"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className="w-full h-[65vh] block bg-white"
        />
      </div>

      <p className="font-body text-[11px] text-white/40 px-4 py-2.5 border-t border-white/10">
        إذا ظهرت المعاينة فارغة فالمستضيف يمنع التضمين —
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white underline underline-offset-4 mr-1">
          افتح الموقع المباشر
        </a>
      </p>
    </div>
  );
}
