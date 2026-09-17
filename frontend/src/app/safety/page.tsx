"use client";
import { StaticShell } from "@/screens/StaticShell";

export default function SafetyPage() {
  return (
    <StaticShell
      page="safety"
      onNavigate={(path) => {
        if (typeof window !== "undefined") {
          window.location.href = path;
        }
      }}
    />
  );
}
