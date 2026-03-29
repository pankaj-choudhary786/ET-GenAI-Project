import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ActivityBarChart({ data }) {
  return (
    <div className="bg-white border text-left border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
      <h3 className="font-bold text-slate-800 tracking-tight mb-4">Agent Activity This Week</h3>
      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <BarChart
            data={data || []}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
            <Bar dataKey="prospecting" name="Prospecting" stackId="a" fill="#a855f7" radius={[0, 0, 4, 4]} />
            <Bar dataKey="deal_intel" name="Deal Intel" stackId="a" fill="#f43f5e" />
            <Bar dataKey="retention" name="Retention" stackId="a" fill="#10b981" />
            <Bar dataKey="competitive" name="Competitive" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
