"use client";

import { useState } from "react";
import { ArrowUp, Check, ChevronDown, Globe2 } from "lucide-react";
import { DEFAULT_COUNTRIES } from "@/lib/countries";
import { useLanguage } from "@/lib/LanguageContext";

interface ComposerProps {
  onSubmit: (query: string, country: string) => void;
}

const examples = [
  "My Instagram account was hacked",
  "I need mental health support near me",
  "I need legal help in Lucknow",
  "Someone at home is hurting me",
];

export default function Composer({ onSubmit }: ComposerProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRIES[0]?.name || "India");
  const [countryOpen, setCountryOpen] = useState(false);

  const submit = () => {
    const query = value.trim();
    if (!query) return;
    onSubmit(query, country);
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="landing-composer group rounded-[22px] bg-[#F6F4EE] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.30)] ring-1 ring-black/10 transition-transform duration-300 focus-within:-translate-y-0.5 focus-within:shadow-[0_30px_75px_rgba(0,0,0,0.34)]">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          rows={2}
          placeholder={t("Describe what you need help with...")}
          className="min-h-16 w-full resize-none bg-transparent px-3 py-2 text-base leading-7 text-[#12312c] outline-none placeholder:text-[#70817c] sm:min-h-[72px] sm:px-4 sm:py-3 sm:text-[15px]"
          aria-label={t("Describe what you need help with")}
        />

        <div className="flex items-center justify-between gap-3 border-t border-[#17352f]/10 px-1.5 pt-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCountryOpen((open) => !open)}
              className="inline-flex max-w-[190px] items-center gap-2 rounded-full border border-[#17352f]/10 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#29423d] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/30"
            >
              {country ? (
                <span>{DEFAULT_COUNTRIES.find((item) => item.name === country)?.flag || "🌐"}</span>
              ) : (
                <Globe2 className="h-3.5 w-3.5" />
              )}
              <span className="truncate">{country || t("Anywhere")}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#657974]" aria-hidden="true" />
            </button>

            {countryOpen && (
              <div className="absolute bottom-full left-0 z-40 mb-2 w-52 overflow-hidden rounded-2xl border border-white/40 bg-[#F8F7F2] p-1.5 shadow-2xl ring-1 ring-black/5">
                <button
                  type="button"
                  onClick={() => {
                    setCountry("");
                    setCountryOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs text-[#223f38] hover:bg-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <Globe2 className="h-3.5 w-3.5" />
                    {t("Anywhere")}
                  </span>
                  {!country && <Check className="h-3.5 w-3.5 text-teal-700" />}
                </button>

                {DEFAULT_COUNTRIES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setCountry(item.name);
                      setCountryOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs text-[#223f38] hover:bg-white"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span>{item.flag}</span>
                      {item.name}
                    </span>
                    {country === item.name && (
                      <Check className="h-3.5 w-3.5 text-teal-700" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-[#F6F4EE] shadow-[0_8px_20px_rgba(15,118,110,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0d6b64] disabled:cursor-not-allowed disabled:bg-[#D6D9D4] disabled:text-[#929A96] disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40"
            aria-label={t("Find support")}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setValue(example)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium text-white/58 backdrop-blur-sm transition-all duration-300 hover:border-teal-300/25 hover:bg-white/[0.07] hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/50 sm:text-xs"
          >
            <span>{t(example)}</span>
            <span className="translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-70">→</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] leading-5 text-white/42 sm:text-xs">
        {t("TrustLine helps route you to relevant support resources. Always verify critical information with the appropriate local authority.")}
      </p>
    </div>
  );
}
