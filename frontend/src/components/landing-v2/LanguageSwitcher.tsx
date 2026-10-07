import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronUp, Check } from 'lucide-react';
import { useLanguage, LANGUAGES, LanguageCode } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, currentOption } = useLanguage();
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 select-none font-sans"
      aria-label="Language selection"
    >
      {/* Dropdown Menu */}
      {open && (
        <div className={`absolute bottom-full left-0 mb-2 w-52 max-w-[calc(100vw-2rem)] backdrop-blur-xl border rounded-2xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
          isDark
            ? 'bg-[#060d20]/95 border-slate-700/80 shadow-black/80'
            : 'bg-white/95 border-slate-200 shadow-slate-300/60'
        }`}>
          <div className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border-b mb-1 ${
            isDark ? 'text-slate-400 border-slate-800/80' : 'text-slate-500 border-slate-200'
          }`}>
            Interface Language
          </div>
          <div className="space-y-0.5 max-h-56 overflow-y-auto">
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer min-h-[40px] active:scale-98 ${
                    isActive
                      ? isDark
                        ? 'bg-slate-800/90 text-white font-medium'
                        : 'bg-slate-100 text-slate-900 font-semibold'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>({lang.name})</span>
                  </span>
                  {isActive && <Check className="w-3.5 h-3.5 text-teal-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Pill Trigger matching TrustLine theme */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full border text-xs font-medium shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer group active:scale-95 ${
          isDark
            ? 'bg-[#081229]/95 hover:bg-[#0c1838] border-slate-700/80 hover:border-slate-600 text-slate-200 shadow-black/60'
            : 'bg-white/95 hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 shadow-slate-300/40'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-teal-500 group-hover:rotate-12 transition-transform duration-300 shrink-0" />
        <span className={`shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentOption.flag}</span>
        <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentOption.nativeName}</span>
        <ChevronUp
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            open ? 'rotate-180 text-teal-500' : isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        />
      </button>
    </div>
  );
};
