import React, { useState } from 'react';
import Drawer from '../../components/ui/Drawer';
import { Settings2, Building2, MapPin, DollarSign, Users, Mail, Send, Edit3, X, Check, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { LeadSourcesChart } from '../../components/charts/AgentCharts';
import { useProspects } from '../../hooks/useProspects';
import client from '../../api/client';
import { useStore } from '../../store/useStore';
import AddProspectModal from '../../components/modals/AddProspectModal';

function ICPConfigurator() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useStore();
  const addToast = useStore(state => state.addToast);
  
  const [prefs, setPrefs] = useState({
    industry: user?.agentPreferences?.prospecting?.industry || 'B2B SaaS',
    companySize: user?.agentPreferences?.prospecting?.companySize || '100 - 500 EMP',
    fundingStage: user?.agentPreferences?.prospecting?.fundingStage || 'Series B or Later',
    location: user?.agentPreferences?.prospecting?.location || 'North America'
  });

  const handleSave = async () => {
    try {
      const { data } = await client.put('/api/auth/profile', {
        agentPreferences: {
          ...user.agentPreferences,
          prospecting: {
            ...user.agentPreferences?.prospecting,
            ...prefs
          }
        }
      });
      setUser(data.user);
      addToast('success', 'ICP Target Specs updated successfully.');
      setIsOpen(false);
    } catch (err) {
      addToast('error', 'Failed to save preferences.');
    }
  };

  return (
    <div className="bg-white border text-left border-slate-200 rounded-xl shadow-sm mb-6 lg:mb-0 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100/50 transition-colors border-b border-transparent data-[open=true]:border-slate-200"
        data-open={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00A4BD]/10 text-[#00A4BD] flex items-center justify-center">
             <Settings2 className="w-4 h-4" />
          </div>
          <div className="text-left">
             <h3 className="font-bold text-slate-800 tracking-tight">Ideal Customer Profile (ICP)</h3>
             <p className="text-xs text-slate-500 font-medium">{prefs.industry} • {prefs.companySize} • {prefs.fundingStage}</p>
          </div>
        </div>
        <div className="text-sm font-bold text-[#00A4BD]">
          {isOpen ? 'Close Configurator' : 'Edit Profile'}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-white animate-in slide-in-from-top-4 font-medium">
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><Building2 className="w-3 h-3"/> Industry</label>
             <select 
               value={prefs.industry}
               onChange={(e) => setPrefs({...prefs, industry: e.target.value})}
               className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00A4BD]"
             >
               <option>B2B SaaS</option>
               <option>Fintech</option>
               <option>Healthcare IT</option>
               <option>Cybersecurity</option>
               <option>AI Infrastructure</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><Users className="w-3 h-3"/> Company Size</label>
             <select 
                value={prefs.companySize}
                onChange={(e) => setPrefs({...prefs, companySize: e.target.value})}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00A4BD]"
             >
               <option>10 - 50 EMP</option>
               <option>100 - 500 EMP</option>
               <option>500 - 1000 EMP</option>
               <option>1000+ EMP</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><DollarSign className="w-3 h-3"/> Funding Stage</label>
             <select 
                value={prefs.fundingStage}
                onChange={(e) => setPrefs({...prefs, fundingStage: e.target.value})}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00A4BD]"
             >
               <option>Seed / Series A</option>
               <option>Series B or Later</option>
               <option>Publicly Traded</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><MapPin className="w-3 h-3"/> Geography</label>
             <select 
                value={prefs.location}
                onChange={(e) => setPrefs({...prefs, location: e.target.value})}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00A4BD]"
             >
               <option>North America</option>
               <option>EMEA</option>
               <option>APAC</option>
               <option>Global</option>
             </select>
           </div>
           <div className="md:col-span-4 flex justify-end pt-4 border-t border-slate-100">
             <button onClick={handleSave} className="px-6 py-2 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-lg transition-colors shadow-sm">
               Save Target Specs
             </button>
           </div>
        </div>
      )}
    </div>
  );
}

function ProspectCard({ prospect, onClick }) {
  const initial = String(prospect.company || prospect.contactName || 'U').charAt(0).toUpperCase();

  return (
    <div 
      onClick={onClick}
      className="bg-white border text-left border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-[#00A4BD]/50 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
           <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
             {initial}
           </div>
           <div className="min-w-0">
             <h4 className="font-bold text-slate-900 group-hover:text-[#00A4BD] transition-colors text-sm truncate">{prospect.company}</h4>
             <p className="text-[11px] text-slate-400 font-medium truncate">{prospect.contactName || 'Unknown Contact'}</p>
           </div>
        </div>
        <div className={clsx(
          "px-1.5 py-0.5 rounded text-[10px] font-black flex-shrink-0 ml-2",
          prospect.icpScore === null ? "bg-slate-100 text-slate-400 animate-pulse" : 
          prospect.icpScore >= 80 ? "bg-emerald-100 text-emerald-700" : 
          prospect.icpScore >= 60 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
        )}>
          {prospect.icpScore === null ? '···' : `${prospect.icpScore}`}
        </div>
      </div>
      <div className="text-[11px] text-slate-500 bg-slate-50 px-2 py-1.5 rounded-lg flex items-start gap-1.5">
        <span className={clsx("flex-shrink-0 mt-0.5", prospect.icpScore === null ? "text-slate-300 animate-bounce" : "text-emerald-500")}>•</span>
        <span className="line-clamp-1 leading-relaxed italic">
           {prospect.icpScore === null ? "Analysing real-time intelligence..." : (prospect.topSignal || prospect.fitReason || 'ICP verified')}
        </span>
      </div>
    </div>
  );
}

function ProspectDrawer({ prospect, isOpen, onClose }) {
  if (!prospect) return null;
  const initial = String(prospect.company || prospect.contactName || 'U').charAt(0).toUpperCase();
  const addToast = useStore(state => state.addToast);
  // We'll pass the refresh function from the parent
  const { onActionSuccess } = prospect._internal || {};

  const handleApprove = async (seqIndex) => {
    try {
      // Optimistic Move
      if (onActionSuccess) onActionSuccess(prospect._id, 'emailed');
      await client.post(`/api/prospects/${prospect._id}/approve-email`, { sequenceIndex: seqIndex });
      addToast('success', 'Email approved and sent.');
      onClose();
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to approve email.');
    }
  };

  const handleQualify = async () => {
    try {
      // Optimistic Move
      if (onActionSuccess) onActionSuccess(prospect._id, 'qualified');
      await client.post(`/api/prospects/${prospect._id}/qualify`);
      addToast('success', `${prospect.company} qualified as a new Deal!`);
      onClose();
    } catch (err) {
      addToast('error', 'Failed to qualify prospect.');
    }
  };

  const handleDrop = async () => {
    if (!window.confirm(`Remove ${prospect.company} from prospects?`)) return;
    try {
      await client.delete(`/api/prospects/${prospect._id}`);
      addToast('success', 'Prospect removed');
      onClose();
    } catch (err) {
      addToast('error', 'Failed to remove prospect');
    }
  };

  const handleGenerateSequence = async () => {
    try {
        addToast('info', 'AI is writing your outreach sequence...');
        await client.post(`/api/prospects/${prospect._id}/generate-sequence`);
        addToast('success', '3-step sequence generated!');
        onClose(); // Close and let parent refresh
    } catch (err) {
        addToast('error', 'Failed to generate sequence');
    }
  };

  const handleRetryResearch = async () => {
    try {
      addToast('info', 'AI is conducting fresh research on this target...');
      await client.post(`/api/prospects/${prospect._id}/research`);
      addToast('success', 'Deep research complete! Match score updated.');
      onClose();
    } catch (err) {
      addToast('error', 'Research failed. AI model might be busy.');
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Prospect Intelligence`} width="w-[600px]">
      <div className="space-y-8 pb-10">
        
        {/* Header Block */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00A4BD] to-blue-600 text-white font-bold text-3xl flex items-center justify-center shadow-lg">
              {initial}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 max-w-[300px] truncate">{prospect.company}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mt-1">
                <Building2 className="w-4 h-4" /> B2B SaaS
              </div>
            </div>
          </div>
          <div className="text-center bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl flex-shrink-0">
             <div className="text-2xl font-black text-emerald-600">{prospect.icpScore}</div>
             <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Fit Score</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex gap-3">
          {prospect.icpScore === null ? (
            <button 
              onClick={handleRetryResearch}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-black rounded-xl transition-all shadow-md animate-pulse active:scale-95"
            >
              <Users className="w-5 h-5" />
              RE-RUN AI RESEARCH
            </button>
          ) : (
            <button 
              onClick={handleQualify}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all shadow-md active:scale-95"
            >
              <Check className="w-5 h-5" />
              QUALIFY & CREATE DEAL
            </button>
          )}
          <button 
            onClick={handleDrop}
            className="px-6 py-3 border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Reasoning */}
        <div>
          <h4 className="font-bold text-slate-800 mb-3 tracking-tight">AI Scouting Report</h4>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed font-medium">
             <p className="mb-2"><strong>Targeting Basis:</strong> {prospect.fitReason}</p>
             <p className="text-[#00A4BD]"><strong>Core Signal:</strong> {prospect.topSignal}</p>
          </div>
        </div>

        {/* Contact Target */}
        <div>
          <h4 className="font-bold text-slate-800 mb-3 tracking-tight">Key Decision Maker</h4>
          <div className="flex items-center justify-between border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
             <div>
               <p className="font-bold text-slate-900">{prospect.contactName}</p>
               <p className="text-sm font-medium text-slate-500">{prospect.contactTitle}</p>
               <p className="text-xs text-slate-400 mt-1">{prospect.contactEmail}</p>
             </div>
             <a 
               href={prospect.linkedinUrl || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(prospect.company || '')}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-lg hover:bg-black transition-colors"
             >
               LINKEDIN <ChevronRight className="w-3 h-3" />
             </a>
          </div>
        </div>

        {/* Sequence Preview */}
        {prospect.outreachSequences && prospect.outreachSequences.length > 0 ? (
            <div>
            <div className="flex justify-between items-end mb-3">
                <h4 className="font-bold text-slate-800 tracking-tight">Persona-Driven Sequence</h4>
                <span className="text-xs font-bold text-[#00A4BD] bg-[#00A4BD]/10 px-2 py-1 rounded">{prospect.outreachSequences.length} Steps Generated</span>
            </div>
            
            <div className="space-y-4">
                {prospect.outreachSequences.map((seq, i) => {
                  const isSent = seq.status === 'sent' || seq.sent;
                  const isDraft = seq.status === 'draft' || !isSent;
                  const seqNum = seq.sequence ?? seq.index ?? i;
                  return (
                    <div key={seqNum} className={clsx("border rounded-xl overflow-hidden", isSent ? "border-emerald-200 shadow-sm" : "border-slate-200 shadow-sm")}>
                        <div className={clsx("px-4 py-2.5 border-b flex justify-between items-center", isSent ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-200")}>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> Step {i + 1} {isSent && <span className="text-emerald-500 ml-2 font-black">(DELIVERED)</span>} 
                            </div>
                        </div>
                        <div className="p-4 bg-white space-y-3">
                        <p className="text-sm font-bold text-slate-800">Subject: {seq.subject}</p>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap font-serif italic">
                            "{seq.body}"
                        </p>
                        {isDraft && (
                            <div className="flex justify-end pt-3 border-t border-slate-50">
                                <button 
                                    className="flex items-center gap-2 px-6 py-2 bg-[#FF7A59] hover:bg-[#ff6a45] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm rounded-lg transition-all shadow-md active:scale-95" 
                                    onClick={() => handleApprove(seqNum)}
                                    disabled={prospect.icpScore === null}
                                >
                                {prospect.icpScore === null ? '...' : <Send className="w-4 h-4" />}
                                {prospect.icpScore === null ? 'AWAITING INTEL' : 'APPROVE & SEND NOW'}
                                </button>
                            </div>
                        )}
                        </div>
                    </div>
                  );
                })}
            </div>
            </div>
        ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Mail className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">No Outreach Generated</h4>
                    <p className="text-xs text-slate-500 font-medium max-w-[220px] mx-auto mt-1">The agent found the lead but hasn't prepared the emails yet.</p>
                 </div>
                 <button 
                    onClick={handleGenerateSequence}
                    disabled={prospect.icpScore === null}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#00A4BD] hover:bg-[#008f9c] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                 >
                    ⚡ GENERATE AI SEQUENCE
                 </button>
            </div>
        )}

      </div>
    </Drawer>
  );
}

export default function Prospecting() {
  const [selectedId, setSelectedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { prospects, setProspects, loading, refetch } = useProspects();
  const addToast = useStore(state => state.addToast);
  const [agentLoading, setAgentLoading] = useState(false);

  // Optimistic Move helper
  const moveProspectOptimistically = (id, newStatus) => {
    setProspects(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
  };

  const columns = [
    { id: 'discovered', label: 'Discovered', color: 'bg-purple-100 text-purple-700' },
    { id: 'scored', label: 'Scored & Verified', color: 'bg-blue-100 text-blue-700' },
    { id: 'emailed', label: 'Sequence Active', color: 'bg-orange-100 text-orange-700' },
    { id: 'replied', label: 'Engaged', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'qualified', label: 'Qualified (Deals)', color: 'bg-teal-100 text-teal-700' }
  ];

  const categorizedProspects = {
    discovered: (prospects || []).filter(p => p.status === 'discovered'),
    scored: (prospects || []).filter(p => p.status === 'scored'),
    emailed: (prospects || []).filter(p => p.status === 'emailed'),
    replied: (prospects || []).filter(p => p.status === 'replied'),
    qualified: (prospects || []).filter(p => p.status === 'qualified')
  };

  const handleRunAgent = async () => {
    setAgentLoading(true);
    addToast('info', 'Searching live for elite targets...');
    try {
      await client.post('/api/prospects/run-agent');
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        await refetch();
        if (attempts >= 45) { // Increased to 90 seconds total
          clearInterval(poll);
          setAgentLoading(false);
          try {
            const { data } = await client.get('/api/auth/profile');
            const summary = data.user.lastAgentSummary || 'Autonomous discovery cycle complete.';
            addToast('success', summary);
          } catch {
            addToast('success', 'Autonomous discovery cycle complete.');
          }
        }
      }, 2000);
    } catch (err) {
      setAgentLoading(false);
      addToast('error', 'Agent failed to start.');
    }
  };

  const handleAddProspect = async (formData) => {
    try {
      await client.post('/api/prospects/manual', formData);
      addToast('success', `${formData.company} added`);
      setShowAddModal(false);
      refetch();
    } catch (err) {
      addToast('error', 'Failed to add prospect');
    }
  };

  return (
    <div className="h-full flex flex-col max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">PROSPECTING ENGINE</h1>
          <p className="text-slate-500 font-medium">Autonomous outbound pipeline fueling your growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)} 
            className="px-6 py-3 bg-white border border-slate-200 text-slate-900 font-black rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            MANUAL ADD
          </button>
          <button onClick={handleRunAgent} disabled={agentLoading} className="px-6 py-3 bg-[#FF7A59] hover:bg-[#ff6a45] disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95">
            {agentLoading ? <div className="w-4 h-4 border-4 border-white rounded-full border-t-transparent animate-spin"></div> : <Send className="w-5 h-5" />}
            RUN AUTONOMOUS AGENT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <ICPConfigurator />
        </div>
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
           <div>
              <h3 className="font-black text-lg leading-tight mb-2">PIPELINE VOLUME</h3>
              <p className="text-white/60 text-sm font-medium">Active prospects discovered and managed by agents.</p>
           </div>
            <div className={clsx(
              "text-6xl font-black transition-all duration-500",
              agentLoading ? "text-[#FF7A59] animate-pulse scale-110" : "text-[#FF7A59]",
              prospects.length > 0 && !agentLoading && "animate-bounce"
            )}>
              {prospects.length}
            </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 flex overflow-x-auto gap-6 pb-12 snap-x scrollbar-hide">
        {columns.map(col => {
          const columnProspects = categorizedProspects[col.id];
          return (
            <div key={col.id} className="flex flex-col bg-slate-50/50 rounded-2xl border border-slate-200/60 p-4 min-w-[300px] max-w-[300px] shadow-sm" style={{height: 'calc(100vh - 340px)', minHeight: '420px'}}>
              <div className="flex items-center justify-between mb-4 px-1">
                 <h3 className="font-black text-slate-700 uppercase tracking-tighter text-xs flex items-center gap-2">
                   {col.label} 
                 </h3>
                 <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm", col.color)}>{columnProspects.length}</span>
              </div>
              <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 custom-scrollbar pb-4">
                 {columnProspects.map(prospect => (
                   <ProspectCard 
                      key={prospect._id} 
                      prospect={prospect} 
                      onClick={() => setSelectedId(prospect._id)} 
                   />
                 ))}
                 {columnProspects.length === 0 && (
                     <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-300 text-[10px] font-black uppercase tracking-widest flex flex-col items-center gap-3 bg-white/50">
                         {agentLoading && col.id === 'discovered' ? (
                           <>
                             <div className="w-7 h-7 border-4 border-[#00A4BD]/20 border-t-[#00A4BD] rounded-full animate-spin"></div>
                             <span className="animate-pulse text-[#00A4BD] text-[10px]">Scouting...</span>
                           </>
                         ) : (
                           <>
                            <div className="opacity-30 text-[9px]">No prospects yet</div>
                            {col.id === 'discovered' && <p className="normal-case text-[9px] font-bold text-slate-400 max-w-[120px]">Run the agent to fill this column</p>}
                           </>
                         )}
                     </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedId && (
        <ProspectDrawer 
          prospect={prospects.find(p => p._id === selectedId)} 
          isOpen={!!selectedId} 
          onClose={() => { setSelectedId(null); refetch(); }} 
          onActionSuccess={moveProspectOptimistically}
        />
      )}

      {showAddModal && (
        <AddProspectModal 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddProspect} 
        />
      )}
    </div>
  );
}