import React from 'react';
import clsx from 'clsx';
import Avatar from '../ui/Avatar';

const agentColors = {
  prospecting: 'bg-purple-100 text-purple-700 border-purple-200',
  recovery: 'bg-rose-100 text-rose-700 border-rose-200',
  retention: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function DraftList({ drafts, selectedId, onSelect }) {
  return (
    <div className="flex flex-col h-full border-r border-slate-200 bg-white min-w-[320px] max-w-[400px]">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {drafts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Drafts</p>
            <p className="text-xs text-slate-400 max-w-[200px]">Run the prospecting or deal agents to generate outreach drafts.</p>
          </div>
        )}
        {drafts.map((draft) => {
          const isSelected = draft.id === selectedId;
          const isAwaiting = draft.status === 'awaiting_approval';
          const agentKey = draft.agent?.toLowerCase();

          return (
            <button
              key={draft.id}
              onClick={() => onSelect(draft.id)}
              className={clsx(
                "w-full text-left p-4 border-b border-slate-100 transition-all focus:outline-none relative group",
                isSelected ? "bg-slate-50" : "hover:bg-slate-50/50",
                isAwaiting && !isSelected && "hover:ring-1 hover:ring-amber-400/50",
                isSelected && isAwaiting && "ring-1 ring-inset ring-amber-400 bg-amber-50/30"
              )}
            >
              {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00A4BD]"></div>}
              
              <div className="flex gap-3 mb-2">
                <Avatar name={draft.company} size="sm" className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-slate-900 truncate">{draft.company}</h4>
                    {draft.sendDelay && <span className="text-xs text-slate-400 whitespace-nowrap">{draft.sendDelay}</span>}
                  </div>
                  <p className="text-sm font-medium text-slate-500 truncate">{draft.recipient}</p>
                </div>
              </div>
              
              <h5 className="text-sm font-bold text-slate-800 mb-1.5 truncate">{draft.subject}</h5>
              
              <div className="flex items-center gap-2 mt-3">
                <span className={clsx(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                  agentColors[agentKey] || 'bg-slate-100 text-slate-600 border-slate-200'
                )}>
                  {draft.agent} Agent
                </span>
                {isAwaiting && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 border border-amber-200">
                    Awaiting
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
