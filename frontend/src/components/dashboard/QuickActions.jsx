import React, { useState } from 'react';
import { Play, Users, ShieldAlert, Swords, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import client from '../../api/client';
import { useStore } from '../../store/useStore';

const ACTIONS = [
  { id: 'prospecting', label: 'Run prospecting now', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'dealIntel', label: 'Scan pipeline for risks', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-100' },
  { id: 'retention', label: 'Check retention scores', icon: Play, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'competitive', label: 'Refresh battlecards', icon: Swords, color: 'text-amber-600', bg: 'bg-amber-100' }
];

export default function QuickActions() {
  const [running, setRunning] = useState(null);
  const addToast = useStore(state => state.addToast);

  const handleRun = async (agentType) => {
    const endpoints = {
      prospecting: '/api/prospects/run-agent',
      dealIntel: '/api/deals/scan',
      retention: '/api/retention/scan',
      competitive: '/api/battlecards/refresh/all'
    };
    const labels = {
      prospecting: 'Prospecting agent',
      dealIntel: 'Deal Intelligence agent',
      retention: 'Retention agent',
      competitive: 'Competitive Intel agent'
    };
    
    setRunning(agentType);
    addToast('info', `${labels[agentType]} started...`);
    
    try {
      if (agentType === 'competitive') {
          // Placeholder for competitive refresh all if not implemented, 
          // but following prompt's logic 
          await client.post(endpoints[agentType]);
      } else {
          await client.post(endpoints[agentType]);
      }
      
      setTimeout(() => {
        setRunning(null);
        addToast('success', `${labels[agentType]} completed`);
      }, 5000); // UI feedback delay
    } catch (err) {
      setRunning(null);
      addToast('error', `Failed to start ${labels[agentType]}`);
    }
  };

  return (
    <div className="bg-white border text-left border-slate-200 rounded-xl p-5 shadow-sm h-[420px] flex flex-col">
      <h3 className="font-bold text-slate-800 tracking-tight mb-4 text-left">Manual Overrides</h3>
      <div className="flex flex-col gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => handleRun(action.id)}
            disabled={running !== null}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className={clsx("w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors", action.bg, action.color)}>
              {running === action.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <action.icon className="w-4 h-4" />}
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors text-left flex-1">
              {action.label}
            </span>
            {running === action.id && <span className="text-xs font-semibold text-[#00A4BD] animate-pulse pr-2">Running...</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
