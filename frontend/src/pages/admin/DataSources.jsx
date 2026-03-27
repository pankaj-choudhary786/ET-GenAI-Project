import React from 'react';
import { Database, Plus, RefreshCw, Key } from 'lucide-react';
import clsx from 'clsx';
import { DataSourceSyncChart } from '../../components/charts/AdminCharts';

const SOURCES = [];

export default function DataSources() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-[#00A4BD]" /> System Data Pipelines
          </h1>
          <p className="text-slate-500 mt-1">Manage global data providers feeding the AI engines.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Provider
        </button>
      </div>

      <div className="bg-white border text-left border-rose-200 bg-rose-50 text-rose-800 rounded-xl p-4 shadow-sm mb-6 flex items-start gap-3">
         <div className="p-1.5 bg-rose-100 rounded-lg shrink-0 mt-0.5"><Database className="w-5 h-5 text-rose-600"/></div>
         <div>
            <h4 className="font-bold text-rose-900 leading-tight mb-1">Source Failure: TechCrunch PR Feed</h4>
            <p className="text-sm font-medium opacity-90">RSS parser syntax error due to recent structure changes. This affects Competitive Intelligence for all tenants tracking SaaS players.</p>
            <button className="mt-3 text-sm font-bold bg-white border border-rose-200 shadow-sm px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">Review Parser Logs</button>
         </div>
      </div>

      <DataSourceSyncChart />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SOURCES.map(src => (
          <div key={src.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 flex items-start justify-between border-b border-slate-100">
               <div>
                  <h3 className="font-bold text-slate-900 text-lg">{src.name}</h3>
                  <p className="text-slate-500 font-medium text-sm mt-0.5">{src.type}</p>
               </div>
               <div className={clsx(
                 "px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider",
                 src.status === 'Healthy' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
               )}>
                 {src.status}
               </div>
            </div>
            <div className="p-5 flex-1 bg-slate-50 flex flex-col justify-between">
               <div className="space-y-3 mb-6">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500 font-medium">Last Global Sync</span>
                   <span className="font-bold text-slate-700">{src.lastSync}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500 font-medium">Daily API Calls</span>
                   <span className="font-bold text-slate-700">12,450 / 50k</span>
                 </div>
               </div>
               <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 font-bold text-slate-600 rounded-lg hover:bg-slate-100 text-sm">
                    <RefreshCw className="w-4 h-4" /> Force Sync
                  </button>
                  <button className="px-3 border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 rounded-lg transition-colors">
                    <Key className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}