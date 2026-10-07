"use client";

import React from "react";
import {
  MessageSquare,
  ScanLine,
  Link2,
  ArrowDownRight,
} from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";
import ScrollReveal from "./ScrollReveal";
import { useTheme } from "./ThemeContext";

interface Step {
  number: string;
  label: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    label: "Describe",
    title: "Tell TrustLine what is happening.",
    description:
      "Describe your situation in your own words. You do not need to know which category or helpline you need.",
  },
  {
    number: "02",
    label: "Understand",
    title: "Your situation is understood.",
    description:
      "TrustLine identifies the relevant support category and extracts useful context such as urgency and location.",
  },
  {
    number: "03",
    label: "Connect",
    title: "Get routed to verified support.",
    description:
      "Relevant support resources are retrieved from TrustLine's verified data sources so you can decide what to do next.",
  },
];

export default function HowItWorksSection() {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
        );
      case 1:
        return (
          <ScanLine className="w-3.5 h-3.5 text-teal-400" />
        );
      case 2:
        return (
          <Link2 className="w-3.5 h-3.5 text-teal-400" />
        );
      default:
        return (
          <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
        );
    }
  };

  return (
    <section
      id="how-it-works"
      className={[
        "landing-section relative border-t py-16 sm:py-24 md:py-32 transition-colors duration-300",
        isDark
          ? "border-slate-800/80 bg-[#071011]"
          : "border-slate-200 bg-[#f7f5ef]",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Header */}
        <ScrollReveal direction="down">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-16 sm:gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-500 sm:mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span>{t("How TrustLine works")}</span>
              </div>

              <h2
                className={[
                  "text-balance text-2xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl",
                  isDark ? "text-white" : "text-slate-900",
                ].join(" ")}
              >
                {t("A simple path from uncertainty to support.")}
              </h2>
            </div>

            <p
              className={[
                "max-w-sm text-xs leading-relaxed sm:text-sm",
                isDark ? "text-slate-300" : "text-slate-600",
              ].join(" ")}
            >
              {t(
                "You describe the problem. TrustLine helps organize the next step."
              )}
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <div className="space-y-3.5 sm:space-y-4">
          {STEPS.map((step, index) => (
            <ScrollReveal
              key={step.number}
              delay={index * 0.1}
              direction="up"
            >
              <div
                className={[
                  "group rounded-xl border-2 p-4 transition-all duration-200 sm:rounded-2xl sm:p-6 md:p-8",
                  isDark
                    ? "border-slate-800/90 bg-[#040b18]/90 hover:border-slate-700"
                    : "border-slate-300 bg-white shadow-[0_8px_25px_-5px_rgba(15,23,42,0.08)] hover:border-teal-400/60 hover:bg-teal-50/20",
                ].join(" ")}
              >
                <div className="grid grid-cols-1 items-start gap-3 sm:gap-6 md:grid-cols-12 md:items-center">
                  {/* Mobile top row */}
                  <div className="flex items-center justify-between md:contents">
                    <div
                      className={[
                        "font-mono text-2xl font-light sm:text-4xl md:col-span-1",
                        isDark
                          ? "text-teal-400/80"
                          : "font-semibold text-teal-600",
                      ].join(" ")}
                    >
                      {step.number}
                    </div>

                    <div className="md:col-span-2">
                      <div
                        className={[
                          "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider",
                          isDark
                            ? "text-slate-400 group-hover:text-slate-200"
                            : "text-slate-600 group-hover:text-slate-900",
                        ].join(" ")}
                      >
                        {getIcon(index)}
                        <span>{t(step.label)}</span>
                      </div>
                    </div>

                    <div className="md:hidden">
                      <div
                        className={[
                          "flex h-7 w-7 items-center justify-center rounded-full border",
                          isDark
                            ? "border-slate-700 bg-slate-900 text-slate-400"
                            : "border-slate-300 bg-slate-100 text-slate-700",
                        ].join(" ")}
                      >
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="md:col-span-4">
                    <h3
                      className={[
                        "text-base font-bold leading-snug sm:text-xl",
                        isDark ? "text-white" : "text-slate-900",
                      ].join(" ")}
                    >
                      {t(step.title)}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-4">
                    <p
                      className={[
                        "text-xs leading-relaxed sm:text-sm",
                        isDark ? "text-slate-300" : "text-slate-600",
                      ].join(" ")}
                    >
                      {t(step.description)}
                    </p>
                  </div>

                  {/* Desktop icon */}
                  <div className="hidden justify-end md:col-span-1 md:flex">
                    <div
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-full border transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5",
                        isDark
                          ? "border-slate-700/80 bg-slate-900/80 text-slate-400 group-hover:border-teal-500/40 group-hover:text-teal-400"
                          : "border-slate-300 bg-slate-50 text-slate-600 group-hover:border-teal-500/60 group-hover:text-teal-700",
                      ].join(" ")}
                    >
                      <ArrowDownRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}