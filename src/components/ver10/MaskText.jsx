import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const line = {
  initial: { y: '100%' },
  visible: { y: '0', transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] } },
};

/**
 * Ochi "MaskText" port — every phrase rises out of its own overflow-hidden
 * mask, staggered by index, once the block enters the viewport.
 */
export default function MaskText({ children, className = '', lineClassName = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const phrases = React.Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {phrases.map((phrase, index) => (
        <div key={index} className="overflow-hidden">
          <motion.div
            custom={index}
            variants={line}
            initial="initial"
            animate={inView ? 'visible' : ''}
            transition={{ delay: index * 0.06 }}
            className={lineClassName}
          >
            {phrase}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
