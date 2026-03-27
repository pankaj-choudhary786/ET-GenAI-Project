import React from 'react';
import KPICard from '../../components/dashboard/KPICard';
import DonutChart from '../../components/admin/DonutChart';
import ActivityBarChart from '../../components/admin/ActivityBarChart';
import UserTable from '../../components/admin/UserTable';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Control Room</h1>
          <p className="text-slate-500 mt-1">Global oversight of all tenants, agent activity, and pipeline health.</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium font-sans outline-none focus:ring-2 focus:ring-[#00A4BD]">
             <option>Last 7 Days</option>
             <option>Last 30 Days</option>
             <option>This Quarter</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard label="Total Active Users" value="-" trend={0} isPositive={true} colorClass="text-[#00A4BD]" />
        <KPICard label="Global Emails Sent" value="-" trend={0} isPositive={true} colorClass="text-purple-600" />
        <KPICard label="Avg. Reply Rate" value="-" trend={0} isPositive={false} colorClass="text-rose-600" />
        <KPICard label="Compute Cost (MTD)" value="-" trend={0} isPositive={false} colorClass="text-slate-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <ActivityBarChart />
         </div>
         <div className="lg:col-span-1">
            <DonutChart />
         </div>
      </div>

      <div className="pt-4">
        <UserTable showControls={false} />
      </div>

    </div>
  );
}