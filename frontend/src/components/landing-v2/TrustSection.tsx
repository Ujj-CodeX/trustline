"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
  Compass,
} from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";
import ScrollReveal from "./ScrollReveal";

interface TrustCardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  highlighted?: boolean;
  isDark: boolean;
}

function TrustCard({
  number,
  icon,
  title,
  description,
  children,
  highlighted = false,
  isDark,
}: TrustCardProps) {
  return (
    <div
      className={[
        "h-full rounded-2xl border-2 p-4 sm:p-6",
        highlighted
          ? isDark
            ? "border-teal-500/40 bg-gradient-to-b from-[#091636] to-[#061026] shadow-lg shadow-teal-950/30"
            : "border-teal-500 bg-white shadow-[0_14px_35px_-5px_rgba(13,148,136,0.22)] ring-1 ring-teal-500/20"
          : isDark
            ? "border-slate-800 bg-[#050d18] hover:border-slate-700"
            : "border-slate-300 bg-white shadow-[0_8px_25px_-5px_rgba(15,23,42,0.1)] hover:border-slate-400",
        "transition-all duration-300",
      ].join(" ")}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div
              className={[
                "flex h-8 w-8 items-center justify-center rounded-lg text-teal-500",
                highlighted
                  ? "border border-teal-400/40 bg-teal-500/20"
                  : isDark
                    ? "border border-slate-700/80 bg-slate-900"
                    : "border border-slate-300 bg-slate-100",
              ].join(" ")}
            >
              {icon}
            </div>

            {highlighted ? (
              <span
                className={[
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-[11px]",
                  isDark
                    ? "border border-teal-500/40 bg-teal-950/90 text-teal-300"
                    : "border border-teal-400 bg-teal-100 text-teal-950",
                ].join(" ")}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                VERIFIED
              </span>
            ) : (
              <span
                className={`font-mono text-[11px] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {number}
              </span>
            )}
          </div>

          <h3
            className={[
              "mb-2 text-lg font-bold sm:text-xl",
              isDark ? "text-white" : "text-slate-900",
            ].join(" ")}
          >
            {title}
          </h3>

          <p
            className={[
              "text-xs leading-relaxed sm:text-sm",
              isDark ? "text-slate-300" : "text-slate-600",
            ].join(" ")}
          >
            {description}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default function TrustSection() {
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
      id="safety"
      className={[
        "landing-section relative border-t py-16 transition-colors duration-300 sm:py-24 md:py-32",
        isDark
          ? "border-slate-800/80 bg-[#061011]"
          : "border-slate-200 bg-[#f7f5ef]",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Header */}
        <ScrollReveal direction="down">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-16 sm:gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-500 sm:mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span>{t("Why verification matters")}</span>
              </div>

              <h2
                className={[
                  "text-balance text-2xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl",
                  isDark ? "text-white" : "text-slate-900",
                ].join(" ")}
              >
                {t("The AI helps understand. The data does the routing.")}
              </h2>
            </div>

            <div className="max-w-sm space-y-2">
              <p
                className={[
                  "text-xs leading-relaxed sm:text-sm",
                  isDark ? "text-slate-300" : "text-slate-600",
                ].join(" ")}
              >
                {t(
                  "TrustLine is designed to keep the interpretation layer separate from the verified support data."
                )}
              </p>

              <div className="flex items-center gap-2 text-xs font-medium text-teal-600 dark:text-teal-300">
                <Compass className="h-3.5 w-3.5" />
                <span>
                  {t("Understanding first. Verified routing next.")}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div className="mb-8 grid grid-cols-1 items-stretch gap-4 sm:mb-10 lg:grid-cols-11">
          {/* Card 1 */}
          <ScrollReveal
            delay={0.1}
            className="lg:col-span-3"
          >
            <TrustCard
              number="01"
              icon={<MessageSquare className="h-4 w-4" />}
              title={t("Understand the situation")}
              description={t(
                "The system works from the words the person actually uses, helping organize the problem into a useful support context."
              )}
              isDark={isDark}
            />
          </ScrollReveal>

          {/* Arrow */}
          <div className="hidden flex-col items-center justify-center lg:col-span-1 lg:flex">
            <span
              className={[
                "mb-1 text-[10px] font-bold uppercase tracking-wider",
                isDark ? "text-slate-400" : "text-slate-600",
              ].join(" ")}
            >
              {t("Then")}
            </span>
            <ArrowRight className="h-4 w-4 text-teal-500" />
          </div>

          {/* Card 2 */}
          <ScrollReveal
            delay={0.2}
            className="lg:col-span-3"
          >
            <TrustCard
              number="02"
              highlighted
              icon={<ShieldCheck className="h-4 w-4" />}
              title={t("Use verified support data")}
              description={t(
                "Relevant support resources are retrieved from the available verified data sources instead of being invented by the model."
              )}
              isDark={isDark}
            >
              <div
                className={[
                  "mt-5 rounded-xl border p-3 sm:p-3.5",
                  isDark
                    ? "border-slate-700/80 bg-[#030919]"
                    : "border-teal-200 bg-teal-50/70",
                ].join(" ")}
              >
                <div
                  className={[
                    "text-xs font-bold",
                    isDark ? "text-white" : "text-slate-900",
                  ].join(" ")}
                >
                  {t("Verified support resource")}
                </div>

                <div
                  className={[
                    "mt-1 text-[11px] font-medium",
                    isDark ? "text-slate-400" : "text-slate-600",
                  ].join(" ")}
                >
                  {t("Source-controlled contact information")}
                </div>
              </div>
            </TrustCard>
          </ScrollReveal>

          {/* Arrow */}
          <div className="hidden flex-col items-center justify-center lg:col-span-1 lg:flex">
            <span
              className={[
                "mb-1 text-[10px] font-bold uppercase tracking-wider",
                isDark ? "text-slate-400" : "text-slate-600",
              ].join(" ")}
            >
              {t("So you can")}
            </span>
            <ArrowRight className="h-4 w-4 text-teal-500" />
          </div>

          {/* Card 3 */}
          <ScrollReveal
            delay={0.3}
            className="lg:col-span-3"
          >
            <TrustCard
              number="03"
              icon={<PhoneCall className="h-4 w-4" />}
              title={t("Take the next step")}
              description={t(
                "Once the right support route is identified, you can contact the relevant service or follow the guidance provided."
              )}
              isDark={isDark}
            >
              <div
                className={[
                  "mt-5 border-t pt-4",
                  isDark
                    ? "border-slate-800/80"
                    : "border-slate-200",
                ].join(" ")}
              >
                <a
                  href="/chat"
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-xs font-semibold text-slate-950 shadow-md shadow-teal-500/25 transition-all hover:bg-teal-400 active:scale-[0.98] sm:text-sm"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>{t("Find support")}</span>
                </a>
              </div>
            </TrustCard>
          </ScrollReveal>
        </div>

        {/* Notice */}
        <ScrollReveal delay={0.35}>
          <div
            className={[
              "flex items-start gap-2 pt-2 text-xs sm:pt-4",
              isDark ? "text-slate-400" : "text-slate-600",
            ].join(" ")}
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />

            <span className="leading-relaxed">
              {t(
                "For immediate danger or a life-threatening emergency, contact your local emergency service directly."
              )}
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}