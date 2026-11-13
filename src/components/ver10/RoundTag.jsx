import React from 'react';
import LiquidButton from './LiquidButton';

/**
 * Ochi "Tags" port - pill whose GSAP blob fill wipes up through it on hover.
 * href optional: links navigate, otherwise renders a static chip.
 */
export default function RoundTag({ href, title, className = '' }) {
  const inner = (
    <span className="relative z-[10] px-3 py-1 text-xs text-[#B9B9B4] group-hover:text-black transition-colors duration-300 whitespace-nowrap">
      {title}
    </span>
  );

  if (href) {
    return (
      <Link to={href} className={`w-fit rounded-[50px] border border-white/25 cursor-pointer group ${className}`}>
        <LiquidButton className="h-full">{inner}</LiquidButton>
      </Link>
    );
  }

  return (
    <span className={`w-fit rounded-[50px] border border-white/25 cursor-default group overflow-hidden relative flex items-center ${className}`}>
      {inner}
      <span
        aria-hidden="true"
        className="absolute h-[150%] w-full rounded-[50%] top-full bg-[#F2F2F0] transition-all duration-500 ease-out group-hover:top-[-25%]"
      />
    </span>
  );
}

/* CSS-only fallback for chips without a link (GSAP reserved for real CTAs) */
