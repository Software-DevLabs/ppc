import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* The three SDL-agent gradient cards (public/card*.png) with the
   "AI INTEGRATIONS" intro. layouts:
   - cardsFirst=false (ver10 order): intro above, cards below
   - cardsFirst=true  (products lnd order): cards above, intro below-left */

const AGENT_CARDS = [
  { src: '/card1_ai_agent_for_campagny.png', alt: 'SDL Agent — SDL Agent Organizes your campagny' },
  { src: '/card3_ai_agent_automation.png', alt: 'SDL Agent — SDL Agent Automate your daily tasks' },
  { src: '/card2_ai_agent_secure_server_analyst.png', alt: 'SDL Agent — SDL Agent Analyst Devices, On 24/7' },
];

const Intro = ({ compact = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className={compact ? 'md:pl-10' : ''}
  >
    <div className="flex items-center gap-3 mb-4 md:mb-9">
      <span
        aria-hidden="true"
        className="inline-block w-0 h-0 border-y-[9px] border-y-transparent border-b-[15px] border-b-[#3056F5] -translate-y-[3px]"
      />
      <span className="font-mono text-sm md:text-base tracking-[0.35em] uppercase text-[#F2F2F0]">AI Integrations</span>
    </div>
    <h2 className={compact
      ? 'max-w-xl text-lg md:text-xl leading-relaxed text-[#EDEDEA]'
      : 'max-w-4xl text-[clamp(1.5rem,2.9vw,2.8rem)] font-medium leading-snug text-[#F2F2F0]'}
    >
      SDL Agent automates daily tasks, secures devices 24/7, and organizes code and campaigns
      with AI-driven workflow integrations.
    </h2>
  </motion.div>
);

const CardsGrid = () => (
  <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 items-center">
    {AGENT_CARDS.map((card, i) => (
      <motion.div
        key={card.src}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          to="/contact"
          aria-label={card.alt}
          className="block rounded-[18px] overflow-hidden hover:-translate-y-2 transition-transform duration-700"
        >
          <img src={card.src} alt={card.alt} loading="lazy" className="w-full h-auto object-cover" />
        </Link>
      </motion.div>
    ))}
  </div>
);

export default function AgentCardsSection({ cardsFirst = false, className = '' }) {
  return (
    <section
      className={`border-y border-white/10 bg-[#0a0807] py-20 md:py-24 ${className}`}
      aria-label="SDL AI Agent"
    >
      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10" dir="ltr">
        {cardsFirst ? (
          <>
            <CardsGrid />
            <div className="mt-12">
              <Intro compact />
            </div>
          </>
        ) : (
          <>
            <Intro />
            <CardsGrid />
          </>
        )}
      </div>
    </section>
  );
}
