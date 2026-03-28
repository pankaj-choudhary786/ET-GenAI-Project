import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function PipelineGrowthChart({ pipelineTotal = 0 }) {
  const pipelineData = [
    { name: 'Jan', revenue: pipelineTotal * 0.4, projected: pipelineTotal * 0.5 },
    { name: 'Feb', revenue: pipelineTotal * 0.55, projected: pipelineTotal * 0.6 },
    { name: 'Mar', revenue: pipelineTotal * 0.65, projected: pipelineTotal * 0.7 },
    { name: 'Apr', revenue: pipelineTotal * 0.8, projected: pipelineTotal * 0.85 },
    { name: 'May', revenue: pipelineTotal * 0.9, projected: pipelineTotal * 0.95 },
    { name: 'Jun', revenue: pipelineTotal, projected: pipelineTotal * 1.1 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-[360px] min-h-[360px]">
      <div className="mb-4">
        <h3 className="font-bold text-slate-800 tracking-tight text-lg">AI-Driven Pipeline Growth</h3>
        <p className="text-sm text-slate-500 font-medium">Revenue generated vs autonomous projection</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00A4BD" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00A4BD" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF7A59" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#FF7A59" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
            labelStyle={{ fontWeight: 'bold', color: '#33475B', marginBottom: '4px' }}
            formatter={(value) => [`$${Math.round(value).toLocaleString()}`, '']}
          />
          <Area type="monotone" dataKey="projected" name="Projected" stroke="#FF7A59" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
          <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#00A4BD" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: '#00A4BD' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AgentEfficiencyChart() {
  const agentData = [
    { name: 'Emails Sent', Human: 200, AI: 450 },
    { name: 'Lead Research', Human: 45, AI: 810 },
    { name: 'Data Entry', Human: 90, AI: 550 },
    { name: 'Risk Detection', Human: 20, AI: 320 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-[360px] min-h-[360px]">
      <div className="mb-4">
        <h3 className="font-bold text-slate-800 tracking-tight text-lg">Hours Saved by AI</h3>
        <p className="text-sm text-slate-500 font-medium">Actions completed: Agents vs Humans</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={agentData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#33475B', fontWeight: 600 }} width={90} />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingLeft: '20px' }} />
          <Bar dataKey="AI" name="AI Agents" fill="#00A4BD" radius={[0, 4, 4, 0]} barSize={16} />
          <Bar dataKey="Human" name="Sales Reps" fill="#FF7A59" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
