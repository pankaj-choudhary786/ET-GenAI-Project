import React, { useState } from 'react';
import KPICard from '../../components/dashboard/KPICard';
import Drawer from '../../components/ui/Drawer';
import { ShieldAlert, Activity, AlertTriangle, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { NetRevenueRetentionChart } from '../../components/charts/AgentCharts';

const RETENTION_DATA = [];

function SparklineCell({ data, color }) {
  const max = Math.max(...data, 1);
  const min = 0; // anchor to 0 for logins
  const range = max - min;
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
  if (!account) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Retention Intelligence" width="w-[600px]">
      <div className="space-y-8 pb-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{account.company}</h2>
            <p className="text-slate-500 font-medium mt-1">{account.plan} • {account.value}</p>
          </div>
          <div className={clsx(
            "text-center border px-4 py-2 rounded-xl",
            account.score >= 70 ? "bg-rose-50 border-rose-100" : account.score >= 40 ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
          )}>
             <div className={clsx("text-3xl font-black", account.score >= 70 ? "text-rose-600" : account.score >= 40 ? "text-amber-600" : "text-emerald-600")}>{account.score}</div>
             <div className={clsx("text-[10px] uppercase font-bold tracking-wider", account.score >= 70 ? "text-rose-700" : account.score >= 40 ? "text-amber-700" : "text-emerald-700")}>Churn Risk</div>
          </div>
        </div>

        {/* Churn Score Breakdown */}
        {account.score > 40 && (
          <div>
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Activity className="w-5 h-5 text-rose-500" /> Risk Factor Breakdown
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
               {/* Stacked Bar */}
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
                     <span className="text-slate-700 font-bold">45%</span>
                   </div>
                   <p className="text-slate-500 text-xs">Login frequency drop (14 days)</p>
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                     <span className="text-slate-700 font-bold">35%</span>
                   </div>
                   <p className="text-slate-500 text-xs">P1 Support Ticket Spike</p>
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                     <span className="text-slate-700 font-bold">20%</span>
                   </div>
                   <p className="text-slate-500 text-xs">Low feature adoption</p>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Intervention Status */}
        {account.status === 'Triggered' && (
          <div>
            <h4 className="font-bold text-slate-800 mb-3 tracking-tight">AI Intervention Playbook</h4>
            <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4">
               <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                 <CheckCircle2 className="w-5 h-5" /> Executive Escalation Triggered
               </div>
               <p className="text-sm text-emerald-800/80 mb-4 font-medium">
                 The AI drafted an email from your CEO to their Executive Sponsor offering a free architecture review to unblock their deployment.
               </p>
               <button className="flex items-center justify-center gap-2 w-full py-2 bg-white text-emerald-700 border border-emerald-200 font-bold rounded-lg shadow-sm hover:bg-emerald-100 transition-colors">
                 View Sent Email in Outbox <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        )}
        
      </div>
    </Drawer>
  );
}

export default function Retention() {
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <div className="h-full flex flex-col max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Retention</h1>
          <p className="text-slate-500 mt-1">Predicting and preventing churn before it happens.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <NetRevenueRetentionChart />
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-6">
          <KPICard label="Healthy Accounts" value="-" trend={0} isPositive={true} colorClass="text-emerald-600" />
          <KPICard label="At-Risk Accounts" value="-" trend={0} isPositive={true} colorClass="text-rose-600" />
          
          <div className="bg-white border text-left border-slate-200 rounded-xl p-6 shadow-sm flex-1 flex flex-col justify-center">
             <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Health Distribution</h3>
             <div className="h-10 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner mb-2">
               <div className="bg-emerald-500 h-full flex items-center pl-4 text-white font-bold text-xs" style={{ width: '85%' }}>85%</div>
               <div className="bg-amber-400 h-full flex items-center justify-center text-amber-900 font-bold text-xs" style={{ width: '10%' }}></div>
               <div className="bg-rose-500 h-full flex items-center pr-3 justify-end text-white font-bold text-xs" style={{ width: '5%' }}></div>
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
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#00A4BD]" />
            Accounts requiring attention
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200">Company</th>
                <th className="px-6 py-4 border-b border-slate-200">Value</th>
                <th className="px-6 py-4 border-b border-slate-200">30d Login Trend</th>
                <th className="px-6 py-4 border-b border-slate-200">Adoption</th>
                <th className="px-6 py-4 border-b border-slate-200">Churn Score</th>
                <th className="px-6 py-4 border-b border-slate-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RETENTION_DATA.map((acc) => (
                <tr 
                  key={acc.id} 
                  onClick={() => setSelectedAccount(acc)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">{acc.company}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{acc.value}</td>
                  <td className="px-6 py-4">
                    <SparklineCell data={acc.loginData} color={acc.score >= 70 ? "text-rose-500" : acc.score >= 40 ? "text-amber-500" : "text-emerald-500"} />
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                       <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className={clsx("h-full", acc.adoption > 50 ? "bg-[#00A4BD]" : "bg-amber-400")} style={{width: `${acc.adoption}%`}}></div>
                       </div>
                       <span className="text-xs font-bold text-slate-500">{acc.adoption}%</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold w-12 justify-center",
                      acc.score >= 70 ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20' : 
                      acc.score >= 40 ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' :
                      'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                    )}>
                      {acc.score}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={clsx(
                       "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                       acc.status === 'Triggered' ? "bg-[#00A4BD]/10 text-[#00A4BD]" :
                       acc.status === 'Healthy' ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-700"
                     )}>
                       {acc.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <AccountDrawer account={selectedAccount} isOpen={!!selectedAccount} onClose={() => setSelectedAccount(null)} />
    </div>
  );
}