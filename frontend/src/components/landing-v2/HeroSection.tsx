"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import NetworkCanvas from "./NetworkCanvas";
import Composer from "./Composer";

interface HeroSectionProps {
  onRouteSubmit: (query: string, country: string) => void;
}

const phrases = [
  "You know you need help.",
  "You just don't know where to start.",
  "Find the help you deserve.",
];

export default function HeroSection({ onRouteSubmit }: HeroSectionProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const one = window.setTimeout(() => setPhase(1), 1350);
    const two = window.setTimeout(() => setPhase(2), 2700);
    return () => {
      window.clearTimeout(one);
      window.clearTimeout(two);
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#051817] pb-14 pt-32 text-white sm:pb-16 sm:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,189,0.12),transparent_40%),radial-gradient(ellipse_at_50%_100%,rgba(212,140,132,0.30),transparent_54%),linear-gradient(180deg,#020b0a_0%,#051817_48%,#102927_76%,#5e4649_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(0,0,0,0)_30%,rgba(0,0,0,0.3)_100%)]" />
      <NetworkCanvas />

      <div className="landing-shell relative z-10 flex w-full flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <div className="landing-hero-stage w-full">
          <div className="mb-5 min-h-[190px] sm:mb-8 sm:min-h-[225px]">
            {phrases.map((phrase, index) => (
              <div
                key={phrase}
                className={[
                  "landing-hero-phrase absolute left-1/2 w-[min(92vw,980px)] -translate-x-1/2 px-2 transition-all duration-[650ms] ease-[cubic-bezier(.16,1,.3,1)]",
                  phase === index
                    ? "translate-y-0 opacity-100 blur-0"
                    : "pointer-events-none -translate-y-5 opacity-0 blur-[7px]",
                ].join(" ")}
                aria-hidden={phase !== index}
              >
                <h1 className="font-display text-[clamp(3.1rem,8vw,7.3rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[#F5F4EE] text-balance">
                  {t(phrase)}
                </h1>
              </div>
            ))}
          </div>

          <div
            className={[
              "mx-auto w-full transition-all duration-[700ms] ease-[cubic-bezier(.16,1,.3,1)]",
              phase >= 2
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-8 opacity-0",
            ].join(" ")}
          >
            <Composer onSubmit={onRouteSubmit} />
          </div>
        </div>

        <a
          href="#next-section"
          className="mt-10 inline-flex items-center gap-2 text-xs font-medium text-white/46 transition-colors hover:text-white/80 sm:mt-12"
        >
          <span>{t("See how TrustLine works")}</span>
          <span className="animate-bounce text-teal-300/80">↓</span>
        </a>
      </div>
    </section>
  );
}
