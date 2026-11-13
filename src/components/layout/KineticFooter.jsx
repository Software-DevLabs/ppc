import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, SITE_NAME, SKILLS } from '@/lib/site';

function MarqueeRow({ items, direction = 'left' }) {
  const doubled = [...items, ...items, ...items, ...items];
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const trackRef = React.useRef(null);
  const savedX = React.useRef(0);

  const handleMouseEnter = (i) => {
    setHoveredIndex(i);
    if (trackRef.current) {
      const matrix = new DOMMatrix(getComputedStyle(trackRef.current).transform);
      savedX.current = matrix.m41;
      trackRef.current.style.animationPlayState = 'paused';
      trackRef.current.style.transform = `translateX(${savedX.current}px)`;
      trackRef.current.style.animation = 'none';
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    if (trackRef.current) {
      const totalWidth = trackRef.current.scrollWidth / 2;
      const progress = direction === 'right' ? 1 - Math.abs(savedX.current) / totalWidth : Math.abs(savedX.current) / totalWidth;
      const delay = -(progress * 60);
      trackRef.current.style.transform = '';
      trackRef.current.style.animation = `marquee 60s linear ${delay}s infinite`;
      trackRef.current.style.animationDirection = direction === 'right' ? 'reverse' : 'normal';
    }
  };

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div ref={trackRef} className="marquee-track inline-flex"
        style={{ animationDirection: direction === 'right' ? 'reverse' : 'normal' }}>
        {doubled.map((item, i) => (
          <React.Fragment key={i}>
            <span className="text-4xl md:text-6xl lg:text-8xl font-mono font-light tracking-tight uppercase select-none leading-none cursor-default transition-colors duration-200"
              onMouseEnter={() => handleMouseEnter(i)} onMouseLeave={handleMouseLeave}>
              <span className="transition-all duration-300" style={{
                color: hoveredIndex === i ? '#2E5BFF' : undefined,
                filter: hoveredIndex !== null && hoveredIndex !== i ? 'blur(4px)' : 'none',
                opacity: hoveredIndex === i ? 1 : hoveredIndex !== null ? 0.15 : 0.1,
              }}>{item}</span>
            </span>
            <span className="text-4xl md:text-6xl lg:text-8xl font-mono font-light text-foreground select-none leading-none mx-2 md:mx-4 transition-all duration-300"
              style={{ filter: hoveredIndex !== null ? 'blur(4px)' : 'none', opacity: hoveredIndex !== null ? 0.15 : 0.1 }}>·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function KineticFooter() {
  const linkCls = 'font-body text-sm text-foreground hover:text-cobalt transition-colors focus:outline-none focus:ring-2 focus:ring-cobalt focus:ring-offset-4';
  return (
    <footer className="relative py-16 md:pt-24 md:pb-[26px] overflow-hidden">
      <div className="space-y-4 mb-8 md:mb-24">
        <MarqueeRow items={SKILLS} direction="left" />
      </div>
      <div className="px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8 mb-12 md:mb-16">
          <div>
            <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">التنقل</h3>
            <div className="flex flex-col gap-3">
              <Link to="/" className={linkCls}>الرئيسية</Link>
              <Link to="/projects" className={linkCls}>المشاريع</Link>
              <Link to="/blog" className={linkCls}>المدونة</Link>
              <Link to="/about" className={linkCls}>عنّي</Link>
              <Link to="/contact" className={linkCls}>تواصل</Link>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">أدوات</h3>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" className={linkCls}>لوحة التحكم</Link>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">تواصل</h3>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkCls} text-left`} dir="ltr">{CONTACT_EMAIL}</a>
              <span className="font-body text-sm text-muted-foreground">متاح للعمل الحر والتعاون عن بُعد</span>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">قانوني</h3>
            <div className="flex flex-col gap-3">
              <Link to="/privacy" className={linkCls}>سياسة الخصوصية</Link>
              <Link to="/accessibility" className={linkCls}>بيان إمكانية الوصول</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 pt-8 border-t border-border md:border-t-0">
          <span className="font-mono text-xs text-muted-foreground">© 2026 {SITE_NAME}.</span>
        </div>
      </div>
    </footer>
  );
}
