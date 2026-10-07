"use client";

import React, { useEffect, useState } from "react";
import {
  Globe,
  Building2,
  Building,
  MapPin,
  Compass,
  SlidersHorizontal,
} from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";
import ScrollReveal from "./ScrollReveal";

interface LocationScope {
  tier: "GLOBAL" | "COUNTRY" | "STATE" | "DISTRICT";
  title: string;
  status: string;
  detail: string;
}

const LOCATION_SCOPES: LocationScope[] = [
  {
    tier: "GLOBAL",
    title: "Available across regions",
    status: "Broad",
    detail:
      "International human rights, platform security protocols, and cross-border standards.",
  },
  {
    tier: "COUNTRY",
    title: "India",
    status: "National",
    detail:
      "Union ministries, national cybercrime portals, and federal lifelines.",
  },
  {
    tier: "STATE",
    title: "Uttar Pradesh",
    status: "Regional",
    detail:
      "State cyber nodal directorate and High Court Legal Services committee.",
  },
  {
    tier: "DISTRICT",
    title: "Lucknow",
    status: "Nearby",
    detail:
      "District Legal Services Authority (DLSA) & local municipal helpdesk.",
  },
];

export default function LocationSection() {
  const [selectedTier, setSelectedTier] =
    useState<LocationScope["tier"]>("DISTRICT");

  const [isDark, setIsDark] = useState(false);

  const { t } = useLanguage();

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

  const currentScope =
    LOCATION_SCOPES.find(
      (scope) => scope.tier === selectedTier
    ) || LOCATION_SCOPES[3];

  const getTierIcon = (
    tier: LocationScope["tier"],
    highlighted: boolean
  ) => {
    const iconClass = highlighted
      ? "text-teal-500"
      : isDark
        ? "text-slate-400"
        : "text-slate-500";

    switch (tier) {
      case "GLOBAL":
        return <Globe className={`w-4 h-4 ${iconClass}`} />;

      case "COUNTRY":
        return (
          <Building2 className={`w-4 h-4 ${iconClass}`} />
        );

      case "STATE":
        return (
          <Building className={`w-4 h-4 ${iconClass}`} />
        );

      case "DISTRICT":
        return (
          <MapPin className={`w-4 h-4 ${iconClass}`} />
        );

      default:
        return (
          <Compass className={`w-4 h-4 ${iconClass}`} />
        );
    }
  };

  return (
    <section
      className={[
        "relative border-t py-16 transition-colors duration-300 sm:py-24 md:py-32",
        isDark
          ? "border-slate-800/80 bg-[#061011]"
          : "border-slate-200 bg-[#f7f5ef]",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Section heading */}
        <ScrollReveal direction="down">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-16 sm:gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-500 sm:mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />

                <span>
                  {t("LOCATION, WITH PURPOSE")}
                </span>
              </div>

              <h2
                className={[
                  "text-balance text-2xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl",
                  isDark
                    ? "text-white"
                    : "text-slate-900",
                ].join(" ")}
              >
                {t(
                  "Relevant support, closer to where you are."
                )}
              </h2>
            </div>

            <p
              className={[
                "max-w-sm text-xs leading-relaxed sm:text-sm",
                isDark
                  ? "text-slate-300"
                  : "text-slate-600",
              ].join(" ")}
            >
              {t(
                "Support systems work differently around the world. TrustLine uses your chosen location to bring verified local resources into view."
              )}
            </p>
          </div>
        </ScrollReveal>

        {/* Main layout */}
        <div className="grid grid-cols-1 items-stretch gap-5 sm:gap-6 lg:grid-cols-12">
          {/* Human request */}
          <ScrollReveal
            delay={0.1}
            className="lg:col-span-5"
          >
            <div
              className={[
                "flex h-full flex-col justify-between rounded-2xl border-2 p-5 shadow-xl transition-colors sm:rounded-3xl sm:p-8",
                isDark
                  ? "border-slate-800 bg-[#040b1e]"
                  : "border-slate-300 bg-white shadow-[0_12px_36px_-6px_rgba(15,23,42,0.12)]",
              ].join(" ")}
            >
              <div>
                <div
                  className={[
                    "mb-5 flex items-center justify-between border-b pb-3 text-xs sm:mb-8 sm:pb-4",
                    isDark
                      ? "border-slate-800/80 text-slate-400"
                      : "border-slate-200 text-slate-600",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex items-center gap-2 font-bold uppercase tracking-wider",
                      isDark
                        ? "text-slate-300"
                        : "text-slate-800",
                    ].join(" ")}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />

                    <span>
                      {t("HUMAN REQUEST")}
                    </span>
                  </div>

                  <Compass
                    className={[
                      "h-4 w-4",
                      isDark
                        ? "text-slate-500"
                        : "text-slate-400",
                    ].join(" ")}
                  />
                </div>

                <blockquote
                  className={[
                    "text-xl font-medium leading-snug sm:text-2xl md:text-3xl",
                    isDark
                      ? "text-white"
                      : "text-slate-900",
                  ].join(" ")}
                >
                  {t("“I need legal help in Lucknow.”")}
                </blockquote>
              </div>

              {/* Selected location */}
              <div
                className={[
                  "mt-6 flex items-start gap-3 rounded-xl border p-3.5 sm:mt-12 sm:rounded-2xl sm:p-4",
                  isDark
                    ? "border-slate-700/80 bg-slate-900/80"
                    : "border-slate-300 bg-slate-50 shadow-sm",
                ].join(" ")}
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-500/20 text-teal-500">
                  <MapPin className="h-4 w-4" />
                </div>

                <div>
                  <span
                    className={[
                      "mb-0.5 block text-[10px] font-bold uppercase tracking-wider",
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    {t("USING SELECTED LOCATION")}
                  </span>

                  <span
                    className={[
                      "text-xs font-semibold sm:text-sm",
                      isDark
                        ? "text-slate-100"
                        : "text-slate-900",
                    ].join(" ")}
                  >
                    {t(
                      "Lucknow, Uttar Pradesh, India"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Support scope */}
          <ScrollReveal
            delay={0.2}
            className="lg:col-span-7"
          >
            <div
              className={[
                "flex h-full flex-col justify-between rounded-2xl border-2 p-5 shadow-xl transition-colors sm:rounded-3xl sm:p-8",
                isDark
                  ? "border-slate-800 bg-[#040b1e]"
                  : "border-slate-300 bg-white shadow-[0_12px_36px_-6px_rgba(15,23,42,0.12)]",
              ].join(" ")}
            >
              <div>
                <div
                  className={[
                    "mb-4 flex items-center justify-between border-b pb-3 text-xs sm:mb-6 sm:pb-4",
                    isDark
                      ? "border-slate-800/80 text-slate-400"
                      : "border-slate-200 text-slate-600",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "font-bold uppercase tracking-wider",
                      isDark
                        ? "text-slate-300"
                        : "text-slate-800",
                    ].join(" ")}
                  >
                    {t("SUPPORT SCOPE")}
                  </span>

                  <span className="font-mono text-[10px] font-semibold text-teal-600 dark:text-teal-300 sm:text-[11px]">
                    {t("Global → local")}
                  </span>
                </div>

                {/* Scope rows */}
                <div className="space-y-2.5 sm:space-y-3.5">
                  {LOCATION_SCOPES.map((scope) => {
                    const isSelected =
                      selectedTier === scope.tier;

                    return (
                      <button
                        key={scope.tier}
                        type="button"
                        onClick={() =>
                          setSelectedTier(scope.tier)
                        }
                        className={[
                          "flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-200 active:scale-[0.99] sm:gap-4 sm:rounded-2xl sm:p-4",
                          isSelected
                            ? isDark
                              ? "border-teal-500/50 bg-gradient-to-r from-teal-950/40 via-slate-900/80 to-slate-900/40 shadow-md ring-1 ring-teal-400/20"
                              : "border-teal-600 bg-teal-50 shadow-sm ring-1 ring-teal-500/30"
                            : isDark
                              ? "border-slate-800/80 bg-slate-900/40 hover:border-slate-700"
                              : "border-slate-300 bg-slate-50 hover:border-slate-400",
                        ].join(" ")}
                      >
                        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
                          <div
                            className={[
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl",
                              isSelected
                                ? "border border-teal-400/40 bg-teal-500/20"
                                : isDark
                                  ? "border border-slate-700/60 bg-slate-800/80"
                                  : "border border-slate-300/60 bg-slate-200/80",
                            ].join(" ")}
                          >
                            {getTierIcon(
                              scope.tier,
                              isSelected
                            )}
                          </div>

                          <div className="min-w-0">
                            <span
                              className={[
                                "block text-[9px] font-bold uppercase tracking-wider sm:text-[10px]",
                                isDark
                                  ? "text-slate-400"
                                  : "text-slate-500",
                              ].join(" ")}
                            >
                              {scope.tier}
                            </span>

                            <span
                              className={[
                                "block truncate text-[11px] font-semibold sm:text-sm",
                                isSelected
                                  ? isDark
                                    ? "text-white"
                                    : "font-bold text-slate-950"
                                  : isDark
                                    ? "text-slate-200"
                                    : "text-slate-700",
                              ].join(" ")}
                            >
                              {t(scope.title)}
                            </span>
                          </div>
                        </div>

                        {/* Dotted trail */}
                        <div className="hidden flex-1 items-center justify-center px-4 sm:flex">
                          <div
                            className={[
                              "w-full border-b border-dotted",
                              isDark
                                ? "border-slate-700/80"
                                : "border-slate-300",
                            ].join(" ")}
                          />
                        </div>

                        {/* Status */}
                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={[
                              "rounded-md px-2 py-0.5 text-[9px] font-semibold sm:px-2.5 sm:py-1 sm:text-xs",
                              isSelected
                                ? "bg-teal-500 font-bold text-slate-950"
                                : isDark
                                  ? "bg-slate-800 text-slate-300"
                                  : "bg-slate-200 font-medium text-slate-700",
                            ].join(" ")}
                          >
                            {t(scope.status)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active scope */}
              <div
                className={[
                  "mt-4 border-t pt-4 text-[11px] sm:mt-6 sm:pt-6 sm:text-xs",
                  isDark
                    ? "border-slate-800/80 text-slate-400"
                    : "border-slate-200 text-slate-600",
                ].join(" ")}
              >
                {t("Active Tier Scope:")}{" "}
                <span className="font-semibold text-teal-600 dark:text-teal-300">
                  {t(currentScope.detail)}
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Control note */}
        <ScrollReveal delay={0.25}>
          <div
            className={[
              "mt-5 flex items-center gap-2 pt-1 text-xs sm:mt-6 sm:pt-2",
              isDark
                ? "text-slate-400"
                : "text-slate-600",
            ].join(" ")}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-teal-500" />

            <span className="leading-relaxed">
              {t(
                "You stay in control of the location used to refine your support options."
              )}
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}