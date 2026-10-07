import React, { useState } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Languages, Check } from 'lucide-react';
import { MULTILINGUAL_ITEMS } from '../data/landingData';

export const MultilingualSection: React.FC = () => {
  const [activeCode, setActiveCode] = useState<string>('en');

  return (
    <section className="relative py-20 bg-[#030713] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <ScrollReveal direction="down">
          {/* Soft warm neutral container matching Untitled.png */}
          <div className="bg-[#0b1428] border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Left Column matching Untitled.png */}
              <div className="flex items-start gap-5 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                  <Languages className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    Support should meet people where they are.
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
                    Choose the language that feels most natural.
                  </p>
                </div>
              </div>

              {/* Right Column: Language Pills matching Untitled.png */}
              <div className="flex flex-wrap items-center gap-2.5">
                {MULTILINGUAL_ITEMS.map((lang) => {
                  const isActive = activeCode === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setActiveCode(lang.code)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white border border-teal-400/60 shadow-md ring-1 ring-teal-400/30 font-semibold'
                          : 'bg-slate-900/40 text-slate-300 hover:text-white border border-slate-700/60 hover:bg-slate-800/80'
                      }`}
                    >
                      <span>{lang.name}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-teal-400 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
