import { ChatSessionView } from "@/screens/ChatSessionView";

async function getSession(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${slug}/`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const session = await getSession(params.slug);
  if (!session) {
    return { title: "TrustLine | Not Found" };
  }
  const { category, state, district, country } = session.extracted;
  const location = [district, state, country].filter(Boolean).join(", ");
  return {
    title: `${category.replace(/_/g, " ")} help in ${location} | TrustLine`,
    description: session.reply?.slice(0, 155) || "Verified helpline support from TrustLine.",
  };
}

export default async function ChatSessionPage({ params }: { params: { slug: string } }) {
  const session = await getSession(params.slug);

  if (!session) {
    return <div className="p-10 text-center">Session not found.</div>;
  }

  return <ChatSessionView session={session} slug={params.slug} />;
}