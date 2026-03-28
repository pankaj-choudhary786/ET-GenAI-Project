import React, { useState, useEffect } from 'react';
import DraftList from '../../components/outbox/DraftList';
import EmailPreview from '../../components/outbox/EmailPreview';
import clsx from 'clsx';
import { useStore } from '../../store/useStore';
import { useProspects } from '../../hooks/useProspects';
import { useDeals } from '../../hooks/useDeals';
import client from '../../api/client';

const FILTERS = ['All drafts', 'Prospecting', 'Recovery', 'Waiting approval'];

export default function Outbox() {
  const { prospects, refetch: refetchProspects } = useProspects();
  const { deals, refetch: refetchDeals } = useDeals();
  const addToast = useStore(state => state.addToast);

  const [drafts, setDrafts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All drafts');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const combined = [];
    
    // Prospect sequences
    if (prospects) {
      prospects.forEach(p => {
        if (p.outreachSequences) {
          p.outreachSequences.forEach((seq) => {
            if (!seq.approved && !seq.sent) {
              combined.push({
                id: `prospect_${p._id}_${seq.index}`,
                type: 'prospect',
                entityId: p._id,
                sequenceIndex: seq.index,
                agent: 'Prospecting',
                status: 'awaiting_approval',
                subject: seq.subject,
                content: seq.body,
                recipient: p.contactEmail,
                company: p.company,
                date: p.lastAgentActivity || p.createdAt
              });
            }
          });
        }
      });
    }

    // Deals Recovery plays
    if (deals) {
      deals.forEach(d => {
        if (d.recoveryPlay && d.recoveryPlay.messageDraft) {
          combined.push({
            id: `deal_${d._id}`,
            type: 'deal',
            entityId: d._id,
            agent: 'Recovery',
            status: 'awaiting_approval',
            subject: 'Checking in regarding our deal',
            content: d.recoveryPlay.messageDraft,
            recipient: d.contactEmail || `contact@${d.company.toLowerCase().replace(' ', '')}.com`,
            company: d.company,
            date: d.recoveryPlay.generatedAt || d.updatedAt
          });
        }
      });
    }

    setDrafts(combined);
    if (!selectedId && combined.length > 0) {
      setSelectedId(combined[0].id);
    }
  }, [prospects, deals]);

  const filteredDrafts = drafts.filter(d => {
    if (activeFilter === 'All drafts') return true;
    if (activeFilter === 'Waiting approval') return d.status === 'awaiting_approval';
    return d.agent.toLowerCase() === activeFilter.toLowerCase();
  });

  const selectedDraft = drafts.find(d => d.id === selectedId);

  const handleApprove = async (id, editedBody) => {
    const draft = drafts.find(d => d.id === id);
    if (!draft) return;

    setLoading(true);
    try {
      if (draft.type === 'prospect') {
         await client.post(`/api/prospects/${draft.entityId}/approve-email`, {
           sequenceIndex: draft.sequenceIndex,
           editedBody: editedBody || draft.content
         });
         addToast('success', 'Prospect email approved and sent!');
         refetchProspects();
      } else if (draft.type === 'deal') {
         await client.post(`/api/deals/${draft.entityId}/send-recovery`, {
           emailBody: editedBody || draft.content
         });
         await client.put(`/api/deals/${draft.entityId}/resolve`);
         addToast('success', 'Recovery email sent!');
         refetchDeals();
      }
      setSelectedId(null);
    } catch (err) {
      addToast('error', 'Failed to approve email');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = async (id) => {
    const draft = drafts.find(d => d.id === id);
    if (!draft) return;
    
    try {
      if (draft.type === 'deal') {
         await client.put(`/api/deals/${draft.entityId}/resolve`);
         addToast('info', 'Recovery play discarded.');
         refetchDeals();
      } else {
         addToast('info', 'Prospect draft discarded.');
         // For prospects, we might want to mark the sequence as discarded in DB.
         // For now, let's just filter it out of the local view.
         setDrafts(prev => prev.filter(d => d.id !== id));
      }
      setSelectedId(null);
    } catch (err) {
      addToast('error', 'Failed to discard draft');
    }
  };

  const handleRegenerate = async (id, guidance) => {
    const draft = drafts.find(d => d.id === id);
    if (!draft || draft.type !== 'prospect') return;

    try {
      const { data } = await client.post(`/api/prospects/${draft.entityId}/regenerate-email`, {
        sequenceIndex: draft.sequenceIndex,
        guidance
      });
      addToast('success', 'Email regenerated with AI');
      refetchProspects();
      return data.prospect.outreachSequences.find(s => s.index === draft.sequenceIndex)?.body;
    } catch (err) {
      addToast('error', 'Failed to regenerate email');
    }
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

      <div className="flex flex-1 h-full overflow-hidden relative">
        <DraftList 
          drafts={filteredDrafts} 
          selectedId={selectedId} 
          onSelect={setSelectedId} 
        />
        
        {loading && (
           <div className="absolute inset-x-0 bottom-0 top-0 left-80 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
             <div className="w-8 h-8 rounded-full border-4 border-[#FF7A59]/30 border-t-[#FF7A59] animate-spin"></div>
           </div>
        )}

        <EmailPreview 
          draft={selectedDraft}
          onApprove={(id) => handleApprove(id, selectedDraft.content)}
          onDiscard={handleDiscard}
          onRegenerate={handleRegenerate}
        />
      </div>
    </div>
  );
}