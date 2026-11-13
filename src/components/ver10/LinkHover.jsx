import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Ochi "LinkHover" port - the double underline sweep (.link-flash in index.css).
 * Base line wipes out to the right, replacement wipes in from the left,
 * staggered 0.25s, 0.6s each.
 */
export default function LinkHover({ href, title, className = '' }) {
  return (
    <Link
      to={href}
      className={`link-flash w-fit text-[#B9B9B4] hover:text-[#F2F2F0] transition-colors duration-300 cursor-pointer ${className}`}
    >
      {title}
    </Link>
  );
}
