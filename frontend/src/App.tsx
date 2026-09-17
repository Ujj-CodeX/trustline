import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LandingPage } from "@/screens/LandingPage";
import { ChatPage } from "@/screens/ChatPage";
import { StaticShell } from "@/screens/StaticShell";
import { CountryOption } from "@/types";

const COUNTRIES: CountryOption[] = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
];

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [chatInitialQuery, setChatInitialQuery] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("India");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("trustline_theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Keep DOM class and localStorage in sync whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      localStorage.setItem("trustline_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      localStorage.setItem("trustline_theme", "light");
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Sync client-side URL routing with browser history
  useEffect(() => {
    const syncFromLocation = () => {
      const path = window.location.pathname || "/";
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      const c = params.get("country");

      setCurrentPath(path);
      if (q) setChatInitialQuery(q);
      if (c && COUNTRIES.some((item) => item.name === c)) {
        setSelectedCountry(c);
      }
    };

    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, []);

  const navigate = (path: string, queryParam?: string, countryParam?: string) => {
    let url = path;
    const params = new URLSearchParams();
    if (queryParam) params.set("q", queryParam);
    if (countryParam) params.set("country", countryParam);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    try {
      window.history.pushState({}, "", url);
    } catch {
      // In constrained iframe environments, state tracking remains active via React state
    }

    setCurrentPath(path);
    if (queryParam !== undefined) {
      setChatInitialQuery(queryParam);
    }
    if (countryParam) {
      setSelectedCountry(countryParam);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={(p) => navigate(p)}
        selectedCountry={selectedCountry}
        onCountryChange={(c) => setSelectedCountry(c)}
        countries={COUNTRIES}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPath === "/chat" ? (
          <ChatPage
            initialQuery={chatInitialQuery}
            selectedCountry={selectedCountry}
            onNavigate={(p) => navigate(p)}
            countries={COUNTRIES}
          />
        ) : currentPath === "/how-it-works" ? (
          <StaticShell page="how-it-works" onNavigate={(p) => navigate(p)} />
        ) : currentPath === "/resources" ? (
          <StaticShell page="resources" onNavigate={(p) => navigate(p)} />
        ) : currentPath === "/safety" ? (
          <StaticShell page="safety" onNavigate={(p) => navigate(p)} />
        ) : currentPath === "/about" ? (
          <StaticShell page="about" onNavigate={(p) => navigate(p)} />
        ) : (
          <LandingPage
            onNavigateToChat={(query, country) => navigate("/chat", query, country)}
            onNavigate={(p) => navigate(p)}
            selectedCountry={selectedCountry}
            onCountryChange={(c) => setSelectedCountry(c)}
            countries={COUNTRIES}
          />
        )}
      </main>

      {/* Footer with Fixed Disclaimer */}
      <Footer onNavigate={(p) => navigate(p)} />
    </div>
  );
}
