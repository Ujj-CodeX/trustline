"use client";

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

const THEME_PREFERENCE_KEY = "trustline_theme_preference";
const LEGACY_THEME_KEY = "trustline_theme";

export const ThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Keep the first server and client render identical to avoid hydration mismatches.
  const [theme, setTheme] = useState<Theme>("dark");
  const [isHydrated, setIsHydrated] = useState(false);
  const [followsSystem, setFollowsSystem] = useState(false);

  useEffect(() => {
    const storedPreference = localStorage.getItem(THEME_PREFERENCE_KEY);

    if (storedPreference === "light" || storedPreference === "dark") {
      // A manual choice takes priority over the operating system.
      setTheme(storedPreference);
      setFollowsSystem(false);
    } else {
      // The old key stored the active theme on every visit, so it cannot
      // reliably tell a manual choice from the old default. Use system mode
      // unless a new, explicitly saved preference exists.
      localStorage.removeItem(LEGACY_THEME_KEY);

      const systemPreference = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      setTheme(systemPreference.matches ? "dark" : "light");
      setFollowsSystem(true);
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || !followsSystem) return;

    const systemPreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    systemPreference.addEventListener("change", handleSystemThemeChange);

    return () => {
      systemPreference.removeEventListener("change", handleSystemThemeChange);
    };
  }, [isHydrated, followsSystem]);

  useEffect(() => {
    if (!isHydrated) return;

    const root = document.documentElement;

    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [theme, isHydrated]);

  const toggleTheme = () => {
    setFollowsSystem(false);

    setTheme((previous) => {
      const next = previous === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_PREFERENCE_KEY, next);
      return next;
    });
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
