import React from 'react';
import { Target, Briefcase, LineChart, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  return (
    <section id="agents" className="w-full py-24 px-6 bg-white flex flex-col items-center">
      <div className="max-w-7xl w-full text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-[#33475B] mb-6">Built for the entire <span className="text-[#00A4BD]">revenue lifecycle.</span></h2>
        <p className="text-xl text-[#4a5568] max-w-3xl mx-auto font-light">
          NexusAI deploys four specialized, autonomous agents that integrate directly into your workflow to prospect, engage, close, and retain customers automatically.
        </p>
      </div>

      <div className="max-w-7xl w-full flex flex-col gap-24">
        
        {/* Feature 1 - Prospecting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative rounded-2xl bg-[#F5F8FA] p-8 md:p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
             {/* Mocking a mini-UI for prospecting */}
             <div className="w-full max-w-md bg-white rounded-xl shadow-card overflow-hidden border border-slate-100">
               <div className="bg-[#00A4BD] text-white p-4 font-bold flex justify-between items-center">
                 <span>Agent: Prospector</span>
                 <span className="text-xs bg-white/20 px-2 py-1 rounded font-bold uppercase tracking-wider">Active</span>
               </div>
               <div className="p-6 space-y-4">
                 <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                   <div>
                     <p className="font-bold text-[#33475B] text-lg">Acme Corp.</p>
                     <p className="text-sm text-slate-500">VP of Sales - Series B Fast Growth</p>
                   </div>
                   <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">92/100</div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100 italic leading-relaxed">
                   "Drafting personalized outreach based on recent $12M funding round mentioned in TechCrunch..."
                 </div>
                 <button className="w-full mt-2 py-3 text-[#00A4BD] font-bold text-sm bg-blue-50/50 border border-blue-100 rounded hover:bg-blue-50 transition-colors cursor-pointer">Review Draft</button>
               </div>
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="w-16 h-16 rounded-xl bg-[#00A4BD]/10 flex items-center justify-center mb-8">
              <Target className="w-8 h-8 text-[#00A4BD]" />
            </div>
            <h3 className="text-4xl font-black text-[#33475B] mb-6 tracking-tight">Find and engage the right buyers.</h3>
            <p className="text-lg text-[#4a5568] mb-8 leading-relaxed font-normal">
              The <strong>Prospecting Agent</strong> reads your Ideal Customer Profile, scrapes the web for real-time buying signals (like hiring spikes or fundraises), and drafts hyper-personalized outreach sequences that humans couldn't write at scale.
            </p>
            <a href="#" className="inline-flex items-center text-[#00A4BD] font-bold hover:text-[#00869C] transition-colors cursor-pointer text-lg">
              See how Prospecting works <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>

        {/* Feature 2 - Deal Intelligence & Retention (Combined visual) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-16 rounded-xl bg-[#FF7A59]/10 flex items-center justify-center mb-8">
              <Briefcase className="w-8 h-8 text-[#FF7A59]" />
            </div>
            <h3 className="text-4xl font-black text-[#33475B] mb-6 tracking-tight">Never let a deal go cold again.</h3>
            <p className="text-lg text-[#4a5568] mb-8 leading-relaxed font-normal">
              The <strong>Deal Intelligence Agent</strong> monitors your pipeline 24/7. When a prospect stops replying or sentiment drops, it flags the deal risk and instantly generates a recovery play for your rep to execute with one click.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <LineChart className="w-6 h-6 text-[#00A4BD] mb-4" />
                <h4 className="font-bold text-[#33475B] mb-2 text-lg">Revenue Retention</h4>
                <p className="text-sm text-[#4a5568] leading-relaxed">Predicts churn weeks before cancellation by analyzing software usage patterns.</p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <Shield className="w-6 h-6 text-[#00A4BD] mb-4" />
                <h4 className="font-bold text-[#33475B] mb-2 text-lg">Competitive Intel</h4>
                <p className="text-sm text-[#4a5568] leading-relaxed">Pushes dynamic battlecards into active deals when competitors are mentioned.</p>
              </div>
            </div>
          </div>
          <div className="relative rounded-2xl shadow-xl overflow-hidden border border-slate-200 bg-white">
             <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-slate-300"></div>
               <div className="w-3 h-3 rounded-full bg-slate-300"></div>
               <div className="w-3 h-3 rounded-full bg-slate-300"></div>
             </div>
             <img src="/analytics_dashboard.png" alt="Analytics Dashboard" className="w-full h-auto object-cover" />
          </div>
        </div>

      </div>
    </section>
  );
}
