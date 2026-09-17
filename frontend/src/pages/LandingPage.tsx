import React from "react";
import {
  FileText,
  Brain,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Lock,
  LifeBuoy,
  Heart,
  Users,
  Laptop,
  CloudRain,
  Scale,
  MoreHorizontal,
  User,
  Globe2,
  Languages,
  Clock,
} from "lucide-react";
import { GlobeHero } from "@/components/GlobeHero";
import { CountryOption } from "@/types";

interface LandingPageProps {
  onNavigateToChat: (initialQuery?: string, country?: string) => void;
  onNavigate: (path: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  countries: CountryOption[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToChat,
  onNavigate,
  selectedCountry,
  onCountryChange,
  countries,
}) => {
  const categoryCards = [
    {
      id: "mental-health",
      title: "Mental Health Support",
      query: "Mental health support counseling and crisis line",
      icon: Heart,
      iconColor: "text-sky-500 fill-sky-500",
      bgColor: "bg-sky-50 dark:bg-sky-950/40",
    },
    {
      id: "women-safety",
      title: "Women Safety & Gender Support",
      query: "Women safety emergency helpline and domestic abuse support",
      icon: Users,
      iconColor: "text-rose-500 fill-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-950/40",
    },
    {
      id: "cyber-crime",
      title: "Cyber Crime Assistance",
      query: "Cyber crime fraud reporting helpline and financial scam recovery",
      icon: Laptop,
      iconColor: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
    },
    {
      id: "disaster-relief",
      title: "Disaster Relief & Emergency",
      query: "Disaster relief rescue flood fire and civil defense emergency",
      icon: CloudRain,
      iconColor: "text-amber-500 fill-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      id: "legal-aid",
      title: "Legal Aid & Consumer Rights",
      query: "Free legal aid attorney advisory and consumer rights protection",
      icon: Scale,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      id: "more-categories",
      title: "More Categories",
      subtitle: "Explore all support areas",
      query: "Complete directory of verified emergency and public support lines",
      icon: MoreHorizontal,
      iconColor: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/40",
    },
  ];

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Section with Dotted World Map & Input */}
      <GlobeHero
        onSearch={(q, c) => onNavigateToChat(q, c)}
        selectedCountry={selectedCountry}
        onCountryChange={onCountryChange}
        countries={countries}
      />

      {/* 2. "How it works" 3-step row */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Step 1 */}
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 block leading-none">
                    1
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                    Describe your situation
                  </span>
                </div>
              </div>
              <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 ml-2" />
            </div>

            {/* Step 2 */}
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 block leading-none">
                    2
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                    AI understands your need
                  </span>
                </div>
              </div>
              <ArrowRight className="hidden md:block w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 ml-2" />
            </div>

            {/* Step 3 */}
            <div className="flex items-center p-2">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 block leading-none">
                    3
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block mt-1">
                    Get verified, real contacts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3 Trust Badges Row */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Badge 1: Verified sources */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6 fill-blue-600/20" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Verified sources
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                From trusted organisations
              </p>
            </div>
          </div>

          {/* Badge 2: Private & anonymous */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Private & anonymous
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                No sign-up. No tracking.
              </p>
            </div>
          </div>

          {/* Badge 3: Free to use */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Free to use
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Help for everyone, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "Find support for what matters" 6-Card Category Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find support for what matters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {categoryCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onNavigateToChat(card.query, selectedCountry)}
                className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center ${card.iconColor} shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Stats Row */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-6 border-y border-slate-200/80 dark:border-slate-800">
          {/* Stat 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block leading-none">
                10,000+
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">
                Helpline records
              </span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block leading-none">
                195+
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">
                Countries & regions
              </span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block leading-none">
                50+
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">
                Languages
              </span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block leading-none">
                24/7
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">
                Support availability
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
