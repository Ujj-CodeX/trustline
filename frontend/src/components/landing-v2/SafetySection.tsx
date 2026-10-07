import React from 'react';
import { ShieldCheck, EyeOff, AlertCircle, Ban, Lock, HeartPulse } from 'lucide-react';

export const SafetySection: React.FC = () => {
  const safetyPillars = [
    {
      icon: EyeOff,
      title: 'Ephemeral Zero-Retention Processing',
      description:
        'When you describe a personal trauma or legal crisis, your words never become training tokens for commercial AI models. Requests are processed in volatile memory and purged immediately after routing.',
      badge: 'Zero AI Training',
    },
    {
      icon: Ban,
      title: 'Absolute Ban on Lead Brokers & Bounty Ads',
      description:
        'Traditional search engines often rank predatory "recovery hackers", bail-bond sharks, or unvetted private referral services that charge exorbitant fees. TrustLine only routes to accredited non-profits and public authorities.',
      badge: '100% Non-Commercial',
    },
    {
      icon: ShieldCheck,
      title: 'Physical Human Verification Protocol',
      description:
        'Every organization in our directory is physically vetted: our safety compliance officers verify corporate charters, active licensure, physical office addresses, and telephone line operability every 90 days.',
      badge: 'Quarterly Audited',
    },
    {
      icon: HeartPulse,
      title: 'Zero-Latency Life-Safety Emergency Override',
      description:
        'If a natural language prompt conveys imminent physical danger, severe domestic violence in progress, or immediate self-harm, our safety classifier immediately triggers high-priority statutory emergency helplines (911, 988, 112) with zero delay.',
      badge: 'Immediate Triage',
    },
  ];

  return (
    <section id="safety" className="relative py-28 bg-[#040814] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
            Safety &amp; Ethics Charter
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight text-balance">
            Protection built for people at their most vulnerable.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Seeking help should never expose you to data surveillance, predatory marketing, or unverified charlatans. Here is our solemn architectural pledge.
          </p>
        </div>

        {/* 4 Core Safety Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {safetyPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-[#070e1f] border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-sky-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enforced at kernel architecture level</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Notice Banner */}
        <div className="bg-[#0b162f]/60 border border-sky-900/60 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <AlertCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">In immediate physical danger?</strong> If you or someone you know is in immediate life-threatening danger, please contact your local emergency authorities immediately (Dial 911 in US/CA, 999 in UK, 112 in EU/India).
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 shrink-0">
            Emergency Override: Active
          </div>
        </div>
      </div>
    </section>
  );
};
