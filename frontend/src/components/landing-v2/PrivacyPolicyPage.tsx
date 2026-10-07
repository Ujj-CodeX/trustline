import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock, ExternalLink, Mail, CheckCircle2, FileText } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

interface PrivacyPolicyPageProps {
  onBackToHome: () => void;
  onNavigateToTerms: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onBackToHome,
  onNavigateToTerms,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDark ? 'bg-[#030712] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
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
            <span className={`px-2.5 py-1 rounded-full font-medium ${
              isDark ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' : 'bg-teal-50 text-teal-800 border border-teal-300'
            }`}>
              Privacy Policy
            </span>
            <button
              type="button"
              onClick={onNavigateToTerms}
              className={`transition-colors py-1 px-2 rounded-lg text-xs font-medium cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Switch to Terms of Use →
            </button>
          </div>
        </div>

        {/* Header Block */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
            <Lock className="w-3.5 h-3.5 text-teal-500" />
            <span>Official Policy</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight mb-3 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Privacy Policy
          </h1>

          <p className={`text-xs sm:text-sm font-mono mb-6 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Last updated: October 7, 2026
          </p>

          <div className={`p-4 sm:p-5 rounded-2xl border-2 leading-relaxed text-sm sm:text-base ${
            isDark
              ? 'bg-[#060e22] border-slate-700/80 text-slate-200'
              : 'bg-white border-slate-300 text-slate-800 shadow-sm'
          }`}>
            <p className="mb-3">
              TrustLine is a verified support-routing system that helps people discover relevant helplines, authorities, and support organizations based on what they describe and, when available, their selected or detected location.
            </p>
            <p className="font-medium text-teal-600 dark:text-teal-300">
              TrustLine is designed to minimize unnecessary personal information while using the information required to provide relevant support.
            </p>
          </div>
        </div>

        {/* Sections Content */}
        <div className="space-y-8 sm:space-y-10 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">1</span>
              <span>Information We Process</span>
            </h2>
            <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              When you use TrustLine, we may process:
            </p>
            <div className="space-y-3.5 pl-2 sm:pl-4">
              <div>
                <h3 className={`font-semibold text-sm ${isDark ? 'text-teal-300' : 'text-teal-800'}`}>Your query</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  The text you enter is processed to understand the type of support you are looking for, such as cyber crime, mental health, women safety, legal aid, disaster support, or other categories.
                </p>
              </div>

              <div>
                <h3 className={`font-semibold text-sm ${isDark ? 'text-teal-300' : 'text-teal-800'}`}>Location information</h3>
                <p className={`mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  TrustLine may use location in two ways:
                </p>
                <ul className={`list-disc list-inside space-y-1 pl-2 mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <li>A country you explicitly select.</li>
                  <li>Your current location, when you choose to use location-based support and provide browser permission.</li>
                </ul>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  When current location is used, TrustLine may process country, state, and district information to identify geographically relevant resources. TrustLine does not need your precise street address to route support.
                </p>
              </div>

              <div>
                <h3 className={`font-semibold text-sm ${isDark ? 'text-teal-300' : 'text-teal-800'}`}>Technical and session information</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  TrustLine may maintain limited technical or session information required for the operation of the service.
                </p>
              </div>

              <div>
                <h3 className={`font-semibold text-sm ${isDark ? 'text-teal-300' : 'text-teal-800'}`}>Language preference</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Your selected interface language may be stored locally in your browser so that TrustLine can remember your language preference.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">2</span>
              <span>How We Use Information</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Information processed by TrustLine is used to:
            </p>
            <ul className={`list-disc list-inside space-y-1.5 pl-2 mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>Understand the support category relevant to your request.</li>
              <li>Determine relevant country, state, or district context.</li>
              <li>Retrieve relevant helplines and support resources from TrustLine's verified data sources.</li>
              <li>Generate a clear response explaining the available support options.</li>
              <li>Improve the reliability and operation of the service.</li>
            </ul>
            <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium ${
              isDark ? 'bg-teal-950/30 border-teal-500/40 text-teal-200' : 'bg-teal-50 border-teal-300 text-teal-900'
            }`}>
              TrustLine's AI is used to understand and structure a request. It does not invent helpline numbers or create support contacts. Actual support resources are retrieved from TrustLine's maintained data sources.
            </div>
          </section>

          {/* Section 3 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">3</span>
              <span>Location and Browser Permission</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine may request browser location permission when location is needed to provide geographically relevant support.
            </p>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              You can deny this permission. When location is unavailable, TrustLine can continue using information explicitly provided in your query or the country you select.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Granting location permission is optional unless a particular location-based feature requires it.
            </p>
          </section>

          {/* Section 4 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">4</span>
              <span>Data Storage</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Certain information associated with requests and routed support sessions may be stored by TrustLine, including the query and routing information such as detected category, urgency, country, state, or district.
            </p>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine does not require you to create an account to use the core support-routing experience.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              TrustLine does not ask for unnecessary identity information such as your name, password, or government identification merely to search for support.
            </p>
          </section>

          {/* Section 5 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">5</span>
              <span>Third-Party Services</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Some TrustLine functionality may rely on external service providers for technical or translation-related processing.
            </p>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              For example, interface translation may use an external translation service to translate requested user-interface text.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              External websites and support organizations linked through TrustLine operate independently and are subject to their own privacy policies and terms.
            </p>
          </section>

          {/* Section 6 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">6</span>
              <span>Verified Resources and External Links</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine may provide links, phone numbers, websites, and other contact information belonging to government authorities, NGOs, helplines, and other support organizations.
            </p>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine is responsible for maintaining its resource database, but external organizations control their own services, websites, availability, and handling of information after you contact them.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Review the relevant organization's privacy policy before providing sensitive information.
            </p>
          </section>

          {/* Section 7 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">7</span>
              <span>Sensitive Information</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Please avoid entering unnecessary sensitive personal information into your query.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Describe the situation at the level necessary to find appropriate support. You generally do not need to provide passwords, financial credentials, government identification numbers, or other highly sensitive information to find a helpline.
            </p>
          </section>

          {/* Section 8 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">8</span>
              <span>Security</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine takes reasonable technical measures to protect information processed by the service.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              However, no online system can guarantee absolute security. You should avoid submitting information that is not necessary for finding support.
            </p>
          </section>

          {/* Section 9 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">9</span>
              <span>Children's Privacy</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine may provide information relating to child support and child helplines. This does not mean that TrustLine intentionally collects personal information from children.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Users should avoid providing unnecessary personal details about a child when searching for support.
            </p>
          </section>

          {/* Section 10 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">10</span>
              <span>Changes to This Privacy Policy</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              This Privacy Policy may be updated when TrustLine's functionality, data practices, or legal requirements change.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              The latest version will be published on this page with the updated date.
            </p>
          </section>

          {/* Section 11 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">11</span>
              <span>Contact</span>
            </h2>
            <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              For privacy-related questions, concerns, or requests, contact:
            </p>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-teal-500" />
              <a
                href="mailto:privacy@trustline.org"
                className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
              >
                privacy@trustline.org
              </a>
            </div>
          </section>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs sm:text-sm rounded-full cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToTerms}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer border ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
            }`}
          >
            View Terms of Use →
          </button>
        </div>
      </div>
    </div>
  );
};
