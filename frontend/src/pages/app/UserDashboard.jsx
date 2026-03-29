import React, { useState, useEffect } from 'react';
import GreetingBanner from '../../components/dashboard/GreetingBanner';
import KPICard from '../../components/dashboard/KPICard';
import AgentFeed from '../../components/dashboard/AgentFeed';
import QuickActions from '../../components/dashboard/QuickActions';
import RiskMiniTable from '../../components/dashboard/RiskMiniTable';
import { PipelineGrowthChart, AgentEfficiencyChart } from '../../components/dashboard/DashboardCharts';
import { useStore } from '../../store/useStore';
import { useProspects } from '../../hooks/useProspects';
import { useDeals } from '../../hooks/useDeals';
import { useRetentionAccounts } from '../../hooks/useRetentionAccounts';
import client from '../../api/client';

export default function UserDashboard() {
  const user = useStore(state => state.user);
  const userName = user?.name ? user.name.split(' ')[0] : 'User';
  
  const { prospects, loading: pLoading } = useProspects();
  const { deals, loading: dLoading } = useDeals();
  const { accounts, loading: aLoading } = useRetentionAccounts();
  const [outboxCount, setOutboxCount] = useState('-');

  useEffect(() => {
    // Manually calculating outbox count using logic
    let num = 0;
    if (prospects) {
       prospects.forEach(p => {
          if (p.outreachSequences) {
             p.outreachSequences.forEach(s => {
                if (s.status === 'draft' || (!s.approved && !s.sent)) num++;
             });
          }
       });
    }
    if (deals) {
       deals.forEach(d => {
          if (d.recoveryPlay && d.recoveryPlay.messageDraft) num++;
       });
    }
    // we only update if not loading both
    if (!pLoading && !dLoading) {
       setOutboxCount(num);
    }
  }, [prospects, deals, pLoading, dLoading]);

  const pipelineTotal = deals ? deals.reduce((sum, d) => sum + d.value, 0) : 0;
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <GreetingBanner name={userName} />
      
      {(!pLoading && prospects.length === 0) && (
        <div className="bg-[#00A4BD] text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce-subtle">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">🚀</div>
              <div>
                <h3 className="font-bold text-lg">Judge Mode: No data detected</h3>
                <p className="text-white/80 text-sm">Click the button to instantly populate this dashboard with deals, prospects, and agent logs.</p>
              </div>
           </div>
           <button 
             onClick={async () => {
                try {
                  await client.post('/api/auth/seed-demo');
                  window.location.reload();
                } catch (err) {
                  alert('Seeding failed. Please check backend logs.');
                }
             }}
             className="px-6 py-2.5 bg-white text-[#00A4BD] font-black rounded-xl hover:bg-slate-50 transition-all shadow-sm"
           >
             Populate Demo Data
           </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Prospects Found (MTD)" value={pLoading ? '-' : prospects.length} trend={14} isPositive={true} colorClass="text-[#FF7A59]" />
        <KPICard label="Emails Pending Approval" value={pLoading && dLoading ? '-' : outboxCount} colorClass="text-slate-800" />
        <KPICard label="Active Pipeline Deals" value={dLoading ? '-' : deals.length} trend={8} isPositive={true} colorClass="text-[#00A4BD]" />
        <KPICard label="Accounts at Churn Risk" value={aLoading ? '-' : accounts.length} trend={2} isPositive={false} colorClass="text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
        <div className="relative min-h-[360px]">
          {deals.length === 0 && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl text-center p-4">
              <p className="text-sm font-black text-slate-400 uppercase tracking-tighter">No Pipeline Data</p>
              <p className="text-xs text-slate-500 font-medium max-w-[200px]">Qualify prospects to see your growth chart here.</p>
            </div>
          )}
          <PipelineGrowthChart pipelineTotal={pipelineTotal} />
        </div>
        <div className="relative min-h-[360px]">
          {prospects.length === 0 && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl text-center p-4">
              <p className="text-sm font-black text-slate-400 uppercase tracking-tighter">No Active Leads</p>
              <p className="text-xs text-slate-500 font-medium max-w-[200px]">Run the Prospecting Agent to populate efficiency stats.</p>
            </div>
          )}
          <AgentEfficiencyChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AgentFeed />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 pt-2">
        <RiskMiniTable accounts={accounts} loading={aLoading} />
      </div>
    </div>
  );
}