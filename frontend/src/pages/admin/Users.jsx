import React from 'react';
import UserTable from '../../components/admin/UserTable';
import { UserPlus } from 'lucide-react';
import { UserGrowthChart } from '../../components/charts/AdminCharts';

export default function Users() {
  return (
    <div className="h-full flex flex-col max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Manage tenant access, billing tiers, and individual seats.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-lg transition-colors shadow-sm">
          <UserPlus className="w-4 h-4" /> Provision New User
        </button>
      </div>

      <UserGrowthChart />

      <div className="flex-1 min-h-0">
        <UserTable showControls={true} />
      </div>
    </div>
  );
}