"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

type TranslationCache = Record<string, Record<string, string>>;

type LanguageContextType = {
  lang: string;
  changeLang: (lang: string) => void;
  t: (text: string) => string;
  translateTexts: (texts: string[]) => Promise<Record<string, string>>;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const CACHE_KEY = "trustline_ui_translation_cache";

function readCache(): TranslationCache {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const [lang, setLang] = useState("en");
  const [cache, setCache] = useState<TranslationCache>(() => readCache());

  const cacheRef = useRef<TranslationCache>(cache);
  const requestIdRef = useRef(0);

  useEffect(() => {
    cacheRef.current = cache;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {}
  }, [cache]);

  useEffect(() => {
    const saved = localStorage.getItem("trustline_ui_lang");
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const changeLang = useCallback((newLang: string) => {
    setLang(newLang);
    localStorage.setItem("trustline_ui_lang", newLang);
  }, []);

  const translateTexts = useCallback(
    async (texts: string[]): Promise<Record<string, string>> => {
      const uniqueTexts = [
        ...new Set(
          texts.filter(
            (text): text is string =>
              typeof text === "string" && text.trim().length > 0
          )
        ),
      ];

      if (!uniqueTexts.length || lang === "en") {
        return Object.fromEntries(uniqueTexts.map((text) => [text, text]));
      }

      const currentCache = cacheRef.current[lang] || {};
      const missingTexts = uniqueTexts.filter(
        (text) => !(text in currentCache)
      );

      if (!missingTexts.length) {
        return Object.fromEntries(
          uniqueTexts.map((text) => [text, currentCache[text] || text])
        );
      }

      const currentRequestId = ++requestIdRef.current;

      try {
        const response = await fetch(`${API_URL}/api/translate-ui/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            texts: missingTexts,
            lang,
          }),
        });

        if (!response.ok) {
          throw new Error(`UI translation failed: ${response.status}`);
        }

        const data = await response.json();
        const translated = Array.isArray(data.translated)
          ? data.translated
          : [];

        const additions: Record<string, string> = {};
        missingTexts.forEach((text, index) => {
          additions[text] = translated[index] ?? text;
        });

        const mergedLanguageCache = {
          ...(cacheRef.current[lang] || {}),
          ...additions,
        };

        const mergedCache = {
          ...cacheRef.current,
          [lang]: mergedLanguageCache,
        };

        cacheRef.current = mergedCache;

        if (currentRequestId === requestIdRef.current) {
          setCache(mergedCache);
        } else {
          setCache((previous) => ({
            ...previous,
            [lang]: mergedLanguageCache,
          }));
        }

        return Object.fromEntries(
          uniqueTexts.map((text) => [
            text,
            mergedLanguageCache[text] || text,
          ])
        );
      } catch (error) {
        console.error("[TrustLine] UI translation request failed:", error);
        return Object.fromEntries(
          uniqueTexts.map((text) => [
            text,
            currentCache[text] || text,
          ])
        );
      }
    },
    [lang]
  );

  const t = useCallback(
    (text: string) =>
      lang === "en"
        ? text
        : cacheRef.current[lang]?.[text] || text,
    [lang, cache]
  );

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, translateTexts }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
