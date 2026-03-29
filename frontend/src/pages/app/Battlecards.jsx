import React, { useState } from 'react';
import clsx from 'clsx';
import { Swords, Share, Shield, Target, Plus, ChevronDown, ChevronRight, Newspaper, Send, Search } from 'lucide-react';
import { useBattlecards } from '../../hooks/useBattlecards';
import client from '../../api/client';
import { useStore } from '../../store/useStore';
import AddCompetitorModal from '../../components/modals/AddCompetitorModal';

function ObjectionAccordion({ objections }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!objections || objections.length === 0) {
      return <div className="text-sm text-slate-500 p-4 text-center border border-dashed rounded-lg">No objection handlers generated yet.</div>;
  }

  return (
    <div className="space-y-3">
      {objections.map((obj, i) => (
        <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
          <button 
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <span className="truncate pr-4">"{obj.claim}"</span>
            {openIndex === i ? <ChevronDown className="w-5 h-5 flex-shrink-0 text-slate-400" /> : <ChevronRight className="w-5 h-5 flex-shrink-0 text-slate-400" />}
          </button>
          
          {openIndex === i && (
            <div className="p-4 bg-white border-t border-slate-100 flex items-start gap-3">
              <div className="p-1.5 bg-[#00A4BD]/10 text-[#00A4BD] rounded-lg mt-0.5 flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {obj.response}
              </p>
            </div>
          )}
        </div>
      ))}
      {showAddModal && (
        <AddCompetitorModal 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddCompetitor} 
        />
      )}
    </div>
  );
}

export default function Battlecards() {
  const { battlecards, loading, refetch } = useBattlecards();
  const [selectedId, setSelectedId] = useState(null);
  const addToast = useStore(state => state.addToast);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Set initial selected
  React.useEffect(() => {
     if (battlecards.length > 0 && !selectedId) {
         setSelectedId(battlecards[0]._id);
     }
  }, [battlecards, selectedId]);

  const activeCompetitor = battlecards.find(c => c._id === selectedId);

  const handleRefresh = async () => {
     if (!activeCompetitor) return;
     try {
        setRefreshing(true);
        addToast('info', `Agent recon started for ${activeCompetitor.competitor}...`);
        await client.post(`/api/battlecards/refresh/${activeCompetitor.competitor}`);
        setTimeout(async () => {
          try {
            const { data } = await client.get('/api/auth/profile');
            addToast('success', data.user.lastAgentSummary || `Battlecard for ${activeCompetitor.competitor} updated`);
          } catch {
            addToast('success', `Battlecard for ${activeCompetitor.competitor} updated`);
          }
          setRefreshing(false);
          refetch();
        }, 3000);
     } catch (err) {
        setRefreshing(false);
        addToast('error', 'Recon failed');
     }
  };

  const handleAddCompetitor = async (name) => {
    try {
      addToast('info', `Targeting ${name}. Launching reconnaissance agents...`);
      await client.post('/api/battlecards', { competitor: name });
      try {
        const { data } = await client.get('/api/auth/profile');
        addToast('success', data.user.lastAgentSummary || `${name} battlecard generated!`);
      } catch {
        addToast('success', `${name} battlecard generated!`);
      }
      setShowAddModal(false);
      refetch();
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to add competitor');
    }
  };

  const handlePushToDeals = async () => {
    if (!activeCompetitor) return;
    try {
       const { data } = await client.post(`/api/battlecards/${activeCompetitor._id}/push-to-deals`);
       addToast('success', `Battlecard intel pushed to ${data.dealsUpdated} active deals.`);
    } catch {
       addToast('error', 'Failed to push to deals');
    }
  };

  return (
    <div className="h-full flex flex-col max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Competitive Intelligence</h1>
          <p className="text-slate-500 mt-1">Live battlecards autonomously updated from public market signals.</p>
        </div>
      </div>

      <div className="flex flex-1 h-[calc(100vh-14rem)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
        {loading && (
             <div className="absolute inset-x-0 bottom-0 top-0 left-72 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
               <div className="w-8 h-8 rounded-full border-4 border-[#00A4BD]/30 border-t-[#00A4BD] animate-spin"></div>
             </div>
        )}
        
        {/* Competitor Sidebar */}
        <div className="w-72 border-r border-slate-200 bg-slate-50 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-100/50">
             <h3 className="font-bold text-slate-800 tracking-tight">Tracked Targets</h3>
             <button onClick={() => setShowAddModal(true)} className="text-[#00A4BD] hover:text-[#008f9c] transition-colors p-1 bg-white rounded-md border border-slate-200"><Plus className="w-5 h-5"/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {battlecards.map(comp => (
              <button 
                key={comp._id}
                onClick={() => setSelectedId(comp._id)}
                className={clsx(
                  "w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all",
                  selectedId === comp._id ? "bg-white border-[#00A4BD] shadow-sm ring-1 ring-[#00A4BD] ring-inset" : "border-transparent hover:bg-slate-100"
                )}
              >
                <div>
                  <h4 className="font-bold text-slate-900">{comp.competitor}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Updated {new Date(comp.lastScraped).toLocaleDateString()}</p>
                </div>
                <div className={clsx(
                  "w-2.5 h-2.5 rounded-full shadow-sm",
                  comp.freshness === 'fresh' ? "bg-emerald-500 shadow-emerald-500/30" : 
                  comp.freshness === 'stale' ? "bg-amber-500 shadow-amber-500/30" : "bg-rose-500 shadow-rose-500/30"
                )}></div>
              </button>
            ))}
            {battlecards.length === 0 && !loading && (
                <div className="text-sm font-medium text-slate-500 text-center p-4">No competitors tracked.</div>
            )}
          </div>
        </div>

        {/* Battlecard Document */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-slate-50/30 p-8">
          
          {activeCompetitor ? (
          <div className="max-w-4xl mx-auto w-full space-y-8">
            <div className="flex justify-between items-start pb-6 border-b border-slate-200">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className={clsx(
                         "px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border",
                         activeCompetitor.freshness === 'fresh' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                         activeCompetitor.freshness === 'stale' ? "bg-amber-100 text-amber-700 border-amber-200" :
                         "bg-rose-100 text-rose-700 border-rose-200"
                     )}>
                         {activeCompetitor.freshness === 'fresh' ? 'Live Data Validated' : activeCompetitor.freshness === 'stale' ? 'Needs Update Soon' : 'Data is Obsolete'}
                     </span>
                     <span className="text-sm font-medium text-slate-500">Last crawled: {new Date(activeCompetitor.lastScraped).toLocaleString()}</span>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">{activeCompetitor.competitor}</h2>
               </div>
               
               <div className="flex flex-col gap-2">
                   <button onClick={handleRefresh} disabled={refreshing} className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50">
                    <Search className={clsx("w-4 h-4", refreshing && "animate-spin text-[#00A4BD]")} /> {refreshing ? 'Scanning Web...' : 'Trigger Manual Recon'}
                   </button>
                   <button onClick={handlePushToDeals} className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00A4BD] border border-transparent text-white hover:bg-[#008f9c] font-bold rounded-lg transition-colors shadow-sm">
                    <Share className="w-4 h-4" /> Push to active deals
                   </button>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
               
               {/* Positioning (Left Column) */}
               <div className="space-y-6 lg:w-[45%] flex flex-col">
                 <div className="bg-white border text-left border-rose-100 rounded-xl p-6 shadow-sm shadow-rose-100/20 flex-1">
                    <h3 className="font-bold text-rose-800 mb-4 flex items-center gap-2"><Target className="w-5 h-5"/> Their Strengths</h3>
                    <ul className="space-y-2 text-sm text-slate-700 font-medium ml-4 list-disc">
                      {activeCompetitor.sections?.theirStrengths?.map((str, i) => <li key={i}>{str}</li>)}
                      {(!activeCompetitor.sections?.theirStrengths || activeCompetitor.sections?.theirStrengths.length === 0) && <li>No data.</li>}
                    </ul>
                 </div>

                 <div className="bg-white border text-left border-emerald-100 rounded-xl p-6 shadow-sm shadow-emerald-100/20 flex-1">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><Swords className="w-5 h-5"/> Our Counter-Positioning</h3>
                    <ul className="space-y-2 text-sm text-slate-700 font-medium ml-4 list-disc">
                       {activeCompetitor.sections?.ourCounterPositioning?.map((c, i) => <li key={i}>{c}</li>)}
                       {(!activeCompetitor.sections?.ourCounterPositioning || activeCompetitor.sections?.ourCounterPositioning.length === 0) && <li>No data.</li>}
                    </ul>
                 </div>

                  <div className="bg-white border text-left border-purple-100 rounded-xl p-6 shadow-sm shadow-purple-100/20">
                    <h3 className="font-bold text-purple-800 mb-4 text-lg">Weaknesses</h3>
                    <ul className="space-y-2 text-sm text-slate-700 font-medium ml-4 list-disc">
                       {activeCompetitor.sections?.theirWeaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                       {(!activeCompetitor.sections?.theirWeaknesses || activeCompetitor.sections?.theirWeaknesses.length === 0) && <li>No data.</li>}
                    </ul>
                 </div>
               </div>

               {/* Right Column: Objections & Signals */}
               <div className="space-y-6 lg:w-[55%] flex flex-col">
                  <div className="bg-white border text-left border-slate-200 rounded-xl p-6 shadow-sm flex-1">
                    <h3 className="font-bold text-slate-800 mb-4 text-lg">Objection Handlers</h3>
                    <ObjectionAccordion 
                      objections={activeCompetitor.sections?.objectionHandlers || []}
                    />
                  </div>

                  <div className="bg-white border text-left border-slate-200 rounded-xl p-6 shadow-sm">
                     <h3 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                       <Newspaper className="w-5 h-5 text-[#00A4BD]"/> Recent Market Signals
                     </h3>
                     <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                       {activeCompetitor.sections?.recentSignals && activeCompetitor.sections.recentSignals.length > 0 ? (
                           activeCompetitor.sections.recentSignals.map((sig, i) => (
                               <div key={i} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                  <p className="text-sm font-bold text-slate-800 mb-1">{sig}</p>
                                  <span className="text-xs text-slate-500">Autonomous crawl</span>
                               </div>
                           ))
                       ) : (
                           <div className="p-4 text-center text-sm font-medium text-slate-500">No recent signals detected.</div>
                       )}
                     </div>
                  </div>
                  
                  <div className="bg-[#00A4BD]/5 border border-[#00A4BD]/20 rounded-lg p-4 flex items-center justify-between">
                     <div>
                       <h4 className="font-bold text-slate-800 mb-0.5 text-sm">Active Deals vs {activeCompetitor?.competitor}</h4>
                       <span className="text-xs font-medium text-slate-600">Syncs locally</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Shield className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No Battlecard Selected</h3>
                  <p className="text-slate-500 max-w-sm">Select a tracked competitor from the left sidebar to view real-time competitive intelligence.</p>
              </div>
          )}
        </div>

      </div>
    </div>
  );
}