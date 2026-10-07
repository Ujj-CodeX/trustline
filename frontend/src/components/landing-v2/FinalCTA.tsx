"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";
import Composer from "./Composer";
import ScrollReveal from "./ScrollReveal";

interface FinalCTAProps {
  onRouteSubmit: (
    query: string,
    country: string
  ) => void;
}

export default function FinalCTA({
  onRouteSubmit,
}: FinalCTAProps) {
  const { t } = useLanguage();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(
        document.documentElement.classList.contains("dark")
      );
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className={[
        "landing-section relative overflow-hidden border-t py-16 transition-colors duration-300 sm:py-24 md:py-28",
        isDark
          ? "border-slate-900 bg-[#030713]"
          : "border-slate-200 bg-[#f7f5ef]",
      ].join(" ")}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 50%, rgba(20,38,86,0.4) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(214,230,255,0.5) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Kicker */}
        <ScrollReveal direction="down">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-300">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />

            <span>
              {t("VERIFIED HUMAN GUIDANCE")}
            </span>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={0.06}>
          <h2
            className={[
              "mb-3 text-balance text-2xl font-bold leading-tight tracking-tight sm:mb-4 sm:text-5xl md:text-6xl",
              isDark
                ? "text-white"
                : "text-slate-900",
            ].join(" ")}
          >
            {t(
              "You don’t have to navigate this alone."
            )}
          </h2>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal delay={0.12}>
          <p
            className={[
              "mx-auto mb-7 max-w-xl text-balance text-xs font-normal leading-relaxed sm:mb-10 sm:text-base md:text-lg",
              isDark
                ? "text-slate-200/90"
                : "text-slate-600",
            ].join(" ")}
          >
            {t(
              "Whenever you are ready, take the first confidential step with verified human guidance."
            )}
          </p>
        </ScrollReveal>

        {/* Final composer */}
        <ScrollReveal delay={0.18}>
          <div className="w-full">
            <Composer
              onRouteSubmit={onRouteSubmit}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}