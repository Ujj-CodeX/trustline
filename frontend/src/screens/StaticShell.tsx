"use client";
import React from "react";
import {
  ArrowLeft, ShieldCheck, HelpCircle, BookOpen, Lock, Info,
  FileText, Brain, Heart, Users, Laptop, Scale, CloudRain,
  EyeOff, Database, Server, Globe2, CheckCircle2, Target,
} from "lucide-react";

interface StaticShellProps {
  page: "how-it-works" | "resources" | "safety" | "about";
  onNavigate: (path: string) => void;
}

export const StaticShell: React.FC<StaticShellProps> = ({ page, onNavigate }) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen w-full bg-white dark:bg-slate-950">
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-8">
      <button onClick={() => onNavigate("/")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>
      {children}
      <button onClick={() => onNavigate("/chat")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-sm active:scale-95 cursor-pointer">
        <ShieldCheck className="w-4 h-4" /> Launch TrustLine Chat
      </button>
    </div>
  </div>
);

  const Header = ({ Icon, title, tagline }: any) => (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-400 shrink-0">
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{tagline}</p>
      </div>
    </div>
  );

  const Card = ({ Icon, title, desc, color }: any) => (
    <div className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all">
      <div className={`w-12 h-12 rounded-xl bg-${color}-50 dark:bg-${color}-950/50 flex items-center justify-center text-${color}-600 dark:text-${color}-400 mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{desc}</p>
    </div>
  );

  if (page === "how-it-works") {
    return (
      <Wrapper>
        <Header Icon={HelpCircle} title="How TrustLine Works" tagline="AI-guided intent matching, backed entirely by verified data — never AI guesses." />
        <div className="grid md:grid-cols-3 gap-5">
          <Card Icon={FileText} color="blue" title="1. Describe your situation" desc={`Type what's happening in plain words — "cyber fraud in Lucknow" or "domestic violence help in Australia." No forms, no categories.`} />
          <Card Icon={Brain} color="blue" title="2. AI extracts intent" desc="Our LLM identifies category, urgency, and location from your message — it never generates a phone number itself." />
          <Card Icon={ShieldCheck} color="blue" title="3. Verified lookup" desc="The backend queries a trusted database — government helplines for India, cached verified global sources elsewhere." />
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><Target className="w-4 h-4 text-teal-600" /> Why this order matters</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Separating "understanding" from "data" means the AI can never hallucinate a helpline number — every contact you see is pulled from a verified record, and the AI only writes the surrounding guidance.
          </p>
        </div>
      </Wrapper>
    );
  }

  if (page === "resources") {
    const cats = [
      { Icon: Heart, color: "sky", title: "Mental Health Support", desc: "Counseling, crisis lines, emotional support helplines." },
      { Icon: Users, color: "rose", title: "Women Safety & Gender Support", desc: "Domestic abuse, harassment, and gender-based violence support." },
      { Icon: Laptop, color: "cyan", title: "Cyber Crime Assistance", desc: "Report fraud, scams, and online crime — recover faster." },
      { Icon: CloudRain, color: "amber", title: "Disaster Relief & Emergency", desc: "Flood, fire, earthquake, and civil emergency response." },
      { Icon: Scale, color: "purple", title: "Legal Aid & Consumer Rights", desc: "Free legal consultation and consumer protection." },
      { Icon: Globe2, color: "teal", title: "195+ Countries Covered", desc: "India: district-level depth. Elsewhere: verified global cache." },
    ];
    return (
      <Wrapper>
        <Header Icon={BookOpen} title="Helpline Resources Directory" tagline="10,000+ verified records across mental health, safety, legal, and emergency categories." />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {cats.map((c) => <Card key={c.title} {...c} />)}
        </div>
      </Wrapper>
    );
  }

  if (page === "safety") {
    return (
      <Wrapper>
        <Header Icon={Lock} title="Safety & Privacy Commitment" tagline="Strictly anonymous. No tracking. No stored conversations." />
        <div className="grid md:grid-cols-3 gap-5">
          <Card Icon={EyeOff} color="teal" title="No accounts, no login" desc="Nothing to sign up for. Ask for help without leaving a trace." />
          <Card Icon={Database} color="teal" title="Stateless processing" desc="Your query is used only to find the right helpline — never stored as your identity." />
          <Card Icon={Server} color="teal" title="Verified, not guessed" desc="Every phone number comes from a trusted database — the AI never invents contact details." />
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/50">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            This information may not always be fully current or verified. If something seems unreliable, please contact your local authorities directly.
          </p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header Icon={Info} title="About TrustLine" tagline="Connecting people in distress to verified help, in seconds." />
      <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
        Millions of people don't know where to turn when it matters most. TrustLine bridges AI-driven intent
        understanding with verified civic infrastructure — government helplines, NGOs, and trusted directories —
        so anyone, anywhere, can find the right support without guesswork or delay.
      </p>
      <div className="grid md:grid-cols-3 gap-5">
        <Card Icon={CheckCircle2} color="blue" title="Verified sources" desc="Every number sourced from government helplines, NGOs, and verified directories." />
        <Card Icon={Globe2} color="blue" title="Global + local depth" desc="District-level coverage in India, cached verified data across 195+ countries." />
        <Card Icon={ShieldCheck} color="blue" title="AI that never guesses" desc="The AI understands and explains — the data always comes from a trusted source." />
      </div>
    </Wrapper>
  );
};