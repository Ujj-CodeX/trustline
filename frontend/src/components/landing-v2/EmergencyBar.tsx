"use client";

import { AlertTriangle, PhoneCall } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function EmergencyBar() {
  const { t } = useLanguage();

  return (
    <div className="landing-emergency-bar" role="alert">
      <div className="landing-shell flex min-h-9 items-center justify-center gap-2 px-4 text-center text-[11px] font-medium tracking-[0.01em] sm:text-xs">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-400" aria-hidden="true" />
        <span className="text-white/75">{t("Urgent emergency or dangerous situation?")}</span>
        <a
          href="tel:112"
          className="inline-flex items-center gap-1 font-semibold text-red-300 transition-colors hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/70"
        >
          <PhoneCall className="h-3 w-3" aria-hidden="true" />
          {t("Call 112 immediately")}
        </a>
      </div>
    </div>
  );
}
