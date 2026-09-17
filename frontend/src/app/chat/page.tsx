"use client";
import { ChatPage } from "@/screens/ChatPage";

export default function Page() {
  const query = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("q") || "" : "";
  const country = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("country") || "India" : "India";

  return (
    <ChatPage
      initialQuery={query}
      selectedCountry={country}
      onNavigate={(path) => {
        if (typeof window !== "undefined") {
          window.location.href = path;
        }
      }}
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
