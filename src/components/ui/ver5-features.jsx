"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Brain, Layers, Sparkles } from 'lucide-react';
import PixelField from '@/components/PixelField';
import LogoPixels from '@/components/LogoPixels';

const features = [
  {
    icon: Brain,
    title: 'Smart Automation',
    description: 'Execute tasks automatically with minimal manual input, reducing repetitive work and freeing up time for high-impact activities.',
    accent: '#2E5BFF',
  },
  {
    icon: Zap,
    title: 'Process Optimization',
    description: 'Improve speed and consistency across workflows, streamlining operations for more reliable and efficient outcomes.',
    accent: '#22D3EE',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, SOC2 compliance, and granular access controls keep your data protected at all times.',
    accent: '#A855F7',
  },
  {
    icon: Layers,
    title: 'Seamless Integration',
    description: 'Connect with 200+ tools you already use — Slack, Notion, GitHub, Jira, and more — without writing code.',
    accent: '#F59E0B',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Real-time analytics and predictive intelligence help you make faster, data-driven decisions across teams.',
    accent: '#10B981',
  },
  {
    icon: Check,
    title: 'Custom Workflows',
    description: 'Build tailored automation sequences with a visual drag-and-drop builder — no engineering resources required.',
    accent: '#EF4444',
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export default function Ver5Features() {
  return (
    <section className="relative bg-background text-foreground v5-round">
      {/* Pixel dissolve transition */}
      <PixelField variant="dissolve" fg="#2E5BFF" cell={12} height={100} seed={42} className="block w-full" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-10 pb-20 md:pb-28">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex items-end justify-between gap-6 mb-12"
        >
          <motion.p variants={itemVariants} className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground" dir="ltr">
            CAPABILITIES — 001
          </motion.p>
          <motion.p variants={itemVariants} className="font-mono text-[11px] text-muted-foreground" dir="ltr">
            [{String(features.length).padStart(2, '0')}]
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              variants={itemVariants}
              className="group v5-card border border-border bg-card p-6 hover:border-cobalt/50 transition-colors duration-500 relative overflow-hidden"
              style={{ borderRadius: '18px' }}
            >
              {/* Accent top border */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, ${feature.accent}, ${feature.accent}80)` }}
              />

              {/* Feature Icon */}
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${feature.accent}15` }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <feature.icon
                  className="w-6 h-6"
                  style={{ color: feature.accent }}
                  aria-hidden="true"
                />
              </motion.div>

              {/* Feature Content */}
              <div className="pr-2">
                <motion.h3
                  variants={itemVariants}
                  className="text-xl font-medium tracking-tight text-foreground group-hover:text-cobalt transition-colors duration-500"
                >
                  {feature.title}
                </motion.h3>
                <motion.p
                  variants={itemVariants}
                  className="text-sm leading-relaxed mt-3 text-muted-foreground"
                >
                  {feature.description}
                </motion.p>
              </div>

              {/* Hover indicator */}
              <motion.div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-cobalt font-mono text-[10px]"
                dir="ltr"
              >
                VIEW →
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mt-16 text-center"
        >
          <motion.p variants={itemVariants} className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground" dir="ltr">
            READY TO BUILD — 002
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="font-light tracking-tight leading-[1.3] mt-4 max-w-3xl mx-auto"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Start automating today — first workflow free.
          </motion.h2>
          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:hello@example.com"
              className="group inline-flex items-center justify-center gap-2 bg-cobalt text-white font-body text-sm font-bold px-8 py-4 border-2 border-[#171717] dark:border-white/25 hover:opacity-85 transition-opacity duration-500"
            >
              Start a Project
              <Zap className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center gap-2 border border-[#171717]/30 dark:border-white/25 font-body text-sm font-bold px-8 py-4 hover:border-[#171717] dark:hover:border-white transition-colors"
            >
              View Work
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom pixel landscape */}
      <div className="relative">
        <PixelField variant="landscape" fg="#2E5BFF" cell={14} height={180} seed={77} className="block w-full dark:hidden opacity-50" />
        <PixelField variant="landscape" fg="#F0F0F0" cell={14} height={180} seed={77} className="hidden w-full dark:block opacity-50" />
      </div>
    </section>
  );
}