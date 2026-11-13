import React, { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'framer-motion';

/**
 * Ochi "LogoMarquee" port — marquee whose speed and direction react
 * to the page scroll velocity (scroll down speeds it up, scroll up flips it).
 */
export default function VelocityMarquee({ children, baseVelocity = 3, className = '', innerClassName = '' }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div dir="ltr" className={`overflow-hidden flex whitespace-nowrap flex-wrap ${className}`}>
      <motion.div className={`flex whitespace-nowrap items-center flex-nowrap ${innerClassName}`} style={{ x }}>
        <span className="flex shrink-0">{children}&nbsp;</span>
        <span className="flex shrink-0">{children}&nbsp;</span>
        <span className="flex shrink-0">{children}&nbsp;</span>
        <span className="flex shrink-0">{children}&nbsp;</span>
      </motion.div>
    </div>
  );
}
