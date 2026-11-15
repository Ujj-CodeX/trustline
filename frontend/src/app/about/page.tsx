"use client";

import { AboutPage as AboutPageContent } from "@/components/landing-v2/AboutPage";

export default function AboutPage() {
  return (
    <AboutPageContent
      onBackToHome={() => {
        window.location.href = "/";
      }}
      onNavigateToPrivacy={() => {
        window.location.href = "/privacy";
      }}
      onNavigateToTerms={() => {
        window.location.href = "/terms";
      }}
      onFindHelpClick={() => {
        window.location.href = "/chat";
      }}
    />
  );
}
