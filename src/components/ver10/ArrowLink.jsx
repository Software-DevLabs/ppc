import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * Ochi "Button" port - label pill + circle-arrow.
 * The circle arrow scales 0 -> 1 on hover while the pill fills white.
 */
export default function ArrowLink({ href, title, className = '' }) {
  return (
    <Link
      to={href}
      className={`flex items-center gap-1.5 w-fit group ${className}`}
    >
      <span className="rounded-[50px] border border-white/25 group-hover:bg-[#F2F2F0] py-1 px-3 cursor-pointer transition-colors duration-300">
        <span className="text-xs font-normal text-[#B9B9B4] group-hover:text-black transition-colors duration-300 uppercase whitespace-nowrap">
          {title}
        </span>
      </span>
      <span className="w-[30px] h-[30px] hidden sm:flex items-center justify-center border border-white/25 rounded-[50px] group-hover:bg-[#F2F2F0] transition-all duration-300 scale-0 group-hover:scale-100">
        <ArrowUpRight strokeWidth={1.5} className="w-4 h-4 text-[#F2F2F0] group-hover:text-black transition-colors duration-300" />
      </span>
    </Link>
  );
}
