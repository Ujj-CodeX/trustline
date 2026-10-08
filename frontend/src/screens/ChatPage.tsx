"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Send,
  Lock,
  Lightbulb,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  SlidersHorizontal,
  ChevronUp,
}from "lucide-react";
import { ChatBubble } from "@/components/ChatBubble";
import { ResourceCard } from "@/components/ResourceCard";
import { fetchChatResponse } from "@/lib/api";
import { Message, ResourceItem, ExtractedIntent, CountryOption, UrgencyTier } from "@/types";
import { useRouter } from "next/navigation";

import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/landing-v2/ThemeContext";

interface ChatPageProps {
  initialQuery?: string;
  initialSession?: {
    query_text?: string;
    reply?: string;
    extracted?: ExtractedIntent | null;
    resources?: ResourceItem[];
  } | null;
  selectedCountry: string;
  resumeFromStorage?: boolean;
  countries: CountryOption[];

}

export const ChatPage: React.FC<ChatPageProps> = ({
  initialQuery = "",
  initialSession = null,
  selectedCountry,
  resumeFromStorage = false,
  countries,
}) => {
  const router = useRouter();
  const [localCountry, setLocalCountry] = useState(selectedCountry);
  const { isDark } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentExtracted, setCurrentExtracted] = useState<ExtractedIntent | null>(null);
  const [currentResources, setCurrentResources] = useState<ResourceItem[]>([]);
  const [backendNotice, setBackendNotice] = useState<string | null>(null);
  const [resourceSort, setResourceSort] = useState<
    "recommended" | "verified" | "24_7" | "name"
  >("recommended");
  const [visibleOtherResources, setVisibleOtherResources] = useState(4);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasTriggeredInitialQuery = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async (queryText: string) => {
  if (!queryText.trim() || isLoading) return;

  const userMessage: Message = { id: `user-${Date.now()}`, sender: "user", text: queryText.trim(), timestamp: getFormattedTime() };
  const typingMessage: Message = { id: `typing-${Date.now()}`, sender: "ai", text: "Searching verified databases...", timestamp: getFormattedTime(), isTyping: true };

  setMessages((prev) => [...prev, userMessage, typingMessage]);
  setInputQuery("");
  setIsLoading(true);
  setBackendNotice(null);

  let geoLocation = null;
  let countryToSend: string | null = null;

  if (!hasLocationInQuery(queryText)) {
    console.log("[DEBUG] No location in query. selectedCountry =", JSON.stringify(selectedCountry));
    if (localCountry) {
      console.log("[DEBUG] Using dropdown:", localCountry);
      countryToSend = localCountry;
    } else {
      console.log("[DEBUG] Triggering geolocation...");
      geoLocation = await getGeoLocation();
      console.log("[DEBUG] Geolocation result:", geoLocation);
    }
  } else {
    console.log("[DEBUG] Location detected IN QUERY, skipping geo/dropdown");
  }

  try {
    const { data, error } = await fetchChatResponse(queryText.trim(), countryToSend, geoLocation);

    setMessages((prev) => {
      const withoutTyping = prev.filter((m) => !m.isTyping);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply || "Here are the verified support resources for your query.",
        timestamp: getFormattedTime(),
        extracted: data.extracted,
        resources: data.resources,
      };
      return [...withoutTyping, aiMessage];
    });

    setCurrentExtracted(data.extracted || null);
    setCurrentResources(data.resources || []);
    setResourceSort("recommended");
    setVisibleOtherResources(4);
    setIsSortOpen(false);

    if (error) {
      setBackendNotice("Could not reach the backend. Please try again.");
    }
  } catch (err) {
    console.error("Chat error:", err);
    setMessages((prev) => {
      const withoutTyping = prev.filter((m) => !m.isTyping);
      const errorMessage: Message = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "An error occurred. Please try again or contact emergency services directly if in immediate danger.",
        timestamp: getFormattedTime(),
      };
      return [...withoutTyping, errorMessage];
    });
  } finally {
    setIsLoading(false);
  }
};

  // Seed default greeting or initial query if navigated from landing page
  useEffect(() => {
    if (hasTriggeredInitialQuery.current) return;
    hasTriggeredInitialQuery.current = true;

    if (resumeFromStorage){
      const saved = sessionStorage.getItem("trustline_resume");
      if (saved) {
        const data = JSON.parse(saved);
        setMessages([
          {id:"resumed-user", sender: "user" , text: data.query_text, timestamp: getFormattedTime() },
          {id: "resumed-ai", sender: "ai", text: data.reply, timestamp: getFormattedTime() },
        ]);

        setCurrentExtracted(data.extracted);
        setCurrentResources(data.resources || [] );
        sessionStorage.removeItem("trustline_resume");
        return;

      }
    }

    if (initialSession) {
      setMessages([
        {
          id: "session-user",
          sender: "user",
          text: initialSession.query_text || "Query",
          timestamp: getFormattedTime(),
        },
        {
          id: "session-ai",
          sender: "ai",
          text:
            initialSession.reply ||
            "Here are the verified support resources for your query.",
          timestamp: getFormattedTime(),
          extracted: initialSession.extracted || undefined,
          resources: initialSession.resources || [],
        },
      ]);

      setCurrentExtracted(initialSession.extracted || null);
      setCurrentResources(initialSession.resources || []);
      setResourceSort("recommended");
      setVisibleOtherResources(4);
      setIsSortOpen(false);
      return;
    }

    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    } 
  }, [initialQuery, selectedCountry]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResources]);

  const topResource = currentResources.length > 0 ? currentResources[0] : null;
  const otherResources =
    currentResources.length > 1 ? currentResources.slice(1) : [];

  const sortedOtherResources = useMemo(() => {
    const resources = [...otherResources];

    if (resourceSort === "recommended") {
      return resources;
    }

    if (resourceSort === "verified") {
      return resources
        .map((resource, index) => ({ resource, index }))
        .sort((a, b) => {
          const aVerified =
            a.resource.verification_status === "verified_web" ||
            a.resource.verification_status === "verified_authority" ||
            a.resource.is_india_db === true ||
            a.resource.country?.toLowerCase() === "india" ||
            Boolean(a.resource.phone || a.resource.priority);
          const bVerified =
            b.resource.verification_status === "verified_web" ||
            b.resource.verification_status === "verified_authority" ||
            b.resource.is_india_db === true ||
            b.resource.country?.toLowerCase() === "india" ||
            Boolean(b.resource.phone || b.resource.priority);

          return Number(bVerified) - Number(aVerified) || a.index - b.index;
        })
        .map(({ resource }) => resource);
    }

    if (resourceSort === "24_7") {
      return resources
        .map((resource, index) => ({ resource, index }))
        .sort((a, b) => {
          const a24x7 =
            a.resource.available_24x7 === true ||
            a.resource.availability?.toLowerCase().includes("24/7");
          const b24x7 =
            b.resource.available_24x7 === true ||
            b.resource.availability?.toLowerCase().includes("24/7");

          return Number(b24x7) - Number(a24x7) || a.index - b.index;
        })
        .map(({ resource }) => resource);
    }

    return resources
      .map((resource, index) => ({ resource, index }))
      .sort((a, b) => {
        const aName = (
          a.resource.name ||
          a.resource.title ||
          ""
        ).toLocaleLowerCase();
        const bName = (
          b.resource.name ||
          b.resource.title ||
          ""
        ).toLocaleLowerCase();

        return aName.localeCompare(bName) || a.index - b.index;
      })
      .map(({ resource }) => resource);
  }, [otherResources, resourceSort]);

  const displayedOtherResources = sortedOtherResources.slice(
    0,
    visibleOtherResources
  );
  const hasMoreOtherResources =
    visibleOtherResources < sortedOtherResources.length;

  const guidanceTips = [
  "Keep relevant information or records safe for future reference.",
  "Avoid sharing sensitive personal details unnecessarily.",
  "Use verified support services whenever possible.",
  "Seek immediate local assistance if the situation becomes urgent or unsafe."
];


  const hasLocationInQuery = (text: string): boolean => {
  return /\b(in|near|at)\s+[a-zA-Z]+/i.test(text);
};

const getGeoLocation = async (): Promise<{ country: string; state: string; district: string } | null> => {
  try {
    const cached = sessionStorage.getItem("trustline_geo");
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    sessionStorage.removeItem("trustline_geo");
  }

  const result = await new Promise<{ country: string; state: string; district: string } | null>((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          resolve({
            country: data.address?.country || "",
            state: data.address?.state || "",
            district: data.address?.county || data.address?.city_district || data.address?.city || "",
          });
        } catch {
          resolve(null)
        }
      },
      (err) => { console.log("[DEBUG] Geolocation ERROR:", err.code, err.message);
    resolve(null); 
     },
     { timeout: 5000 }
    );
  });

  if (result) {
    sessionStorage.setItem("trustline_geo", JSON.stringify(result));
  }
  return result;
};

  return (
  <div
    className={
      "min-h-screen w-full transition-colors duration-300 " +
      (isDark
        ? "bg-[#03091b] text-slate-100"
        : "bg-[#f6f8fb] text-slate-900")
    }
  >
    <div
      className={
        "pointer-events-none fixed inset-0 -z-0 opacity-100 " +
        (isDark ? "cinematic-sky-bg" : "bg-slate-50")
      }
      aria-hidden="true"
    />
    <div
      id="chat-page-root"
      className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20"
    >
      {/* TrustLine-style chat header */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className={
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold " +
            "backdrop-blur-md transition-all cursor-pointer " +
            (isDark
              ? "bg-[#081229]/80 border-slate-700 text-slate-200 hover:border-teal-500/50 hover:text-white"
              : "bg-white/85 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-slate-950")
          }
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to TrustLine</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
  <button
    type="button"
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    className={
              "h-9 px-3.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md " +
              (isDark
                ? "bg-[#081229]/85 border-slate-700 text-slate-200"
                : "bg-white/90 border-slate-300 text-slate-800")
            }
  >
    {localCountry || "Select Country"}
    <ChevronDown className="w-3.5 h-3.5" />
  </button>
  {isDropdownOpen && (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
      <div
        className={
          "absolute right-0 top-full mt-2 w-52 max-h-60 overflow-y-auto rounded-2xl shadow-2xl border p-1 z-50 " +
          (isDark
            ? "bg-[#071127] border-slate-700"
            : "bg-white border-slate-200")
        }
      >
        {countries.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => { setLocalCountry(c.name); setIsDropdownOpen(false); }}
            className={
              "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-left transition-colors " +
              (isDark
                ? "text-slate-300 hover:bg-slate-800/70"
                : "text-slate-700 hover:bg-slate-100")
            }
          >
            <span>{c.flag}</span><span>{c.name}</span>
          </button>
        ))}
      </div>
    </>
  )}
</div>
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setCurrentResources([]);
              setCurrentExtracted(null);
              setBackendNotice(null);
              hasTriggeredInitialQuery.current = false;
              setInputQuery("");
            }}
            className={
              "p-2 rounded-full border transition-colors " +
              (isDark
                ? "text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800"
                : "text-slate-500 border-slate-300 hover:text-slate-950 hover:bg-white")
            }
            title="Reset conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Backend Notice if offline */}
      {backendNotice && (
        <div
          className={
            "mb-5 p-4 rounded-2xl border text-xs flex items-start gap-2.5 backdrop-blur-md " +
            (isDark
              ? "bg-teal-950/30 border-teal-800/80 text-teal-200"
              : "bg-teal-50 border-teal-200 text-teal-800")
          }
        >
          <AlertCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Backend Connection Note</p>
            <p className="mt-0.5 opacity-90">{backendNotice}</p>
          </div>
        </div>
      )}

      {/* Chat workspace */}
      <div
        className={
          "overflow-hidden rounded-[28px] border shadow-2xl backdrop-blur-xl " +
          (isDark
            ? "bg-[#050d20]/90 border-slate-700/80 shadow-black/40"
            : "bg-white/90 border-slate-200 shadow-slate-900/10")
        }
      >
        {/* Chat Header */}
        <div
          className={
            "p-5 sm:p-7 border-b flex items-center justify-between gap-4 " +
            (isDark
              ? "border-slate-800 bg-[#071127]/85"
              : "border-slate-200 bg-slate-50/80")
          }
        >
          <div className="flex items-center gap-3.5">
            <div
              className={
                "w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 " +
                (isDark
                  ? "bg-teal-950/40 border-teal-800/70 text-teal-300"
                  : "bg-teal-50 border-teal-200 text-teal-700")
              }
            >
              <ShieldCheck
                className={
                  "w-7 h-7 " +
                  (isDark ? "text-teal-300" : "text-teal-600")
                }
              />
            </div>
            <div>
              <h2
                className={
                  "text-base sm:text-lg font-bold leading-tight " +
                  (isDark ? "text-white" : "text-slate-900")
                }
              >
                Chat with TrustLine
              </h2>
              <p
                className={
                  "text-xs sm:text-sm mt-1 " +
                  (isDark ? "text-slate-400" : "text-slate-600")
                }
              >
                Ask anything. Get verified helplines and support resources — instantly.
              </p>
            </div>
          </div>

          <div
            className={
              "hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 border " +
              (isDark
                ? "bg-slate-900/70 border-slate-700 text-slate-300"
                : "bg-white border-slate-200 text-slate-700")
            }
          >
            <Lock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Private & anonymous</span>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="p-4 sm:p-7 md:p-8 space-y-7">
          {/* Bubbles */}
          <div
            className="space-y-4"
            data-translation-skip="true"
          >
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
          </div>

          {/* Top Recommended Resource Card */}
          {topResource && (
            <div
              className="pt-2"
              data-translation-skip="true"
            >
              <ResourceCard
                resource={topResource}
                urgencyTier={currentExtracted?.urgency_tier as UrgencyTier || "general"}
                isTopRecommended={true}
              />
            </div>
          )}

          {/* Other Useful Resources List */}
          {otherResources.length > 0 && (
            <div
              className={
                "pt-5 space-y-3 border-t " +
                (isDark ? "border-slate-800" : "border-slate-200")
              }
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Other Useful Resources
                  </h3>
                  <p
                    className={
                      "mt-0.5 text-[11px] " +
                      (isDark ? "text-slate-500" : "text-slate-500")
                    }
                  >
                    Showing {Math.min(visibleOtherResources, sortedOtherResources.length)} of {sortedOtherResources.length} additional resources
                  </p>
                </div>

                <div className="relative self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen((previous) => !previous)}
                    className={
                      "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors " +
                      (isDark
                        ? "bg-slate-900/70 border-slate-700 text-slate-200 hover:bg-slate-800"
                        : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50")
                    }
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-teal-500" />
                    <span>
                      {resourceSort === "recommended"
                        ? "Recommended"
                        : resourceSort === "verified"
                          ? "Verified first"
                          : resourceSort === "24_7"
                            ? "24/7 first"
                            : "Name A–Z"}
                    </span>
                    <ChevronDown
                      className={
                        "w-3.5 h-3.5 transition-transform " +
                        (isSortOpen ? "rotate-180" : "")
                      }
                    />
                  </button>

                  {isSortOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsSortOpen(false)}
                      />
                      <div
                        className={
                          "absolute right-0 top-full mt-2 z-50 w-44 overflow-hidden rounded-2xl border p-1 shadow-2xl " +
                          (isDark
                            ? "bg-[#071127] border-slate-700"
                            : "bg-white border-slate-200")
                        }
                      >
                        {[
                          ["recommended", "Recommended"],
                          ["verified", "Verified first"],
                          ["24_7", "24/7 first"],
                          ["name", "Name A–Z"],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setResourceSort(
                                value as
                                  | "recommended"
                                  | "verified"
                                  | "24_7"
                                  | "name"
                              );
                              setVisibleOtherResources(4);
                              setIsSortOpen(false);
                            }}
                            className={
                              "w-full rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-colors " +
                              (resourceSort === value
                                ? isDark
                                  ? "bg-teal-950/50 text-teal-300"
                                  : "bg-teal-50 text-teal-700"
                                : isDark
                                  ? "text-slate-300 hover:bg-slate-800"
                                  : "text-slate-700 hover:bg-slate-100")
                            }
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                {displayedOtherResources.map((res, index) => (
                  <div
                    key={res.id || index}
                    data-translation-skip="true"
                  >
                    <ResourceCard
                      resource={res}
                      urgencyTier={
                        currentExtracted?.urgency_tier as UrgencyTier ||
                        "general"
                      }
                      isTopRecommended={false}
                    />
                  </div>
                ))}
              </div>

              {hasMoreOtherResources && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleOtherResources(
                      (count) =>
                        Math.min(
                          count + 5,
                          sortedOtherResources.length
                        )
                    )
                  }
                  className={
                    "w-full flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-xs font-semibold transition-all " +
                    (isDark
                      ? "bg-slate-900/70 border-slate-700 text-teal-300 hover:bg-slate-800"
                      : "bg-white border-slate-300 text-teal-700 hover:bg-slate-50")
                  }
                >
                  <span>
                    Show {Math.min(
                      5,
                      sortedOtherResources.length -
                        visibleOtherResources
                    )} more contacts
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {!hasMoreOtherResources && sortedOtherResources.length > 4 && (
                <button
                  type="button"
                  onClick={() => setVisibleOtherResources(4)}
                  className={
                    "w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold transition-colors " +
                    (isDark
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-500 hover:text-slate-800")
                  }
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>Show fewer contacts</span>
                </button>
              )}
            </div>
          )}

          {/* Important Guidance Tip Box */}
          <div
            className={
              "rounded-2xl p-4 sm:p-5 border " +
              (isDark
                ? "bg-teal-950/20 border-teal-900/60"
                : "bg-teal-50/80 border-teal-200")
            }
          >
             <div className="flex items-center gap-2 text-cyan-900 dark:text-cyan-300 font-bold text-sm mb-2.5">
                 <Lightbulb className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Important Guidance</span>
            </div>

            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
              {guidanceTips.map((tip, idx) => (
                <li key={idx} className="leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          className={
            "p-4 sm:p-5 border-t " +
            (isDark
              ? "border-slate-800 bg-[#040b18]/90"
              : "border-slate-200 bg-white/90")
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputQuery);
            }}
            className="flex items-center gap-2 rounded-2xl"
          >
            <button
              type="button"
              className={
                "p-2.5 rounded-xl transition-colors " +
                (isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100")
              }
              title="Help information"
              onClick={() => {
                alert("TrustLine is an AI helpline-discovery system connecting you directly to verified authorities and crisis centers.");
              }}
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <input
              id="chat-query-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              placeholder="Ask anything or describe what you need help with..."
              className={
                "flex-1 h-12 px-4 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/60 " +
                (isDark
                  ? "bg-slate-900/80 border-slate-700 text-white placeholder-slate-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400")
              }/>

            <button
              id="chat-send-btn"
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className={
                "w-12 h-12 rounded-2xl disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 shrink-0 " +
                (isDark
                  ? "bg-teal-500 hover:bg-teal-400 text-slate-950"
                  : "bg-teal-600 hover:bg-teal-700")
              }
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};
