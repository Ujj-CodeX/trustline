"use client";

import React, { useState } from "react";
import { ArrowUp, ChevronDown, Check } from "lucide-react";
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
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useLanguage();
  const { isDark } = useTheme();

  const currentCountry =
    DEFAULT_COUNTRIES.find(
      (country) => country.code === selectedCountry
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
      onRouteSubmit?.(query, currentCountry.name);
      setIsSubmitting(false);
    }, 250);
  };

  const handleSuggestion = (text: string) => {
    setPromptText(text);
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <form
        onSubmit={handleSubmit}
        className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-slate-900 transition-all duration-300 focus-within:ring-2 focus-within:ring-teal-400/40 ${
          isDark
            ? "bg-[#060e22] shadow-2xl shadow-black/70 border border-slate-700/80 hover:border-slate-600"
            : "bg-[#f6f4ee] shadow-[0_18px_60px_rgba(0,0,0,0.22)] border border-white/50"
        }`}
      >
        {/* Input */}
        <div className="px-1">
          <input
            type="text"
            value={promptText}
            onChange={(event) => setPromptText(event.target.value)}
            placeholder={t("Describe what you need help with...")}
            className={`w-full bg-transparent outline-none text-[15px] sm:text-base ${
              isDark
                ? "text-white placeholder:text-slate-400"
                : "text-slate-900 placeholder:text-slate-500"
            }`}
          />
        </div>

        {/* Bottom controls */}
        <div className="mt-3 pt-3 border-t border-slate-300/70 flex items-center justify-between gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isDark
                  ? "bg-[#081229] border border-slate-700 text-white"
                  : "bg-white/70 hover:bg-white border border-slate-300 text-slate-900"
              }`}
            >
              <span>{currentCountry.flag}</span>
              <span>{currentCountry.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {dropdownOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close country menu"
                  className="fixed inset-0 z-20 cursor-default"
                  onClick={() => setDropdownOpen(false)}
                />

                <div className={`absolute left-0 bottom-full mb-2 z-30 w-48 max-h-60 overflow-y-auto rounded-xl shadow-2xl p-1 border ${
                  isDark
                    ? "bg-[#081229] border-slate-700"
                    : "bg-white border-slate-200"
                }`}>
                  {DEFAULT_COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(country.code);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                        selectedCountry === country.code
                          ? isDark
                            ? "bg-teal-950/80 text-teal-300"
                            : "bg-teal-50 text-teal-700"
                          : isDark
                            ? "text-slate-200 hover:bg-slate-800"
                            : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </span>

                      {selectedCountry === country.code && (
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={!promptText.trim() || isSubmitting}
            aria-label={t("Find support")}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-teal-500 hover:bg-teal-400 disabled:bg-slate-300 disabled:text-slate-500 text-slate-950 shadow-md transition-all active:scale-95 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </form>

      {/* Suggestions */}
      <div className="mt-3 flex flex-wrap justify-center gap-2 px-1">
        {promptSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestion(suggestion)}
            className={`px-3 py-1.5 rounded-full border text-[11px] sm:text-xs backdrop-blur-sm transition-all active:scale-95 ${
              isDark
                ? "border-white/20 bg-white/10 text-white/85 hover:bg-white/15"
                : "border-slate-300 bg-white/70 text-slate-700 hover:bg-white"
            }`}
          >
            {t(suggestion)}
          </button>
        ))}
      </div>
    </div>
  );
}