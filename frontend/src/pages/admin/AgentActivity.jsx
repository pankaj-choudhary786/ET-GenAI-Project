import React, { useState } from 'react';
import { Activity, ShieldAlert, CheckCircle2, Clock, Filter, AlertTriangle, Download } from 'lucide-react';
import clsx from 'clsx';
import { AgentSkillRadar } from '../../components/charts/AdminCharts';
import { useAgentFeed } from '../../hooks/useAgentFeed';
import { useAdminStats } from '../../hooks/useAdminStats';

export default function AgentActivity() {
  const [filter, setFilter] = useState('');
  const { logs, loading } = useAgentFeed(filter ? 1 : 1, 50, filter); // simplistic pagination 
  const { stats } = useAdminStats();

  return (
    <div className="h-full flex flex-col max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#00A4BD]" /> Global Agent Log
          </h1>
          <p className="text-slate-500 mt-1">Real-time inference and execution logs across all tenants.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <div className="lg:col-span-1">
            <AgentSkillRadar />
         </div>
         <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 rounded-xl p-8 text-white shadow-lg shadow-purple-900/20 flex flex-col justify-center relative overflow-hidden border border-slate-800">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-fuchsia-500/20 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none"></div>
            
            <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider mb-3">Total Platform Actions Synthesized</h3>
            <div className="text-6xl font-black mb-3 tracking-tighter">{stats?.totalAgentActions ?? '-'}</div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs ring-1 ring-inset ring-emerald-500/30">Live</span>
              <span className="text-slate-400 font-medium text-sm">since genesis block</span>
            </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 relative">
        {loading && (
             <div className="absolute top-16 bottom-0 inset-x-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
               <div className="w-8 h-8 rounded-full border-4 border-[#00A4BD]/30 border-t-[#00A4BD] animate-spin"></div>
             </div>
        )}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Search logs by tenant or action..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-80 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00A4BD] outline-none" 
            />
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg text-sm hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors shadow-sm">
             <Download className="w-4 h-4" /> Export Logs
          </button>
        </div>

        <div className="overflow-x-auto flex-1 font-mono text-xs">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Req ID</th>
                <th className="px-6 py-3">Tenant (Email)</th>
                <th className="px-6 py-3">Agent Group</th>
                <th className="px-6 py-3">Action Details</th>
                <th className="px-6 py-3">Duration (ms)</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950 text-slate-300">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-800/80 transition-colors">
                  <td className="px-6 py-3 border-r border-slate-800/50 text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</td>
                  <td className="px-6 py-3 border-r border-slate-800/50 text-[#00A4BD]">{log._id.slice(-6)}</td>
                  <td className="px-6 py-3 border-r border-slate-800/50 text-purple-400">{log.userId?.email || 'System'}</td>
                  <td className="px-6 py-3 border-r border-slate-800/50 font-bold text-slate-200">{log.agentType}</td>
                  <td className="px-6 py-3 border-r border-slate-800/50 truncate max-w-sm" title={log.action}>{log.action}</td>
                  <td className="px-6 py-3 border-r border-slate-800/50 text-slate-500">{log.latencyMs}</td>
                  <td className="px-6 py-3">
                     <span className={clsx(
                       "flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px]",
                       log.status === 'success' ? "text-emerald-400" :
                       log.status === 'failed' ? "text-rose-500" :
                       log.status === 'warning' ? "text-amber-400" :
                       "text-blue-400 animate-pulse"
                     )}>
                       {log.status === 'success' && <CheckCircle2 className="w-3 h-3"/>}
                       {log.status === 'failed' && <ShieldAlert className="w-3 h-3"/>}
                       {log.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                       {log.status === 'processing' && <Clock className="w-3 h-3"/>}
                       {log.status}
                     </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                 <tr><td colSpan="7" className="text-center p-6 text-slate-500">No logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}