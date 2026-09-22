"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBubble } from "@/components/ChatBubble";
import { ResourceCard } from "@/components/ResourceCard";
import { useRouter } from "next/navigation";
import { UrgencyTier } from "@/types";

const DEFAULT_COUNTRIES = [
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



export function ChatSessionView({ session, slug }: { session: any; slug: string }) {
  const router = useRouter();
  const topResource = session.resources?.[0];
  const otherResources = session.resources?.slice(1) || [];


  const handleContinue = () => {
  sessionStorage.setItem("trustline_resume", JSON.stringify({
    query_text: session.query_text,
    reply: session.reply,
    extracted: session.extracted,
    resources: session.resources,
  }));
  router.push(`/chat?resume=true&country=${session.extracted.country}`);
};

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 flex flex-col">
      <Navbar
        currentPath="/chat"
        onNavigate={(path) => router.push(path)}
        selectedCountry={session.extracted.country || ""}
        onCountryChange={() => {}}
        countries={DEFAULT_COUNTRIES}
        darkMode={false}
        onToggleDarkMode={() => {}}
      />

      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-6">
        <button onClick={() => router.push("/chat")} className="text-sm text-teal-700 dark:text-teal-400 font-semibold">
          ← Start a new chat
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex justify-end">
            <div className="max-w-xl">
              <ChatBubble message={{ id: "q", sender: "user", text: session.query_text || "Query", timestamp: "" }} />
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-xl">
              <ChatBubble message={{ id: "a", sender: "ai", text: session.reply, timestamp: "" }} />
            </div>
          </div>

          {topResource && (
            <ResourceCard resource={topResource} urgencyTier={session.extracted.urgency_tier as UrgencyTier} isTopRecommended={true} />
          )}
          {otherResources.map((res: any, i: number) => (
            <ResourceCard key={i} resource={res} urgencyTier={session.extracted.urgency_tier as UrgencyTier} isTopRecommended={false} />
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-sm transition-transform active:scale-95">
            
          Continue this conversation →
        </button>
      </div>

      <Footer onNavigate={(path) => router.push(path)} />
    </div>
  );
}