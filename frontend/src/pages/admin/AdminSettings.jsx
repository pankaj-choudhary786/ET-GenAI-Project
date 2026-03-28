import React, { useState } from 'react';
import { ShieldCheck, Cpu, MessageSquare, Zap, HardDrive, Key, Save, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

const SETTINGS_SECTIONS = [
  { id: 'ai', label: 'AI Parameters', icon: Cpu },
  { id: 'security', label: 'Security & Access', icon: ShieldCheck },
  { id: 'infrastructure', label: 'Compute & Storage', icon: HardDrive },
];

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('ai');
  const addToast = useStore(state => state.addToast);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        addToast('success', 'Global system settings updated successfully.');
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h1>
          <p className="text-slate-500 mt-1 font-medium">Global AI governor and platform operational controls.</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#00A4BD]/20 disabled:opacity-50">
          {loading ? 'Propagating...' : <><Save className="w-4 h-4" /> Save Global Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-1">
          {SETTINGS_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border",
                activeSection === section.id 
                  ? "bg-white border-slate-200 text-[#00A4BD] shadow-sm" 
                  : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              )}
            >
              <section.icon className={clsx("w-5 h-5", activeSection === section.id ? "text-[#00A4BD]" : "text-slate-400")} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* AI Settings */}
          {activeSection === 'ai' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-500"/> LLM Governance</h3>
                  <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Primary Reasoning Model</label>
                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00A4BD] outline-none">
                            <option>Anthropic Claude 3.5 Sonnet</option>
                            <option>Anthropic Claude 3 Opus (Critical Reasoning)</option>
                            <option>OpenAI GPT-4o (Drafting)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Sonnet is currently configured for all autonomous agent loops.</p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl">
                        <div className="flex gap-3">
                            <Zap className="w-5 h-5 text-amber-600 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-amber-900">Agent Autonomy Threshold</p>
                                <p className="text-xs text-amber-700 font-medium">Auto-send is currently throttled globally to 40% of leads.</p>
                            </div>
                        </div>
                        <input type="range" className="accent-amber-600" />
                    </div>
                  </div>
               </div>

               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-left"><Key className="w-5 h-5 text-[#00A4BD]"/> API Key Rotation</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-bold text-slate-600">ANTHROPIC_API_KEY</span>
                        <span className="bg-emerald-100 text-emerald-700 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                     </div>
                     <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-bold text-slate-600">GOOGLE_CLIENT_ID</span>
                        <span className="bg-emerald-100 text-emerald-700 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center animate-in slide-in-from-right-4 duration-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-[#00A4BD]" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Role Based Access Control (RBAC)</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">RBAC is globally enforced. All requests to /api/admin/* require the "admin" role claim in JWT.</p>
                <div className="flex gap-2 justify-center">
                    <button className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800">Review Access Logs</button>
                </div>
             </div>
          )}

          {/* Infrastructure */}
          {activeSection === 'infrastructure' && (
             <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><HardDrive className="w-5 h-5 text-slate-400"/> Primary Database</h3>
                    <div className="p-4 bg-slate-50 rounded-xl font-mono text-xs text-slate-500 break-all border border-slate-100">
                        {/* Masked string */}
                        mongodb+srv://pankaj:********@cluster0.mongodb.net/nexusai
                    </div>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-rose-900">Storage Alert</p>
                        <p className="text-xs text-rose-700 font-medium">Agent logs are consuming 4.2GB/mo. Consider enabling log rotation.</p>
                    </div>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
