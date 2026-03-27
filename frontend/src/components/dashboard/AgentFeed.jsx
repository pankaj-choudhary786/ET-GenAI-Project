import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const DUMMY_FEED = [];

const agentColors = {
  prospecting: 'bg-purple-500 shadow-purple-500/30',
  deal: 'bg-rose-500 shadow-rose-500/30',
  retention: 'bg-emerald-500 shadow-emerald-500/30',
  competitive: 'bg-amber-500 shadow-amber-500/30',
};

export default function AgentFeed() {
  return (
    <div className="bg-white border text-left border-slate-200 rounded-xl p-5 shadow-sm h-[420px] flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 tracking-tight">Live Agent Activity</h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A4BD] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A4BD]"></span>
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar min-h-0">
        {DUMMY_FEED.map((item, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={item.id} 
            className="flex gap-4 items-start group"
          >
            <div className="mt-1.5 flex flex-col items-center">
              <div className={clsx("w-2.5 h-2.5 rounded-full shadow-sm", agentColors[item.agent])}></div>
              {idx !== DUMMY_FEED.length - 1 && <div className="w-0.5 h-12 bg-slate-100 mt-2"></div>}
            </div>
            <div className="flex-1 pb-1">
              <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed">
                {item.text}
              </p>
              <span className="text-xs text-slate-400 font-medium">{item.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
