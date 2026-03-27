import React from 'react';
import GreetingBanner from '../../components/dashboard/GreetingBanner';
import KPICard from '../../components/dashboard/KPICard';
import AgentFeed from '../../components/dashboard/AgentFeed';
import QuickActions from '../../components/dashboard/QuickActions';
import RiskMiniTable from '../../components/dashboard/RiskMiniTable';
import { PipelineGrowthChart, AgentEfficiencyChart } from '../../components/dashboard/DashboardCharts';

export default function UserDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <GreetingBanner name="Sarah" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Prospects Found (MTD)" value="-" trend={0} isPositive={true} colorClass="text-[#FF7A59]" />
        <KPICard label="Emails Pending Approval" value="-" colorClass="text-slate-800" />
        <KPICard label="Active Pipeline Deals" value="-" trend={0} isPositive={true} colorClass="text-[#00A4BD]" />
        <KPICard label="Accounts at Churn Risk" value="-" trend={0} isPositive={false} colorClass="text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
        <PipelineGrowthChart />
        <AgentEfficiencyChart />
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
        <RiskMiniTable />
      </div>
    </div>
  );
}