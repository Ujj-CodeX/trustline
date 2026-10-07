"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "./ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  onFindHelpClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onFindHelpClick,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { t } = useLanguage();
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav
      aria-label="Main Navigation"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out ${
        scrolled
          ? isDark
            ? "bg-[#030713]/95 backdrop-blur-md border-b border-slate-800/70 py-2 sm:py-2.5 shadow-xl"
            : "bg-white/95 backdrop-blur-md border-b border-slate-200 py-2 sm:py-2.5 shadow-md shadow-slate-200/50"
          : "bg-transparent border-b border-transparent py-2.5 sm:py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Left: TrustLine logo */}
        <a
          href="/"
          aria-label="TrustLine home"
          className="group flex items-center gap-2.5 rounded-lg py-1 focus-visible:ring-2 focus-visible:ring-teal-400 focus:outline-none"
        >
          {/* TrustLine emblem */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-500 p-[1.5px] shadow-sm shadow-teal-500/30 group-hover:scale-105 transition-transform duration-200">
            <div
              className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
                isDark ? "bg-[#050c1c]" : "bg-white"
              }`}
            >
              <svg
                className="w-4 h-4 text-teal-500"
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

            {/* Verification pip */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-teal-500/20" />
          </div>

          <div className="flex flex-col leading-none">
            <span
              className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                isDark
                  ? "text-white group-hover:text-teal-200"
                  : "text-slate-900 group-hover:text-teal-800"
              }`}
            >
              TrustLine
            </span>

            <span
              className={`text-[9px] font-mono uppercase tracking-widest hidden xs:block ${
                isDark ? "text-teal-400/80" : "text-teal-700"
              }`}
            >
              Verified Routing
            </span>
          </div>
        </a>

        {/* Desktop navigation */}
        <div
          className={`hidden md:flex items-center gap-6 lg:gap-8 text-xs ${
            isDark
              ? "text-slate-300"
              : "text-slate-600 font-medium"
          }`}
        >
          <a
            href="#how-it-works"
            className={`transition-colors duration-150 py-1 ${
              isDark
                ? "hover:text-white"
                : "hover:text-slate-950"
            }`}
          >
            {t("How it works")}
          </a>

          <a
            href="#resources"
            className={`transition-colors duration-150 py-1 ${
              isDark
                ? "hover:text-white"
                : "hover:text-slate-950"
            }`}
          >
            {t("Resources")}
          </a>

          <a
            href="#safety"
            className={`transition-colors duration-150 py-1 ${
              isDark
                ? "hover:text-white"
                : "hover:text-slate-950"
            }`}
          >
            {t("Safety")}
          </a>

          <a
            href="#about"
            className={`transition-colors duration-150 py-1 ${
              isDark
                ? "hover:text-white"
                : "hover:text-slate-950"
            }`}
          >
            {t("About")}
          </a>
        </div>

        {/* Desktop Get Help */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle variant="nav" />

          <button
            type="button"
            onClick={onFindHelpClick}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 shadow-sm active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
              isDark
                ? "text-slate-950 bg-white hover:bg-slate-100 shadow-black/20"
                : "text-white bg-slate-950 hover:bg-slate-800 shadow-slate-300/40"
            }`}
          >
            <span>{t("Get Help")}</span>

            <ArrowRight
              className={`w-3 h-3 ${
                isDark
                  ? "text-slate-800"
                  : "text-slate-200"
              }`}
            />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle variant="nav" />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`p-2 -mr-1 rounded-lg focus-visible:ring-2 focus-visible:ring-teal-400 focus:outline-none min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer ${
              isDark
                ? "text-slate-300 hover:text-white"
                : "text-slate-700 hover:text-slate-950"
            }`}
            aria-label={
              mobileMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden backdrop-blur-2xl border-b px-5 py-4 space-y-3 shadow-2xl ${
            isDark
              ? "bg-[#030713]/98 border-slate-800 text-slate-200"
              : "bg-white/98 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex flex-col space-y-1 text-sm font-normal">
            <a
              href="#how-it-works"
              onClick={handleMobileLinkClick}
              className={`py-2.5 px-2 rounded-lg transition-colors flex items-center min-h-[44px] ${
                isDark
                  ? "hover:bg-slate-800/40 hover:text-white"
                  : "hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {t("How it works")}
            </a>

            <a
              href="#resources"
              onClick={handleMobileLinkClick}
              className={`py-2.5 px-2 rounded-lg transition-colors flex items-center min-h-[44px] ${
                isDark
                  ? "hover:bg-slate-800/40 hover:text-white"
                  : "hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {t("Resources")}
            </a>

            <a
              href="#safety"
              onClick={handleMobileLinkClick}
              className={`py-2.5 px-2 rounded-lg transition-colors flex items-center min-h-[44px] ${
                isDark
                  ? "hover:bg-slate-800/40 hover:text-white"
                  : "hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {t("Safety")}
            </a>

            <a
              href="#about"
              onClick={handleMobileLinkClick}
              className={`py-2.5 px-2 rounded-lg transition-colors flex items-center min-h-[44px] ${
                isDark
                  ? "hover:bg-slate-800/40 hover:text-white"
                  : "hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {t("About")}
            </a>
          </div>

          <div
            className={`pt-2 border-t ${
              isDark
                ? "border-slate-800/80"
                : "border-slate-200"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onFindHelpClick();
              }}
              className={`w-full py-2.5 px-4 text-center text-xs font-semibold rounded-full cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] shadow-md active:scale-[0.98] transition-transform ${
                isDark
                  ? "text-slate-950 bg-white hover:bg-slate-100"
                  : "text-white bg-slate-950 hover:bg-slate-800"
              }`}
            >
              <span>{t("Get Help")}</span>

              <ArrowRight
                className={`w-3.5 h-3.5 ${
                  isDark
                    ? "text-slate-900"
                    : "text-white"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;