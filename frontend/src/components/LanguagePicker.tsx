"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, ChevronUp, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "mr", name: "मराठी" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "ml", name: "മലയാളം" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "ur", name: "اردو" },
  { code: "ne", name: "नेपाली" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
  { code: "ru", name: "Русский" },
  { code: "sv", name: "Svenska" },
];

export function LanguagePicker() {
  const { lang, changeLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const selectedLanguage =
    LANGUAGES.find((language) => language.code === lang) ||
    LANGUAGES[0];

  return (
    <div
      ref={pickerRef}
      data-translation-skip="true"
      className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-[80]"
    >
      <div className="relative">
        {open && (
          <div className="absolute bottom-full left-0 mb-2 w-56 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            {LANGUAGES.map((language) => {
              const selected =
                language.code === lang;

              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => {
                    changeLang(language.code);
                    setOpen(false);
                  }}
                  className={[
                    "w-full flex items-center justify-between gap-3",
                    "rounded-lg px-3 py-2.5 text-left text-sm",
                    "font-medium transition-colors",
                    "text-slate-800 hover:bg-slate-100",
                    "dark:text-slate-100 dark:hover:bg-slate-800",
                    selected
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                      : "",
                  ].join(" ")}
                >
                  <span>{language.name}</span>

                  {selected && (
                    <Check className="h-4 w-4 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full border border-slate-700/80 bg-[#081229]/95 px-3 py-2 text-xs font-semibold text-slate-100 shadow-xl backdrop-blur-md transition-colors hover:bg-[#0c1838]"
        >
          <Globe className="h-4 w-4 text-teal-500" />
          <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">
            {selectedLanguage.code}
          </span>
          <span>{selectedLanguage.name}</span>
          <ChevronUp
            className={[
              "h-3.5 w-3.5 text-slate-500 transition-transform",
              "dark:text-slate-400",
              open ? "" : "rotate-180",
            ].join(" ")}
          />
        </button>
      </div>
    </div>
  );
}
