import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [];

export default function DonutChart() {
  return (
    <div className="bg-white border text-left border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
      <h3 className="font-bold text-slate-800 tracking-tight mb-4">Data Sources Breakdown</h3>
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DATA}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 gap-x-4">
         {DATA.map((d, i) => (
           <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
             <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
             <span className="truncate">{d.name} ({d.value}%)</span>
           </div>
         ))}
      </div>
    </div>
  );
}
