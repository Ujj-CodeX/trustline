import React, { useState } from "react";
import { ShieldCheck, Sun, Moon, ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { CountryOption } from "@/src/types";

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  countries: CountryOption[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  selectedCountry,
  onCountryChange,
  countries,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentCountry = countries.find((c) => c.name === selectedCountry) || countries[0];

  const navLinks = [
    { label: "How it works", path: "/how-it-works" },
    { label: "Resources", path: "/resources" },
    { label: "Safety", path: "/safety" },
    { label: "About", path: "/about" },
  ];

  return (
    <nav
      id="main-navbar"
      className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            id="nav-logo-button"
          >
            <div className="w-11 h-11 rounded-xl bg-teal-700 dark:bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none block">
                TrustLine
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide block mt-0.5">
                Find Help. Feel Safer.
              </span>
            </div>
          </button>

          {/* Desktop Nav Links & Controls */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-6 lg:gap-7">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => onNavigate(link.path)}
                    className={`text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "text-teal-700 dark:text-teal-400 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Country Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                id="nav-country-dropdown"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
              >
                <span className="text-base">{currentCountry.flag}</span>
                <span>{currentCountry.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isCountryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCountryDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1 z-50">
                    {countries.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          onCountryChange(c.name);
                          setIsCountryDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left cursor-pointer transition-colors ${
                          selectedCountry === c.name
                            ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="text-base">{c.flag}</span>
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              id="theme-toggle-button"
              onClick={onToggleDarkMode}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-slate-700 dark:text-slate-300" />}
            </button>
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => {
                  onNavigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                  currentPath === link.path
                    ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            {/* Country Picker */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Region</span>
              <select
                value={selectedCountry}
                onChange={(e) => onCountryChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.name} className="dark:bg-slate-900">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                onNavigate("/chat");
                setIsMobileMenuOpen(false);
              }}
              className="w-full h-11 rounded-xl bg-teal-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Get Help Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
