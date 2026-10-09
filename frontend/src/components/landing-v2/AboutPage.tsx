import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Compass,
  Lock,
  PhoneCall,
  CheckCircle2,
  FileText,
  AlertCircle,
  ExternalLink,
  Users,
  Layers,
  HeartHandshake,
  Cpu,
  Database,
  ArrowRight,
  Sparkles,
} 
from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useLanguage } from '@/lib/LanguageContext';

interface AboutPageProps {
  onBackToHome: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onFindHelpClick?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackToHome,
  onNavigateToPrivacy,
  onNavigateToTerms,
  onFindHelpClick,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? 'bg-[#030712] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Back Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-700/40 dark:border-slate-800">
          <button
            type="button"
            onClick={onBackToHome}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-teal-300 border-slate-700 hover:border-teal-500/50'
                : 'bg-white hover:bg-slate-50 text-teal-800 border-slate-300 shadow-xs hover:border-teal-600'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to TrustLine</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`px-2.5 py-1 rounded-full font-medium ${
                isDark
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                  : 'bg-teal-50 text-teal-800 border border-teal-300'
              }`}
            >
              About TrustLine
            </span>
            <button
              type="button"
              onClick={onNavigateToPrivacy}
              className={`transition-colors py-1 px-2 rounded-lg text-xs font-medium cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Privacy Policy →
            </button>
            <button
              type="button"
              onClick={onNavigateToTerms}
              className={`transition-colors py-1 px-2 rounded-lg text-xs font-medium cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Terms of Use →
            </button>
          </div>
        </div>

        {/* Hero Section / Core Introduction */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>Verified Support Routing Infrastructure</span>
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            About TrustLine
          </h1>

          <p
            className={`text-base sm:text-lg leading-relaxed mb-6 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            Connecting people in distress with verified, life-saving authorities and helplines
            through private, intelligent situational triage.
          </p>

          {/* Highlighted Core Introduction Card (Standout in light and dark mode) */}
          <div
            className={`p-6 sm:p-7 rounded-2xl border-2 leading-relaxed transition-all ${
              isDark
                ? 'bg-gradient-to-br from-[#060e22] to-[#040b1d] border-teal-500/30 text-slate-200 shadow-xl shadow-black/40'
                : 'bg-white border-teal-500/40 text-slate-800 shadow-lg shadow-teal-500/5'
            }`}
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isDark
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-teal-50 text-teal-700 border border-teal-200'
                }`}
              >
                <Sparkles className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <h2
                  className={`text-base sm:text-lg font-bold mb-1 ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  The Core Principle of TrustLine
                </h2>
                <p className="text-xs sm:text-sm font-medium text-teal-600 dark:text-teal-400">
                  AI helps understand the request. Verified data provides the actual support resource.
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base leading-relaxed mb-4">
              <strong>TrustLine</strong> is a verified support-routing system that helps people
              discover relevant helplines, authorities, and support organizations based on what they
              describe in their own words and, when available, their selected or detected location.
            </p>

            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              When a person faces a crisis—whether it is financial fraud, online harassment, domestic
              violence, mental distress, or unlawful eviction—they are often in a heightened state of
              anxiety. Navigating fragmented government websites, outdated helpline directories, or
              sponsored search results is difficult and dangerous. TrustLine exists to eliminate that
              confusion with direct, verified, and confidential routing.
            </p>
          </div>
        </header>

        {/* 4 Key Metrics / Guarantees Strip */}
        <section
          aria-label="Key system guarantees"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12"
        >
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              isDark
                ? 'bg-[#040a1c] border-slate-800 hover:border-teal-500/40'
                : 'bg-white border-slate-200 shadow-xs hover:border-teal-500/50'
            }`}
          >
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">100%</div>
            <div
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              Vetted Resources
            </div>
            <p className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Never machine-generated phone numbers
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              isDark
                ? 'bg-[#040a1c] border-slate-800 hover:border-teal-500/40'
                : 'bg-white border-slate-200 shadow-xs hover:border-teal-500/50'
            }`}
          >
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">Zero</div>
            <div
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              PII Barrier
            </div>
            <p className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No logins, accounts, or phone numbers required
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              isDark
                ? 'bg-[#040a1c] border-slate-800 hover:border-teal-500/40'
                : 'bg-white border-slate-200 shadow-xs hover:border-teal-500/50'
            }`}
          >
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">4-Tier</div>
            <div
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              Geo-Precision
            </div>
            <p className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Country, state, district, and national routing
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              isDark
                ? 'bg-[#040a1c] border-slate-800 hover:border-teal-500/40'
                : 'bg-white border-slate-200 shadow-xs hover:border-teal-500/50'
            }`}
          >
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">Immediate</div>
            <div
              className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              112 Priority
            </div>
            <p className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Instant emergency escalation for urgent risks
            </p>
          </div>
        </section>

        {/* Detailed Narrative Sections */}
        <div className="space-y-8 sm:space-y-10 text-sm sm:text-base leading-relaxed">
          {/* Section 1: The Problem We Solve */}
          <section
            className={`p-6 sm:p-7 rounded-2xl border transition-all ${
              isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <h2
              className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <span>Why We Built TrustLine</span>
            </h2>
            <p className={`mb-3.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              In moments of vulnerability, search engines often deliver conflicting search results:
              commercial listings, broken phone numbers, fake customer support scams, or walls of
              bureaucratic terminology.
            </p>
            <p className={`mb-3.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              At the same time, general-purpose AI chat assistants can hallucinate invalid helpline
              numbers or provide generalized advice when a user urgently needs to contact a real,
              functioning department.
            </p>
            <div
              className={`p-4 rounded-xl border mt-4 ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <p className="font-medium text-xs sm:text-sm">
                TrustLine resolves this duality by splitting responsibilities strictly:
              </p>
              <ul className="mt-2 space-y-1.5 text-xs sm:text-sm pl-4 list-disc text-teal-700 dark:text-teal-300">
                <li>
                  <strong>The AI Engine</strong> focuses exclusively on natural-language comprehension—detecting distress category, urgency level, and jurisdiction requirements.
                </li>
                <li>
                  <strong>The Verified Database</strong> supplies all contact numbers, URLs, official operating hours, and organizational coverage records.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Four Foundational Pillars */}
          <section
            className={`p-6 sm:p-7 rounded-2xl border transition-all ${
              isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <h2
              className={`text-lg sm:text-xl font-bold mb-4 flex items-center gap-2.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <span>The Four Pillars of TrustLine</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-xl border ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-white text-sm">
                  <Cpu className="w-4 h-4 text-teal-500" />
                  <span>1. Natural Language Triage</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Users describe problems in everyday words. TrustLine accurately recognizes topics
                  such as cyber harassment, sextortion, domestic fear, psychological crisis, or tenant disputes without forcing users through rigid drop-down menus.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-white text-sm">
                  <Database className="w-4 h-4 text-teal-500" />
                  <span>2. Vetted Registry Only</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Every listed resource is verified from authentic government agencies, police cyber cells, recognized medical boards, and established non-profits. The system is architected so AI cannot fabricate numbers.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-white text-sm">
                  <Lock className="w-4 h-4 text-teal-500" />
                  <span>3. Privacy by Architecture</span>
                </div>
                <p className="text-xs leading-relaxed">
                  TrustLine requires no sign-up, email, phone number, or government credentials. Location access is always voluntary and limited to administrative boundaries (district/state level), never tracking street addresses.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-white text-sm">
                  <PhoneCall className="w-4 h-4 text-teal-500" />
                  <span>4. Multi-Tier Geographic Scoping</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Crisis support varies by jurisdiction. TrustLine resolves support across national emergency lines (112), state legal authorities, district counseling cells, and international organizations.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Domains of Support */}
          <section
            className={`p-6 sm:p-7 rounded-2xl border transition-all ${
              isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <h2
              className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span>Support Domains Handled</span>
            </h2>

            <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine connects individuals to verified entities across key human-welfare and legal disciplines:
            </p>

            <div className="space-y-3">
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Cybercrime & Digital Extortion
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    National Cyber Crime Reporting Portals, citizen financial fraud helplines (e.g. 1930), identity recovery desks, and social-platform escalation channels.
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Women’s Safety & Domestic Distress
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    24/7 dedicated Women Helplines (181, 1091), One-Stop Crisis Centers, emergency shelter coordination, and domestic abuse advocacy networks.
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Mental Health & Suicide Prevention
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Government psychological support hotlines (Tele-MANAS, KIRAN), crisis counselors, confidential youth listening desks, and panic decompression resources.
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Legal Aid & Tenancy Rights
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    State & District Legal Services Authorities (SLSA/DLSA), free legal representation for marginalized citizens, consumer forums, and tenant advocacy panels.
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Emergency Dispatch & Child Protection
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Direct connection to National Emergency 112, Childline (1098), Disaster Management Authorities, and senior citizen aid desks.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: What TrustLine Is Not */}
          <section
            className={`p-6 sm:p-7 rounded-2xl border transition-all ${
              isDark
                ? 'bg-gradient-to-b from-[#0a1226] to-[#04091a] border-amber-500/30'
                : 'bg-amber-50/50 border-amber-200 shadow-xs'
            }`}
          >
            <h2
              className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2.5 ${
                isDark ? 'text-amber-300' : 'text-amber-900'
              }`}
            >
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <span>Important Boundaries & Emergency Notice</span>
            </h2>

            <div
              className={`space-y-3 text-xs sm:text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <p>
                <strong>TrustLine is not an emergency dispatcher:</strong> If you are in immediate
                physical danger, witness a violent crime in progress, or require urgent medical
                resuscitation, call <strong>112</strong> or your local emergency services immediately.
                Do not wait for a search or routing query to resolve.
              </p>
              <p>
                <strong>TrustLine is not a substitute for professional counsel:</strong> Information
                routed through TrustLine connects you to official bodies, but TrustLine does not
                provide legal representation, psychiatric therapy, or police investigations directly.
              </p>
              <p>
                <strong>Independent Operation:</strong> External organizations, government helplines,
                and non-profits listed on TrustLine operate independently and are responsible for their
                own personnel, wait times, and handling of inquiries.
              </p>
            </div>
          </section>

          {/* Section 5: Continuous Maintenance & Reporting */}
          <section
            className={`p-6 sm:p-7 rounded-2xl border transition-all ${
              isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <h2
              className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span>Resource Accuracy & Governance</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine regularly reviews helpline registries to ensure contact numbers, URLs, and
              operating hours remain active. If you represent a certified government body, emergency
              authority, or non-profit helpline wishing to verify or update your listing, or if you
              detect an outdated contact, please consult our team.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="mailto:support@trustline.org"
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-teal-300'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-teal-700 shadow-xs'
                }`}
              >
                <span>Report Outdated Resource</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={onNavigateToPrivacy}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Read Privacy Policy</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToTerms}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Read Terms of Use</span>
              </button>
            </div>
          </section>

          {/* Bottom Action CTA Box */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border text-center transition-all ${
              isDark
                ? 'bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/40 border-teal-500/30'
                : 'bg-gradient-to-r from-teal-50/80 via-white to-sky-50/80 border-teal-300 shadow-md'
            }`}
          >
            <h3
              className={`text-xl sm:text-2xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Need immediate support or guidance?
            </h3>
            <p
              className={`text-xs sm:text-sm max-w-xl mx-auto mb-5 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Describe your situation in your own words. TrustLine will instantly route you to verified
              national, regional, or local authorities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onFindHelpClick) {
                    onFindHelpClick();
                  } else {
                    onBackToHome();
                  }
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-md active:scale-95 ${
                  isDark
                    ? 'bg-white text-slate-950 hover:bg-slate-100 shadow-teal-500/10'
                    : 'bg-slate-950 text-white hover:bg-slate-800 shadow-slate-300'
                }`}
              >
                <span>Find Verified Help Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onBackToHome}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                  isDark
                    ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
