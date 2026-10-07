"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import Composer from "./Composer";
import {NetworkCanvas} from "./NetworkCanvas";
import { useLanguage } from "@/lib/LanguageContext";

interface HeroSectionProps {
  onRouteSubmit: (query: string, country: string) => void;
}

export default function HeroSection({
  onRouteSubmit,
}: HeroSectionProps) {
  const [phase, setPhase] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const first = window.setTimeout(() => {
      setPhase(1);
    }, 650);

    const second = window.setTimeout(() => {
      setPhase(2);
    }, 1450);

    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full overflow-hidden cinematic-sky-bg flex flex-col items-center justify-between pt-24 sm:pt-28 pb-8"
    >
      <NetworkCanvas />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(20,184,166,0.16) 0%, rgba(228,157,140,0.10) 38%, transparent 72%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex-1 flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="hero-0"
              initial={{
                opacity: 0,
                filter: "blur(8px)",
                y: 14,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
              }}
              exit={{
                opacity: 0,
                filter: "blur(8px)",
                y: -14,
              }}
              transition={{
                duration: 0.32,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                {t("You know you need help.")}
              </h1>
            </motion.div>
          )}

          {phase === 1 && (
            <motion.div
              key="hero-1"
              initial={{
                opacity: 0,
                filter: "blur(8px)",
                y: 14,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
              }}
              exit={{
                opacity: 0,
                filter: "blur(8px)",
                y: -14,
              }}
              transition={{
                duration: 0.32,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                {t("You just don't know where to start.")}
              </h1>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="hero-2"
              initial={{
                opacity: 0,
                filter: "blur(10px)",
                y: 18,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
              }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full flex flex-col items-center"
            >
              <div className="w-full max-w-4xl px-2 mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight text-white leading-tight">
                  {t("Find the help you deserve.")}
                </h1>

                <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
                  {t(
                    "Tell us what is happening. TrustLine helps you find the right support."
                  )}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                id="hero-composer"
                className="w-full"
              >
                <Composer onRouteSubmit={onRouteSubmit} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll cue */}
      <div className="relative z-10 flex flex-col items-center pt-6 text-slate-300">
        <a
          href="#how-it-works"
          className="group flex flex-col items-center gap-1 text-xs sm:text-sm hover:text-white transition-colors"
        >
          <span>{t("How it works")}</span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}