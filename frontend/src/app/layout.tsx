"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { LanguageProvider } from "@/lib/LanguageContext";
import { LanguagePicker } from "@/components/LanguagePicker";
import { ThemeProvider } from "@/components/landing-v2/ThemeContext";
import ThemeToggle from "@/components/landing-v2/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <LanguageProvider>
            {children}

            {/* Universal controls */}
            <LanguagePicker />
            <ThemeToggle variant="floating" />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}