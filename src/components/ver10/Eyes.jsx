import React, { useEffect, useState } from 'react';

/**
 * Ochi "Eyes" port - the eyeballs rotate toward the cursor (atan2 angle).
 */
export default function Eyes({ className = '', ballClassName = 'w-[104px] h-[104px]' }) {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const onMove = (e) => {
      const deltaX = e.clientX - window.innerWidth / 2;
      const deltaY = e.clientY - window.innerHeight / 2;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      setRotate(angle - 280);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const balls = [0, 1];
  return (
    <div className={`flex items-center justify-center gap-[30px] ${className}`}>
      {balls.map((b) => (
        <div
          key={b}
          className={`bg-white border-2 border-[#21212188] rounded-full flex items-center justify-center overflow-hidden shrink-0 ${ballClassName}`}
        >
          <img
            src="/eyes.svg"
            alt=""
            aria-hidden="true"
            style={{ transform: `rotate(${rotate}deg)` }}
            className="w-full h-full object-cover block"
          />
        </div>
      ))}
    </div>
  );
}
