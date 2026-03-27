import React from 'react';
import { Database, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Connect your CRM",
      desc: "Instant two-way sync with Salesforce, HubSpot, or Pipedrive. We securely index your historical deals and current pipeline.",
      icon: <Database className="w-6 h-6 text-[#FF7A59]" />
    },
    {
      num: "02",
      title: "Agents begin analysis",
      desc: "Our AI immediately scans all active deals for risk signals and historically matches them against your closed-won architecture.",
      icon: <TrendingUp className="w-6 h-6 text-[#FF7A59]" />
    },
    {
      num: "03",
      title: "Automate and Close",
      desc: "Approve AI-generated recovery plays, send personalized outreach, and watch your win-rate skyrocket autonomously.",
      icon: <CheckCircle2 className="w-6 h-6 text-[#FF7A59]" />
    }
  ];

  return (
    <section className="w-full py-24 px-6 bg-white flex flex-col items-center">
      <div className="max-w-7xl w-full text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-[#33475B] mb-6 tracking-tight">How <span className="text-[#FF7A59]">NexusAI</span> works</h2>
        <p className="text-xl text-[#4a5568] max-w-2xl mx-auto font-light leading-relaxed">
          Set up in minutes. No complex implementation or engineering required. Simply connect your CRM and let our agents take over.
        </p>
      </div>
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        {/* Hidden line connecting steps */}
        <div className="hidden md:block absolute top-[12%] lg:top-[16%] left-[16%] right-[16%] h-[2px] bg-slate-100 z-0 border-t-2 border-dashed border-slate-200"></div>
        
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center relative z-10 group cursor-pointer hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-slate-100 shadow-md group-hover:border-[#FF7A59] transition-colors flex items-center justify-center mb-6 text-2xl font-black text-[#FF7A59]">
              {step.num}
            </div>
            <div className="w-14 h-14 rounded-xl bg-[#FF7A59]/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              {step.icon}
            </div>
            <h3 className="text-2xl font-bold text-[#33475B] mb-4">{step.title}</h3>
            <p className="text-[#4a5568] leading-relaxed max-w-xs">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
