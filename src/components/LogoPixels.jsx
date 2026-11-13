import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';

// Our logo rebuilt from squares in the distressed-pixel style:
// white squares for lit pixels, cobalt for the blue ones, scattered gaps.
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function LogoPixels({
  src = '/logo.png',
  cols = 30,
  cell = 12,
  gap = 3,
  seed = 9,
  blue = '#2E5BFF',
  mono = null,
  ink = [240, 240, 240],
  className = '',
}) {
  const [cells, setCells] = useState(null);

  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      try {
        const rows = Math.round((cols * img.height) / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = cols;
        canvas.height = rows;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, cols, rows);
        const d = ctx.getImageData(0, 0, cols, rows).data;
        const rand = mulberry32(seed);
        const out = [];
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            if (d[i + 3] < 24) continue;
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            const bright = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            if (bright < 0.12) continue;
            // Distressed texture: drop a few lit cells at random.
            if (rand() < 0.1) continue;
            const isBlue = b > r + 25 && b > g + 10;
            out.push({
              x, y,
              fill: mono || (isBlue ? blue : `rgba(${ink[0]},${ink[1]},${ink[2]},${0.45 + bright * 0.55})`),
              delay: Math.round((x / cols) * 400 + rand() * 300),
            });
          }
        }
        if (alive) setCells({ rows, cells: out });
      } catch {}
    };
    img.onerror = () => {};
    return () => { alive = false; };
  }, [src, cols, seed, blue, mono]);

  if (!cells) return <div className={className} aria-label="جارٍ رسم الشعار" />;

  return (
    <div
      role="img"
      aria-label="شعار المختبر بمربعات"
      dir="ltr"
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gridAutoRows: `${cell}px`,
        gap: `${gap}px`,
        width: 'max-content',
      }}
    >
      {cells.cells.map((c, i) => (
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
