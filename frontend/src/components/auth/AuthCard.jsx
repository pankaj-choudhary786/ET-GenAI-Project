import React from 'react';
import { Network } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex selection:bg-[#00A4BD]/20 selection:text-[#00A4BD] w-full items-stretch">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative overflow-hidden items-center justify-center flex-col p-12 lg:p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00A4BD]/30 via-transparent to-[#FF7A59]/20 opacity-60 mix-blend-screen pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-8">
              <Network className="w-10 h-10 text-[#FF7A59]" />
              <span className="text-3xl font-black text-white tracking-tight">NexusAI</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
              The autonomous CRM layer that works while you sleep.
            </h2>
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-6 rounded-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Agent Terminal Active</span>
              </div>
              <p className="text-slate-300 font-mono text-sm leading-relaxed space-y-2">
                <span className="block text-emerald-400">&gt; Starting routine sync...</span>
                <span className="block text-slate-300">&gt; Prospecting Agent found 4 new ICP matches.</span>
                <span className="block text-slate-300">&gt; Deal Intelligence flagged Acme Corp for 14 days silence.</span>
                <span className="block text-slate-300">&gt; Crafting personalized follow-up emails...</span>
                <span className="block text-[#00A4BD] animate-pulse">&gt; Waiting for user approval_</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center bg-white p-6 sm:p-12 lg:p-24 shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.05)] relative z-20 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center sm:text-left">
            <div className="lg:hidden flex justify-center sm:justify-start mb-6">
              <Network className="w-10 h-10 text-[#FF7A59]" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
            <p className="mt-2 text-[15px] p-0 font-medium text-slate-500 leading-snug">{subtitle}</p>
          </div>
          
          <div className="w-full">
            {children}
          </div>
          
        </div>
      </div>
    </div>
  );
}
