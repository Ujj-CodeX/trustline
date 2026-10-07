"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import {
  ArrowLeft,
  Lock,
  Mail,
} from "lucide-react";
import { useTheme } from "@/components/landing-v2/ThemeContext";

export default function PrivacyPolicyPage(): React.JSX.Element {
  const { isDark } = useTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const sectionClass = isDark
    ? "bg-[#040a1c] border-slate-800"
    : "bg-white border-slate-200 shadow-sm";

  const bodyClass = isDark
    ? "text-slate-300"
    : "text-slate-600";

  return (
    <main
      className={
        "min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 " +
        (isDark
          ? "bg-[#030712] text-slate-100"
          : "bg-[#f8fafc] text-slate-900")
      }
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-300/40 dark:border-slate-800">
          <Link
            href="/"
            className={
              "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full " +
              "text-xs font-semibold transition-all border " +
              (isDark
                ? "bg-slate-900 hover:bg-slate-800 text-teal-300 border-slate-700 hover:border-teal-500/50"
                : "bg-white hover:bg-slate-50 text-teal-800 border-slate-300 shadow-sm hover:border-teal-600")
            }
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to TrustLine</span>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={
                "px-2.5 py-1 rounded-full font-medium " +
                (isDark
                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/30"
                  : "bg-teal-50 text-teal-800 border border-teal-300")
              }
            >
              Privacy Policy
            </span>
            <Link
              href="/terms"
              className={
                "transition-colors py-1 px-2 rounded-lg text-xs font-medium " +
                (isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-950")
              }
            >
              Switch to Terms of Use →
            </Link>
          </div>
        </div>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
            <Lock className="w-3.5 h-3.5 text-teal-500" />
            <span>Official Policy</span>
          </div>

          <h1
            className={
              "text-3xl sm:text-5xl font-bold tracking-tight mb-3 " +
              (isDark ? "text-white" : "text-slate-900")
            }
          >
            Privacy Policy
          </h1>

          <p
            className={
              "text-xs sm:text-sm font-mono mb-6 " +
              (isDark ? "text-slate-400" : "text-slate-500")
            }
          >
            Last updated: October 7, 2026
          </p>

          <div
            className={
              "p-4 sm:p-5 rounded-2xl border-2 leading-relaxed text-sm sm:text-base " +
              (isDark
                ? "bg-[#060e22] border-slate-700/80 text-slate-200"
                : "bg-white border-slate-300 text-slate-800 shadow-sm")
            }
          >
            <p className="mb-3">
              TrustLine is a verified support-routing system that helps people
              discover relevant helplines, authorities, and support organizations
              based on what they describe and, when available, their selected or
              detected location.
            </p>
            <p className="font-medium text-teal-600 dark:text-teal-300">
              TrustLine is designed to minimize unnecessary personal information
              while using the information required to provide relevant support.
            </p>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-10 text-sm sm:text-base leading-relaxed">
          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">1</span>
              <span>Information We Process</span>
            </h2>
            <p className={`mb-4 ${bodyClass}`}>When you use TrustLine, we may process:</p>

            <div className="space-y-3.5 pl-2 sm:pl-4">
              <div>
                <h3 className={`font-semibold text-sm ${isDark ? "text-teal-300" : "text-teal-800"}`}>
                  Your query
                </h3>
                <p className={bodyClass}>
                  The text you enter is processed to understand the type of support
                  you are looking for, such as cyber crime, mental health, women safety,
                  legal aid, disaster support, or other categories.
                </p>
              </div>

              <div>
                <h3 className={`font-semibold text-sm ${isDark ? "text-teal-300" : "text-teal-800"}`}>
                  Location information
                </h3>
                <p className={`mb-1.5 ${bodyClass}`}>
                  TrustLine may use location in two ways:
                </p>
                <ul className={`list-disc list-inside space-y-1 pl-2 mb-2 ${bodyClass}`}>
                  <li>A country you explicitly select.</li>
                  <li>Your current location, when you choose to use location-based support and provide browser permission.</li>
                </ul>
                <p className={bodyClass}>
                  When current location is used, TrustLine may process country, state,
                  and district information to identify geographically relevant resources.
                  TrustLine does not need your precise street address to route support.
                </p>
              </div>

              <div>
                <h3 className={`font-semibold text-sm ${isDark ? "text-teal-300" : "text-teal-800"}`}>
                  Technical and session information
                </h3>
                <p className={bodyClass}>
                  TrustLine may maintain limited technical or session information required
                  for the operation of the service.
                </p>
              </div>

              <div>
                <h3 className={`font-semibold text-sm ${isDark ? "text-teal-300" : "text-teal-800"}`}>
                  Language preference
                </h3>
                <p className={bodyClass}>
                  Your selected interface language may be stored locally in your browser
                  so that TrustLine can remember your language preference.
                </p>
              </div>
            </div>
          </section>

          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">2</span>
              <span>How We Use Information</span>
            </h2>
            <p className={`mb-3 ${bodyClass}`}>Information processed by TrustLine is used to:</p>
            <ul className={`list-disc list-inside space-y-1.5 pl-2 mb-4 ${bodyClass}`}>
              <li>Understand the support category relevant to your request.</li>
              <li>Determine relevant country, state, or district context.</li>
              <li>Retrieve relevant helplines and support resources from TrustLine's verified data sources.</li>
              <li>Generate a clear response explaining the available support options.</li>
              <li>Improve the reliability and operation of the service.</li>
            </ul>
            <div
              className={
                "p-3.5 rounded-xl border text-xs sm:text-sm font-medium " +
                (isDark
                  ? "bg-teal-950/30 border-teal-500/40 text-teal-200"
                  : "bg-teal-50 border-teal-300 text-teal-900")
              }
            >
              TrustLine's AI is used to understand and structure a request. It does
              not invent helpline numbers or create support contacts. Actual support
              resources are retrieved from TrustLine's maintained data sources.
            </div>
          </section>

          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">3</span>
              <span>Location and Browser Permission</span>
            </h2>
            <p className={`mb-3 ${bodyClass}`}>
              TrustLine may request browser location permission when location is needed
              to provide geographically relevant support.
            </p>
            <p className={`mb-3 ${bodyClass}`}>
              You can deny this permission. When location is unavailable, TrustLine can
              continue using information explicitly provided in your query or the country
              you select.
            </p>
            <p className={bodyClass}>
              Granting location permission is optional unless a particular location-based
              feature requires it.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">4</span>
              <span>Data Storage</span>
            </h2>
            <p className={`mb-3 ${bodyClass}`}>
              Certain information associated with requests and routed support sessions
              may be stored by TrustLine, including the query and routing information
              such as detected category, urgency, country, state, or district.
            </p>
            <p className={`mb-3 ${bodyClass}`}>
              TrustLine does not require you to create an account to use the core
              support-routing experience.
            </p>
            <p className={bodyClass}>
              TrustLine does not ask for unnecessary identity information such as your
              name, password, or government identification merely to search for support.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">5</span>
              <span>Third-Party Services</span>
            </h2>
            <p className={`mb-3 ${bodyClass}`}>
              Some TrustLine functionality may rely on external service providers for
              technical or translation-related processing.
            </p>
            <p className={`mb-3 ${bodyClass}`}>
              For example, interface translation may use an external translation service
              to translate requested user-interface text.
            </p>
            <p className={bodyClass}>
              External websites and support organizations linked through TrustLine operate
              independently and are subject to their own privacy policies and terms.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">6</span>
              <span>Verified Resources and External Links</span>
            </h2>
            <p className={`mb-3 ${bodyClass}`}>
              TrustLine may provide links, phone numbers, websites, and other contact
              information belonging to government authorities, NGOs, helplines, and other
              support organizations.
            </p>
            <p className={`mb-3 ${bodyClass}`}>
              TrustLine is responsible for maintaining its resource database, but external
              organizations control their own services, websites, availability, and handling
              of information after you contact them.
            </p>
            <p className={bodyClass}>
              Review the relevant organization's privacy policy before providing sensitive information.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">7</span>
              <span>Sensitive Information</span>
            </h2>
            <p className={`mb-3 ${bodyClass}`}>
              Please avoid entering unnecessary sensitive personal information into your query.
            </p>
            <p className={bodyClass}>
              Describe the situation at the level necessary to find appropriate support.
              You generally do not need to provide passwords, financial credentials,
              government identification numbers, or other highly sensitive information to find a helpline.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">8</span>
              <span>Security</span>
            </h2>
            <p className={`mb-3 ${bodyClass}`}>
              TrustLine takes reasonable technical measures to protect information processed by the service.
            </p>
            <p className={bodyClass}>
              However, no online system can guarantee absolute security. You should avoid
              submitting information that is not necessary for finding support.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">9</span>
              <span>Children's Privacy</span>
            </h2>
            <p className={`mb-3 ${bodyClass}`}>
              TrustLine may provide information relating to child support and child helplines.
              This does not mean that TrustLine intentionally collects personal information from children.
            </p>
            <p className={bodyClass}>
              Users should avoid providing unnecessary personal details about a child when searching for support.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">10</span>
              <span>Changes to This Privacy Policy</span>
            </h2>
            <p className={`mb-3 ${bodyClass}`}>
              This Privacy Policy may be updated when TrustLine's functionality, data practices,
              or legal requirements change.
            </p>
            <p className={bodyClass}>
              The latest version will be published on this page with the updated date.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border transition-all ${sectionClass}`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">11</span>
              <span>Contact</span>
            </h2>
            <p className={`mb-4 ${bodyClass}`}>
              For privacy-related questions, concerns, or requests, contact:
            </p>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-teal-500" />
              <a
                data-translation-skip="true"
                href="mailto:privacy@trustline.org"
                className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
              >
                privacy@trustline.org
              </a>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-300/50 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs sm:text-sm rounded-full transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/terms"
            className={
              "px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors border " +
              (isDark
                ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700"
                : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm")
            }
          >
            View Terms of Use →
          </Link>
        </div>
      </div>
    </main>
  );
}
