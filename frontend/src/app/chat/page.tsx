"use client";
import { useSearchParams } from "next/navigation";
import { ChatPage } from "@/screens/ChatPage";
import { DEFAULT_COUNTRIES } from "@/lib/countries";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const country = searchParams.get("country") || "";
  const resume = searchParams.get("resume") === "true";

  return (
    <ChatPage
      initialQuery={query}
      selectedCountry={country}
      resumeFromStorage={resume}
      
      onNavigate={(path) => { window.location.href = path; }}
      countries={DEFAULT_COUNTRIES}
    />
  );
}