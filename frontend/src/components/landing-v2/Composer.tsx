"use client";

import React, { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { DEFAULT_COUNTRIES } from "@/lib/countries";
import { useTheme } from "./ThemeContext";

interface ComposerProps {
  onRouteSubmit?: (query: string, country: string) => void;
  initialPrompt?: string;
  className?: string;
}

export default function Composer({
  onRouteSubmit,
  initialPrompt = "",
  className = "",
}: ComposerProps) {
  const [promptText, setPromptText] = useState(initialPrompt);
  // Backend expects the country NAME ("India", "United States", ...), not the ISO code.
  // India is shown by default for the UI, but it is not treated as an
  // explicitly selected country until the user actually chooses one.
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [hasManualCountrySelection, setHasManualCountrySelection] =
    useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useLanguage();
  const { isDark } = useTheme();

  const currentCountry =
    DEFAULT_COUNTRIES.find(
      (country) => country.name === selectedCountry
    ) || DEFAULT_COUNTRIES[0];

  const promptSuggestions = [
    "My Instagram account was hacked",
    "I need mental health support near me",
    "I need legal help in Lucknow",
    "Someone at home is hurting me",
    "I need emergency help",
  ];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const query = promptText.trim();
    if (!query || isSubmitting) return;

    setIsSubmitting(true);

    window.setTimeout(() => {
      onRouteSubmit?.(
        query,
        hasManualCountrySelection ? currentCountry.name : ""
      );
      setIsSubmitting(false);
    }, 250);
  };

  const handleSuggestion = (text: string) => {
    setPromptText(text);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <form
        onSubmit={handleSubmit}
        className={`w-full rounded-2xl sm:rounded-full p-2 sm:p-2.5 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all focus-within:ring-2 ${
          isDark
            ? "bg-slate-900/95 shadow-2xl shadow-teal-400/25 ring-teal-400/30 border border-teal-700"
            : "bg-white/95 shadow-2xl shadow-teal-600/40 ring-teal-500/40 border border-teal-300"
        }`}
      >
        {/* Country dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`w-full sm:w-auto h-11 px-3.5 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-between sm:justify-center gap-2 border transition-colors cursor-pointer ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-600"
                : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200/80"
            }`}
          >
            <span className="text-lg">{currentCountry.flag}</span>
            <span className="truncate max-w-[130px]">
              {currentCountry.name}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 ${
                isDark ? "text-slate-400" : "text-slate-400"
              }`}
            />
          </button>

          {dropdownOpen && (
            <>
              <button
                type="button"
                aria-label="Close country menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setDropdownOpen(false)}
              />

              <div
                className={`absolute left-0 top-full mt-2 w-52 max-h-60 overflow-y-auto rounded-xl shadow-xl border p-1 z-50 ${
                  isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                {DEFAULT_COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(country.name);
                      setHasManualCountrySelection(true);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                      selectedCountry === country.name
                        ? isDark
                          ? "bg-teal-950/60 text-teal-300 font-semibold"
                          : "bg-teal-50 text-teal-700 font-semibold"
                        : isDark
                          ? "text-slate-300 hover:bg-slate-800"
                          : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-base">{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Main query input */}
        <div className="flex-1 px-2 py-1 sm:py-0 min-w-0">
          <input
            type="text"
            value={promptText}
            onChange={(event) => setPromptText(event.target.value)}
            placeholder={t("Describe what you need help with...")}
            className={`w-full bg-transparent text-sm sm:text-base font-bold focus:outline-none ${
              isDark
                ? "text-white placeholder-slate-300"
                : "text-slate-900 placeholder-slate-700"
            }`}
          />

          <p
            className={`text-[11px] truncate mt-0.5 hidden sm:block ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            e.g. cyber fraud, mental health support, women safety, domestic
            violence, disaster relief...
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!promptText.trim() || isSubmitting}
          aria-label={t("Find support")}
          className={`w-full sm:w-11 h-11 rounded-xl sm:rounded-full flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 shrink-0 cursor-pointer ${
            promptText.trim()
              ? "bg-[#0d4a54] hover:bg-[#09353c] text-white"
              : isDark
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="sm:hidden text-xs font-semibold">
                {t("Find Helplines")}
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </>
          )}
        </button>
      </form>

      {/* Suggestions */}
      <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-1">
        {promptSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestion(suggestion)}
            className={`text-left text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer active:scale-95 ${
              isDark
                ? "bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white"
                : "bg-white hover:bg-teal-50/50 border-slate-300 text-slate-800 hover:text-teal-900 shadow-sm"
            }`}
          >
            {t(suggestion)}
          </button>
        ))}
      </div>
    </div>
  );
}
