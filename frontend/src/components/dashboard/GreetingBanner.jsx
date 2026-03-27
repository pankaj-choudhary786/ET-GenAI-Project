import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GreetingBanner({ name = "John", customMessage }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#00A4BD] via-[#008f9c] to-[#FF7A59] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-[#00A4BD]/20 relative overflow-hidden text-left"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          Good morning, {name}. 
          <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
        </h2>
        <p className="mt-2 text-white/90 font-medium text-lg">
          {customMessage || "Your AI agents found 4 new prospects and flagged 2 at-risk deals overnight."}
        </p>
      </div>

      <button className="relative z-10 group flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-lg text-white font-medium transition-all">
        View Summary
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
