import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export function PipelineStageChart() {
  const data = [
    { stage: 'Discovery', value: 350000 },
    { stage: 'Qualification', value: 280000 },
    { stage: 'Proposal', value: 410000 },
    { stage: 'Negotiation', value: 160000 },
    { stage: 'Closed Won', value: 210000 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-[380px] h-full">
      <h3 className="font-bold text-slate-800 tracking-tight text-left mb-4">Sales Pipeline by Stage</h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4a5568', fontWeight: 600 }} width={100} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
              formatter={(val) => `$${(val/1000)}k`}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#1e293b', fontSize: 12, fontWeight: 'bold', formatter: (v) => `$${v/1000}k` }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LeadSourcesChart() {
  const data = [
    { name: 'Organic', value: 45, color: '#3b82f6' },
    { name: 'Referral', value: 25, color: '#60a5fa' },
    { name: 'Social', value: 15, color: '#93c5fd' },
    { name: 'Paid', value: 10, color: '#bfdbfe' },
    { name: 'Other', value: 5, color: '#dbeafe' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-[380px] h-full">
      <h3 className="font-bold text-slate-800 tracking-tight text-left mb-4">Lead Sources</h3>
      <div className="flex-1 w-full relative flex flex-col items-center justify-between">
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
                formatter={(val) => `${val}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full flex justify-center flex-wrap gap-2 mt-4">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm shrink-0">
              <div className="w-2.5 h-2.5 rounded-full shadow-inner" style={{ backgroundColor: d.color }}></div>
              <span>{d.name} <span className="text-slate-900 ml-0.5">{d.value}%</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NetRevenueRetentionChart() {
  const data = [
    { month: 'Jan 1', nrr: 92 },
    { month: 'Feb 1', nrr: 101 },
    { month: 'Mar 1', nrr: 107 },
    { month: 'Apr 1', nrr: 97 },
    { month: 'May 1', nrr: 108 },
    { month: 'Jun 1', nrr: 103 },
    { month: 'Jul 1', nrr: 110.2 },
    { month: 'Aug 1', nrr: 108.5 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-[400px] h-full">
      <div className="mb-6 flex justify-between items-start">
         <div className="text-left">
           <h3 className="font-bold text-slate-800 tracking-tight text-lg mb-1">Net Revenue Retention (NRR)</h3>
           <div className="flex items-center gap-2 text-sm text-slate-500 font-medium whitespace-nowrap">
             <div className="w-2.5 h-2.5 rounded-full bg-[#00A4BD]"></div> Net Revenue Retention
           </div>
         </div>
         <div className="text-right">
           <div className="text-2xl font-black text-slate-900">108.5% NRR</div>
           <div className="text-sm font-bold text-emerald-500">+1.2% vs. Last Month</div>
         </div>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNRR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00A4BD" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00A4BD" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dy={10} />
            <YAxis domain={[90, 120]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} tickFormatter={(val) => `${val}%`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
              labelStyle={{ fontWeight: 'bold', color: '#33475B', marginBottom: '4px' }}
              formatter={(value) => [`${value}%`, 'NRR']}
            />
            <Area type="monotone" dataKey="nrr" stroke="#00A4BD" strokeWidth={3} fillOpacity={1} fill="url(#colorNRR)" activeDot={{ r: 6, strokeWidth: 2, fill: '#fff', stroke: '#00A4BD' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
