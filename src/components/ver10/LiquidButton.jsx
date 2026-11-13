import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Ochi "Rounded" GSAP port — filling-circle hover.
 * Circle starts below the pill (top:100%), slides up as a 150%-wide
 * blob through two labeled tweens ("enter"/"exit"), revealing the fill.
 */
export default function LiquidButton({ className = '', label, children, labelClassName = '', ...rest }) {
  const wrap = useRef(null);
  const circle = useRef(null);
  const tl = useRef(null);
  const leaveTimer = useRef(null);

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true });
    tl.current
      .to(
        circle.current,
        { top: '-25%', width: '150%', duration: 0.2, ease: 'power3.in' },
        'enter',
      )
      .to(circle.current, { top: '-150%', width: '125%', duration: 0.2 }, 'exit');
    return () => {
      clearTimeout(leaveTimer.current);
    };
  }, []);

  const handleEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    tl.current?.tweenFromTo('enter', 'exit');
  };

  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => {
      tl.current?.play();
    }, 150);
  };

  return (
    <span
      ref={wrap}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...rest}
      className={`rounded-full relative flex items-center justify-center overflow-hidden ${className}`}
    >
      <span className={`relative z-[10] flex items-center justify-center gap-2 whitespace-nowrap ${labelClassName}`}>
        {children || label}
      </span>
      <span
        ref={circle}
        aria-hidden="true"
        className="w-full h-[150%] absolute rounded-[50%] top-full"
      />
    </span>
  );
}
