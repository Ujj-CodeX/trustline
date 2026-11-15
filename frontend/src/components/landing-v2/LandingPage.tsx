"use client";

import { useEffect } from "react";
import { LocalizedPage } from "@/components/LocalizedPage";
import { useLanguage } from "@/lib/LanguageContext";
import EmergencyBar from "./EmergencyBar";
import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";

const LANDING_V2_UI_TEXTS = [
  "Urgent emergency or dangerous situation?",
  "Call 112 immediately",
  "How it works",
  "Resources",
  "Safety",
  "About",
  "Get Help",
  "TrustLine home",
  "Open navigation",
  "Close navigation",
  "You know you need help.",
  "You just don't know where to start.",
  "Find the help you deserve.",
  "Describe what you need help with...",
  "Describe what you need help with",
  "Anywhere",
  "Find support",
  "See how TrustLine works",
  "My Instagram account was hacked",
  "I need mental health support near me",
  "I need legal help in Lucknow",
  "Someone at home is hurting me",
  "TrustLine helps route you to relevant support resources. Always verify critical information with the appropriate local authority.",
];

export default function LandingPage() {
  const { lang, translateTexts } = useLanguage();

  useEffect(() => {
    if (lang !== "en") {
      void translateTexts(LANDING_V2_UI_TEXTS);
    }
  }, [lang, translateTexts]);

  const handleRouteSubmit = (query: string, country: string) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (country) params.set("country", country);
    window.location.href = "/chat?" + params.toString();
  };

  const handleGetHelp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <LocalizedPage>
      <div className="min-h-screen overflow-x-clip bg-[#051817] text-white">
        <EmergencyBar />
        <LandingNavbar onGetHelp={handleGetHelp} />
        <main>
          <HeroSection onRouteSubmit={handleRouteSubmit} />
          <div id="next-section" className="h-px w-full bg-transparent" />
        </main>
      </div>
    </LocalizedPage>
  );
}
