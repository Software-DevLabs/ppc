import React, { useMemo } from 'react';
import LogoPixels from '@/components/LogoPixels';

// Brand lockup rebuilt from squares: blue pixel S on the left,
// "SOFTWARE / DEVLABS" pixel wordmark on the right.
// Classic 5×7 pixel letterforms, crisp (no distressing — it's the logo).
const GLYPHS = {
  A: ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
  B: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X...X', 'X...X', 'XXXX.'],
  D: ['XXXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'XXXX.'],
  E: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'XXXXX'],
  F: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'X....'],
  L: ['X....', 'X....', 'X....', 'X....', 'X....', 'X....', 'XXXXX'],
  O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
  R: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X'],
  S: ['.XXXX', 'X....', 'X....', '.XXX.', '....X', '....X', 'XXXX.'],
  T: ['XXXXX', '..X..', '..X..', '..X..', '..X..', '..X..', '..X..'],
  V: ['X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.X.X.', '..X..'],
  W: ['X...X', 'X...X', 'X...X', 'X.X.X', 'X.X.X', 'XX.XX', 'X...X'],
};

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shadeBlue(rand) {
  // Cobalt with subtle per-cell variance for texture.
  const base = [46, 91, 255];
  const f = 0.82 + rand() * 0.36;
  const c = base.map((v) => Math.min(255, Math.round(v * f)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function PixelWord({ text, cell = 5, gap = 1.5, color = '#F5F5F5', seed = 3 }) {
  const cells = useMemo(() => {
    const rand = mulberry32(seed);
    const out = [];
    [...text].forEach((ch, ci) => {
      const g = GLYPHS[ch];
      if (!g) return;
      g.forEach((row, y) => {
        [...row].forEach((px, x) => {
          if (px !== 'X') return;
          out.push({
            x: ci * 6 + x,
            y,
            fill: color === 'blue' ? shadeBlue(rand) : color,
            delay: Math.round((ci * 6 + x + y) * 14 + rand() * 200),
          });
        });
      });
    });
    return out;
  }, [text, color, seed]);

  const width = text.length * 6 * (cell + gap);

  return (
    <div
      role="img"
      aria-label={text}
      dir="ltr"
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${text.length * 6}, ${cell}px)`,
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

export default function LogoLockup({ className = '' }) {
  return (
    <div className={`flex items-center gap-8 ${className}`} dir="ltr" role="img" aria-label="Software DevLabs">
      <LogoPixels cols={22} cell={5} gap={1.5} mono="#2E5BFF" />
      <div className="flex flex-col gap-4">
        <PixelWord text="SOFTWARE" cell={7} gap={2} color="#F5F5F5" seed={21} />
        <PixelWord text="DEVLABS" cell={7} gap={2} color="#F5F5F5" seed={33} />
      </div>
    </div>
  );
}
