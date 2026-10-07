"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { LanguagePicker } from "@/components/LanguagePicker";
import { ThemeProvider } from "@/components/landing-v2/ThemeContext";


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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <ThemeProvider>
    <LanguageProvider>
      {children}
      <LanguagePicker />
    </LanguageProvider>
  </ThemeProvider>
</body>
    </html>
  );
}

