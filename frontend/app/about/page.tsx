import { StaticShell } from "@/src/pages/StaticShell";

export default function AboutPage() {
  return (
    <StaticShell
      page="about"
      onNavigate={(path) => {
        if (typeof window !== "undefined") {
          window.location.href = path;
        }
      }}
    />
  );
}
