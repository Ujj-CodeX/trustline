import React, { useEffect } from 'react';
import { ArrowLeft, FileText, AlertTriangle, ExternalLink, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface TermsOfUsePageProps {
  onBackToHome: () => void;
  onNavigateToPrivacy: () => void;
}

export const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({
  onBackToHome,
  onNavigateToPrivacy,
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
              Terms of Use
            </span>
            <button
              type="button"
              onClick={onNavigateToPrivacy}
              className={`transition-colors py-1 px-2 rounded-lg text-xs font-medium cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Switch to Privacy Policy →
            </button>
          </div>
        </div>

        {/* Header Block */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
            <FileText className="w-3.5 h-3.5 text-teal-500" />
            <span>Legal Agreement</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight mb-3 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Terms of Use
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
            <p className="mb-3 font-medium">
              By using TrustLine, you agree to these Terms of Use.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              TrustLine provides an AI-assisted system for discovering and routing users to relevant helplines, authorities, and support resources. It is intended to help users identify an appropriate next step; it does not replace professional, medical, legal, mental-health, police, emergency, or other specialized services.
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
              <span>What TrustLine Does</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine allows you to describe a situation in your own words.
            </p>
            <p className={`mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              The system may then:
            </p>
            <ol className={`list-decimal list-inside space-y-1.5 pl-2 mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>Understand the type of support you may need.</li>
              <li>Use available location context to identify relevant regional resources.</li>
              <li>Retrieve matching resources from TrustLine's verified data sources.</li>
              <li>Present those resources in a clear and accessible format.</li>
            </ol>
            <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium ${
              isDark ? 'bg-teal-950/30 border-teal-500/40 text-teal-200' : 'bg-teal-50 border-teal-300 text-teal-900'
            }`}>
              TrustLine is designed around the principle: <br />
              <span className="font-bold">AI helps understand the request. Verified data provides the actual support resource.</span>
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
              <span>No Guarantee of Outcome</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine provides information and routing assistance. It does not guarantee:
            </p>
            <ul className={`list-disc list-inside space-y-1.5 pl-2 mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>That a particular organization will answer.</li>
              <li>That a helpline will always be available.</li>
              <li>That an external website will remain accessible.</li>
              <li>That an organization will accept or resolve your case.</li>
              <li>That a particular resource is appropriate for every individual circumstance.</li>
            </ul>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Availability, eligibility, operating hours, jurisdiction, and response times may vary by organization and location.
            </p>
          </section>

          {/* Section 3 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 text-xs font-mono flex items-center justify-center shrink-0">3</span>
              <span>Emergency Situations</span>
            </h2>
            <div className={`p-3.5 mb-3 rounded-xl border flex items-start gap-3 ${
              isDark ? 'bg-red-950/20 border-red-500/30 text-red-200' : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">TrustLine is not an emergency response service.</p>
                <p className="text-xs sm:text-sm">
                  If you are in immediate danger or believe there is an imminent threat to life or safety, contact your local emergency services directly.
                </p>
              </div>
            </div>
            <p className={`mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Do not wait for TrustLine to respond before seeking emergency assistance.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              For India, TrustLine may display 112 for immediate emergency assistance where applicable.
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
              <span>AI Limitations</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine uses AI to interpret natural-language requests and help identify relevant support needs.
            </p>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              AI-generated interpretation can be incomplete or incorrect.
            </p>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              The AI layer should therefore not be treated as an authority, diagnosis, legal determination, or professional assessment.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              TrustLine's AI is not intended to independently generate or fabricate helpline numbers. Support resources are retrieved from TrustLine's maintained data sources.
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
              <span>Resource Accuracy</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine makes reasonable efforts to maintain and verify its support-resource database.
            </p>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              However, information can change. Telephone numbers, websites, operating hours, organizational responsibilities, and regional availability may change without immediate notice.
            </p>
            <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Before relying on a resource, verify the information through the relevant official organization where practical.
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                If you identify incorrect, outdated, or misleading resource information, please report it to:
              </span>
              <a href="mailto:support@trustline.org" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                support@trustline.org
              </a>
            </div>
          </section>

          {/* Section 6 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">6</span>
              <span>External Organizations</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine may connect you to third-party organizations, government authorities, NGOs, helplines, websites, or other external services.
            </p>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Those organizations operate independently of TrustLine.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              TrustLine does not control their services, decisions, policies, response times, or treatment of information after you contact them.
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
              <span>Acceptable Use</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              You agree to use TrustLine only for lawful and legitimate purposes.
            </p>
            <p className={`mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              You must not use TrustLine to:
            </p>
            <ul className={`list-disc list-inside space-y-1.5 pl-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>Abuse, threaten, harass, or impersonate others.</li>
              <li>Submit intentionally misleading information for the purpose of disrupting the service.</li>
              <li>Attempt to gain unauthorized access to TrustLine or its infrastructure.</li>
              <li>Interfere with the service or its availability.</li>
              <li>Use the platform for unlawful activity.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">8</span>
              <span>No Professional Advice</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Information presented by TrustLine should not be treated as a substitute for professional advice or direct assessment by a qualified authority or professional.
            </p>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              This includes, without limitation, medical, mental-health, legal, financial, law-enforcement, and emergency advice.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              TrustLine helps you find the right place to seek support; the relevant professional or authority remains responsible for the actual advice, intervention, or service.
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
              <span>User Responsibility</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              You are responsible for deciding whether, when, and how to contact a recommended organization.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              When contacting an external organization, use reasonable judgment about the information you disclose and follow that organization's instructions.
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
              <span>Service Availability</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine may be unavailable temporarily because of maintenance, technical problems, third-party service failures, network conditions, or other circumstances.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              TrustLine does not guarantee uninterrupted or error-free operation.
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
              <span>Changes to These Terms</span>
            </h2>
            <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              TrustLine may update these Terms when the service, functionality, or applicable requirements change.
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Continued use of TrustLine after an updated version is published constitutes acceptance of the revised Terms to the extent permitted by applicable law.
            </p>
          </section>

          {/* Section 12 */}
          <section className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#040a1c] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-500 text-xs font-mono flex items-center justify-center shrink-0">12</span>
              <span>Contact</span>
            </h2>
            <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              For questions, feedback, or concerns regarding these Terms:
            </p>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-teal-500" />
              <a
                href="mailto:contact@trustline.org"
                className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
              >
                contact@trustline.org
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
            onClick={onNavigateToPrivacy}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer border ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
            }`}
          >
            View Privacy Policy →
          </button>
        </div>
      </div>
    </div>
  );
};
