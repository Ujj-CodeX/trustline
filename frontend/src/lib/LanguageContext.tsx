"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type LanguageContextType = {
  lang: string;
  changeLang: (lang: string) => void;
  translateTexts: (texts: string[]) => Promise<Record<string, string>>;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("trustline_ui_lang");

    if (saved) {
      setLang(saved);
    }
  }, []);

  const changeLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem("trustline_ui_lang", newLang);
  };

  const translateTexts = async (
    texts: string[]
  ): Promise<Record<string, string>> => {
    if (lang === "en") {
      return Object.fromEntries(texts.map((text) => [text, text]));
    }

    try {
      const res = await fetch(`${API_URL}/api/translate-ui/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts,
          lang,
        }),
      });

      if (!res.ok) {
        throw new Error(`UI translation failed: ${res.status}`);
      }

      const data = await res.json();

      return Object.fromEntries(
        texts.map((text, index) => [
          text,
          data.translated?.[index] ?? text,
        ])
      );
    } catch (error) {
      console.error("UI translation error:", error);

      // Keep original English text if translation fails
      return Object.fromEntries(texts.map((text) => [text, text]));
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        changeLang,
        translateTexts,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}