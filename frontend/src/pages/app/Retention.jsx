import React, { useState, useEffect } from 'react';
import KPICard from '../../components/dashboard/KPICard';
import Drawer from '../../components/ui/Drawer';
import { ShieldAlert, Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { NetRevenueRetentionChart } from '../../components/charts/AgentCharts';
import { useRetentionAccounts } from '../../hooks/useRetentionAccounts';
import client from '../../api/client';
import { useStore } from '../../store/useStore';

function SparklineCell({ data, color }) {
  if (!data || data.length === 0) return <div className="text-slate-400 text-xs">N/A</div>;
  const max = Math.max(...data, 1);
  const min = 0; // anchor to 0 for logins
  const range = max - min || 1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 60},${20 - ((d - min) / range) * 20}`).join(' ');

  return (
    <svg className={clsx("w-16 h-6 overflow-visible", color)} viewBox="0 0 60 20">
      <polyline 
        points={points} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

function AccountDrawer({ account, isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
     if (isOpen && account) {
         client.get(`/api/retention/accounts/${account._id}`)
           .then(res => setHistory(res.data.history || []))
           .catch(() => {});
     }
  }, [isOpen, account]);

  if (!account) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Retention Intelligence" width="w-[600px]">
      <div className="space-y-8 pb-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{account.companyName}</h2>
            <p className="text-slate-500 font-medium mt-1">Contract: ${account.contractValue?.toLocaleString()}</p>
          </div>
          <div className={clsx(
            "text-center border px-4 py-2 rounded-xl",
            account.churnScore >= 70 ? "bg-rose-50 border-rose-100" : account.churnScore >= 40 ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
          )}>
             <div className={clsx("text-3xl font-black", account.churnScore >= 70 ? "text-rose-600" : account.churnScore >= 40 ? "text-amber-600" : "text-emerald-600")}>{account.churnScore}</div>
             <div className={clsx("text-[10px] uppercase font-bold tracking-wider", account.churnScore >= 70 ? "text-rose-700" : account.churnScore >= 40 ? "text-amber-700" : "text-emerald-700")}>Churn Risk</div>
          </div>
        </div>

        {/* Churn Score Breakdown */}
        {account.churnScore > 40 && (
          <div>
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Activity className="w-5 h-5 text-rose-500" /> Risk Factor Breakdown
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
               {/* Stacked Bar Approximation */}
               <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
                 <div className="bg-rose-500 h-full" style={{ width: '45%' }}></div>
                 <div className="bg-amber-500 h-full" style={{ width: '35%' }}></div>
                 <div className="bg-blue-500 h-full" style={{ width: '20%' }}></div>
               </div>
               {/* Legend */}
               <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                     <span className="text-slate-700 font-bold">Logins ({account.loginLast7d} recent)</span>
                   </div>
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                     <span className="text-slate-700 font-bold">{account.supportTickets30d} Support Tickets</span>
                   </div>
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                     <span className="text-slate-700 font-bold">Adoption: {account.featureAdoptionPct}%</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Intervention Status */}
        {account.interventionStatus && (
          <div>
            <h4 className="font-bold text-slate-800 mb-3 tracking-tight">AI Intervention Playbook</h4>
            <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4">
               <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2 uppercase">
                 <CheckCircle2 className="w-5 h-5" /> Type: {account.interventionStatus} Applied
               </div>
               <p className="text-sm text-emerald-800/80 mb-4 font-medium">
                 The AI agent dispatched an automated action targeting this account to mitigate risk.
               </p>
            </div>
          </div>
        )}
        
      </div>
    </Drawer>
  );
}

export default function Retention() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { accounts, loading, refetch } = useRetentionAccounts();
  const [agentLoading, setAgentLoading] = useState(false);
  const addToast = useStore(state => state.addToast);

  const handleScan = async () => {
      try {
          setAgentLoading(true);
          await client.post('/api/retention/scan');
          addToast('success', 'Retention scan started.');
          setTimeout(refetch, 3000);
      } catch {
          addToast('error', 'Failed to scan');
      } finally {
          setAgentLoading(false);
      }
  };

  const healthyStats = accounts.filter(a => a.churnScore < 40).length;
  const riskStats = accounts.filter(a => a.churnScore >= 40).length;

  return (
    <div className="h-full flex flex-col max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Retention</h1>
          <p className="text-slate-500 mt-1">Predicting and preventing churn before it happens.</p>
        </div>
        <button onClick={handleScan} disabled={agentLoading} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2">
            {agentLoading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div> : <Activity className="w-4 h-4" />}
            Scan Account Telemetry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <NetRevenueRetentionChart />
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-6">
          <KPICard label="Healthy Accounts" value={healthyStats} trend={0} isPositive={true} colorClass="text-emerald-600" />
          <KPICard label="At-Risk Accounts" value={riskStats} trend={0} isPositive={true} colorClass="text-rose-600" />
          
          <div className="bg-white border text-left border-slate-200 rounded-xl p-6 shadow-sm flex-1 flex flex-col justify-center">
             <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Health Distribution</h3>
             <div className="h-10 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner mb-2">
               <div className="bg-emerald-500 h-full flex items-center pl-4 text-white font-bold text-xs" style={{ width: `${(healthyStats/Math.max(accounts.length, 1)) * 100}%` }}></div>
               <div className="bg-amber-400 h-full flex items-center justify-center text-amber-900 font-bold text-xs" style={{ width: `${(accounts.filter(a => a.churnScore >= 40 && a.churnScore < 70).length/Math.max(accounts.length, 1)) * 100}%` }}></div>
               <div className="bg-rose-500 h-full flex items-center pr-3 justify-end text-white font-bold text-xs" style={{ width: `${(accounts.filter(a => a.churnScore >= 70).length/Math.max(accounts.length, 1)) * 100}%` }}></div>
             </div>
             <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
               <span className="text-emerald-600">Secure</span>
               <span className="text-amber-600">At Risk</span>
               <span className="text-rose-600">Danger</span>
             </div>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 relative">
        {loading && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
             <div className="w-8 h-8 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
           </div>
        )}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
            Accounts requiring attention
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200">Company</th>
                <th className="px-6 py-4 border-b border-slate-200">Contract Value</th>
                <th className="px-6 py-4 border-b border-slate-200">Product Adoption</th>
                <th className="px-6 py-4 border-b border-slate-200">Support Load</th>
                <th className="px-6 py-4 border-b border-slate-200">Churn Score</th>
                <th className="px-6 py-4 border-b border-slate-200">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((acc) => (
                <tr 
                  key={acc._id} 
                  onClick={() => setSelectedAccount(acc)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">{acc.companyName}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">${acc.contractValue?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                       <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className={clsx("h-full", acc.featureAdoptionPct > 50 ? "bg-emerald-500" : "bg-amber-400")} style={{width: `${acc.featureAdoptionPct}%`}}></div>
                       </div>
                       <span className="text-xs font-bold text-slate-500">{acc.featureAdoptionPct}%</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{acc.supportTickets30d} Tickets / 30d</td>
                  <td className="px-6 py-4">
                     <div className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold w-12 justify-center",
                      acc.churnScore >= 70 ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20' : 
                      acc.churnScore >= 40 ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' :
                      'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                    )}>
                      {acc.churnScore}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     {acc.interventionStatus ? (
                         <span className="text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-[#00A4BD]/10 text-[#00A4BD]">{acc.interventionStatus} Triggered</span>
                     ) : (
                         <span className="text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-slate-100 text-slate-500">None</span>
                     )}
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && !loading && (
                  <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No account data.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AccountDrawer account={selectedAccount} isOpen={!!selectedAccount} onClose={() => setSelectedAccount(null)} />
    </div>
  );
}
