import React, { useState } from 'react';
import DraftList from '../../components/outbox/DraftList';
import EmailPreview from '../../components/outbox/EmailPreview';
import clsx from 'clsx';
import Toast from '../../components/ui/Toast';

const DUMMY_DRAFTS = [];

const FILTERS = ['All drafts', 'Prospecting', 'Recovery', 'Retention', 'Waiting approval'];

export default function Outbox() {
  const [drafts, setDrafts] = useState(DUMMY_DRAFTS);
  const [activeFilter, setActiveFilter] = useState('Waiting approval');
  const [selectedId, setSelectedId] = useState('1');
  const [toast, setToast] = useState(null);

  const filteredDrafts = drafts.filter(d => {
    if (activeFilter === 'All drafts') return true;
    if (activeFilter === 'Waiting approval') return d.status === 'awaiting_approval';
    return d.agent.toLowerCase() === activeFilter.toLowerCase();
  });

  const selectedDraft = drafts.find(d => d.id === selectedId);

  const handleApprove = (id) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    setSelectedId(null);
    setToast({ type: 'success', message: 'Email sent successfully!' });
  };

  const handleDiscard = (id) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    setSelectedId(null);
    setToast({ type: 'info', message: 'Draft discarded.' });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50 overflow-x-auto custom-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeFilter === f 
                ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-1 h-full overflow-hidden">
        <DraftList 
          drafts={filteredDrafts} 
          selectedId={selectedId} 
          onSelect={setSelectedId} 
        />
        
        <EmailPreview 
          draft={selectedDraft}
          onApprove={handleApprove}
          onDiscard={handleDiscard}
        />
      </div>

      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}