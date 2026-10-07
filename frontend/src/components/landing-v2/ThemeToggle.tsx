<<<<<<< HEAD
"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
=======
import React from 'react';
import { Sun, Moon } from 'lucide-react';
>>>>>>> 16c6caff36431655593351e4d1702f71f7a55b42
import { useTheme } from "./ThemeContext";

interface ThemeToggleProps {
  className?: string;
  variant?: "nav" | "floating";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  variant = "nav",
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (variant === "floating") {
    return (
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none ${className}`}
      >
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            isDark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer active:scale-90 ${
            isDark
              ? "bg-[#081229]/95 hover:bg-[#0c1a3b] text-amber-300 border border-slate-700/80 shadow-black/60 hover:border-amber-400/50 hover:shadow-amber-500/10"
              : "bg-white hover:bg-slate-50 text-indigo-900 border border-slate-200/90 shadow-slate-400/30 hover:border-indigo-400/50 hover:shadow-indigo-500/10"
          }`}
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-300 transition-all duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-700 fill-indigo-700/20 transition-transform duration-300" />
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 ${
        isDark
          ? "bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-slate-700/70 hover:border-amber-400/40"
          : "bg-slate-100 hover:bg-slate-200 text-indigo-900 border border-slate-300/80 hover:border-indigo-400/40"
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-700 fill-indigo-700/20" />
      )}
    </button>
  );
};

export default ThemeToggle;