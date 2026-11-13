import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpLeft, Code2, Bot, Server, PenTool } from 'lucide-react';
import { usePublishedPosts, usePublishedProjects } from '@/lib/queries';

/* Real services from the homepage (#services) — same content as Ver2 */
const SERVICES = [
  { icon: Code2, title: 'هندسة المنتجات', desc: 'بنية معمارية موثوقة من الفكرة حتى الإنتاج.' },
  { icon: Bot, title: 'أنظمة الذكاء الاصطناعي', desc: 'وكلاء، أتمتة، وواجهات ذكية مدعومة بـ LLM.' },
  { icon: Server, title: 'البنية التحتية', desc: 'سحابة، وواجهات برمجية، وقواعد بيانات.' },
  { icon: PenTool, title: 'تصميم الواجهات', desc: 'واجهات دقيقة مصممة حول الوضوح.' },
];

const PLAIN_ROUTES = {
  projects: '/projects',
  services: '/#services',
  products: '/products',
  blog: '/blog',
};

const dropdownPanel = {
  hidden: { opacity: 0, x: '-50%', y: 10, scale: 0.98 },
  show: { opacity: 1, x: '-50%', y: 0, scale: 1, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: '-50%', y: 6, scale: 0.98, transition: { duration: 0.18, ease: 'easeIn' } },
};

export default function Ver9Header() {
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false); // <=700px
  const [openMenu, setOpenMenu] = useState(null);
  const closeTimer = useRef(null);
  const firstTrigger = useRef(null);

  const { data: projectsData } = usePublishedProjects();
  const { data: postsData } = usePublishedPosts();
  const projects = (projectsData || []).slice(0, 3);
  const posts = (postsData || []).slice(0, 3);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onOutside = (e) => {
      if (!e.target.closest('.nav-item')) setOpenMenu(null);
    };
    const onEscape = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        firstTrigger.current?.focus();
      }
    };
    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('click', onOutside);
      document.removeEventListener('keydown', onEscape);
      clearTimeout(closeTimer.current);
    };
  }, []);

  const finePointer = () =>
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const handleEnter = (menu) => {
    if (!finePointer()) return;
    clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };

  const handleLeave = () => {
    if (!finePointer()) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 300);
  };

  const handleFocus = () => clearTimeout(closeTimer.current);
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      closeTimer.current = setTimeout(() => setOpenMenu(null), 180);
    }
  };

  const items = [
    { menu: 'projects', label: 'المشاريع', expandable: projects.length > 0 },
    { menu: 'services', label: 'الخدمات', expandable: true },
    { menu: 'products', label: 'المنتجات', plain: true },
    { menu: 'about', label: 'من نحن', plain: true },
    { menu: 'blog', label: 'المدونة', expandable: posts.length > 0 },
  ];

  const panels = {
    projects: projects.length > 0 && (
      <div id="menu-projects" className="dropdown dropdown-destinations" role="region" aria-label="المشاريع" dir="rtl">
        {projects.map((p) => (
          <Link key={p.id || p.slug} to={`/projects/${p.slug}`} className="destination-link">
            <img src={p.banner_url || '/logo.png'} alt="" loading="lazy" />
            <span>
              <strong>{p.title}</strong>
              <small>{p.category || (p.skills || []).slice(0, 2).join(' · ')}</small>
            </span>
          </Link>
        ))}
        <div className="dropdown-footer">
          <Link to="/projects" className="view-all" dir="ltr">VIEW ALL ↗</Link>
        </div>
      </div>
    ),
    services: (
      <div id="menu-services" className="dropdown dropdown-services" role="region" aria-label="الخدمات" dir="rtl">
        {SERVICES.map((s) => (
          <a key={s.title} href="/#services" className="service-link">
            <s.icon className="w-4 h-4 text-cobalt shrink-0" aria-hidden="true" />
            <span>
              <strong>{s.title}</strong>
              <small>{s.desc}</small>
            </span>
          </a>
        ))}
      </div>
    ),
    blog: posts.length > 0 && (
      <div id="menu-blog" className="dropdown dropdown-destinations" role="region" aria-label="المدونة" dir="rtl">
        {posts.map((post, i) => (
          <Link key={post.slug || i} to={`/blog/${post.slug}`} className="destination-link">
            <img src={post.banner_url || '/logo.png'} alt="" loading="lazy" />
            <span>
              <strong>{post.title}</strong>
              <small>{post.excerpt ? String(post.excerpt).slice(0, 46) : 'مقال تقني'}</small>
            </span>
          </Link>
        ))}
        <div className="dropdown-footer">
          <Link to="/blog" className="view-all" dir="ltr">VIEW ALL ↗</Link>
        </div>
      </div>
    ),
  };

  return (
    <>
      <div
        className={`nav-backdrop ${openMenu ? 'visible' : ''}`}
        onClick={() => setOpenMenu(null)}
        aria-hidden="true"
      />

      {/* Header morphs with framer-motion springs when the pill appears on scroll */}
      <motion.header
        className={`nav-shell ${scrolled ? 'nav-scrolled' : ''}`}
        role="banner"
        initial={{ y: -32, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          height: scrolled ? (compact ? 56 : 64) : compact ? 64 : 76,
          marginTop: scrolled ? (compact ? 8 : 12) : 0,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      >
        <Link to="/" className="brand" aria-label="Software DevLabs - الرئيسية">
          <span className="brand-logo">
            <img src="/logo.png" alt="Software DevLabs" className="w-full h-full object-contain" decoding="async" />
          </span>
        </Link>

        <nav className="nav-items" aria-label="التنقل الرئيسي" dir="rtl">
          {items.map(({ menu, label, plain, expandable }) => (
            <div
              key={menu}
              className="nav-item"
              onMouseEnter={() => expandable && handleEnter(menu)}
              onMouseLeave={() => expandable && handleLeave()}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {plain ? (
                <Link className="nav-trigger font-bold" to={PLAIN_ROUTES[menu] || '/'}>
                  {label}
                </Link>
              ) : (
                <button
                  ref={menu === 'projects' ? firstTrigger : undefined}
                  className="nav-trigger font-bold"
                  type="button"
                  aria-expanded={openMenu === menu}
                  aria-controls={`menu-${menu}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (expandable) setOpenMenu(openMenu === menu ? null : menu);
                  }}
                >
                  {label} {expandable && <ChevronDown aria-hidden="true" />}
                </button>
              )}

              {/* Dropdown window — animated with framer-motion */}
              <AnimatePresence>
                {expandable && openMenu === menu && (
                  <motion.div
                    className="dropdown-anchor"
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    variants={dropdownPanel}
                  >
                    {panels[menu]}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="contact-wrap">
          <Link className="contact" to="/contact">
            <span>ابدأ مشروعًا</span>
            <ArrowUpLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </motion.header>
    </>
  );
}
