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

type DomValueState = {
  original: string;
  translated: string | null;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const TRANSLATABLE_ATTRIBUTES = [
  "title",
  "placeholder",
  "aria-label",
  "aria-description",
  "alt",
];

const TRANSLATION_SKIP_SELECTOR = [
  "[data-translation-skip]",
  "script",
  "style",
  "noscript",
  "template",
  "pre",
  "code",
  "option",
  "svg",
].join(",");

const textNodeState = new WeakMap<Text, DomValueState>();
const attributeState = new WeakMap<
  Element,
  Map<string, DomValueState>
>();

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
    // Storage can be blocked by browser privacy settings.
  }
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function isTranslatableText(value: string): boolean {
  const normalized = normalizeText(value);

  if (normalized.length < 2) {
    return false;
  }

  // Do not translate the TrustLine brand.
  if (normalized === "TrustLine") {
    return false;
  }

  // Skip pure numbers/symbols while allowing multilingual Unicode text.
  return /\p{L}/u.test(normalized);
}

function preserveWhitespace(
  source: string,
  translated: string
): string {
  const leading = source.match(/^\s*/)?.[0] || "";
  const trailing = source.match(/\s*$/)?.[0] || "";

  return leading + translated.trim() + trailing;
}

function isInsideSkippedRegion(
  element: Element | null
): boolean {
  if (!element) {
    return false;
  }

  return Boolean(
    element.closest(TRANSLATION_SKIP_SELECTOR)
  );
}

function buildReverseTranslationMap(
  cache: Record<string, string>
): Map<string, string> {
  const reverse = new Map<string, string>();

  Object.entries(cache).forEach(
    ([original, translated]) => {
      const normalizedTranslated =
        normalizeText(translated);

      if (
        normalizedTranslated &&
        normalizedTranslated !== normalizeText(original) &&
        !reverse.has(normalizedTranslated)
      ) {
        reverse.set(normalizedTranslated, original);
      }
    }
  );

  return reverse;
}

function resolveDomValueState(
  currentValue: string,
  state: DomValueState | undefined,
  reverseTranslations: Map<string, string>,
  languageCache: Record<string, string>
): DomValueState {
  if (!state) {
    const reverseOriginal = reverseTranslations.get(
      normalizeText(currentValue)
    );

    if (reverseOriginal) {
      return {
        original: reverseOriginal,
        translated: currentValue,
      };
    }

    return {
      original: currentValue,
      translated: null,
    };
  }

  if (
    currentValue === state.original ||
    currentValue === state.translated
  ) {
    return state;
  }

  const cachedTranslation =
    languageCache[state.original];

  if (
    cachedTranslation &&
    normalizeText(currentValue) ===
      normalizeText(cachedTranslation)
  ) {
    state.translated = currentValue;
    return state;
  }

  const reverseOriginal = reverseTranslations.get(
    normalizeText(currentValue)
  );

  if (reverseOriginal) {
    state.original = reverseOriginal;
    state.translated = currentValue;
    return state;
  }

  // React rendered a genuinely new string into this node.
  state.original = currentValue;
  state.translated = null;
  return state;
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const [lang, setLang] = useState("en");
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

  useEffect(() => {
    cacheRef.current = cache;
  }, [cache]);

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

      const currentCache = cacheRef.current[lang] || {};

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
          API_URL + "/api/translate-ui/",
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
          const errorBody = await response.text();

          console.error(
            "[TrustLine] UI translation API error:",
            {
              status: response.status,
              body: errorBody,
            }
          );

          throw new Error(
            "UI translation failed: " + response.status
          );
        }

        const data = await response.json();

        const translated = Array.isArray(data.translated)
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

  /*
   * Universal UI translation layer.
   *
   * This observes the rendered DOM instead of requiring every page/component
   * to manually wrap every string with t(). Any newly added page with normal
   * static UI text automatically participates in the active language.
   *
   * Dynamic content that is already localized by the backend (for example
   * chat replies and resource data) can opt out with data-translation-skip.
   */
  useEffect(() => {
    if (typeof window === "undefined" || !document.body) {
      return;
    }

    let disposed = false;
    let animationFrame = 0;
    let running = false;
    let pending = false;

    const syncDomTranslations = async () => {
      if (disposed || !document.body) {
        return;
      }

      const languageCache =
        cacheRef.current[lang] || {};
      const reverseTranslations =
        buildReverseTranslationMap(languageCache);

      const textNodesByOriginal = new Map<
        string,
        Text[]
      >();

      const attributeTargets = new Map<
        string,
        Array<{
          element: Element;
          attribute: string;
        }>
      >();

      const addTextNode = (node: Text) => {
        const parent = node.parentElement;

        if (
          !parent ||
          isInsideSkippedRegion(parent)
        ) {
          return;
        }

        const currentValue = node.nodeValue || "";

        if (!isTranslatableText(currentValue)) {
          return;
        }

        const state = resolveDomValueState(
          currentValue,
          textNodeState.get(node),
          reverseTranslations,
          languageCache
        );

        textNodeState.set(node, state);

        if (lang === "en") {
          if (node.nodeValue !== state.original) {
            node.nodeValue = state.original;
          }
          state.translated = null;
          return;
        }

        const existing = textNodesByOriginal.get(
          state.original
        );

        if (existing) {
          existing.push(node);
        } else {
          textNodesByOriginal.set(
            state.original,
            [node]
          );
        }
      };

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );

      let currentNode = walker.nextNode();

      while (currentNode) {
        addTextNode(currentNode as Text);
        currentNode = walker.nextNode();
      }

      const elements =
        document.body.querySelectorAll("*");

      elements.forEach((element) => {
        if (isInsideSkippedRegion(element)) {
          return;
        }

        let states = attributeState.get(element);

        if (!states) {
          states = new Map();
          attributeState.set(element, states);
        }

        TRANSLATABLE_ATTRIBUTES.forEach(
          (attribute) => {
            const currentValue =
              element.getAttribute(attribute);

            if (
              currentValue === null ||
              !isTranslatableText(currentValue)
            ) {
              return;
            }

            const state =
              resolveDomValueState(
                currentValue,
                states!.get(attribute),
                reverseTranslations,
                languageCache
              );

            states!.set(attribute, state);

            if (lang === "en") {
              if (
                element.getAttribute(attribute) !==
                state.original
              ) {
                element.setAttribute(
                  attribute,
                  state.original
                );
              }
              state.translated = null;
              return;
            }

            const key = state.original;
            const existing =
              attributeTargets.get(key);

            if (existing) {
              existing.push({
                element,
                attribute,
              });
            } else {
              attributeTargets.set(key, [
                { element, attribute },
              ]);
            }
          }
        );
      });

      if (lang === "en") {
        return;
      }

      const originals = Array.from(
        new Set([
          ...textNodesByOriginal.keys(),
          ...attributeTargets.keys(),
        ])
      );

      if (!originals.length) {
        return;
      }

      const translated =
        await translateTexts(originals);

      if (disposed) {
        return;
      }

      textNodesByOriginal.forEach(
        (nodes, original) => {
          const translatedValue =
            translated[original] || original;

          nodes.forEach((node) => {
            const state = textNodeState.get(node);

            if (!state) {
              return;
            }

            state.translated =
              translatedValue;

            const nextValue =
              preserveWhitespace(
                state.original,
                translatedValue
              );

            if (node.nodeValue !== nextValue) {
              node.nodeValue = nextValue;
            }
          });
        }
      );

      attributeTargets.forEach(
        (targets, original) => {
          const translatedValue =
            translated[original] || original;

          targets.forEach(
            ({ element, attribute }) => {
              const states =
                attributeState.get(element);
              const state =
                states?.get(attribute);

              if (!state) {
                return;
              }

              state.translated =
                translatedValue;

              const nextValue =
                preserveWhitespace(
                  state.original,
                  translatedValue
                );

              if (
                element.getAttribute(attribute) !==
                nextValue
              ) {
                element.setAttribute(
                  attribute,
                  nextValue
                );
              }
            }
          );
        }
      );
    };

    const schedule = () => {
      if (
        disposed ||
        animationFrame
      ) {
        return;
      }

      animationFrame =
        window.requestAnimationFrame(() => {
          animationFrame = 0;

          if (running) {
            pending = true;
            return;
          }

          running = true;

          void syncDomTranslations()
            .finally(() => {
              running = false;

              if (pending && !disposed) {
                pending = false;
                schedule();
              }
            });
        });
    };

    const observer =
      new MutationObserver(() => {
        schedule();
      });

    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRIBUTES,
    });

    schedule();

    return () => {
      disposed = true;
      observer.disconnect();

      if (animationFrame) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }
    };
  }, [lang, translateTexts]);

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
