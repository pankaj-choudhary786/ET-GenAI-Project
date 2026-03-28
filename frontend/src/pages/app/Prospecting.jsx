import React, { useState } from 'react';
import Drawer from '../../components/ui/Drawer';
import { Settings2, Building2, MapPin, DollarSign, Users, Mail, Send, Edit3, X, Check, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { LeadSourcesChart } from '../../components/charts/AgentCharts';
import { useProspects } from '../../hooks/useProspects';
import client from '../../api/client';
import { useStore } from '../../store/useStore';

function ICPConfigurator() {
  const [isOpen, setIsOpen] = useState(false);

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
             <p className="text-xs text-slate-500 font-medium">B2B SaaS • 100-500 EMP • Series B+</p>
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
             <select className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00A4BD]">
               <option>B2B SaaS</option>
               <option>Fintech</option>
               <option>Healthcare IT</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><Users className="w-3 h-3"/> Company Size</label>
             <select className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00A4BD]">
               <option>100 - 500 EMP</option>
               <option>500 - 1000 EMP</option>
               <option>1000+ EMP</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><DollarSign className="w-3 h-3"/> Funding Stage</label>
             <select className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00A4BD]">
               <option>Series B or Later</option>
               <option>Seed / Series A</option>
               <option>Publicly Traded</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2"><MapPin className="w-3 h-3"/> Geography</label>
             <select className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#00A4BD]">
               <option>North America</option>
               <option>EMEA</option>
               <option>Global</option>
             </select>
           </div>
           <div className="md:col-span-4 flex justify-end pt-4 border-t border-slate-100">
             <button className="px-6 py-2 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-lg transition-colors shadow-sm">
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
      className="bg-white border text-left border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#00A4BD]/50 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center">
             {initial}
           </div>
           <div className="overflow-hidden">
             <h4 className="font-bold text-slate-900 group-hover:text-[#00A4BD] transition-colors truncate">{prospect.company}</h4>
             <p className="text-xs text-slate-500 font-medium truncate">{prospect.contactName} • {prospect.contactTitle}</p>
           </div>
        </div>
        <div className={clsx(
          "px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0",
          prospect.icpScore >= 90 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
        )}>
          {prospect.icpScore}
        </div>
      </div>
      <div className="text-xs font-medium text-slate-500 bg-slate-50 p-2 rounded-lg flex items-start gap-1.5">
        <span className="text-emerald-500 mt-0.5">•</span>
        <span className="line-clamp-2 leading-relaxed">{prospect.topSignal || prospect.fitReason}</span>
      </div>
    </div>
  );
}

function ProspectDrawer({ prospect, isOpen, onClose }) {
  if (!prospect) return null;
  const initial = String(prospect.company || prospect.contactName || 'U').charAt(0).toUpperCase();
  const addToast = useStore(state => state.addToast);

  const handleApprove = async (seqIndex) => {
    try {
      await client.post(`/api/prospects/${prospect._id}/approve-email`, { sequenceIndex: seqIndex });
      addToast('success', 'Email approved and sent.');
      onClose(); // In a real app we'd reload the sequence or prospect, but closing is an easy UX here.
    } catch {
      addToast('error', 'Failed to approve email.');
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

        {/* AI Reasoning */}
        <div>
          <h4 className="font-bold text-slate-800 mb-3 tracking-tight">Why the AI targeted them</h4>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed font-medium">
             <p className="mb-2"><strong>Match Justification:</strong> {prospect.fitReason}</p>
             <p className="text-[#00A4BD]"><strong>Trigger Signal:</strong> {prospect.topSignal}</p>
          </div>
        </div>

        {/* Contact Target */}
        <div>
          <h4 className="font-bold text-slate-800 mb-3 tracking-tight">Key Contact</h4>
          <div className="flex items-center justify-between border border-slate-200 rounded-xl p-4">
             <div>
               <p className="font-bold text-slate-900">{prospect.contactName}</p>
               <p className="text-sm font-medium text-slate-500">{prospect.contactTitle}</p>
               <p className="text-xs text-slate-400">{prospect.contactEmail}</p>
             </div>
             <button className="flex items-center gap-2 text-sm font-bold text-[#FF7A59] hover:text-[#ff6a45]">
               View LinkedIn <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Sequence Preview */}
        {prospect.outreachSequences && prospect.outreachSequences.length > 0 && (
            <div>
            <div className="flex justify-between items-end mb-3">
                <h4 className="font-bold text-slate-800 tracking-tight">Generated Email Sequence</h4>
                <span className="text-xs font-bold text-[#00A4BD] bg-[#00A4BD]/10 px-2 py-1 rounded">{prospect.outreachSequences.length} Steps Ready</span>
            </div>
            
            <div className="space-y-4">
                {prospect.outreachSequences.map((seq, i) => {
                  const isSent = seq.status === 'sent' || seq.sent;
                  const isApproved = seq.status === 'approved' || seq.approved;
                  const isDraft = seq.status === 'draft' || (!isSent && !isApproved);
                  const seqNum = seq.sequence ?? seq.index ?? i;
                  return (
                    <div key={seqNum} className={clsx("border rounded-xl overflow-hidden", isSent ? "border-emerald-200 shadow-sm" : "border-slate-200 shadow-sm")}>
                        <div className={clsx("px-4 py-2.5 border-b flex justify-between items-center", isSent ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-200")}>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> Step {i + 1} {isSent && <span className="text-emerald-500 ml-2">(Sent)</span>} 
                            </div>
                        </div>
                        <div className="p-4 bg-white space-y-3">
                        <p className="text-sm font-bold text-slate-800">Subject: {seq.subject}</p>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed font-serif">
                            {seq.body}
                        </p>
                        {isDraft && (
                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
                                <button className="p-2 text-rose-500 hover:bg-rose-50 rounded transition-colors"><X className="w-4 h-4"/></button>
                                <button className="flex items-center gap-2 px-4 py-1.5 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold text-sm rounded transition-colors shadow-sm" onClick={() => handleApprove(seqNum)}>
                                <Check className="w-4 h-4" /> Approve Step
                                </button>
                            </div>
                        )}
                        </div>
                    </div>
                  );
                })}
            </div>
            </div>
        )}

      </div>
    </Drawer>
  );
}

export default function Prospecting() {
  const [selectedProspect, setSelectedProspect] = useState(null);
  const { prospects, loading, refetch } = useProspects();
  const addToast = useStore(state => state.addToast);
  const [agentLoading, setAgentLoading] = useState(false);

  const columns = [
    { id: 'discovered', label: 'Discovered', color: 'bg-purple-100 text-purple-700' },
    { id: 'scored', label: 'Scored & Verified', color: 'bg-blue-100 text-blue-700' },
    { id: 'emailed', label: 'Sequence Active', color: 'bg-amber-100 text-amber-700' },
    { id: 'replied', label: 'Replied', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'qualified', label: 'Qualified', color: 'bg-teal-100 text-teal-700' }
  ];

  const categorizedProspects = {
    discovered: prospects.filter(p => p.status === 'discovered'),
    scored: prospects.filter(p => p.status === 'scored'),
    emailed: prospects.filter(p => p.status === 'emailed'),
    replied: prospects.filter(p => p.status === 'replied'),
    qualified: prospects.filter(p => p.status === 'qualified')
  };

  const handleRunAgent = async () => {
    try {
        setAgentLoading(true);
        await client.post('/api/prospects/run-agent');
        addToast('success', 'Prospecting Agent is running. Data will appear shortly.');
        setTimeout(refetch, 3000); // Simple hack to wait to fetch
    } catch {
        addToast('error', 'Failed to start agent');
    } finally {
        setAgentLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Prospecting Engine</h1>
          <p className="text-slate-500 mt-1">Autonomous outbound pipeline generation based on your ICP.</p>
        </div>
        <button onClick={handleRunAgent} disabled={agentLoading} className="px-5 py-2.5 bg-[#FF7A59] hover:bg-[#ff6a45] disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2">
          {agentLoading ? <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div> : <Send className="w-4 h-4" />}
          Run Prospecting Agent
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 flex flex-col">
          <ICPConfigurator />
          <div className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-sm flex items-center justify-between mt-6 lg:mt-0">
             <div>
                <h3 className="font-black text-xl mb-1">Scale outbound by 10x</h3>
                <p className="font-medium text-white/80">Agents are generating custom sequences for {prospects.length} fresh targets.</p>
             </div>
             <div className="text-4xl font-black">{prospects.length}</div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <LeadSourcesChart />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-[500px] grid grid-cols-1 md:grid-cols-5 gap-6 pb-6 overflow-x-auto relative">
        {loading && (
           <div className="absolute inset-x-0 bottom-0 top-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
             <div className="w-8 h-8 rounded-full border-4 border-[#FF7A59]/30 border-t-[#FF7A59] animate-spin"></div>
           </div>
        )}
        {columns.map(col => (
          <div key={col.id} className="flex flex-col h-full bg-slate-50/50 rounded-xl border border-slate-200/60 p-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-slate-800 tracking-tight">{col.label}</h3>
               <span className={clsx("px-2 py-0.5 rounded-full text-xs font-bold", col.color)}>{categorizedProspects[col.id].length}</span>
            </div>
            <div className="flex-1 space-y-4">
               {categorizedProspects[col.id].map(prospect => (
                 <ProspectCard 
                   key={prospect._id} 
                   prospect={prospect} 
                   onClick={() => setSelectedProspect(prospect)} 
                 />
               ))}
               {categorizedProspects[col.id].length === 0 && (
                   <div className="text-center p-4 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm font-medium">
                       Empty
                   </div>
               )}
            </div>
          </div>
        ))}
      </div>

      <ProspectDrawer 
        prospect={selectedProspect} 
        isOpen={!!selectedProspect} 
        onClose={() => { setSelectedProspect(null); refetch(); }} 
      />
    </div>
  );
}