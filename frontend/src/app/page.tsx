"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Sun,
  ChevronDown,
  ArrowRight,
  ChevronRight,
  FileText,
  Brain,
  Lock,
  LifeBuoy,
  Heart,
  Users,
  Laptop,
  CloudRain,
  Scale,
  MoreHorizontal,
  User,
  Globe2,
  Languages,
  Clock,
  Info,
  Shield,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

interface CountryItem {
  code: string;
  name: string;
  flag: string;
}

const DEFAULT_COUNTRIES: CountryItem[] = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
];

interface PageProps {
  onNavigateToChat?: (initialQuery?: string, country?: string) => void;
  onNavigate?: (path: string) => void;
  selectedCountry?: string;
  onCountryChange?: (country: string) => void;
  countries?: CountryItem[];
}

export default function Page({
  onNavigateToChat,
  onNavigate,
  selectedCountry: propCountry,
  onCountryChange: propOnCountryChange,
  countries: propCountries,
}: PageProps) {
  const countries = propCountries || DEFAULT_COUNTRIES;
  const [selectedCountry, setSelectedCountry] = useState<string>(
    propCountry || "India"
  );
  const [inputQuery, setInputQuery] = useState("");
  const [isNavCountryDropdownOpen, setIsNavCountryDropdownOpen] = useState(false);
  const [isHeroCountryDropdownOpen, setIsHeroCountryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize theme from localStorage or document class
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("trustline_theme");
      const isDark =
        savedTheme === "dark" ||
        document.documentElement.classList.contains("dark") ||
        (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);

      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
      }
    }
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
          document.body.classList.add("dark");
          localStorage.setItem("trustline_theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          document.body.classList.remove("dark");
          localStorage.setItem("trustline_theme", "light");
        }
      }
      return next;
    });
  };

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    if (propOnCountryChange) {
      propOnCountryChange(countryName);
    }
    setIsNavCountryDropdownOpen(false);
    setIsHeroCountryDropdownOpen(false);
  };

  const handleNavigate = (path: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  const handleSearchSubmit = (queryToSearch?: string) => {
    const q = (queryToSearch || inputQuery).trim();
    if (onNavigateToChat) {
      onNavigateToChat(q, selectedCountry);
    } else if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (selectedCountry) params.set("country", selectedCountry);
      window.location.href = `/chat?${params.toString()}`;
    }
  };

  const currentCountry =
    countries.find((c) => c.name === selectedCountry) || countries[0];

  // 6 Map Location Pins (Exact match to screenshot - calm static halos, NO blinkers/twinkling)
  const mapPins = [
    {
      id: "canada",
      label: "Mental health support in Canada",
      query: "Mental health support counseling and crisis line in Canada",
      country: "Canada",
      dotColor: "bg-teal-500",
      haloColor: "bg-teal-500/15 border border-teal-500/30 dark:bg-teal-400/20 dark:border-teal-400/40",
      badgeBorder: "border-teal-200 dark:border-teal-800",
      x: 18,
      y: 31,
    },
    {
      id: "uk",
      label: "Legal aid support in the UK",
      query: "Free legal aid attorney advisory support in the UK",
      country: "United Kingdom",
      dotColor: "bg-purple-600",
      haloColor: "bg-purple-500/15 border border-purple-500/30 dark:bg-purple-400/20 dark:border-purple-400/40",
      badgeBorder: "border-purple-200 dark:border-purple-800",
      x: 46,
      y: 30,
    },
    {
      id: "japan",
      label: "Cyber crime support in Japan",
      query: "Cyber crime fraud reporting helpline in Japan",
      country: "Japan",
      dotColor: "bg-rose-500",
      haloColor: "bg-rose-500/15 border border-rose-500/30 dark:bg-rose-400/20 dark:border-rose-400/40",
      badgeBorder: "border-rose-200 dark:border-rose-800",
      x: 83,
      y: 33,
    },
    {
      id: "brazil",
      label: "Disaster relief resources in Brazil",
      query: "Disaster relief and emergency civil defense in Brazil",
      country: "Brazil",
      dotColor: "bg-emerald-500",
      haloColor: "bg-emerald-500/15 border border-emerald-500/30 dark:bg-emerald-400/20 dark:border-emerald-400/40",
      badgeBorder: "border-emerald-200 dark:border-emerald-800",
      x: 27,
      y: 69,
    },
    {
      id: "india",
      label: "Women safety helpline in India",
      query: "Women safety helpline 1091 and 112 emergency in India",
      country: "India",
      dotColor: "bg-amber-500",
      haloColor: "bg-amber-500/15 border border-amber-500/30 dark:bg-amber-400/20 dark:border-amber-400/40",
      badgeBorder: "border-amber-200 dark:border-amber-800",
      x: 65,
      y: 54,
    },
    {
      id: "australia",
      label: "Emergency help in Australia",
      query: "Triple Zero 000 emergency services in Australia",
      country: "Australia",
      dotColor: "bg-blue-600",
      haloColor: "bg-blue-500/15 border border-blue-500/30 dark:bg-blue-400/20 dark:border-blue-400/40",
      badgeBorder: "border-blue-200 dark:border-blue-800",
      x: 84,
      y: 75,
    },
  ];

  // 6 Categories Grid (Exact match to screenshot)
  const categoryCards = [
    {
      id: "mental-health",
      title: "Mental Health Support",
      query: "Mental health counseling suicide prevention and emotional crisis support",
      icon: Heart,
      iconColor: "text-sky-500 fill-sky-500",
      bgColor: "bg-sky-50 dark:bg-sky-950/40",
    },
    {
      id: "women-safety",
      title: "Women Safety & Gender Support",
      query: "Women safety emergency helpline and domestic abuse support",
      icon: Users,
      iconColor: "text-rose-500 fill-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-950/40",
    },
    {
      id: "cyber-crime",
      title: "Cyber Crime Assistance",
      query: "Cyber crime fraud reporting helpline and online scam recovery",
      icon: Laptop,
      iconColor: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
    },
    {
      id: "disaster-relief",
      title: "Disaster Relief & Emergency",
      query: "Disaster relief flood fire earthquake and civil emergency response",
      icon: CloudRain,
      iconColor: "text-amber-500 fill-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      id: "legal-aid",
      title: "Legal Aid & Consumer Rights",
      query: "Free legal aid attorney consultation and consumer protection rights",
      icon: Scale,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      id: "more-categories",
      title: "More Categories",
      subtitle: "Explore all support areas",
      query: "Directory of all emergency and crisis helplines",
      icon: MoreHorizontal,
      iconColor: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/40",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-teal-100 dark:selection:bg-teal-900">
      {/* =========================================================================
          SECTION 1: NAVBAR (Logo + Tagline, Nav Links, Country Dropdown, Dark Mode)
          ========================================================================= */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Tagline */}
            <button
              type="button"
              onClick={() => handleNavigate("/")}
              className="flex items-center gap-3 text-left cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-700 dark:bg-teal-600 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none block">
                  TrustLine
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mt-1">
                  Find Help. Feel Safer.
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links & Controls */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <div className="flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                <button
                  type="button"
                  onClick={() => handleNavigate("/how-it-works")}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  How it works
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/resources")}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Resources
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/safety")}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Safety
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/about")}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  About
                </button>
              </div>

              {/* Country Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNavCountryDropdownOpen(!isNavCountryDropdownOpen)}
                  className="h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                >
                  <span className="text-base">{currentCountry.flag}</span>
                  <span>{currentCountry.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isNavCountryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNavCountryDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1 z-50">
                      {countries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleCountrySelect(c.name)}
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
                onClick={handleToggleDarkMode}
                className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme"
              >
                <Sun className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
            </div>

            {/* Mobile Actions: Theme Toggle & Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={handleToggleDarkMode}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-800"
                aria-label="Toggle theme"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-800"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Flyout */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-4 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <button
                type="button"
                onClick={() => handleNavigate("/how-it-works")}
                className="px-3 py-2 text-left rounded-lg bg-slate-50 dark:bg-slate-900"
              >
                How it works
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/resources")}
                className="px-3 py-2 text-left rounded-lg bg-slate-50 dark:bg-slate-900"
              >
                Resources
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/safety")}
                className="px-3 py-2 text-left rounded-lg bg-slate-50 dark:bg-slate-900"
              >
                Safety
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/about")}
                className="px-3 py-2 text-left rounded-lg bg-slate-50 dark:bg-slate-900"
              >
                About
              </button>
            </div>

            {/* Mobile Country Selector */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Select Region
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountrySelect(c.name)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left ${
                      selectedCountry === c.name
                        ? "bg-teal-600 text-white font-semibold"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 space-y-12 sm:space-y-16 pb-20">
        {/* =========================================================================
            SECTION 2: HERO (Badge pill, Headline, Hand-drawn note, Map with 6 Pins, Input)
            ========================================================================= */}
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 md:pt-14 md:pb-16 overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-100/40 dark:bg-teal-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Top Pill Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase shadow-2xs">
              <span>GLOBAL SUPPORT</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>VERIFIED SOURCES</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>POWERED BY AI</span>
            </div>
          </div>

          {/* Headline & Hand-drawn Note Wrapper */}
          <div className="relative max-w-4xl mx-auto text-center px-4">
            {/* Playful Handwritten Note: "Help Has No Borders" */}
            <div className="hidden md:block absolute -right-2 lg:right-6 -top-4 rotate-[-8deg] pointer-events-none select-none">
              <div className="text-teal-600 dark:text-teal-400 font-bold leading-none tracking-tight">
                <span className="block text-xl lg:text-2xl font-serif italic">Help</span>
                <span className="block text-xl lg:text-2xl font-serif italic pl-2">Has No</span>
                <span className="block text-2xl lg:text-3xl font-serif italic pl-4">Borders</span>
              </div>
              <svg
                className="w-24 h-4 text-teal-600 dark:text-teal-400 mt-0.5 ml-3"
                viewBox="0 0 100 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 6 C 30 14, 70 2, 95 10" />
                <path d="M12 14 C 35 18, 65 10, 88 16" />
              </svg>
            </div>

            {/* World Map Dotted Image Background Texture directly behind the heroic text */}
            <div className="absolute inset-0 -top-6 sm:-top-10 -bottom-8 sm:-bottom-12 pointer-events-none select-none overflow-hidden flex items-center justify-center -z-10">
              <img
                src="/world_map_dotted.png"
                alt="World Map Texture Background"
                className="w-full max-w-5xl h-full object-contain opacity-65 dark:opacity-30 contrast-125 select-none"
                draggable={false}
              />
              {/* Soft radial overlay for 100% text readability in both light & dark mode */}
              <div className="absolute inset-0 bg-radial from-slate-50/75 via-slate-50/30 to-transparent dark:from-slate-950/80 dark:via-slate-950/35 dark:to-transparent pointer-events-none" />
            </div>

            {/* Headline with last 2 words in teal */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Millions don’t know <br className="hidden sm:inline" />
              where to turn when{" "}
              <span className="text-teal-600 dark:text-teal-400">it</span> <br className="hidden sm:inline" />
              <span className="text-teal-600 dark:text-teal-400">matters most.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal mt-4 max-w-2xl mx-auto leading-relaxed">
              TrustLine connects you to verified helplines and support resources
              <br className="hidden sm:inline" />
              {" "}— instantly, anywhere in the world.
            </p>

            {/* Small trust line below subtext */}
            <div className="inline-flex items-center justify-center gap-2 mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                Every number is sourced from government helplines, NGOs, and verified directories — not AI guesses.
              </span>
            </div>
          </div>

          {/* Floating Chat Input Bar (Moved Upward, immediately below heroic text & subtext) */}
          <div className="w-full max-w-3xl lg:max-w-4xl mx-auto mt-6 sm:mt-8 px-2 sm:px-4 relative z-20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
              className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-xl shadow-slate-900/5 dark:shadow-black/50 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-teal-500/40"
            >
              {/* Country Dropdown Pill on Left */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsHeroCountryDropdownOpen(!isHeroCountryDropdownOpen)}
                  className="w-full sm:w-auto h-11 px-3.5 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-between sm:justify-center gap-2 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
                >
                  <span className="text-lg">{currentCountry.flag}</span>
                  <span className="truncate max-w-[85px]">{currentCountry.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isHeroCountryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsHeroCountryDropdownOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 w-52 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1 z-50">
                      {countries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleCountrySelect(c.name)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-sm text-left transition-colors cursor-pointer ${
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

              {/* Center Input Field */}
              <div className="flex-1 px-2 py-1 sm:py-0">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Describe what you need help with..."
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-700 dark:placeholder-slate-300 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5 hidden sm:block">
                  e.g. cyber fraud, mental health support, women safety, domestic violence, disaster relief...
                </p>
              </div>

              {/* Right Submit Circle Button with Arrow */}
              <button
                type="submit"
                aria-label="Find Support"
                className="w-full sm:w-11 h-11 rounded-xl sm:rounded-full bg-[#0d4a54] hover:bg-[#09353c] text-white flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 shrink-0 cursor-pointer"
              >
                <span className="sm:hidden text-xs font-semibold">Find Helplines</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </form>
          </div>

          {/* Dotted World Map Graphic with 6 Pins & Connector Arcs */}
          <div className="relative w-full max-w-5xl mx-auto mt-4 sm:mt-6 min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex items-center justify-center">
            {/* World Map Dotted Image Background Texture */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <img
                src="/world_map_dotted.png"
                alt="World Map Dotted Texture"
                className="w-full h-full max-w-5xl object-contain opacity-65 dark:opacity-30 contrast-125 select-none"
                draggable={false}
              />
              {/* Subtle soft edge blend overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-50/30 via-transparent to-slate-50/60 dark:from-slate-950/30 dark:via-transparent dark:to-slate-950/60 pointer-events-none" />
            </div>

            {/* Curved connecting flight arcs overlay (Clean cyan lines, no blinking) */}
            <svg
              className="w-full h-full absolute inset-0 pointer-events-none"
              viewBox="0 0 1000 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="pageHeroLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
                </linearGradient>
              </defs>

              {/* Arcs linking continents */}
              <g stroke="url(#pageHeroLineGrad)" strokeWidth="1.2" strokeLinecap="round" className="opacity-80 dark:opacity-60">
                {/* Canada (180, 155) to UK (460, 150) */}
                <path d="M 180 155 Q 320 80, 460 150" />
                {/* UK (460, 150) to Japan (830, 165) */}
                <path d="M 460 150 Q 640 60, 830 165" />
                {/* UK (460, 150) to India (650, 270) */}
                <path d="M 460 150 Q 560 210, 650 270" />
                {/* Canada (180, 155) to Brazil (270, 345) */}
                <path d="M 180 155 Q 195 250, 270 345" />
                {/* Brazil (270, 345) to India (650, 270) */}
                <path d="M 270 345 Q 460 380, 650 270" />
                {/* India (650, 270) to Australia (840, 375) */}
                <path d="M 650 270 Q 755 320, 840 375" />
                {/* Japan (830, 165) to Australia (840, 375) */}
                <path d="M 830 165 Q 870 270, 840 375" />
                {/* Subtle secondary connector from Brazil to Africa junction */}
                <path d="M 270 345 Q 380 340, 490 350" />
                <path d="M 490 350 Q 570 320, 650 270" />
              </g>

              {/* Static junction intersection nodes (calm, no blinkers) */}
              <g fill="#0284c7" className="opacity-60 dark:opacity-80">
                <circle cx="490" cy="350" r="3" />
                <circle cx="560" cy="210" r="2.5" />
                <circle cx="320" cy="80" r="2" />
                <circle cx="755" cy="320" r="2.5" />
              </g>
            </svg>

            {/* Desktop Pin Badges (Positioned matching the screenshot, static halos - NO blinkers) */}
            <div className="hidden md:block absolute inset-0 pointer-events-auto">
              {mapPins.map((pin) => (
                <div
                  key={pin.id}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 group cursor-pointer z-10 select-none"
                  onClick={() => {
                    handleCountrySelect(pin.country);
                    handleSearchSubmit(pin.query);
                  }}
                  title={`Click to find ${pin.label}`}
                >
                  {/* Static Halo & Colored Dot - Strictly NO blinkers / NO twinkling */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full ${pin.haloColor} flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs`}
                    >
                      <span className={`w-3 h-3 rounded-full ${pin.dotColor} shadow-xs`} />
                    </div>
                  </div>

                  {/* White Floating Pill Badge */}
                  <div
                    className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3 py-1.5 rounded-full border ${pin.badgeBorder} shadow-xs group-hover:shadow-md transition-all group-hover:-translate-y-0.5`}
                  >
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {pin.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View: Clean Stacked Location Badges below world map */}
            <div className="md:hidden w-full pt-4 pb-2 z-10 flex flex-wrap justify-center gap-2">
              {mapPins.map((pin) => (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => {
                    handleCountrySelect(pin.country);
                    handleSearchSubmit(pin.query);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border ${pin.badgeBorder} shadow-2xs text-[11px] font-semibold text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${pin.dotColor} shrink-0`} />
                  <span className="truncate max-w-[180px]">{pin.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: "HOW IT WORKS" 3-STEP ROW
            ========================================================================= */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How it works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Step 1 */}
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 block leading-none">
                      1
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                      Describe your situation
                    </span>
                  </div>
                </div>
                <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 ml-2" />
              </div>

              {/* Step 2 */}
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 block leading-none">
                      2
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                      AI understands your need
                    </span>
                  </div>
                </div>
                <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 ml-2" />
              </div>

              {/* Step 3 */}
              <div className="flex items-center p-2">
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 block leading-none">
                      3
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                      Get verified, real contacts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: 3 TRUST BADGES ROW
            ========================================================================= */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Badge 1: Verified sources */}
            <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <ShieldCheck className="w-6 h-6 fill-blue-600/20" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Verified sources
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  From trusted organisations
                </p>
              </div>
            </div>

            {/* Badge 2: Private & anonymous */}
            <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Private & anonymous
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  No sign-up. No tracking.
                </p>
              </div>
            </div>

            {/* Badge 3: Free to use */}
            <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Free to use
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Help for everyone, anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: "FIND SUPPORT FOR WHAT MATTERS" 6-CARD CATEGORY GRID
            ========================================================================= */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find support for what matters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categoryCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSearchSubmit(card.query)}
                  className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center ${card.iconColor} shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {card.title}
                      </h3>
                      {card.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {card.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: STATS ROW (10,000+ / 195+ / 50+ / 24/7)
            ========================================================================= */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-6 border-y border-slate-200/80 dark:border-slate-800">
            {/* Stat 1: 10,000+ */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block leading-none">
                  10,000+
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">
                  Helpline records
                </span>
              </div>
            </div>

            {/* Stat 2: 195+ */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block leading-none">
                  195+
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">
                  Countries & regions
                </span>
              </div>
            </div>

            {/* Stat 3: 50+ */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block leading-none">
                  50+
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">
                  Languages
                </span>
              </div>
            </div>

            {/* Stat 4: 24/7 */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block leading-none">
                  24/7
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">
                  Support availability
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          SECTION 7: FOOTER + FIXED DISCLAIMER BAR AT BOTTOM
          ========================================================================= */}
      <footer
        id="main-footer"
        className="w-full bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors pb-16 pt-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Row: Logo & Tagline | Center Quote | Right Tagline */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/60">
            {/* Logo + Tagline */}
            <button
              type="button"
              onClick={() => handleNavigate("/")}
              className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-700 dark:bg-teal-600 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 dark:text-white leading-none block">
                  TrustLine
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                  Find Help. Feel Safer.
                </span>
              </div>
            </button>

            {/* Center Quote */}
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic">
                &ldquo; A safer, more connected world. &rdquo;
              </p>
            </div>

            {/* Right Tagline */}
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                Trusted. Human. Everywhere.
              </p>
            </div>
          </div>

          {/* Bottom Row: Links on Left | Brighter Tomorrows on Right */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            {/* Left Navigation Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 sm:gap-6">
              <button
                type="button"
                onClick={() => handleNavigate("/about")}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/resources")}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
              >
                Resources
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/safety")}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
              >
                Safety
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/safety")}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/how-it-works")}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/about")}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>

            {/* Right Slogan with Leaf/Sparkles Icon */}
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Help creates brighter tomorrows.</span>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Disclaimer Bar */}
        <div
          id="fixed-disclaimer-bar"
          className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 dark:bg-slate-950 text-slate-200 border-t border-slate-800 px-4 py-2.5 shadow-2xl backdrop-blur-md text-[11px] sm:text-xs"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-300 text-center sm:text-left">
              <Info className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                This information may not always be current or fully verified. If this seems unreliable, please contact your local authorities directly.
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold shrink-0">
              <Shield className="w-4 h-4 text-teal-400" />
              <span>Stay informed. Stay safe.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
