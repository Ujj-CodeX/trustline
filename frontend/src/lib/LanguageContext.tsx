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

function safeStorageGet(key: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key: string, value: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage may be unavailable/restricted.
  }
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const [lang, setLang] = useState("en");

  // Translation cache stays in memory.
  // No localStorage writes for every translation update.
  const [cache, setCache] = useState<TranslationCache>({});

  const cacheRef = useRef<TranslationCache>({});
  const requestIdRef = useRef(0);

  // Restore only the selected language.
  useEffect(() => {
    const savedLang = safeStorageGet("trustline_ui_lang");

    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  // Keep document language in sync.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const changeLang = useCallback((newLang: string) => {
    setLang(newLang);

    safeStorageSet("trustline_ui_lang", newLang);
  }, []);

  const translateTexts = useCallback(
    async (
      texts: string[]
    ): Promise<Record<string, string>> => {
      const uniqueTexts = [
        ...new Set(
          texts.filter(
            (text): text is string =>
              typeof text === "string" &&
              text.trim().length > 0
          )
        ),
      ];

      // English = no API call.
      if (!uniqueTexts.length || lang === "en") {
        return Object.fromEntries(
          uniqueTexts.map((text) => [text, text])
        );
      }

      const currentCache =
        cacheRef.current[lang] || {};

      const missingTexts = uniqueTexts.filter(
        (text) => !(text in currentCache)
      );

      // Everything is already translated.
      if (!missingTexts.length) {
        return Object.fromEntries(
          uniqueTexts.map((text) => [
            text,
            currentCache[text] || text,
          ])
        );
      }

      const currentRequestId =
        ++requestIdRef.current;

      try {
        const response = await fetch(
          `${API_URL}/api/translate-ui/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              texts: missingTexts,
              lang,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `UI translation failed: ${response.status}`
          );
        }

        const data = await response.json();

        const translated = Array.isArray(
          data.translated
        )
          ? data.translated
          : [];

        const additions: Record<string, string> = {};

        missingTexts.forEach((text, index) => {
          additions[text] =
            translated[index] ?? text;
        });

        const mergedLanguageCache = {
          ...(cacheRef.current[lang] || {}),
          ...additions,
        };

        const mergedCache = {
          ...cacheRef.current,
          [lang]: mergedLanguageCache,
        };

        // Update ref immediately.
        cacheRef.current = mergedCache;

        // Trigger React re-render.
        if (
          currentRequestId === requestIdRef.current
        ) {
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
        console.error(
          "[TrustLine] UI translation request failed:",
          error
        );

        // Keep already-known translations.
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
    (text: string) => {
      if (lang === "en") {
        return text;
      }

      return (
        cacheRef.current[lang]?.[text] ||
        text
      );
    },
    [lang, cache]
  );

  return (
    <LanguageContext.Provider
      value={{
        lang,
        changeLang,
        t,
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