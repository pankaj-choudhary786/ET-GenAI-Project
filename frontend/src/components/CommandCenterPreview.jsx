import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

const pipelineData = [
  { name: 'Jan', potential: 4000, revenue: 2400 },
  { name: 'Feb', potential: 3000, revenue: 1398 },
  { name: 'Mar', potential: 2000, revenue: 9800 },
  { name: 'Apr', potential: 2780, revenue: 3908 },
  { name: 'May', potential: 1890, revenue: 4800 },
  { name: 'Jun', potential: 2390, revenue: 3800 },
  { name: 'Jul', potential: 3490, revenue: 4300 },
];

const mockFeed = [
  {
    id: 1,
    agent: 'Prospector',
    time: 'Just now',
    action: 'Drafted 45 personalized emails to VP-level targets at Series B companies.',
    icon: <Zap className="w-5 h-5 text-[#00A4BD]" />
  },
  {
    id: 2,
    agent: 'Retention',
    time: '2m ago',
    action: 'Flagged CloudCorp as high churn risk. Usage dropped 42% this week.',
    icon: <AlertTriangle className="w-5 h-5 text-[#FF7A59]" />
  },
  {
    id: 3,
    agent: 'Intelligence',
    time: '5m ago',
    action: 'Detected competitor mentioned on TechCorp call. Battlecard delivered to rep.',
    icon: <RefreshCw className="w-5 h-5 text-purple-500" />
  },
  {
    id: 4,
    agent: 'Closing',
    time: '12m ago',
    action: 'Auto-generated custom pricing proposal for GlobalTech renewal.',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />
  },
  {
    id: 5,
    agent: 'Prospector',
    time: '18m ago',
    action: 'Found 12 new intent signals from recent funding rounds on Crunchbase.',
    icon: <Clock className="w-5 h-5 text-[#33475B]" />
  }
];

export default function CommandCenterPreview() {
  const [feed, setFeed] = useState(mockFeed);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed(prev => {
        if (prev.length === 0) return prev;
        const newFeed = [...prev];
        const last = newFeed.pop();
        if (last) newFeed.unshift(last);
        return newFeed;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="command" className="w-full py-24 px-6 bg-[#F5F8FA] border-t border-slate-200 flex flex-col items-center">
      <div className="max-w-7xl w-full text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#33475B] tracking-tight">Centralize your <span className="text-[#FF7A59]">operations.</span></h2>
        <p className="text-[#4a5568] text-xl font-light">Monitor your AI agents and pipeline health in a single, unified workspace.</p>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Pipeline Health & Live Sync */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h3 className="text-2xl font-black text-[#33475B]">
                Pipeline Velocity 
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 uppercase tracking-wide">
                <RefreshCw className="w-3 h-3 animate-spin duration-[3000ms]" />
                Live Sync Active
              </div>
            </div>
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A4BD" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00A4BD" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPot" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7A59" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#FF7A59" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#33475B', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748b' }}
                  />
                  <Area type="monotone" dataKey="potential" stroke="#FF7A59" strokeWidth={3} fillOpacity={1} fill="url(#colorPot)" />
                  <Area type="monotone" dataKey="revenue" stroke="#00A4BD" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-[#FF7A59] transition-colors hover:shadow-card">
              <h4 className="text-sm font-bold text-[#FF7A59] mb-4 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> At Risk (Immediate)
              </h4>
              <motion.div animate={{ scale: [1, 1.01, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-[#33475B] text-lg">Initech Corp</span>
                  <span className="text-xs bg-[#FF7A59]/10 text-[#FF7A59] px-2 py-1 rounded font-bold">Score: 89</span>
                </div>
                <p className="text-sm text-slate-500 mb-6 font-medium">Silent for 14 days. Competitor mentions detected.</p>
                <button className="w-full py-3 text-sm font-bold bg-white border border-[#FF7A59] text-[#FF7A59] rounded hover:bg-[#FF7A59] hover:text-white transition-colors cursor-pointer">
                  Review Recovery Play
                </button>
              </motion.div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-green-400 transition-colors hover:shadow-card">
              <h4 className="text-sm font-bold text-green-600 mb-4 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Mitigated / Saved
              </h4>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm cursor-default">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-300 line-through text-lg">Hooli Inc</span>
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-bold">Score: 12</span>
                </div>
                <p className="text-sm text-slate-500 mb-6 font-medium">Re-engaged by Retention Agent email sequence.</p>
                <div className="w-full py-3 text-sm font-bold text-center text-green-600 border border-green-200 rounded bg-green-50">
                  Resolved & Secured
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Agent Action Feed */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[650px] lg:h-auto overflow-hidden relative">
          
          <h3 className="text-2xl font-black text-[#33475B] mb-6 relative z-20 flex items-center justify-between pb-6 border-b border-slate-100">
            Intelligence Stream
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A4BD] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00A4BD]"></span>
            </span>
          </h3>

          <div className="flex-1 overflow-hidden relative min-h-0 pt-2">
            <AnimatePresence>
              {feed.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                  className="mb-4 bg-[#F5F8FA] border border-slate-100 p-5 rounded-xl flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="mt-1 p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wide">{item.agent} Agent</span>
                      <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-1 rounded-full border border-slate-100">{item.time}</span>
                    </div>
                    <p className="text-sm text-[#4a5568] leading-relaxed font-medium">{item.action}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
