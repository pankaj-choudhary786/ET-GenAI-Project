import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "NexusAI identified 47 deals in our pipeline that were silently dying. The automated recovery plays generated $1.2M in pipeline within our very first week.",
      author: "Sarah Jenkins",
      role: "VP of Sales, GlobalTech"
    },
    {
      quote: "The Revenue Retention Agent accurately flagged 14 core accounts preparing to churn 3 months before their renewal date. Highly impressive predictive capabilities.",
      author: "David Chen",
      role: "Chief Revenue Officer, Acme Corp"
    },
    {
      quote: "Our SDRs save over 15 hours a week using the Prospecting Agent. It researches and drafts hyper-personalized emails that actually get extremely high reply rates.",
      author: "Amanda Torres",
      role: "Dir. of Business Dev, Initech"
    }
  ];

  return (
    <section className="w-full py-32 px-6 bg-[#1A1F36] flex flex-col items-center text-white relative">
      <div className="max-w-7xl w-full text-center mb-20 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Over 2,400 global sales teams rely on us.</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          Don't just take our word for it. See how elite, fast-growing sales teams are scaling their revenue with NexusAI.
        </p>
      </div>
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {reviews.map((r, i) => (
          <div key={i} className="bg-slate-800/40 p-10 rounded-2xl border border-slate-700/50 hover:border-[#00A4BD] transition-all hover:bg-slate-800/60 flex flex-col justify-between shadow-xl cursor-crosshair">
            <p className="text-lg text-[#EAF0F6] italic mb-8 mb-auto leading-relaxed tracking-wide font-light">
              "{r.quote}"
            </p>
            <div className="mt-8 border-t border-slate-700/50 pt-6">
              <p className="font-bold text-white text-lg">{r.author}</p>
              <p className="text-sm font-semibold text-[#00A4BD] uppercase tracking-wider mt-1">{r.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
