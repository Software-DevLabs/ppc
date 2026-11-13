import React from 'react';
import { Mail } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/site';

export default function ContactStrip() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-8 border-t border-border" aria-label="تواصل">
      <div className="max-w-7xl mx-auto text-center">
        <span className="font-mono text-xs tracking-widest text-muted-foreground block mb-6">تواصل</span>
        <h2 className="font-body text-4xl md:text-6xl font-light tracking-tight text-foreground leading-tight">
          لنبنِ شيئًا<br /><span className="text-muted-foreground">رائعًا معًا.</span>
        </h2>
        <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mt-6">
          متاح لمشاريع تطوير الويب، بناء وكلاء ذكاء اصطناعي، وهندسة الأنظمة.
        </p>
        <a href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 bg-cobalt text-gallery font-mono text-sm font-bold px-8 py-4 mt-8 hover:opacity-90 hover:-translate-y-0.5 transition-all">
          راسلني عبر البريد <Mail className="w-4 h-4" aria-hidden="true" />
        </a>
        <p className="font-mono text-xs text-muted-foreground mt-6" dir="ltr">{CONTACT_EMAIL}</p>
      </div>
    </section>
  );
}
