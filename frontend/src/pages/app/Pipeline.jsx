import React, { useState } from 'react';
import KPICard from '../../components/dashboard/KPICard';
import Modal from '../../components/ui/Modal';
import clsx from 'clsx';
import { ShieldAlert, Crosshair, Send, Copy, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { PipelineStageChart } from '../../components/charts/AgentCharts';

const PIPELINE_DATA = [];

function RiskBadge({ score, status }) {
  return (
             <div className={clsx(
              "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold w-16 justify-center",
              status === 'critical' ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20' : 
              status === 'warning' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' :
              'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
            )}>
              {score}/100
            </div>
  );
}

function RecoveryModal({ deal, isOpen, onClose }) {
  if (!deal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deal Rescue Intel" maxWidth="max-w-3xl">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">{deal.company}</h2>
          <p className="text-slate-500 font-medium">{deal.stage} • {deal.value}</p>
        </div>
        <RiskBadge score={deal.score} status={deal.status} />
      </div>

      <div className="space-y-6">
        {/* Why this deal is at risk */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-5">
          <h4 className="flex items-center gap-2 font-bold text-rose-800 mb-3">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            AI Risk Assessment
          </h4>
          <ul className="space-y-2 text-sm text-rose-700 font-medium ml-7 list-disc">
            <li>{deal.signal}</li>
            {deal.id === 1 && <li>Historical loss rate for this segment after 10 days silence is 82%.</li>}
            {deal.id === 2 && <li>Historical analysis: Champion departure drops win rate by 65%.</li>}
            {deal.id === 3 && <li>Potential evaluation of competitor "Goliath CRM" detected via reverse IP.</li>}
          </ul>
        </div>

        {/* AI Recovery Plan */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-[#00A4BD]" />
            <h4 className="font-bold text-slate-800">Recommended Recovery Play</h4>
          </div>
          
          <div className="p-5 space-y-5 bg-white">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Action Required</span>
              <p className="font-medium text-slate-800 text-sm">Send "Executive Alignment" sequence to secondary stakeholders.</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Draft Message</span>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-serif leading-relaxed">
                Hi team,<br/><br/>
                Given the recent silence since our last pricing discussion, I want to ensure we're still aligned on the ROI goals we mapped out for {deal.company}. <br/><br/>
                Are there any internal hurdles or alternative options you're exploring that I can help provide comparative data for?<br/><br/>
                Best,<br/>John
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Talking Points on Next Call</span>
              <ul className="space-y-2 text-sm text-slate-700 font-medium ml-5 list-disc">
                <li>Re-anchor on the $250k initial cost savings discussed in Discovery.</li>
                <li>Offer a 30-day opt-out clause to reduce perceived risk.</li>
                <li>Ask directly about competing priorities taking budget.</li>
              </ul>
            </div>

            {deal.id === 3 && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-4">
                 <div className="p-2 border border-amber-200 bg-amber-50 rounded-lg text-amber-600">
                    <ShieldAlert className="w-5 h-5" />
                 </div>
                 <div>
                    <h5 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">Competitor Activity Detected: Goliath CRM</h5>
                    <p className="text-xs text-slate-500 mb-2">Goliath recently launched a pricing promo matching our tier.</p>
                    <button className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                      View Battlecard <ExternalLink className="w-3 h-3" />
                    </button>
                 </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
              <button className="flex-1 min-w-[140px] flex justify-center items-center gap-2 px-4 py-2 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-lg shadow-sm transition-colors">
                <Send className="w-4 h-4" /> Send this email now
              </button>
              <button className="flex-1 min-w-[140px] flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg transition-colors">
                <Copy className="w-4 h-4" /> Copy talking points
              </button>
              <button className="flex-1 min-w-[140px] flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg transition-colors">
                <CheckCircle2 className="w-4 h-4" /> Mark as resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function Pipeline() {
  const [selectedDeal, setSelectedDeal] = useState(null);

  const totalValue = PIPELINE_DATA.reduce((acc, curr) => acc + parseInt(curr.value.replace(/[^0-9]/g, '')), 0);
  const atRiskCount = PIPELINE_DATA.filter(d => d.score > 40).length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deal Intelligence</h1>
          <p className="text-slate-500 mt-1">AI analyzing all active deals for risk vectors.</p>
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

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
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
              {PIPELINE_DATA.map((deal) => (
                <tr 
                  key={deal.id} 
                  onClick={() => setSelectedDeal(deal)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800 border-r border-slate-100">{deal.company}</td>
                  <td className="px-6 py-4 border-r border-slate-100">
                     <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-medium text-xs">{deal.stage}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono tracking-tight font-medium border-r border-slate-100">{deal.value}</td>
                  <td className="px-6 py-4 text-slate-600 border-r border-slate-100">{deal.days}</td>
                  <td className="px-6 py-4 border-r border-slate-100">
                    <RiskBadge score={deal.score} status={deal.status} />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 group-hover:text-slate-900 transition-colors max-w-sm truncate">{deal.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <RecoveryModal deal={selectedDeal} isOpen={!!selectedDeal} onClose={() => setSelectedDeal(null)} />
    </div>
  );
}