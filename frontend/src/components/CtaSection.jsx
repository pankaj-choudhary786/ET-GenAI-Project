import React from 'react';
import { Link } from 'react-router-dom';

export default function CtaSection() {
  return (
    <section className="w-full py-32 px-6 bg-[#00A4BD] flex flex-col items-center text-center text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.03] rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] bg-[#FF7A59] opacity-30 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl w-full relative z-10">
        <h2 className="text-5xl md:text-[4rem] font-black mb-8 leading-tight tracking-tighter">Ready to put your revenue engine on autopilot?</h2>
        <p className="text-xl md:text-2xl text-white/90 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          Join the thousands of sales teams using NexusAI to prospect faster, close more deals, and eliminate churn universally.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/signup" className="px-10 py-5 bg-white text-[#00A4BD] rounded font-bold text-[17px] hover:bg-slate-50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer">
            Get started for free
          </Link>
          <Link to="/signup" className="px-10 py-5 bg-transparent border-2 border-white text-white rounded font-bold text-[17px] hover:bg-white/10 transition-colors cursor-pointer">
            Talk to sales
          </Link>
        </div>
        <p className="mt-10 text-sm font-semibold opacity-90 tracking-wide">
          No credit card required • Setup in 5 minutes • 14-day free trial on Pro
        </p>
      </div>
    </section>
  );
}
