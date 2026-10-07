"use client";

import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "./ThemeContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear()
  );

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <>
      {/* ================================================================
          VERIFICATION / ACCURACY WARNING
          ================================================================ */}
      <section
        aria-label={t("Verification and accuracy statement")}
        className={`relative border-t px-4 py-5 sm:px-8 sm:py-6 transition-colors duration-300 ${
          isDark
            ? "bg-[#030611] border-slate-800/80"
            : "bg-slate-100 border-slate-300"
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-start gap-3 text-xs leading-relaxed sm:items-center ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          <div
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:mt-0 ${
              isDark
                ? "bg-slate-800/90 border border-slate-700/80 text-teal-400"
                : "bg-white border border-slate-300 text-teal-600 shadow-sm"
            }`}
          >
            <Info className="h-3.5 w-3.5" />
          </div>

          <p className="text-xs font-normal">
            {t(
              "This information may not always be current or fully verified. If something seems unreliable, please contact your local authorities directly."
            )}
          </p>
        </div>
      </section>

      {/* ================================================================
          MAIN FOOTER
          ================================================================ */}
      <footer
        className={`relative border-t py-10 text-xs transition-colors duration-300 sm:py-12 ${
          isDark
            ? "bg-[#02050c] border-slate-900 text-slate-400"
            : "bg-white border-slate-200 text-slate-600"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          {/* --------------------------------------------------------------
              TOP ROW
              -------------------------------------------------------------- */}
          <div
            className={`flex flex-col justify-between gap-6 border-b pb-8 sm:gap-8 sm:pb-10 md:flex-row md:items-start ${
              isDark ? "border-slate-900" : "border-slate-200"
            }`}
          >
            {/* Brand */}
            <div className="max-w-sm space-y-2">
              <a
                href="/"
                aria-label={t("TrustLine home")}
                className="group inline-flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                {/* TrustLine logo mark */}
                <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-500 p-[1px] shadow-sm shadow-teal-500/20 transition-transform duration-200 group-hover:scale-105">
                  <div
                    className={`flex h-full w-full items-center justify-center rounded-[7px] transition-colors ${
                      isDark ? "bg-[#050c1c]" : "bg-white"
                    }`}
                  >
                    <svg
                      className="h-3.5 w-3.5 text-teal-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {/* Shield */}
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />

                      {/* Heartbeat */}
                      <path
                        d="M7.5 12h2l1.2-2.5 2 5 1.5-2.5h2.3"
                        strokeWidth="2.2"
                      />
                    </svg>
                  </div>
                </div>

                <span
                  className={`text-base font-bold tracking-tight transition-colors sm:text-lg ${
                    isDark
                      ? "text-white group-hover:text-teal-300"
                      : "text-slate-900 group-hover:text-teal-700"
                  }`}
                >
                  TrustLine
                </span>
              </a>

              <p
                className={`text-xs leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {t(
                  "Connecting people to relevant, verified support when it matters most."
                )}
              </p>
            </div>

            {/* Footer Navigation */}
            <nav
              aria-label={t("Footer navigation")}
              className={`flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs font-normal ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              <a
                href="#how-it-works"
                className={`rounded-md py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                  isDark
                    ? "hover:text-white"
                    : "hover:text-slate-950"
                }`}
              >
                {t("How it works")}
              </a>

              <a
                href="#resources"
                className={`rounded-md py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                  isDark
                    ? "hover:text-white"
                    : "hover:text-slate-950"
                }`}
              >
                {t("Resources")}
              </a>

              <a
                href="#safety"
                className={`rounded-md py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                  isDark
                    ? "hover:text-white"
                    : "hover:text-slate-950"
                }`}
              >
                {t("Safety")}
              </a>

              <a
                href="#about"
                className={`rounded-md py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                  isDark
                    ? "hover:text-white"
                    : "hover:text-slate-950"
                }`}
              >
                {t("About")}
              </a>
            </nav>
          </div>

          {/* --------------------------------------------------------------
              BOTTOM ROW
              -------------------------------------------------------------- */}
          <div
            className={`flex flex-col items-start justify-between gap-3 pt-6 text-[11px] sm:flex-row sm:items-center ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <div>
              © {currentYear} TrustLine.{" "}
              {t("All rights reserved.")}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
              <a
                href="#about"
                className={`rounded-md py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                  isDark
                    ? "hover:text-slate-300"
                    : "hover:text-slate-800"
                }`}
              >
                {t("Privacy")}
              </a>

              <a
                href="#about"
                className={`rounded-md py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                  isDark
                    ? "hover:text-slate-300"
                    : "hover:text-slate-800"
                }`}
              >
                {t("Terms")}
              </a>

              <span
                className={
                  isDark ? "text-slate-500" : "text-slate-400"
                }
                aria-hidden="true"
              >
                ·
              </span>

              <span>{t("TrustLine Verified")}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;