import * as React from 'react';
import { cn } from '@/lib/utils';

const Marquee = ({ className, children, reverse = false, ...props }) => (
  <div
    className={cn('group flex overflow-hidden', className)}
    aria-hidden={props['aria-hidden'] || undefined}
    {...props}
  >
    <div
      className="flex w-max items-center gap-[var(--gap,0.75rem)] will-change-transform"
      style={{
        animation: 'marquee var(--duration, 20s) linear infinite',
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    >
      {children}
      {React.Children.map(children, (child, i) =>
        React.cloneElement(child, { 'aria-hidden': true, key: `dup-${i}` })
      )}
    </div>
  </div>
);

export { Marquee };
