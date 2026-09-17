"use client";
import { StaticShell } from "@/screens/StaticShell";

export default function ResourcesPage() {
  return (
    <StaticShell
      page="resources"
      onNavigate={(path) => {
        if (typeof window !== "undefined") {
          window.location.href = path;
        }
      }}
    />
  );
}
