"use client";
<<<<<<< HEAD
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
>>>>>>> 16c6caff36431655593351e4d1702f71f7a55b42

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext =
  createContext<ThemeContextType | undefined>(undefined);

<<<<<<< HEAD
export const ThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored =
        localStorage.getItem("trustline_theme");

      if (stored === "light" || stored === "dark") {
        return stored;
      }
    }

    // ZIP behavior: TrustLine defaults to dark.
    return "dark";
  });
=======
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Keep the first render identical on server and client.
  // Read localStorage only after hydration to avoid SSR/client markup mismatch.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('trustline_theme');

    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    }
  }, []);
>>>>>>> 16c6caff36431655593351e4d1702f71f7a55b42

  useEffect(() => {
    const root = document.documentElement;

<<<<<<< HEAD
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
=======
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
>>>>>>> 16c6caff36431655593351e4d1702f71f7a55b42
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }

<<<<<<< HEAD
    localStorage.setItem(
      "trustline_theme",
      theme
    );
=======
    localStorage.setItem('trustline_theme', theme);
>>>>>>> 16c6caff36431655593351e4d1702f71f7a55b42
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) =>
      previous === "dark" ? "light" : "dark"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used within a ThemeProvider"
    );
  }

  return context;
};