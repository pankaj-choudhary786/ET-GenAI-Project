import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useAgentFeed } from '../../hooks/useAgentFeed';

const agentConfig = {
  prospecting: { color: 'bg-purple-500 shadow-purple-500/30', label: 'Prospecting', icon: '🎯' },
  deal_intel:  { color: 'bg-rose-500 shadow-rose-500/30',    label: 'Deal Intel',   icon: '⚡' },
  retention:   { color: 'bg-emerald-500 shadow-emerald-500/30', label: 'Retention', icon: '🛡️' },
  competitive: { color: 'bg-amber-500 shadow-amber-500/30',  label: 'Competitive',  icon: '🔍' },
  manual_override: { color: 'bg-blue-500 shadow-blue-500/30', label: 'Manual Override', icon: '👤' },
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
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="bg-white border text-left border-slate-200 rounded-xl p-5 shadow-sm h-[420px] flex flex-col relative overflow-hidden">
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
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-1">{event.outputSummary}</p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-400 font-medium">{timeAgo(event.createdAt)}</span>
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="text-[10px] font-black text-[#00A4BD] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    VIEW SUMMARY
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Detail Overlay */}
      {selectedEvent && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 p-6 flex flex-col animate-in fade-in slide-in-from-right-4">
           <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">Agent Activity Detail</h4>
              <button onClick={() => setSelectedEvent(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Action Initiated</label>
                <p className="text-sm font-black text-slate-800 leading-tight">{selectedEvent.action}</p>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">AI Output Summary</label>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed font-medium italic">
                  "{selectedEvent.outputSummary || "No detailed summary generated for this autonomous cycle."}"
                </div>
              </div>

              {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">System Intelligence Signals</label>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {Object.entries(selectedEvent.metadata).map(([k, v]) => (
                      <div key={k} className="p-2.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <span className="text-slate-400 font-bold block uppercase truncate mb-0.5">{k.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-slate-900 font-black truncate block">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
           </div>

           <div className="pt-4 mt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="w-full py-2.5 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-black transition-all"
              >
                CLOSE SUMMARY
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
