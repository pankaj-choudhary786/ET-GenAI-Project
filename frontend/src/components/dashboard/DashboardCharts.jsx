import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const pipelineData = [];

const agentData = [];

export function PipelineGrowthChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-[350px]">
      <div className="mb-4">
         <h3 className="font-bold text-slate-800 tracking-tight text-lg">AI-Driven Pipeline Growth</h3>
         <p className="text-sm text-slate-500 font-medium">Revenue generated vs autonomous projection</p>
      </div>
      <div className="flex-1 min-h-0 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
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
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val/1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
              labelStyle={{ fontWeight: 'bold', color: '#33475B', marginBottom: '4px' }}
              formatter={(value) => [`$${value.toLocaleString()}`, '']}
            />
            <Area type="monotone" dataKey="projected" name="Projected" stroke="#FF7A59" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
            <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#00A4BD" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: '#00A4BD' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AgentEfficiencyChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-[350px]">
       <div className="mb-4">
         <h3 className="font-bold text-slate-800 tracking-tight text-lg">Hours Saved by AI</h3>
         <p className="text-sm text-slate-500 font-medium">Actions completed: Agents vs Humans</p>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
}
