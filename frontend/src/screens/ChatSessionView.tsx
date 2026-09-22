"use client";
import { ChatBubble } from "@/components/ChatBubble";
import { ResourceCard } from "@/components/ResourceCard";
import { useRouter } from "next/navigation";
import { UrgencyTier } from "@/types";

export function ChatSessionView({ session, slug }: { session: any; slug: string }) {
  const router = useRouter();
  const topResource = session.resources?.[0];
  const otherResources = session.resources?.slice(1) || [];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-6">
      <button onClick={() => router.push("/chat")} className="text-sm text-teal-700 dark:text-teal-400 font-semibold">
        ← Start a new chat
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        <ChatBubble message={{ id: "q", sender: "user", text: session.query_text || "Query", timestamp: "" }} />
        <ChatBubble message={{ id: "a", sender: "ai", text: session.reply, timestamp: "" }} />

        {topResource && (
          <ResourceCard resource={topResource} urgencyTier={session.extracted.urgency_tier as UrgencyTier} isTopRecommended={true} />
        )}
        {otherResources.map((res: any, i: number) => (
          <ResourceCard key={i} resource={res} urgencyTier={session.extracted.urgency_tier as UrgencyTier} isTopRecommended={false} />
        ))}
      </div>
    </div>
  );
}