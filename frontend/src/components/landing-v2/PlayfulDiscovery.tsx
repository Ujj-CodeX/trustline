import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';
import { Sparkles, Compass, ShieldCheck, Heart, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PlayfulDiscoveryProps {
  onSelectSituation: (query: string) => void;
}

const PLAYFUL_SITUATIONS = [
  {
    icon: '⚡',
    label: 'Online Extortion / Hack',
    feeling: 'Panicked & Vulnerable',
    phrase: 'My Instagram account was hacked and someone changed my email.',
    outcome: 'Instant I4C cybercrime token freeze & account recovery desk',
    color: 'from-amber-500/20 to-teal-500/20',
    borderColor: 'border-amber-500/40',
  },
  {
    icon: '⚖️',
    label: 'Illegal Eviction / Lockout',
    feeling: 'Displaced & Confused',
    phrase: 'I need legal help in Lucknow. Landlord locked my house without notice.',
    outcome: 'Direct DLSA pro-bono court injunction defense within 24h',
    color: 'from-sky-500/20 to-teal-500/20',
    borderColor: 'border-sky-500/40',
  },
  {
    icon: '🌱',
    label: 'Severe Anxiety & Panic',
    feeling: 'Overwhelmed & Alone',
    phrase: 'I need mental health support near me right now.',
    outcome: 'Tele-MANAS certified counselor live call in under 30s',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/40',
  },
  {
    icon: '🛡️',
    label: 'Domestic Distress',
    feeling: 'Unsafe & Afraid',
    phrase: 'Someone at home is hurting me and I need confidential protection.',
    outcome: 'Discreet 181 Women Helpline & nearest One-Stop Center dispatch',
    color: 'from-rose-500/20 to-amber-500/20',
    borderColor: 'border-rose-500/40',
  },
];

export const PlayfulDiscovery: React.FC<PlayfulDiscoveryProps> = ({ onSelectSituation }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeItem = PLAYFUL_SITUATIONS[activeIdx];

  return (
    <section className="relative py-16 bg-[#040a1c] border-y border-slate-800/80 overflow-hidden">
      {/* Subtle ambient glow behind playful section */}
      <div
        className="pointer-events-none absolute inset-0 bg-radial-[circle_at_50%_50%] from-teal-950/25 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <ScrollReveal direction="down">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Live Need Compass</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                See how TrustLine decodes uncertainty.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Tap any situation below to test how natural language dissolves into an exact verified destination.
            </p>
          </div>
        </ScrollReveal>

        {/* Playful Interactive Situation Pills */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {PLAYFUL_SITUATIONS.map((sit, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <motion.button
                  key={sit.label}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveIdx(idx);
                    onSelectSituation(sit.phrase);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 ${
                    isSelected
                      ? `bg-slate-900/90 ${sit.borderColor} shadow-lg shadow-teal-950/40 ring-1 ring-teal-400/40`
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{sit.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {sit.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Feeling: {sit.feeling}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Interactive Dynamic Simulation Card */}
        <ScrollReveal delay={0.2} direction="up">
          <div className="bg-gradient-to-r from-[#07132e] via-[#091b3d] to-[#07132e] border border-teal-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left: Simulated prompt */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs font-mono text-teal-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>NATURAL SPEECH DETECTED</span>
                </div>
                <p className="text-lg sm:text-xl font-medium text-white italic">
                  "{activeItem.phrase}"
                </p>
                <div className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                  <span>State: {activeItem.feeling}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-teal-300 font-medium">Triage match in 0.12s</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center text-teal-400">
                <ArrowRight className="w-6 h-6" />
              </div>

              {/* Right: Outcome Preview */}
              <div className="bg-slate-950/70 border border-teal-500/20 rounded-xl p-4 sm:p-5 flex-1 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-slate-300">
                    Verified Destination
                  </span>
                  <span className="text-teal-400 text-xs flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Audited Resource
                  </span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-white">
                  {activeItem.outcome}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectSituation(activeItem.phrase)}
                  className="mt-2 text-xs font-semibold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore full verified record</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Playful Trust Metrics Counter */}
        <ScrollReveal delay={0.25}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 text-center">
            <div>
              <div className="text-2xl font-bold text-white font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Free &amp; Statutory Services</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-400 font-mono">0 ms</div>
              <div className="text-xs text-slate-400 mt-0.5">Data Stored for AI Training</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">3,400+</div>
              <div className="text-xs text-slate-400 mt-0.5">Physically Vetted Centers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-400 font-mono">50+</div>
              <div className="text-xs text-slate-400 mt-0.5">Languages &amp; Native Scripts</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
