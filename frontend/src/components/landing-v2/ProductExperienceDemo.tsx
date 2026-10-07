"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Lock,
  Phone,
} from "lucide-react";

import { useLanguage } from "@/lib/LanguageContext";
import ScrollReveal from "./ScrollReveal";
import { useTheme } from "./ThemeContext";

interface DemoResource {
  name: string;
  organization: string;
  description: string;
  phone: string;
  availability: string;
  coverage: string;
  websiteUrl: string;
  actionLabel: string;
}

interface DemoScenario {
  label: string;
  userText: string;
  trustLineReply: string;
  tag: string;
  resource: DemoResource;
}

const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  "instagram-hack": {
    label: "Cyber Crime",
    userText:
      "My Instagram account was hacked and someone changed my email.",
    trustLineReply:
      "That sounds like an account takeover. TrustLine identifies the relevant support category and can route you to an appropriate verified resource.",
    tag: "compromised account · cyber support",
    resource: {
      name: "National Cyber Crime Helpline",
      organization:
        "Indian Cyber Crime Coordination Centre (I4C)",
      description:
        "Official support for reporting cybercrime and getting guidance after online fraud or account compromise.",
      phone: "1930",
      availability: "24 hours",
      coverage: "India · Nationwide",
      websiteUrl: "https://cybercrime.gov.in",
      actionLabel: "Call now",
    },
  },

  "mental-health": {
    label: "Mental Health",
    userText:
      "I am experiencing severe anxiety and need someone safe to talk to.",
    trustLineReply:
      "TrustLine understands this as a mental-health support request and can help surface an appropriate support resource.",
    tag: "mental health · immediate support",
    resource: {
      name: "Tele-MANAS National Mental Health Lifeline",
      organization:
        "Ministry of Health & Family Welfare",
      description:
        "Mental-health support and counselling through the national tele-mental-health service.",
      phone: "14416",
      availability: "24/7",
      coverage: "India · All States & UTs",
      websiteUrl: "https://telemanas.mohfw.gov.in",
      actionLabel: "Call Tele-MANAS",
    },
  },

  "legal-lucknow": {
    label: "Legal Help",
    userText:
      "I need legal help in Lucknow. My landlord locked my home.",
    trustLineReply:
      "TrustLine identifies this as a legal-support request with a location context and can surface a relevant legal-aid resource.",
    tag: "legal aid · Lucknow · Uttar Pradesh",
    resource: {
      name: "District Legal Services Authority",
      organization:
        "National Legal Services Authority / State Legal Services system",
      description:
        "Legal-aid services for people who need assistance understanding or pursuing legal remedies.",
      phone: "15100",
      availability: "Service hours may vary",
      coverage: "Lucknow · Uttar Pradesh",
      websiteUrl: "https://nalsa.gov.in",
      actionLabel: "Contact",
    },
  },

  "domestic-safety": {
    label: "Safety",
    userText:
      "Someone at home is hurting me and threatening me.",
    trustLineReply:
      "Your immediate safety comes first. TrustLine identifies this as a safety and domestic-violence support request.",
    tag: "domestic safety · emergency support",
    resource: {
      name: "Women Helpline",
      organization:
        "Ministry of Women and Child Development",
      description:
        "Support for women facing violence, abuse, harassment, or other safety concerns.",
      phone: "181",
      availability: "24/7",
      coverage: "India · Nationwide",
      websiteUrl: "https://wcd.nic.in",
      actionLabel: "Call support",
    },
  },

  "emergency-help": {
    label: "Emergency",
    userText:
      "I need emergency assistance right now. There is an immediate threat to life.",
    trustLineReply:
      "This is an emergency situation. Immediate local emergency services should be contacted without delay.",
    tag: "critical life safety · emergency response",
    resource: {
      name: "Emergency Response Support System",
      organization:
        "Government of India · Emergency Response",
      description:
        "Unified emergency response access for immediate police, fire, medical, and other emergency assistance.",
      phone: "112",
      availability: "24/7",
      coverage: "India · Nationwide",
      websiteUrl: "https://112.gov.in",
      actionLabel: "Dial 112",
    },
  },
};

type StepTab = "describe" | "understand" | "connect";

interface ProductExperienceDemoProps {
  activeScenarioId?: string;
}

export default function ProductExperienceDemo({
  activeScenarioId = "instagram-hack",
}: ProductExperienceDemoProps) {
  const [selectedId, setSelectedId] =
    useState(activeScenarioId);

  const [activeStepTab, setActiveStepTab] =
    useState<StepTab>("connect");

  const { t } = useLanguage();
  const { isDark } = useTheme();

  useEffect(() => {
    setSelectedId(
      DEMO_SCENARIOS[activeScenarioId]
        ? activeScenarioId
        : "instagram-hack"
    );
  }, [activeScenarioId]);

  const currentScenario =
    DEMO_SCENARIOS[selectedId] ||
    DEMO_SCENARIOS["instagram-hack"];

  const scenarioKeys = Object.keys(DEMO_SCENARIOS);

  return (
    <section
      id="resources" 
      className={`landing-section relative border-t py-16 sm:py-24 md:py-32 section-dark-elevated transition-colors duration-300 ${
        isDark ? "border-slate-800/80" : "border-slate-200"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        {/* Header */}
        <ScrollReveal direction="down">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-12 md:flex-row md:items-end md:gap-6">
            <div className="max-w-xl">
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-500 sm:mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                <span>{t("A clear path to support")}</span>
              </div>

              <h2 className={`text-balance text-2xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}>
                {t(
                  "From what happened to what you can do next."
                )}
              </h2>
            </div>

            <p className={`max-w-sm text-xs leading-relaxed sm:text-sm ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              {t(
                "See how TrustLine turns a plain-language situation into a clearer support route."
              )}
            </p>
          </div>
        </ScrollReveal>

        {/* Scenario selector */}
        <ScrollReveal delay={0.1}>
          <div className="mb-6 flex flex-wrap items-center gap-1.5 sm:mb-8 sm:gap-2">
            <span className={`mb-1 mr-1 w-full text-[11px] sm:mb-0 sm:w-auto sm:text-xs ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              {t("Try another situation")}
            </span>

            {scenarioKeys.map((key) => {
              const scenario = DEMO_SCENARIOS[key];
              const selected = selectedId === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedId(key)}
                  className={[
                    "cursor-pointer rounded-full border px-2.5 py-1.5 text-[11px] transition-all duration-150 active:scale-95 sm:px-3 sm:text-xs",
                    selected
                      ? isDark
                        ? "border-teal-400/50 bg-teal-500/20 font-semibold text-teal-300"
                        : "border-teal-600 bg-teal-600 font-semibold text-white"
                      : isDark
                        ? "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-950",
                  ].join(" ")}
                >
                  {t(scenario.label)}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Browser mockup */}
        <ScrollReveal delay={0.15}>
          <div className={`overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-300 ${
            isDark
              ? "bg-[#030816] border border-slate-700/80 shadow-2xl shadow-black/80"
              : "bg-white border-2 border-slate-300 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/5"
          }`}>
            {/* Browser top bar */}
            <div className={`border-b px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 ${
              isDark ? "bg-[#02050e] border-slate-800" : "bg-slate-100 border-slate-300"
            }`}>
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 sm:h-3 sm:w-3" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 sm:h-3 sm:w-3" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 sm:h-3 sm:w-3" />
              </div>

              <div className={`flex items-center gap-2 sm:gap-4 text-[10px] font-medium sm:text-xs ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                <button
                  type="button"
                  onClick={() => setActiveStepTab("describe")}
                  className={
                    activeStepTab === "describe"
                      ? isDark
                        ? "font-semibold text-teal-300"
                        : "font-bold text-teal-700"
                      : isDark
                        ? "hover:text-slate-200"
                        : "hover:text-slate-900"
                  }
                >
                  <span className={isDark ? "text-slate-500" : "text-slate-400"}>01</span>{" "}
                  {t("Describe")}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStepTab("understand")}
                  className={
                    activeStepTab === "understand"
                      ? isDark
                        ? "font-semibold text-teal-300"
                        : "font-bold text-teal-700"
                      : isDark
                        ? "hover:text-slate-200"
                        : "hover:text-slate-900"
                  }
                >
                  <span className={isDark ? "text-slate-500" : "text-slate-400"}>02</span>{" "}
                  {t("Understand")}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStepTab("connect")}
                  className={
                    activeStepTab === "connect"
                      ? isDark
                        ? "font-semibold text-teal-300"
                        : "font-bold text-teal-700"
                      : isDark
                        ? "hover:text-slate-200"
                        : "hover:text-slate-900"
                  }
                >
                  <span className="font-bold text-teal-500">
                    03
                  </span>{" "}
                  {t("Connect")}
                </button>
              </div>

              <div className={`flex shrink-0 items-center gap-1 text-[10px] font-medium sm:text-xs ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                <Lock className="h-3 w-3 text-teal-500 sm:h-3.5 sm:w-3.5" />
                <span className="hidden xs:inline">
                  {t("Private by design")}
                </span>
              </div>
            </div>

            {/* Main content */}
            <div className={`grid grid-cols-1 gap-6 p-3.5 sm:gap-8 sm:p-8 lg:grid-cols-12 lg:p-10 ${
              isDark ? "bg-[#030816]" : "bg-[#fafbfc]"
            }`}>
              {/* Left */}
              <div className="flex flex-col justify-between space-y-4 lg:col-span-5 sm:space-y-6">
                <div>
                  <div className={`mb-3 text-xs font-semibold uppercase tracking-wider sm:mb-4 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}>
                    {t("Your conversation")}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {/* User */}
                    <div className={`rounded-xl sm:rounded-2xl p-3.5 sm:p-5 transition-colors ${
                        isDark
                          ? "bg-[#0b1329] border border-slate-700/60"
                          : "bg-white border-2 border-slate-200 shadow-sm"
                      }`}>
                      <div className={`mb-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}>
                        {t("You")}
                      </div>

                      <p className={`text-xs sm:text-base font-normal leading-relaxed ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}>
                        {t(currentScenario.userText)}
                      </p>
                    </div>

                    {/* TrustLine */}
                    <div className={`rounded-xl sm:rounded-2xl p-3.5 sm:p-5 transition-colors ${
                        isDark
                          ? "bg-[#0d1e38] border border-teal-500/30"
                          : "bg-teal-50 border-2 border-teal-500/50 shadow-sm ring-1 ring-teal-500/20"
                      }`}>
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-500 sm:text-[11px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        <span>{t("TrustLine")}</span>
                      </div>

                      <p className={`text-xs sm:text-sm font-normal leading-relaxed ${
                        isDark ? "text-slate-200" : "text-slate-800"
                      }`}>
                        {t(currentScenario.trustLineReply)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-2 border-t pt-3 text-[11px] sm:pt-4 sm:text-xs ${
                  isDark ? "border-slate-800/80 text-slate-400" : "border-slate-300 text-slate-700 font-medium"
                }`}>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  <span className="leading-snug">
                    {t("Relevant context")}:{" "}
                    {t(currentScenario.tag)}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col justify-between lg:col-span-7">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2 text-xs sm:mb-4">
                    <span className={`font-semibold uppercase tracking-wider ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {t("Relevant support option")}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-500 sm:text-xs">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
                      {t("Matched to context")}
                    </span>
                  </div>

                  {/* Resource card */}
                  <div className={`space-y-4 rounded-xl p-4 shadow-xl sm:space-y-6 sm:rounded-2xl sm:p-6 lg:p-8 transition-all duration-300 ${
                    isDark
                      ? "bg-gradient-to-b from-[#0a1836] to-[#081229] border border-slate-700/90"
                      : "bg-white border-2 border-teal-600/70 shadow-[0_16px_36px_-6px_rgba(13,148,136,0.22)] ring-2 ring-teal-500/20"
                  }`}>
                    {/* Resource header */}
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start sm:gap-4">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-400/40 bg-teal-500/20 text-teal-500 sm:h-10 sm:w-10">
                          <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>

                        <div>
                          <h3 className={`text-lg sm:text-2xl font-bold tracking-tight ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}>
                            {t(currentScenario.resource.name)}
                          </h3>

                          <p className={`text-[11px] sm:text-sm font-medium ${
                            isDark ? "text-slate-400" : "text-slate-600"
                          }`}>
                            {t(
                              currentScenario.resource.organization
                            )}
                          </p>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold self-start shrink-0 ${
                        isDark
                          ? "bg-teal-950/80 border border-teal-500/50 text-teal-300"
                          : "bg-teal-100 border border-teal-500 text-teal-950"
                      }`}>
                        <CheckCircle2 className={`h-3 w-3 ${isDark ? "text-teal-400" : "text-teal-600"}`} />
                        {t("Verified resource")}
                      </span>
                    </div>

                    {/* Description */}
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? "text-slate-300" : "text-slate-700 font-normal"
                    }`}>
                      {t(currentScenario.resource.description)}
                    </p>

                    {/* Metadata */}
                    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t ${
                      isDark ? "border-slate-800/80" : "border-slate-200"
                    }`}>
                      <div>
                        <span className={`mb-0.5 block text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {t("Phone")}
                        </span>

                        <span className={`text-sm sm:text-lg font-bold font-mono ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}>
                          {currentScenario.resource.phone}
                        </span>
                      </div>

                      <div>
                        <span className={`mb-0.5 block text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {t("Availability")}
                        </span>

                        <span className={`text-xs sm:text-sm font-semibold ${
                          isDark ? "text-slate-200" : "text-slate-800"
                        }`}>
                          {t(
                            currentScenario.resource.availability
                          )}
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <span className={`mb-0.5 block text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {t("Relevant for")}
                        </span>

                        <span className={`text-xs sm:text-sm font-semibold ${
                          isDark ? "text-teal-300" : "text-teal-600"
                        }`}>
                          {t(currentScenario.resource.coverage)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-4 border-t ${
                      isDark ? "border-slate-800/80" : "border-slate-200"
                    }`}>
                      <a
                        href={`tel:${currentScenario.resource.phone}`}
                        className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-md shadow-teal-500/25 transition-all hover:bg-teal-400 active:scale-95 sm:px-5 sm:text-sm"
                      >
                        <Phone className="h-4 w-4" />
                        <span>
                          {t(
                            currentScenario.resource.actionLabel
                          )}
                        </span>
                      </a>

                      <a
                        href={currentScenario.resource.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-4 sm:px-5 py-2.5 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                          isDark
                            ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700"
                            : "bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 shadow-sm"
                        }`}
                      >
                        <span>{t("Visit website")}</span>
                        <ExternalLink className={`h-3.5 w-3.5 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}