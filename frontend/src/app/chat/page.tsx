"use client";
import { useSearchParams } from "next/navigation";
import { ChatPage } from "@/screens/ChatPage";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const country = searchParams.get("country") || "India";

  return (
    <ChatPage
      initialQuery={query}
      selectedCountry={country}
      onNavigate={(path) => { window.location.href = path; }}
      countries={[
        { code: "IN", name: "India", flag: "🇮🇳" },
        { code: "US", name: "United States", flag: "🇺🇸" },
        { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
        { code: "CA", name: "Canada", flag: "🇨🇦" },
        { code: "AU", name: "Australia", flag: "🇦🇺" },
        { code: "DE", name: "Germany", flag: "🇩🇪" },
      ]}
    />
  );
}