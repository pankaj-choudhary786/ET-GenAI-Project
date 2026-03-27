import React, { useState } from 'react';
import clsx from 'clsx';
import { User, Link, Sliders, Bell, Upload, Lock, ShieldAlert, Swords, Mail, Users } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';

const TABS = [
  { id: 'profile', label: 'Profile Settings', icon: User },
  { id: 'integrations', label: 'Connected Apps', icon: Link },
  { id: 'agents', label: 'Agent Behaviors', icon: Sliders },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const INTEGRATIONS = [
  { id: 'hubspot', name: 'HubSpot', desc: 'Sync contacts, deals, and activities.', status: 'connected', time: 'Syncs every 15m', icon: 'H' },
  { id: 'salesforce', name: 'Salesforce', desc: 'Enterprise CRM sync and battlecard push.', status: 'disconnected', time: '', icon: 'S' },
  { id: 'gmail', name: 'Gmail Workspace', desc: 'Allow AI to read inbox and draft outbound.', status: 'connected', time: 'Last sync: Just now', icon: 'G' },
  { id: 'linkedin', name: 'LinkedIn (Cookie)', desc: 'Prospect monitoring and engagement.', status: 'connected', time: 'Active session', icon: 'L' },
  { id: 'slack', name: 'Slack', desc: 'Receive real-time agent alerts.', status: 'disconnected', time: '', icon: '#' },
];

function ProfileTab() {
  return (
    <div className="space-y-6 max-w-2xl bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
        <div className="relative group cursor-pointer">
           <Avatar name="Sarah Jenkins" size="xl" className="ring-4 ring-white shadow-md group-hover:opacity-80 transition-opacity" />
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
             <Upload className="w-5 h-5 text-white" />
           </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Profile Picture</h3>
          <p className="text-sm text-slate-500 mb-2">PNG, JPG up to 5MB</p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-slate-100 font-bold text-slate-600 rounded text-sm hover:bg-slate-200">Upload</button>
            <button className="px-4 py-1.5 text-rose-500 font-bold bg-white border border-slate-200 rounded text-sm hover:bg-rose-50">Remove</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Full Name</label>
          <input type="text" defaultValue="Sarah Jenkins" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00A4BD] font-medium" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex justify-between">
            Work Email 
            <span className="text-xs text-slate-400 font-normal flex items-center gap-1"><Lock className="w-3 h-3"/> Provided by Google Auth</span>
          </label>
          <input type="email" defaultValue="sarah@fintech.io" disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-medium cursor-not-allowed" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Job Title</label>
          <input type="text" defaultValue="VP of Sales" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00A4BD] font-medium" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Timezone</label>
          <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00A4BD] font-medium text-slate-700">
            <option>Pacific Time (PT) - Los Angeles</option>
            <option>Eastern Time (ET) - New York</option>
            <option>Greenwich Mean Time (GMT)</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button className="px-6 py-2 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-lg shadow-sm">Save Changes</button>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  return (
    <div className="space-y-4 max-w-4xl">
      {INTEGRATIONS.map(int => (
        <div key={int.id} className="bg-white border text-left border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-xl text-slate-400">
              {int.icon}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 tracking-tight">{int.name}</h4>
              <p className="text-sm text-slate-500 mb-1">{int.desc}</p>
              {int.status === 'connected' && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-emerald-600">{int.time}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <button className={clsx(
              "px-5 py-2 font-bold text-sm rounded-lg transition-colors border",
              int.status === 'connected' ? "bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" : "bg-[#00A4BD] text-white border-transparent hover:bg-[#008f9c]"
            )}>
              {int.status === 'connected' ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentsTab() {
  return (
    <div className="space-y-6 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start auto-rows-min">
      
      {/* Prospecting */}
      <div className="bg-white border text-left border-purple-200 shadow-sm shadow-purple-100 rounded-xl p-6">
        <h4 className="font-bold text-purple-900 flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-purple-600" /> Prospecting Engine</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Auto-Send Mode</p>
              <p className="text-xs text-slate-500">Bypass approval queue for top matches.</p>
            </div>
            <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div></div>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm mb-2 mt-4 text-left">Minimum ICP Score Threshold</p>
            <input type="range" min="50" max="100" defaultValue="85" className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs font-bold text-purple-600 mt-1"><span>50</span><span>85 (Current)</span><span>100</span></div>
          </div>
        </div>
      </div>

      {/* Deal Intel */}
      <div className="bg-white border text-left border-rose-200 shadow-sm shadow-rose-100 rounded-xl p-6">
        <h4 className="font-bold text-rose-900 flex items-center gap-2 mb-4"><ShieldAlert className="w-5 h-5 text-rose-600" /> Deal Intelligence</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Slack Risk Alerts</p>
              <p className="text-xs text-slate-500">DM account owners on risk spike.</p>
            </div>
            <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div></div>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm mb-2 mt-4 text-left">Risk Score Alert Threshold</p>
            <input type="range" min="10" max="90" defaultValue="65" className="w-full accent-rose-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs font-bold text-rose-600 mt-1"><span>10</span><span>65+ (Critical)</span><span>90</span></div>
          </div>
        </div>
      </div>

      {/* Retention */}
      <div className="bg-white border text-left border-emerald-200 shadow-sm shadow-emerald-100 rounded-xl p-6">
        <h4 className="font-bold text-emerald-900 flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-emerald-600" /> Retention AI</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 text-sm">CSM Auto-Escalation</p>
              <p className="text-xs text-slate-500">Draft check-in emails automatically.</p>
            </div>
            <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div></div>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm mb-2 mt-4 text-left">Churn Severity Threshold</p>
            <input type="range" min="10" max="90" defaultValue="50" className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs font-bold text-emerald-600 mt-1"><span>10</span><span>50+ (Flagged)</span><span>90</span></div>
          </div>
        </div>
      </div>

      {/* Competitive */}
      <div className="bg-white border text-left border-amber-200 shadow-sm shadow-amber-100 rounded-xl p-6">
        <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-4"><Swords className="w-5 h-5 text-amber-600" /> Competitive Radar</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 text-sm">CRM Battlecard Push</p>
              <p className="text-xs text-slate-500">Sync fresh battlecards to SFDC deals.</p>
            </div>
            <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div></div>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm mb-2 mt-4 text-left">Tracking Focus</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Pricing changes</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Key hires</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full border border-dashed border-slate-300 cursor-pointer hover:bg-slate-200">+ Add</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6 max-w-2xl bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-left">
       <h3 className="font-bold text-slate-800 mb-6 text-lg border-b border-slate-100 pb-4">Communication Preferences</h3>
       
       <div className="space-y-6">
         <label className="flex items-start gap-4 cursor-pointer group">
            <div className="mt-1 flex items-center justify-center w-5 h-5 border-2 border-[#00A4BD] bg-[#00A4BD] rounded text-white"><CheckCircle2 className="w-4 h-4"/></div>
            <div>
               <p className="font-bold text-slate-800 group-hover:text-[#00A4BD] transition-colors">Daily Summary Email</p>
               <p className="text-sm text-slate-500 font-medium">Get a 8:00 AM digest of all agent activities.</p>
            </div>
         </label>
         
         <label className="flex items-start gap-4 cursor-pointer group">
            <div className="mt-1 flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded text-transparent group-hover:border-[#00A4BD]"></div>
            <div>
               <p className="font-bold text-slate-800 group-hover:text-[#00A4BD] transition-colors">Weekly Performance Report</p>
               <p className="text-sm text-slate-500 font-medium">Metrics on sequence replies and risk mitigations (Mondays).</p>
            </div>
         </label>
         
         <label className="flex items-start gap-4 cursor-pointer group">
            <div className="mt-1 flex items-center justify-center w-5 h-5 border-2 border-[#00A4BD] bg-[#00A4BD] rounded text-white"><CheckCircle2 className="w-4 h-4"/></div>
            <div>
               <p className="font-bold text-slate-800 group-hover:text-[#00A4BD] transition-colors">Immediate Risk Flashes</p>
               <p className="text-sm text-slate-500 font-medium">Push notification when a Tier 1 deal turns Critical.</p>
            </div>
         </label>
       </div>
       
       <div className="pt-8 flex justify-end">
        <button className="px-6 py-2 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-lg shadow-sm">Save Preferences</button>
      </div>
    </div>
  );
}

// Ensure CheckCircle2 is imported if we use the literal icon
import { CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="h-full flex flex-col max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 mt-1">Manage your profile, integrations, and agent logic boundaries.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Vertical Tabs */}
        <div className="w-full md:w-64 flex flex-col space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all text-left",
                activeTab === tab.id 
                  ? "bg-white text-[#00A4BD] shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent"
              )}
            >
              <tab.icon className={clsx("w-5 h-5", activeTab === tab.id ? "text-[#00A4BD]" : "text-slate-400")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 w-full pb-12">
           {activeTab === 'profile' && <ProfileTab />}
           {activeTab === 'integrations' && <IntegrationsTab />}
           {activeTab === 'agents' && <AgentsTab />}
           {activeTab === 'notifications' && <NotificationsTab />}
        </div>

      </div>
    </div>
  );
}