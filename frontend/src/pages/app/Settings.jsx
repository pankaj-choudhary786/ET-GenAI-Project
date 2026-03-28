import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { User, Link, Sliders, Bell, Upload, Lock, ShieldAlert, Swords, Users, Activity, CheckCircle2 } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import { useStore } from '../../store/useStore';
import client from '../../api/client';
import debounce from 'lodash.debounce';

const TABS = [
  { id: 'profile', label: 'Profile Settings', icon: User },
  { id: 'integrations', label: 'Connected Apps', icon: Link },
  { id: 'agents', label: 'Agent Behaviors', icon: Sliders },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

function ProfileTab({ user, setUser, addToast }) {
  const [formData, setFormData] = useState({ name: '', company: '', jobTitle: '', timezone: '' });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        timezone: user.timezone || 'UTC'
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const { data } = await client.put('/api/auth/profile', formData);
      setUser(data.user);
      addToast('success', 'Profile updated successfully');
    } catch (err) {
      addToast('error', 'Failed to update profile');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
        <div className="relative group cursor-pointer border border-transparent">
           <Avatar user={user} size="xl" className="ring-4 ring-white shadow-md group-hover:opacity-80 transition-opacity" />
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
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00A4BD] font-medium" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 flex justify-between">
            Work Email 
            <span className="text-xs text-slate-400 font-normal flex items-center gap-1"><Lock className="w-3 h-3"/> Provided by System</span>
          </label>
          <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-medium cursor-not-allowed" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Job Title</label>
          <input type="text" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00A4BD] font-medium" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Company</label>
          <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00A4BD] font-medium" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button onClick={handleSave} className="px-6 py-2 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-lg shadow-sm">Save Changes</button>
      </div>
    </div>
  );
}

function IntegrationsTab({ user, setUser, addToast }) {
  const handleConnect = async (id) => {
    try {
      if (id === 'gmail') {
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
        // Instead of opening real oauth for assignments without backend explicit instruction, we mock successful integration using profile PUT
        const payload = { ...user.connectedIntegrations, gmail: true };
        const { data } = await client.put('/api/auth/profile', { connectedIntegrations: payload });
        setUser(data.user);
        addToast('success', 'Gmail connected successfully');
      }
    } catch (err) {
      addToast('error', 'Failed to connect integration');
    }
  };

  const handleDisconnect = async (id) => {
    try {
        const payload = { ...user.connectedIntegrations, [id]: false };
        const { data } = await client.put('/api/auth/profile', { connectedIntegrations: payload });
        setUser(data.user);
        addToast('info', `${id} disconnected`);
    } catch (err) {
        addToast('error', 'Failed to disconnect');
    }
  };

  const integrationsList = [
    { id: 'hubspot', name: 'HubSpot', desc: 'Sync contacts, deals, and activities.', status: user?.connectedIntegrations?.hubspot ? 'connected' : 'disconnected', icon: 'H' },
    { id: 'salesforce', name: 'Salesforce', desc: 'Enterprise CRM sync and battlecard push.', status: user?.connectedIntegrations?.salesforce ? 'connected' : 'disconnected', icon: 'S' },
    { id: 'gmail', name: 'Gmail Workspace', desc: 'Allow AI to read inbox and draft outbound.', status: user?.connectedIntegrations?.gmail ? 'connected' : 'disconnected', time: 'Last sync: Just now', icon: 'G' },
    { id: 'slack', name: 'Slack', desc: 'Receive real-time agent alerts.', status: user?.connectedIntegrations?.slack ? 'connected' : 'disconnected', icon: '#' },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      {integrationsList.map(int => (
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
                  <span className="text-xs font-bold text-emerald-600">{int.time || 'Connected'}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <button 
              onClick={() => int.status === 'connected' ? handleDisconnect(int.id) : handleConnect(int.id)}
              className={clsx(
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

function AgentsTab({ user, setUser, addToast }) {
  const prefs = user?.agentPreferences || {};

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const savePrefs = useCallback(
    debounce(async (newPrefs) => {
      try {
        const { data } = await client.put('/api/auth/profile', { agentPreferences: newPrefs });
        setUser(data.user);
        addToast('success', 'Agent preferences updated');
      } catch (err) {
        addToast('error', 'Failed to save preferences');
      }
    }, 1000), 
    [setUser, addToast]
  );

  const applyChange = (domain, key, value) => {
    const nextPrefs = { 
      ...prefs, 
      [domain]: { ...(prefs[domain] || {}), [key]: value } 
    };
    savePrefs(nextPrefs);
  };

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
            <div onClick={() => applyChange('prospecting', 'autoSend', !prefs.prospecting?.autoSend)} className={clsx("w-10 h-6 rounded-full relative cursor-pointer", prefs.prospecting?.autoSend ? "bg-purple-600" : "bg-slate-200")}>
              <div className={clsx("w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all", prefs.prospecting?.autoSend ? "right-1" : "left-1")}></div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm mb-2 mt-4 text-left">Minimum ICP Score Threshold</p>
            <input 
              type="range" min="50" max="100" 
              value={prefs.prospecting?.minIcpScore || 60} 
              onChange={e => applyChange('prospecting', 'minIcpScore', parseInt(e.target.value))} 
              className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
            />
            <div className="flex justify-between text-xs font-bold text-purple-600 mt-1"><span>50</span><span>{prefs.prospecting?.minIcpScore || 60} (Current)</span><span>100</span></div>
          </div>
        </div>
      </div>

      {/* Deal Intel */}
      <div className="bg-white border text-left border-rose-200 shadow-sm shadow-rose-100 rounded-xl p-6">
        <h4 className="font-bold text-rose-900 flex items-center gap-2 mb-4"><ShieldAlert className="w-5 h-5 text-rose-600" /> Deal Intelligence</h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 text-sm mb-2 mt-4 text-left">Risk Score Alert Threshold</p>
            <input 
              type="range" min="10" max="90" 
              value={prefs.dealIntel?.riskAlertThreshold || 70} 
              onChange={e => applyChange('dealIntel', 'riskAlertThreshold', parseInt(e.target.value, 10))}
              className="w-full accent-rose-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
            />
            <div className="flex justify-between text-xs font-bold text-rose-600 mt-1"><span>10</span><span>{prefs.dealIntel?.riskAlertThreshold}+ (Critical)</span><span>90</span></div>
          </div>
        </div>
      </div>

      {/* Retention */}
      <div className="bg-white border text-left border-emerald-200 shadow-sm shadow-emerald-100 rounded-xl p-6">
        <h4 className="font-bold text-emerald-900 flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-emerald-600" /> Retention AI</h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 text-sm mb-2 mt-4 text-left">Churn Severity Threshold</p>
            <input 
              type="range" min="10" max="90" 
              value={prefs.retention?.churnEscalateThreshold || 75} 
              onChange={e => applyChange('retention', 'churnEscalateThreshold', parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
            />
            <div className="flex justify-between text-xs font-bold text-emerald-600 mt-1"><span>10</span><span>{prefs.retention?.churnEscalateThreshold}+ (Flagged)</span><span>90</span></div>
          </div>
        </div>
      </div>

      {/* Competitive */}
      <div className="bg-white border text-left border-amber-200 shadow-sm shadow-amber-100 rounded-xl p-6">
        <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-4"><Swords className="w-5 h-5 text-amber-600" /> Competitive Radar</h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 text-sm mb-2 mt-4 text-left">Tracking Focus</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Pricing changes</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Key hires</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function NotificationsTab({ user, setUser, addToast }) {
  const [prefs, setPrefs] = useState(user?.notificationPrefs || {});

  const handleToggle = async (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try {
        const { data } = await client.put('/api/auth/profile', { notificationPrefs: next });
        setUser(data.user);
        addToast('success', 'Notification preferences updated');
    } catch {
        addToast('error', 'Failed to update preferences');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-left">
       <h3 className="font-bold text-slate-800 mb-6 text-lg border-b border-slate-100 pb-4">Communication Preferences</h3>
       
       <div className="space-y-6">
         <label className="flex items-start gap-4 cursor-pointer group" onClick={(e) => { e.preventDefault(); handleToggle('dailySummary'); }}>
            <div className={clsx("mt-1 flex items-center justify-center w-5 h-5 border-2 rounded transition-colors text-white", prefs.dailySummary ? "border-[#00A4BD] bg-[#00A4BD]" : "border-slate-300 text-transparent")}>
                <CheckCircle2 className="w-4 h-4"/>
            </div>
            <div>
               <p className="font-bold text-slate-800 group-hover:text-[#00A4BD] transition-colors">Daily Summary Email</p>
               <p className="text-sm text-slate-500 font-medium">Get a 8:00 AM digest of all agent activities.</p>
            </div>
         </label>
         
         <label className="flex items-start gap-4 cursor-pointer group" onClick={(e) => { e.preventDefault(); handleToggle('weeklyReport'); }}>
            <div className={clsx("mt-1 flex items-center justify-center w-5 h-5 border-2 rounded transition-colors text-white", prefs.weeklyReport ? "border-[#00A4BD] bg-[#00A4BD]" : "border-slate-300 text-transparent")}>
                <CheckCircle2 className="w-4 h-4"/>
            </div>
            <div>
               <p className="font-bold text-slate-800 group-hover:text-[#00A4BD] transition-colors">Weekly Performance Report</p>
               <p className="text-sm text-slate-500 font-medium">Metrics on sequence replies and risk mitigations (Mondays).</p>
            </div>
         </label>
         
         <label className="flex items-start gap-4 cursor-pointer group" onClick={(e) => { e.preventDefault(); handleToggle('slackAlerts'); }}>
            <div className={clsx("mt-1 flex items-center justify-center w-5 h-5 border-2 rounded transition-colors text-white", prefs.slackAlerts ? "border-[#00A4BD] bg-[#00A4BD]" : "border-slate-300 text-transparent")}>
                <CheckCircle2 className="w-4 h-4"/>
            </div>
            <div>
               <p className="font-bold text-slate-800 group-hover:text-[#00A4BD] transition-colors">Immediate Risk Flashes</p>
               <p className="text-sm text-slate-500 font-medium">Push notification when a Tier 1 deal turns Critical.</p>
            </div>
         </label>
       </div>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const addToast = useStore(state => state.addToast);

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
           {activeTab === 'profile' && <ProfileTab user={user} setUser={setUser} addToast={addToast} />}
           {activeTab === 'integrations' && <IntegrationsTab user={user} setUser={setUser} addToast={addToast} />}
           {activeTab === 'agents' && <AgentsTab user={user} setUser={setUser} addToast={addToast} />}
           {activeTab === 'notifications' && <NotificationsTab user={user} setUser={setUser} addToast={addToast} />}
        </div>
      </div>
    </div>
  );
}