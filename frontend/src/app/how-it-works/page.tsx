"use client";
import { StaticShell } from "@/screens/StaticShell";

export default function HowItWorksPage() {
  return (
    <StaticShell
      page="how-it-works"
      onNavigate={(path) => {
        if (typeof window !== "undefined") {
          window.location.href = path;
        }
      }}
    />
  );
}
