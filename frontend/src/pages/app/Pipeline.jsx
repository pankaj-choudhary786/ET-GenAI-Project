import React, { useState } from 'react';
import KPICard from '../../components/dashboard/KPICard';
import Modal from '../../components/ui/Modal';
import clsx from 'clsx';
import { ShieldAlert, Crosshair, Send, Copy, CheckCircle2, AlertTriangle, ExternalLink, Activity } from 'lucide-react';
import { PipelineStageChart } from '../../components/charts/AgentCharts';
import { useDeals } from '../../hooks/useDeals';
import client from '../../api/client';
import { useStore } from '../../store/useStore';
import AddDealModal from '../../components/modals/AddDealModal';

function RiskBadge({ score }) {
  const status = score >= 70 ? 'critical' : score >= 40 ? 'warning' : 'healthy';
  return (
    <div className={clsx(
    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold w-16 justify-center",
    status === 'critical' ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20' : 
    status === 'warning' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' :
    'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
    )}>
    {score || 0}/100
    </div>
  );
}

function RecoveryModal({ deal, isOpen, onClose }) {
  const addToast = useStore(state => state.addToast);
  const [loading, setLoading] = useState(false);
  const [draftLoad, setDraftLoad] = useState(false);
  const [loadedDeal, setLoadedDeal] = useState(deal);

  // If deal is opened but doesn't have recovery play locally initially, we can generate it
  React.useEffect(() => {
     if (isOpen && deal && !deal.recoveryPlay) {
        const fetchRescue = async () => {
            setDraftLoad(true);
            try {
                const { data } = await client.get(`/api/deals/${deal._id}/recovery`);
                setLoadedDeal({ ...deal, recoveryPlay: data.recoveryPlay });
            } catch (err) {
                addToast('error', 'Failed to generate recovery play');
            } finally {
                setDraftLoad(false);
            }
        };
        fetchRescue();
     } else {
         setLoadedDeal(deal);
     }
  }, [isOpen, deal, addToast]);

  const handleResolve = async () => {
      try {
          await client.put(`/api/deals/${deal._id}/resolve`);
          addToast('success', 'Deal risk resolved');
          onClose();
      } catch {
          addToast('error', 'Failed to resolve risk');
      }
  };

  const handleSend = async () => {
      try {
         setLoading(true);
         await client.post(`/api/deals/${deal._id}/send-recovery`, { emailBody: loadedDeal.recoveryPlay?.messageDraft });
         await client.put(`/api/deals/${deal._id}/resolve`);
         addToast('success', 'Recovery email sent!');
         onClose();
      } catch {
         addToast('error', 'Failed to send recovery');
      } finally {
         setLoading(false);
      }
  };

  if (!loadedDeal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deal Rescue Intel" maxWidth="max-w-3xl">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">{loadedDeal.company}</h2>
          <p className="text-slate-500 font-medium">{loadedDeal.stage} • ${loadedDeal.value?.toLocaleString()}</p>
        </div>
        <RiskBadge score={loadedDeal.riskScore} />
      </div>

      <div className="space-y-6">
        {/* Why this deal is at risk */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-5">
          <h4 className="flex items-center gap-2 font-bold text-rose-800 mb-3">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            AI Risk Assessment
          </h4>
          <ul className="space-y-2 text-sm text-rose-700 font-medium ml-7 list-disc">
            {loadedDeal.riskSignals && loadedDeal.riskSignals.length > 0 
                ? loadedDeal.riskSignals.map((sig, idx) => <li key={idx}>{typeof sig === 'string' ? sig : sig.signal}</li>)
                : <li>No major signals detected.</li>
            }
            {loadedDeal.notes && loadedDeal.notes.map((n, idx) => <li key={`note_${idx}`} className="text-amber-700">{n}</li>)}
          </ul>
        </div>

        {/* AI Recovery Plan */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm relative min-h-[100px]">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-[#00A4BD]" />
            <h4 className="font-bold text-slate-800">Recommended Recovery Play</h4>
          </div>
          
          {draftLoad ? (
             <div className="flex flex-col items-center justify-center p-8 space-y-4">
               <div className="w-8 h-8 rounded-full border-4 border-[#00A4BD]/30 border-t-[#00A4BD] animate-spin"></div>
               <p className="text-sm font-bold text-slate-500 animate-pulse">AI is generating a recovery strategy...</p>
             </div>
          ) : loadedDeal.recoveryPlay ? (
             <div className="p-5 space-y-5 bg-white">
                <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Action Required</span>
                <p className="font-medium text-slate-800 text-sm">
                   {loadedDeal.recoveryPlay.action} 
                   <span className="ml-3 inline-block px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase text-slate-500">{loadedDeal.recoveryPlay.urgency}</span>
                </p>
                </div>

                <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Draft Message</span>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-serif leading-relaxed whitespace-pre-wrap">
                    {loadedDeal.recoveryPlay.messageDraft}
                </div>
                </div>

                {loadedDeal.recoveryPlay.talkingPoints && loadedDeal.recoveryPlay.talkingPoints.length > 0 && (
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Talking Points on Next Call</span>
                    <ul className="space-y-2 text-sm text-slate-700 font-medium ml-5 list-disc">
                       {loadedDeal.recoveryPlay.talkingPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                    </ul>
                </div>
                )}
                
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <button onClick={handleSend} disabled={loading} className="flex-1 min-w-[140px] flex justify-center items-center gap-2 px-4 py-2 bg-[#00A4BD] hover:bg-[#008f9c] disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-colors">
                    {loading ? "Sending..." : <><Send className="w-4 h-4" /> Send this email now</>}
                </button>
                <button onClick={handleResolve} className="flex-1 min-w-[140px] flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> Mark as resolved
                </button>
                </div>
            </div>
          ) : (
             <div className="p-5 text-center text-sm text-slate-500">No recovery play available.</div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default function Pipeline() {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const { deals, loading, refetch } = useDeals();
  const [agentLoading, setAgentLoading] = useState(false);
  const addToast = useStore(state => state.addToast);

  const totalValue = deals.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const atRiskCount = deals.filter(d => d.riskScore > 40).length;

  const [showAddModal, setShowAddModal] = useState(false);

  const handleRunAgent = async () => {
    setAgentLoading(true);
    addToast('info', 'Deal Intelligence agent started — scanning pipeline for risks...');
    try {
      await client.post('/api/deals/scan');
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        await refetch();
        if (attempts >= 12) {
          clearInterval(poll);
          setAgentLoading(false);
          addToast('success', 'Pipeline scan completed');
        }
      }, 5000);
    } catch (err) {
      setAgentLoading(false);
      addToast('error', 'Failed to start scan: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddDeal = async (formData) => {
    try {
      await client.post('/api/deals', formData);
      addToast('success', `${formData.company} added to pipeline`);
      setShowAddModal(false);
      refetch();
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to add deal');
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deal Intelligence</h1>
          <p className="text-slate-500 mt-1">AI analyzing all active deals for risk vectors.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)} 
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Add Deal Manually
          </button>
          <button onClick={handleRunAgent} disabled={agentLoading} className="px-5 py-2.5 bg-[#00A4BD] hover:bg-[#008f9c] disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2">
              {agentLoading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div> : <Activity className="w-4 h-4" />}
              Scan Active Pipeline
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <KPICard label="Total Pipeline Value" value={`$${(totalValue / 1000).toFixed(0)}k`} colorClass="text-[#00A4BD]" />
          <KPICard label="Deals at Risk" value={atRiskCount} trend={-15} isPositive={true} colorClass="text-rose-600" />
          <KPICard label="Avg. Deal Cycle" value="34 days" trend={5} isPositive={false} colorClass="text-purple-600" />
        </div>
        <div className="lg:col-span-2">
          <PipelineStageChart />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative">
        {loading && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
             <div className="w-8 h-8 rounded-full border-4 border-[#00A4BD]/30 border-t-[#00A4BD] animate-spin"></div>
           </div>
        )}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#00A4BD]" />
            Deal Risk Radar
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200 border-r border-slate-100">Company</th>
                <th className="px-6 py-4 border-b border-slate-200 border-r border-slate-100">Stage</th>
                <th className="px-6 py-4 border-b border-slate-200 border-r border-slate-100">Deal Value</th>
                <th className="px-6 py-4 border-b border-slate-200 border-r border-slate-100">Days in Stage</th>
                <th className="px-6 py-4 border-b border-slate-200 border-r border-slate-100">Risk Score</th>
                <th className="px-6 py-4 border-b border-slate-200">AI Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deals.map((deal) => (
                <tr 
                  key={deal._id} 
                  onClick={() => setSelectedDeal(deal)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800 border-r border-slate-100">{deal.company}</td>
                  <td className="px-6 py-4 border-r border-slate-100">
                     <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-medium text-xs">{deal.stage}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono tracking-tight font-medium border-r border-slate-100">${deal.value?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600 border-r border-slate-100">{deal.daysInStage || 0}</td>
                  <td className="px-6 py-4 border-r border-slate-100">
                    <RiskBadge score={deal.riskScore} />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 group-hover:text-slate-900 transition-colors max-w-sm truncate whitespace-nowrap overflow-hidden text-ellipsis">
                     {deal.riskSignals && deal.riskSignals.length > 0 
                       ? (typeof deal.riskSignals[0] === 'string' ? deal.riskSignals[0] : deal.riskSignals[0].signal)
                       : (deal.notes ? deal.notes : 'All good')}
                  </td>
                </tr>
              ))}
              {deals.length === 0 && !loading && (
                  <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No deals found.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <RecoveryModal deal={selectedDeal} isOpen={!!selectedDeal} onClose={() => { setSelectedDeal(null); refetch(); }} />

      {showAddModal && (
        <AddDealModal 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddDeal} 
        />
      )}
    </div>
  );
}