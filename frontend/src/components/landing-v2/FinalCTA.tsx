"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";
import Composer from "./Composer";
import ScrollReveal from "./ScrollReveal";
import { useTheme } from "./ThemeContext";

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
  const { isDark } = useTheme();

  return (
    <section
      id="about"
      className={[
        "landing-section relative overflow-hidden border-t py-20 transition-colors duration-300 sm:py-24 md:py-28",
        isDark
          ? "border-slate-900"
          : "border-slate-200 bg-[#f7f5ef]",
      ].join(" ")}
    >
      {/* Reference-style cinematic CTA background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #03091b 0%, #091535 42%, #172657 72%, #72505b 100%)"
            : "linear-gradient(180deg, #eef4ff 0%, #f3f6ff 48%, #f7ecea 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 70% 45% at 50% 92%, rgba(210,150,137,0.28) 0%, rgba(93,68,86,0.16) 38%, transparent 75%)"
            : "radial-gradient(ellipse 70% 45% at 50% 92%, rgba(214,180,170,0.20) 0%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* Kicker */}
        <ScrollReveal direction="down">
          <div className={`mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              isDark ? "text-teal-300" : "text-teal-600"
            }`}>
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
              "mb-4 text-balance text-3xl font-bold leading-tight tracking-tight sm:mb-4 sm:text-5xl md:text-[4.25rem] md:leading-[1.05]",
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
              "mx-auto mb-8 max-w-2xl text-balance text-sm font-normal leading-relaxed sm:mb-10 sm:text-base md:text-lg",
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
              variant="cta"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}