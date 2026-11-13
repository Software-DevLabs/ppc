import React from 'react';
import { Marquee } from '@/components/ui/marquee';
import {
  Wrench, TrendingUp, Megaphone, User, Building2,
  ClipboardList, Code2, Palette, Layers, Rocket, Package,
} from 'lucide-react';

/* Three rows of role chips over the feature image.
   Directions are explicit: row 1 right->left, row 2 left->right, row 3 right->left.
   Durations are long on purpose - the user asked for a slow, calm flow. */

const TagChip = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-black/10 border border-white/20 shrink-0">
    <Icon className="size-4 text-white" />
    <span className="text-sm font-medium text-white whitespace-nowrap">{label}</span>
  </div>
);

const ROWS = [
  {
    reverse: false,
    duration: '42s',
    tags: [
      { icon: Wrench, label: 'مهندسون' },
      { icon: TrendingUp, label: 'مبيعات' },
      { icon: Megaphone, label: 'تسويق' },
      { icon: User, label: 'فرق سكرام' },
      { icon: Building2, label: 'مؤسسات' },
    ],
  },
  {
    reverse: true,
    duration: '34s',
    tags: [
      { icon: ClipboardList, label: 'مديرو المشاريع' },
      { icon: Code2, label: 'مطورون' },
      { icon: Palette, label: 'مصممون' },
      { icon: Layers, label: 'فرق المنتجات' },
    ],
  },
  {
    reverse: false,
    duration: '48s',
    tags: [
      { icon: Rocket, label: 'مؤسسون' },
      { icon: Package, label: 'شركات' },
      { icon: Building2, label: 'مؤسسات' },
      { icon: Wrench, label: 'مهندسون' },
    ],
  },
];

export default function ChipsFlow({ className = '' }) {
  return (
    <div className={`flex flex-col justify-center gap-4 py-10 ${className}`}>
      {ROWS.map((row, i) => (
        <Marquee
          key={i}
          reverse={row.reverse}
          className="p-0"
          /* CSS custom props are inherited into the animated track */
          style={{ '--duration': row.duration, '--gap': '0.75rem' }}
        >
          {row.tags.map((t, j) => (
            <TagChip key={j} icon={t.icon} label={t.label} />
          ))}
        </Marquee>
      ))}
    </div>
  );
}
