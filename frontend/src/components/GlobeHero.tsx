import React, { useState } from "react";
import {
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { CountryOption } from "@/src/types";

interface GlobeHeroProps {
  onSearch: (query: string, country: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  countries: CountryOption[];
}

export const GlobeHero: React.FC<GlobeHeroProps> = ({
  onSearch,
  selectedCountry,
  onCountryChange,
  countries,
}) => {
  const [inputQuery, setInputQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      onSearch(inputQuery.trim(), selectedCountry);
    } else {
      // Default to general help query
      onSearch("Emergency helplines and immediate support resources", selectedCountry);
    }
  };

  const currentCountry =
    countries.find((c) => c.name === selectedCountry) || countries[0];

  // 6 locations exactly as in screenshot (calm, static halos - no blinkers/twinkling)
  const pins = [
    {
      id: "canada",
      label: "Mental health support in Canada",
      query: "Mental health support and counseling in Canada",
      country: "Canada",
      dotColor: "bg-teal-500",
      haloColor: "bg-teal-500/15 border border-teal-500/30 dark:bg-teal-400/20 dark:border-teal-400/40",
      badgeBorder: "border-teal-200 dark:border-teal-800",
      x: 18,
      y: 31,
    },
    {
      id: "uk",
      label: "Legal aid support in the UK",
      query: "Free legal aid and advisory support in the UK",
      country: "United Kingdom",
      dotColor: "bg-purple-600",
      haloColor: "bg-purple-500/15 border border-purple-500/30 dark:bg-purple-400/20 dark:border-purple-400/40",
      badgeBorder: "border-purple-200 dark:border-purple-800",
      x: 46,
      y: 30,
    },
    {
      id: "japan",
      label: "Cyber crime support in Japan",
      query: "Cyber crime fraud reporting helpline in Japan",
      country: "Japan",
      dotColor: "bg-rose-500",
      haloColor: "bg-rose-500/15 border border-rose-500/30 dark:bg-rose-400/20 dark:border-rose-400/40",
      badgeBorder: "border-rose-200 dark:border-rose-800",
      x: 83,
      y: 33,
    },
    {
      id: "brazil",
      label: "Disaster relief resources in Brazil",
      query: "Disaster relief and civil defense emergency in Brazil",
      country: "Brazil",
      dotColor: "bg-emerald-500",
      haloColor: "bg-emerald-500/15 border border-emerald-500/30 dark:bg-emerald-400/20 dark:border-emerald-400/40",
      badgeBorder: "border-emerald-200 dark:border-emerald-800",
      x: 27,
      y: 69,
    },
    {
      id: "india",
      label: "Women safety helpline in India",
      query: "Women safety emergency helpline 1091 and 112 in India",
      country: "India",
      dotColor: "bg-amber-500",
      haloColor: "bg-amber-500/15 border border-amber-500/30 dark:bg-amber-400/20 dark:border-amber-400/40",
      badgeBorder: "border-amber-200 dark:border-amber-800",
      x: 65,
      y: 54,
    },
    {
      id: "australia",
      label: "Emergency help in Australia",
      query: "Triple Zero 000 emergency services in Australia",
      country: "Australia",
      dotColor: "bg-blue-600",
      haloColor: "bg-blue-500/15 border border-blue-500/30 dark:bg-blue-400/20 dark:border-blue-400/40",
      badgeBorder: "border-blue-200 dark:border-blue-800",
      x: 84,
      y: 75,
    },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 md:pt-14 md:pb-16 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-100/40 dark:bg-teal-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Pill Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase shadow-2xs">
          <span>GLOBAL SUPPORT</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span>VERIFIED SOURCES</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span>POWERED BY AI</span>
        </div>
      </div>

      {/* Headline & Hand-drawn Note Wrapper with World Map Background */}
      <div className="relative max-w-5xl mx-auto text-center px-4 pt-2">
        {/* World Map Dotted Image Background Texture directly behind the heroic text */}
        <div className="absolute inset-0 -top-6 sm:-top-10 -bottom-8 sm:-bottom-12 pointer-events-none select-none overflow-hidden flex items-center justify-center -z-10">
          <img
            src="/world_map_dotted.png"
            alt="World Map Texture Background"
            className="w-full max-w-5xl h-full object-contain opacity-65 dark:opacity-30 contrast-125 select-none"
            draggable={false}
          />
          {/* Soft radial overlay for 100% text readability in both light & dark mode */}
          <div className="absolute inset-0 bg-radial from-slate-50/75 via-slate-50/30 to-transparent dark:from-slate-950/80 dark:via-slate-950/35 dark:to-transparent pointer-events-none" />
        </div>

        {/* Playful Handwritten Note: "Help Has No Borders" */}
        <div className="hidden md:block absolute -right-2 lg:right-4 -top-4 rotate-[-8deg] pointer-events-none select-none">
          <div className="text-teal-600 dark:text-teal-400 font-bold leading-none tracking-tight">
            <span className="block text-xl lg:text-2xl font-serif italic">Help</span>
            <span className="block text-xl lg:text-2xl font-serif italic pl-2">Has No</span>
            <span className="block text-2xl lg:text-3xl font-serif italic pl-4">Borders</span>
          </div>
          {/* Hand-drawn double underline swoosh */}
          <svg
            className="w-24 h-4 text-teal-600 dark:text-teal-400 mt-0.5 ml-3"
            viewBox="0 0 100 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M5 6 C 30 14, 70 2, 95 10" />
            <path d="M12 14 C 35 18, 65 10, 88 16" />
          </svg>
        </div>

        {/* Main Display Headline (Exact 3 lines as in screenshot) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
          Millions don’t know <br className="hidden sm:inline" />
          where to turn when{" "}
          <span className="text-teal-600 dark:text-teal-400">it</span> <br className="hidden sm:inline" />
          <span className="text-teal-600 dark:text-teal-400">matters most.</span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal mt-4 max-w-2xl mx-auto leading-relaxed">
          TrustLine connects you to verified helplines and support resources
          <br className="hidden sm:inline" />
          {" "}— instantly, anywhere in the world.
        </p>

        {/* Verification guarantee line */}
        <div className="inline-flex items-center justify-center gap-2 mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>
            Every number is sourced from government helplines, NGOs, and verified directories — not AI guesses.
          </span>
        </div>
      </div>

      {/* Floating Chat Input Bar (Moved Upward, immediately below heroic text & subtext) */}
      <div className="w-full max-w-3xl lg:max-w-4xl mx-auto mt-6 sm:mt-8 px-2 sm:px-4 relative z-20">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-xl shadow-slate-900/5 dark:shadow-black/50 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-teal-500/40"
        >
          {/* Country Dropdown Pill on Left */}
          <div className="relative shrink-0">
            <button
              type="button"
              id="hero-input-country-dropdown"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full sm:w-auto h-11 px-3.5 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-between sm:justify-center gap-2 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
            >
              <span className="text-lg">{currentCountry.flag}</span>
              <span className="truncate max-w-[85px]">{currentCountry.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-52 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1 z-50">
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        onCountryChange(c.name);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                        selectedCountry === c.name
                          ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-base">{c.flag}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Center Input Field */}
          <div className="flex-1 px-2 py-1 sm:py-0">
            <label htmlFor="hero-situation-input" className="sr-only">
              Describe what you need help with
            </label>
            <input
              id="hero-situation-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Describe what you need help with..."
              className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-700 dark:placeholder-slate-300 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5 hidden sm:block">
              e.g. cyber fraud, mental health support, women safety, domestic violence, disaster relief...
            </p>
          </div>

          {/* Right Submit Button with Arrow */}
          <button
            type="submit"
            id="hero-search-submit"
            aria-label="Find Support"
            className="w-full sm:w-11 h-11 rounded-xl sm:rounded-full bg-[#0d4a54] hover:bg-[#09353c] text-white flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 shrink-0 cursor-pointer"
          >
            <span className="sm:hidden text-xs font-semibold">Find Helplines</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </form>
      </div>

      {/* World Map with 6 Pins & Curved Connecting Arcs */}
      <div className="relative w-full max-w-5xl mx-auto mt-4 sm:mt-6 min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex items-center justify-center">
        {/* World Map Dotted Image Background Texture */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <img
            src="/world_map_dotted.png"
            alt="World Map Dotted Texture"
            className="w-full h-full max-w-5xl object-contain opacity-65 dark:opacity-30 contrast-125 select-none"
            draggable={false}
          />
          {/* Subtle soft edge blend overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/30 via-transparent to-slate-50/60 dark:from-slate-950/30 dark:via-transparent dark:to-slate-950/60 pointer-events-none" />
        </div>

        {/* Curved connecting flight arcs overlay (Clean cyan lines, no blinking) */}
        <svg
          className="w-full h-full absolute inset-0 pointer-events-none"
          viewBox="0 0 1000 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="heroLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {/* Arcs linking continents */}
          <g stroke="url(#heroLineGrad)" strokeWidth="1.2" strokeLinecap="round" className="opacity-80 dark:opacity-60">
            {/* Canada (180, 155) to UK (460, 150) */}
            <path d="M 180 155 Q 320 80, 460 150" />
            {/* UK (460, 150) to Japan (830, 165) */}
            <path d="M 460 150 Q 640 60, 830 165" />
            {/* UK (460, 150) to India (650, 270) */}
            <path d="M 460 150 Q 560 210, 650 270" />
            {/* Canada (180, 155) to Brazil (270, 345) */}
            <path d="M 180 155 Q 195 250, 270 345" />
            {/* Brazil (270, 345) to India (650, 270) */}
            <path d="M 270 345 Q 460 380, 650 270" />
            {/* India (650, 270) to Australia (840, 375) */}
            <path d="M 650 270 Q 755 320, 840 375" />
            {/* Japan (830, 165) to Australia (840, 375) */}
            <path d="M 830 165 Q 870 270, 840 375" />
            {/* Subtle secondary connector from Brazil to Africa junction */}
            <path d="M 270 345 Q 380 340, 490 350" />
            <path d="M 490 350 Q 570 320, 650 270" />
          </g>

          {/* Static junction intersection nodes (calm, no blinkers) */}
          <g fill="#0284c7" className="opacity-60 dark:opacity-80">
            <circle cx="490" cy="350" r="3" />
            <circle cx="560" cy="210" r="2.5" />
            <circle cx="320" cy="80" r="2" />
            <circle cx="755" cy="320" r="2.5" />
          </g>
        </svg>

        {/* Desktop Pin Badges (Positioned matching the screenshot, static halos - NO blinkers) */}
        <div className="hidden md:block absolute inset-0 pointer-events-auto">
          {pins.map((pin) => (
            <div
              key={pin.id}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 group cursor-pointer z-10 select-none"
              onClick={() => {
                onCountryChange(pin.country);
                onSearch(pin.query, pin.country);
              }}
              title={`Click to find ${pin.label}`}
            >
              {/* Static Halo & Colored Dot - Strictly NO blinkers / NO twinkling */}
              <div className="relative flex items-center justify-center shrink-0">
                <div
                  className={`w-7 h-7 rounded-full ${pin.haloColor} flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs`}
                >
                  <span className={`w-3 h-3 rounded-full ${pin.dotColor} shadow-xs`} />
                </div>
              </div>

              {/* White Floating Pill Badge */}
              <div
                className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3 py-1.5 rounded-full border ${pin.badgeBorder} shadow-xs group-hover:shadow-md transition-all group-hover:-translate-y-0.5`}
              >
                <span className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {pin.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: Clean Stacked Location Badges below world map */}
        <div className="md:hidden w-full pt-4 pb-2 z-10 flex flex-wrap justify-center gap-2">
          {pins.map((pin) => (
            <button
              key={pin.id}
              type="button"
              onClick={() => {
                onCountryChange(pin.country);
                onSearch(pin.query, pin.country);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border ${pin.badgeBorder} shadow-2xs text-[11px] font-semibold text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${pin.dotColor} shrink-0`} />
              <span className="truncate max-w-[180px]">{pin.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
