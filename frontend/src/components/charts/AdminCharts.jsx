import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Legend, ComposedChart } from 'recharts';

export function UserGrowthChart() {
  const data = [
    { name: 'Week 1', free: 400, pro: 240, enterprise: 40 },
    { name: 'Week 2', free: 500, pro: 398, enterprise: 50 },
    { name: 'Week 3', free: 600, pro: 580, enterprise: 80 },
    { name: 'Week 4', free: 780, pro: 608, enterprise: 100 },
    { name: 'Week 5', free: 890, pro: 800, enterprise: 181 },
    { name: 'Week 6', free: 1190, pro: 1100, enterprise: 250 },
    { name: 'Week 7', free: 1490, pro: 1300, enterprise: 310 },
  ];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-[320px] flex flex-col mb-6 min-w-0">
      <h3 className="font-bold text-slate-800 mb-4 text-left">Total Active Seats by Tier</h3>
      <div className="flex-1 w-full min-h-0 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 0, right: 30, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dx={-10} />
            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Line type="monotone" dataKey="free" stroke="#94a3b8" strokeWidth={3} dot={false} name="Free Tier" />
            <Line type="monotone" dataKey="pro" stroke="#f59e0b" strokeWidth={3} dot={false} name="Pro Tier" />
            <Line type="monotone" dataKey="enterprise" stroke="#FF7A59" strokeWidth={3} dot={false} name="Enterprise Tier" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AgentSkillRadar() {
  const data = [
    { subject: 'Outbound Prospecting', A: 120, fullMark: 150 },
    { subject: 'Data Scraping', A: 98, fullMark: 150 },
    { subject: 'Email Sequences', A: 86, fullMark: 150 },
    { subject: 'CRM Updates', A: 99, fullMark: 150 },
    { subject: 'Lead Scoring', A: 85, fullMark: 150 },
    { subject: 'Competitor Intel', A: 65, fullMark: 150 },
  ];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-[320px] flex flex-col items-center min-w-0">
      <h3 className="font-bold text-slate-800 w-full text-left">Agent Inference Map</h3>
      <div className="flex-1 w-full min-h-0 items-center justify-center -mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#f1f5f9" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
            <Radar name="Usage (Hours)" dataKey="A" stroke="#FF7A59" fill="#FF7A59" fillOpacity={0.6} />
            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DataSourceSyncChart() {
  const data = [
    { name: 'Mon', success: 4000, failed: 240 },
    { name: 'Tue', success: 3000, failed: 139 },
    { name: 'Wed', success: 2000, failed: 980 },
    { name: 'Thu', success: 2780, failed: 390 },
    { name: 'Fri', success: 1890, failed: 480 },
    { name: 'Sat', success: 2390, failed: 380 },
    { name: 'Sun', success: 3490, failed: 430 },
  ];
  return (
     <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-[320px] flex flex-col mb-6 min-w-0">
      <h3 className="font-bold text-slate-800 mb-4 text-left">Ingestion Flow & Fallbacks</h3>
      <div className="flex-1 w-full min-h-0 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#ef4444' }} />
            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            <Bar yAxisId="left" dataKey="success" barSize={24} fill="#0d9488" name="Successful Syncs" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="step" dataKey="failed" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} name="Failed Jobs (Webhook/API)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
