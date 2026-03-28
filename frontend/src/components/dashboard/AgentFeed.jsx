import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useAgentFeed } from '../../hooks/useAgentFeed';

const agentConfig = {
  prospecting: { color: 'bg-purple-500 shadow-purple-500/30', label: 'Prospecting', icon: '🎯' },
  deal_intel:  { color: 'bg-rose-500 shadow-rose-500/30',    label: 'Deal Intel',   icon: '⚡' },
  retention:   { color: 'bg-emerald-500 shadow-emerald-500/30', label: 'Retention', icon: '🛡️' },
  competitive: { color: 'bg-amber-500 shadow-amber-500/30',  label: 'Competitive',  icon: '🔍' },
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AgentFeed() {
  const { feed, loading } = useAgentFeed({ limit: 20 });

  return (
    <div className="bg-white border text-left border-slate-200 rounded-xl p-5 shadow-sm h-[420px] flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 tracking-tight">Live Agent Activity</h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A4BD] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A4BD]"></span>
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-5 min-h-0">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 rounded-full border-4 border-[#00A4BD]/30 border-t-[#00A4BD] animate-spin"></div>
          </div>
        )}

        {!loading && feed.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-sm font-bold text-slate-500">No agent activity yet.</p>
            <p className="text-xs text-slate-400 mt-1">Run an agent from any workspace to see live events here.</p>
          </div>
        )}

        {!loading && feed.map((event, idx) => {
          const config = agentConfig[event.agentType] || agentConfig.prospecting;
          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={event._id}
              className="flex gap-4 items-start group"
            >
              <div className="mt-1.5 flex flex-col items-center">
                <div className={clsx("w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0", config.color)}></div>
                {idx !== feed.length - 1 && <div className="w-0.5 h-10 bg-slate-100 mt-2"></div>}
              </div>
              <div className="flex-1 pb-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{config.icon} {config.label}</span>
                  <span className={clsx(
                    "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                    event.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  )}>{event.status}</span>
                </div>
                <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed">
                  {event.action}
                </p>
                {event.outputSummary && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{event.outputSummary}</p>
                )}
                <span className="text-xs text-slate-400 font-medium">{timeAgo(event.createdAt)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
