"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Languages } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "es", name: "Español" },
  { code: "ta", name: "தமிழ்" },
  { code: "bn", name: "বাংলা" },
];

export function LanguagePicker() {
    const { lang, changeLang } = useLanguage() ;


    return (
        <div className="fixed bottom-14 right-4 z-50">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-md">
        <Languages className="w-4 h-4 text-teal-600" />

        <select
          value={lang}
          onChange={(e) => changeLang(e.target.value)}
          className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
        >
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </div>
    </div>


    );

}