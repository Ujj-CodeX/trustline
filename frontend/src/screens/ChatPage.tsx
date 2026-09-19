import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Lock,
  Lightbulb,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
}from "lucide-react";
import { ChatBubble } from "@/components/ChatBubble";
import { ResourceCard } from "@/components/ResourceCard";
import { fetchChatResponse } from "@/lib/api";
import { Message, ResourceItem, ExtractedIntent, CountryOption, UrgencyTier } from "@/types";

interface ChatPageProps {
  initialQuery?: string;
  selectedCountry: string;
  onNavigate: (path: string) => void;
  countries: CountryOption[];
}

export const ChatPage: React.FC<ChatPageProps> = ({
  initialQuery = "",
  selectedCountry,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentExtracted, setCurrentExtracted] = useState<ExtractedIntent | null>(null);
  const [currentResources, setCurrentResources] = useState<ResourceItem[]>([]);
  const [backendNotice, setBackendNotice] = useState<string | null>(null);

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

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: queryText.trim(),
      timestamp: getFormattedTime(),
    };

    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      sender: "ai",
      text: "Searching verified databases...",
      timestamp: getFormattedTime(),
      isTyping: true,
    };

    setMessages((prev) => [...prev, userMessage, typingMessage]);
    setInputQuery("");
    setIsLoading(true);
    setBackendNotice(null);

    try {
      const { data } = await fetchChatResponse(
        queryText.trim(),
        selectedCountry,
        null
      );

      // Remove typing bubble and append real reply
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

    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.isTyping);
        const errorMessage: Message = {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "An error occurred while connecting to the helpline directory. Please try again or contact emergency services directly if in immediate danger.",
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

    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    } 
  }, [initialQuery, selectedCountry]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResources]);

  const topResource = currentResources.length > 0 ? currentResources[0] : null;
  const otherResources = currentResources.length > 1 ? currentResources.slice(1) : [];

  const guidanceTips = [
    "Keep all evidence (screenshots, transaction details, reference IDs, emails).",
    "Do not share OTPs, passwords or personal PINs with anyone claiming to help.",
    "You can also report in person at your nearest local police station or district cyber cell.",
    "If money has been deducted, contact your bank immediately to freeze the transaction.",
  ];

  return (
    <div id="chat-page-root" className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-6">
      {/* Top Breadcrumb & Return to Landing */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate("/")}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Selected Region: <strong className="text-slate-800 dark:text-slate-200">{selectedCountry}</strong>
          </span>
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Backend Notice if offline */}
      {backendNotice && (
        <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-teal-800 dark:text-teal-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Backend Connection Note</p>
            <p className="mt-0.5 opacity-90">{backendNotice}</p>
          </div>
        </div>
      )}

      {/* Chat Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
              <ShieldCheck className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Chat with TrustLine
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Ask anything. Get verified helplines and support resources — instantly.
              </p>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shrink-0">
            <Lock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Private & anonymous</span>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Bubbles */}
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
          </div>

          {/* Top Recommended Resource Card */}
          {topResource && (
            <div className="pt-2">
              <ResourceCard
                resource={topResource}
                urgencyTier={currentExtracted?.urgency_tier as UrgencyTier || "general"}
                isTopRecommended={true}
              />
            </div>
          )}

          {/* Other Useful Resources List */}
          {otherResources.length > 0 && (
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Other Useful Resources
                </h3>
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 cursor-pointer hover:underline">
                  View all ({otherResources.length})
                </span>
              </div>

              <div className="space-y-2.5">
                {otherResources.map((res, index) => (
                  <ResourceCard
                    key={res.id || index}
                    resource={res}
                    urgencyTier={currentExtracted?.urgency_tier as UrgencyTier || "general"}
                    isTopRecommended={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Important Guidance Tip Box */}
          <div className="bg-sky-50/70 dark:bg-sky-950/20 rounded-xl p-4 sm:p-5 border border-sky-100 dark:border-sky-900/40">
            <div className="flex items-center gap-2 text-sky-900 dark:text-sky-300 font-bold text-sm mb-2.5">
              <Lightbulb className="w-4 h-4 text-sky-600 dark:text-sky-400" />
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
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
              className="flex-1 h-12 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />

            <button
              id="chat-send-btn"
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="w-12 h-12 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
