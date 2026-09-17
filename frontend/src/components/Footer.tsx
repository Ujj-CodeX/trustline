import React from "react";
import { ShieldCheck, Info, Shield, Sparkles } from "lucide-react";

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
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
            onClick={() => onNavigate("/")}
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
              onClick={() => onNavigate("/about")}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/resources")}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
            >
              Resources
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/safety")}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
            >
              Safety
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/safety")}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/how-it-works")}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/about")}
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

      {/* Fixed Bottom Disclaimer Bar (Exact match to screenshot) */}
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
  );
};

