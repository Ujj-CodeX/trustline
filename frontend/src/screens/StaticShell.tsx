import React from "react";
import { ArrowLeft, ShieldCheck, HelpCircle, BookOpen, Lock, Info } from "lucide-react";

interface StaticShellProps {
  page: "how-it-works" | "resources" | "safety" | "about";
  onNavigate: (path: string) => void;
}

export const StaticShell: React.FC<StaticShellProps> = ({ page, onNavigate }) => {
  const pageData = {
    "how-it-works": {
      title: "How TrustLine Works",
      tagline: "Intelligent matching to certified support helplines worldwide.",
      icon: HelpCircle,
      content:
        "TrustLine analyzes your situation using safe AI to immediately identify the domain of assistance you require (such as cyber crime, mental health, legal aid, or emergency rescue) and pinpoints verified local and national resources. Every record is cross-checked against official government registries and certified crisis lines so you can reach trusted assistance with zero guesswork.",
    },
    resources: {
      title: "Helpline Resources Directory",
      tagline: "Comprehensive catalog of verified emergency and public support lines.",
      icon: BookOpen,
      content:
        "Our directory indexes thousands of active helplines across 195+ countries. From official national emergency response systems to specialized NGOs, tele-counseling hotlines, and victim support desks, all numbers and service URLs are maintained with rigorous verification protocols to ensure immediate reliability.",
    },
    safety: {
      title: "Safety & Privacy Commitment",
      tagline: "Strictly anonymous. No tracking. Zero personal data stored.",
      icon: Lock,
      content:
        "TrustLine is built on a privacy-first foundation. We do not require accounts, logins, or cookies, and we do not store chat histories across sessions. Your location and queries are processed statelessly solely to find the correct helpline in your jurisdiction, ensuring complete confidentiality during your most sensitive moments.",
    },
    about: {
      title: "About TrustLine",
      tagline: "Connecting people in distress to verified help in seconds.",
      icon: Info,
      content:
        "TrustLine was created to eliminate the friction and panic of searching for help during a crisis. By bridging AI-driven intent discovery with verified civic infrastructure, TrustLine ensures that anyone, anywhere in the world, can find the right emergency line, legal aid clinic, or emotional support hotline at the exact moment they need it.",
    },
  };

  const current = pageData[page] || pageData["about"];
  const Icon = current.icon;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-6">
      <button
        type="button"
        onClick={() => onNavigate("/")}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {current.title}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {current.tagline}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {current.content}
          </p>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => onNavigate("/chat")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Launch TrustLine Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
