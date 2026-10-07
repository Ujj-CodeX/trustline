"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";

export const EmergencyBar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <aside
      aria-label={t("Emergency life-safety alert")}
      className="w-full bg-[#02050c] border-b border-red-500/25 text-slate-300 text-[10px] sm:text-xs py-1.5 px-3 sm:px-4 shadow-sm select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 text-center leading-tight">
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0"
        />

        <span className="font-normal text-slate-300">
          {t("Urgent emergency or dangerous situation?")}{" "}

          <a
            href="tel:112"
            className="text-red-400 font-bold hover:underline hover:text-red-300 inline-flex items-center gap-0.5 mx-0.5"
          >
            <span>{t("Call 112 immediately")}</span>
          </a>
        </span>
      </div>
    </aside>
  );
};

export default EmergencyBar; 