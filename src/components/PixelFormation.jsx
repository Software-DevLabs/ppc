import React, { useMemo } from 'react';

// Sharp pixel formation: seeded squares with an irregular silhouette.
// Squares keep 0px radius always — the contrast with rounded UI is the point.
// Props: from = edge the mass grows from ('right' | 'bottom' | 'left').
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function PixelFormation({
  cols = 26,
  rows = 18,
  cell = 14,
  gap = 3,
  seed = 7,
  from = 'right',
  color = '#F0F0F0',
  dim = '#3F3F3F',
  accent = null,
  className = '',
}) {
  const cells = useMemo(() => {
    const rand = mulberry32(seed);
    const out = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Mass concentrated at the chosen edge, dissolving inward + noise.
        const t = from === 'right' ? x / (cols - 1)
          : from === 'left' ? 1 - x / (cols - 1)
          : 1 - y / (rows - 1);
        const edge = 0.25 + 0.75 * t * t;
        const r = rand();
        if (r > edge) continue;
        const bright = r > edge - 0.18;
        const useAccent = bright && accent && rand() < 0.22;
        out.push({
          x, y,
          fill: useAccent ? accent : bright ? color : dim,
          delay: Math.round((1 - t) * 500 + rand() * 350),
        });
      }
    }
    return out;
  }, [cols, rows, seed, from, color, dim, accent]);

  return (
    <div
      aria-hidden="true"
      dir="ltr"
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
        gap: `${gap}px`,
        width: 'max-content',
      }}
    >
      {cells.map((c, i) => (
        <span
          key={i}
          className="v6-pixel"
          style={{
            gridColumn: c.x + 1,
            gridRow: c.y + 1,
            width: cell,
            height: cell,
            background: c.fill,
            animationDelay: `${c.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
