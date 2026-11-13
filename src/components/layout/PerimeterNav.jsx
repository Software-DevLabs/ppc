import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects';
import { LOGO_URL } from '@/lib/site';
import { useTheme } from 'next-themes';

const navLinks = [
  { label: 'الرئيسية', path: '/' },
  { label: 'المشاريع', path: '/projects' },
  { label: 'المدونة', path: '/blog' },
  { label: 'عنّي', path: '/about' },
  { label: 'تواصل', path: '/contact' },
];

function FullScreenMenu({ isOpen, onClose }) {
  const [rotation, setRotation] = useState(0);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const { data: menuProjects = [] } = useQuery({
    queryKey: ['menu-projects'],
    queryFn: () => projectsApi.getAll({ published: true }),
    enabled: isOpen,
  });
  const targetRotation = React.useRef(0);
  const rafRef = React.useRef(null);

  useEffect(() => {
    if (isOpen) { setRotation(0); targetRotation.current = 0; setProjectsOpen(false); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onWheel = (e) => {
      e.preventDefault();
      const radius = Math.min(window.innerWidth, window.innerHeight) * 0.85;
      const spread = 22;
      const halfSpan = ((navLinks.length - 1) / 2) * spread;
      const bufferDeg = (100 / radius) * (180 / Math.PI);
      targetRotation.current -= e.deltaY * 0.04;
      targetRotation.current = Math.max(-(halfSpan + bufferDeg), Math.min(halfSpan, targetRotation.current));
      const animate = () => {
        setRotation(prev => {
          const diff = targetRotation.current - prev;
          if (Math.abs(diff) < 0.01) return targetRotation.current;
          return prev + diff * 0.1;
        });
        rafRef.current = requestAnimationFrame(animate);
      };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => { window.removeEventListener('wheel', onWheel); cancelAnimationFrame(rafRef.current); };
  }, [isOpen]);

  const RADIUS = Math.min(window.innerWidth, window.innerHeight) * 0.85;
  const cx = window.innerWidth / 2 - RADIUS;
  const cy = window.innerHeight / 2 - 20;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} className="fixed inset-0 z-50 bg-charcoal overflow-hidden">
          <button onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 text-gallery p-2 focus:outline-none z-10"
            aria-label="إغلاق القائمة">
            <X className="w-6 h-6" />
          </button>
          <div className="absolute inset-0"
            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
            <svg className="absolute" style={{ left: cx - RADIUS, top: cy - RADIUS, width: RADIUS * 2, height: RADIUS * 2, overflow: 'visible' }}
              viewBox={`0 0 ${RADIUS * 2} ${RADIUS * 2}`}>
              <circle cx={RADIUS} cy={RADIUS} r={RADIUS - 1} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            </svg>
            {hoveredProject?.banner_url && (
              <div className="absolute" style={{ left: cx, top: cy, width: RADIUS * 2, height: RADIUS * 2, transform: 'translate(-50%, -50%)', borderRadius: '50%', overflow: 'hidden', zIndex: 5 }}>
                <img src={hoveredProject.banner_url} alt={`معاينة ${hoveredProject.title}`} className="w-full h-full object-cover" />
              </div>
            )}
            {navLinks.map((link, i) => {
              const spread = 22 * (Math.PI / 180);
              const angle = (i - (navLinks.length - 1) / 2) * spread;
              const x = cx + RADIUS * Math.cos(angle);
              const y = cy + RADIUS * Math.sin(angle);
              return (
                <div key={link.path} className="absolute flex flex-col items-start"
                  style={{ left: x, top: y, transform: `translate(0, -50%) rotate(${-rotation}deg)`, transformOrigin: 'center center' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-cobalt flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-white/40 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                      {link.path === '/projects' ? (
                        <div className="flex items-center gap-3">
                          <Link to={link.path} onClick={onClose}
                            className="font-body text-3xl md:text-4xl font-light text-gallery hover:text-cobalt transition-colors duration-300">
                            {link.label}
                          </Link>
                          <button onClick={e => { e.preventDefault(); setProjectsOpen(p => !p); }}
                            className="text-white/50 hover:text-cobalt transition-colors duration-200 mt-1">
                            <ChevronDown className="w-5 h-5 transition-transform duration-300"
                              style={{ transform: projectsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                          </button>
                        </div>
                      ) : (
                        <Link to={link.path} onClick={onClose}
                          className="font-body text-3xl md:text-4xl font-light text-gallery hover:text-cobalt transition-colors duration-300">
                          {link.label}
                        </Link>
                      )}
                      {link.path === '/projects' && projectsOpen && (
                        <div className="mt-3 flex flex-col gap-1 pl-1">
                          {menuProjects.map(p => (
                            <Link key={p.slug} to={`/projects/${p.slug}`} onClick={onClose}
                              onMouseEnter={() => setHoveredProject(p)} onMouseLeave={() => setHoveredProject(null)}
                              className="font-body text-base font-light text-white/50 hover:text-cobalt transition-colors duration-200">
                              {p.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AnimatedLogo() {
  const [phase, setPhase] = useState('idle');
  useEffect(() => {
    let timeout;
    const runCycle = () => {
      setPhase('spacing');
      timeout = setTimeout(() => {
        timeout = setTimeout(() => {
          setPhase('reset');
          timeout = setTimeout(() => { setPhase('idle'); timeout = setTimeout(runCycle, 3000); }, 400);
        }, 3000);
      }, 500);
    };
    timeout = setTimeout(runCycle, 3000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <span className="font-mono text-xs md:text-sm uppercase"
      style={{ letterSpacing: phase === 'spacing' ? '0.7em' : '0.05em', transition: phase === 'spacing' ? 'letter-spacing 0.4s cubic-bezier(0.65,0,0.35,1)' : phase === 'reset' ? 'letter-spacing 0.35s cubic-bezier(0.65,0,0.35,1)' : 'none' }}>
      <span className="flex items-center gap-2">
        <img src={LOGO_URL} alt="شعار Software Dev Labs" className="w-8 h-8 rounded-md" />
        <span className="font-mono text-xs md:text-sm tracking-widest" dir="ltr">SDL</span>
      </span>
    </span>
  );
}

export default function PerimeterNav() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const location = useLocation();
  const isProjectPage = location.pathname.startsWith('/projects/');

  useEffect(() => { setMenuOpen(false); setHeroVisible(true); }, [location]);

  useEffect(() => {
    if (!isProjectPage) return;
    const onScroll = () => setHeroVisible(window.scrollY < window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isProjectPage, location.pathname]);

  const colorStyle = isProjectPage && heroVisible ? { color: '#F5F5F7' } : undefined;

  return (
    <>
      <div className="fixed inset-0 z-40 pointer-events-none" aria-hidden="true">
        <div className="pointer-events-none md:hidden fixed top-6 left-6 right-6 flex justify-between items-center">
          <Link to="/" className="pointer-events-auto hover:text-cobalt transition-colors duration-500" style={colorStyle}><AnimatedLogo /></Link>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="pointer-events-auto p-1.5 hover:text-cobalt transition-colors duration-300" style={colorStyle} aria-label="تبديل الوضع الداكن">
            {theme === 'dark' ? <Sun className="w-5 h-5 scale-90" /> : <Moon className="w-5 h-5 scale-90" />}
          </button>
          <button onClick={() => setMenuOpen(true)}
            className="pointer-events-auto font-mono text-xs tracking-widest uppercase hover:text-cobalt transition-colors duration-500" style={colorStyle} aria-label="فتح القائمة">
            القائمة
          </button>
        </div>
        <div className="hidden md:block">
          <Link to="/" className="pointer-events-auto absolute top-8 left-8 hover:text-cobalt transition-colors duration-500" style={colorStyle}><AnimatedLogo /></Link>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="pointer-events-auto absolute top-8 left-1/2 -translate-x-1/2 p-1.5 hover:text-cobalt transition-colors duration-300" style={colorStyle} aria-label="تبديل الوضع الداكن">
            {theme === 'dark' ? <Sun className="w-5 h-5 scale-90" /> : <Moon className="w-5 h-5 scale-90" />}
          </button>
          <button onClick={() => setMenuOpen(true)}
            className="pointer-events-auto absolute top-8 right-8 font-mono text-xs md:text-sm tracking-widest uppercase hover:text-cobalt transition-colors duration-500" style={colorStyle} aria-label="فتح القائمة">
            القائمة
          </button>
        </div>
        <Link to="/contact"
          className="pointer-events-auto absolute bottom-[26px] right-[26px] font-mono text-xs md:text-sm tracking-widest uppercase hover:text-cobalt transition-colors duration-500" style={colorStyle}>
          ابدأ مشروعًا ←
        </Link>
      </div>
      <FullScreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
