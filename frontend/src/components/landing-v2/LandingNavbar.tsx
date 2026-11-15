"use client";

import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const links = [
  { key: "How it works", href: "/how-it-works" },
  { key: "Resources", href: "/resources" },
  { key: "Safety", href: "/safety" },
  { key: "About", href: "/about" },
];

interface LandingNavbarProps {
  onGetHelp: () => void;
}

export default function LandingNavbar({ onGetHelp }: LandingNavbarProps) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const navigate = (href: string) => {
    setMobileOpen(false);
    window.location.href = href;
  };

  return (
    <nav
      aria-label="Main navigation"
      className={[
        "landing-nav fixed left-0 right-0 top-9 z-50 transition-all duration-500 ease-out",
        scrolled
          ? "border-b border-white/8 bg-[#050b10]/88 shadow-[0_12px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="landing-shell flex h-[68px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group inline-flex items-center rounded-full px-1 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
          aria-label={t("TrustLine home")}
        >
          <span className="text-[1.35rem] font-semibold tracking-[-0.045em] text-white transition-colors duration-300 group-hover:text-teal-200">
            TrustLine
          </span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => navigate(link.href)}
              className="text-[12px] font-medium text-white/60 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
            >
              {t(link.key)}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={onGetHelp}
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[12px] font-semibold text-white/90 backdrop-blur-md transition-all duration-300 hover:border-teal-300/30 hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70"
          >
            {t("Get Help")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/85 backdrop-blur-md md:hidden"
          aria-label={mobileOpen ? t("Close navigation") : t("Open navigation")}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/8 bg-[#050b10]/96 px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="landing-shell space-y-1">
            {links.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => navigate(link.href)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {t(link.key)}
                <ArrowRight className="h-4 w-4 text-white/30" aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={onGetHelp}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-3 text-sm font-semibold text-[#06211d]"
            >
              {t("Get Help")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
