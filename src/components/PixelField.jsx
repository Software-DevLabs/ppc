import React, { useEffect, useRef } from 'react';

// Generative pixel formations (static canvas — no loops, no motion cost):
// - "landscape": irregular black pixel terrain with a noisy horizon edge.
// - "dissolve": dense-to-sparse pixel fade for section transitions.
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function PixelField({
  variant = 'landscape',
  fg = '#171717',
  cell = 14,
  height = 380,
  seed = 7,
  className = '',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const draw = () => {
      const w = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.width = w * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, height);
      ctx.fillStyle = fg;
      const rand = mulberry32(seed);
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(height / cell);

      if (variant === 'landscape') {
        // Noisy horizon walk, filled terrain below with falloff + strays above.
        let y = Math.floor(rows * 0.42);
        for (let x = 0; x < cols; x++) {
          y += Math.floor(rand() * 3) - 1;
          y = Math.max(Math.floor(rows * 0.18), Math.min(Math.floor(rows * 0.72), y));
          for (let yy = y; yy < rows; yy++) {
            const depth = (yy - y) / Math.max(1, rows - y);
            if (rand() < 1 - depth * 0.45) ctx.fillRect(x * cell, yy * cell, cell, cell);
          }
          if (rand() < 0.05 && y > 2) {
            ctx.fillRect(x * cell, Math.floor(rand() * (y - 1)) * cell, cell, cell);
          }
        }
      } else {
        // Dissolve: dense at top edge, sparse at the bottom.
        for (let x = 0; x < cols; x++) {
          const edge = Math.floor(rows * (0.25 + rand() * 0.5));
          for (let yy = 0; yy < rows; yy++) {
            const density = yy < edge ? 0.96 : Math.max(0, 0.9 - (yy - edge) * 0.28);
            if (rand() < density) ctx.fillRect(x * cell, yy * cell, cell, cell);
          }
        }
      }
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [variant, fg, cell, height, seed]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
