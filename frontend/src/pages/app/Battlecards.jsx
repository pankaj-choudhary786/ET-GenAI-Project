import React, { useState } from 'react';
import clsx from 'clsx';
import { Swords, Share, Shield, Target, Plus, ChevronDown, ChevronRight, Newspaper, Send } from 'lucide-react';

const COMPETITORS = [];

function ObjectionAccordion({ objections }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {objections.map((obj, i) => (
        <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
          <button 
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <span>"{obj.claim}"</span>
            {openIndex === i ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </button>
          
          {openIndex === i && (
            <div className="p-4 bg-white border-t border-slate-100 flex items-start gap-3">
              <div className="p-1.5 bg-[#00A4BD]/10 text-[#00A4BD] rounded-lg mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {obj.response}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Battlecards() {
  const [selectedId, setSelectedId] = useState(1);

  const activeCompetitor = COMPETITORS.find(c => c.id === selectedId);

  return (
    <div className="h-full flex flex-col max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Competitive Intelligence</h1>
          <p className="text-slate-500 mt-1">Live battlecards autonomously updated from public market signals.</p>
        </div>
      </div>

      <div className="flex flex-1 h-[calc(100vh-14rem)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Competitor Sidebar */}
        <div className="w-72 border-r border-slate-200 bg-slate-50 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
             <h3 className="font-bold text-slate-800 tracking-tight">Tracked Targets</h3>
             <button className="text-slate-400 hover:text-[#00A4BD] transition-colors"><Plus className="w-5 h-5"/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {COMPETITORS.map(comp => (
              <button 
                key={comp.id}
                onClick={() => setSelectedId(comp.id)}
                className={clsx(
                  "w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all",
                  selectedId === comp.id ? "bg-white border-[#00A4BD] shadow-sm ring-1 ring-[#00A4BD] ring-inset" : "border-transparent hover:bg-slate-100"
                )}
              >
                <div>
                  <h4 className="font-bold text-slate-900">{comp.name}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Updated {comp.lastUpdated}</p>
                </div>
                <div className={clsx(
                  "w-2.5 h-2.5 rounded-full shadow-sm",
                  comp.status === 'fresh' ? "bg-emerald-500 shadow-emerald-500/30" : 
                  comp.status === 'stale' ? "bg-amber-500 shadow-amber-500/30" : "bg-rose-500 shadow-rose-500/30"
                )}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Battlecard Document */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-slate-50/30 p-8">
          
          <div className="max-w-4xl mx-auto w-full space-y-8">
            <div className="flex justify-between items-start pb-6 border-b border-slate-200">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider border border-rose-200">Tier 1 Threat</span>
                     <span className="text-sm font-medium text-slate-500">Last crawled today at 09:41 AM</span>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">{activeCompetitor?.name}</h2>
               </div>
               
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg transition-colors shadow-sm">
                 <Share className="w-4 h-4" /> Push to active deals
               </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
               
               {/* Positioning (Left Column) */}
               <div className="space-y-6 lg:w-[45%] flex flex-col">
                 <div className="bg-white border text-left border-rose-100 rounded-xl p-6 shadow-sm shadow-rose-100/20 flex-1">
                    <h3 className="font-bold text-rose-800 mb-4 flex items-center gap-2"><Target className="w-5 h-5"/> Their Pitch</h3>
                    <ul className="space-y-2 text-sm text-slate-700 font-medium ml-4 list-disc">
                      <li>"The only all-in-one platform your revenue team needs."</li>
                      <li>Highly customizable objects with endless integrations.</li>
                      <li>Deep enterprise security and compliance standards.</li>
                    </ul>
                 </div>

                 <div className="bg-white border text-left border-emerald-100 rounded-xl p-6 shadow-sm shadow-emerald-100/20 flex-1">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><Swords className="w-5 h-5"/> Our Counter-Positioning</h3>
                    <ul className="space-y-2 text-sm text-slate-700 font-medium ml-4 list-disc">
                      <li><strong>Agility:</strong> Goliath takes 6 months to deploy; NexusAI deploys in minutes.</li>
                      <li><strong>Autonomy:</strong> They require humans to enter data; NexusAI agents do the work automatically.</li>
                      <li><strong>Pricing:</strong> $150/user vs our flat platform fee.</li>
                    </ul>
                 </div>
               </div>

               {/* Right Column: Objections & Signals */}
               <div className="space-y-6 lg:w-[55%] flex flex-col">
                  <div className="bg-white border text-left border-slate-200 rounded-xl p-6 shadow-sm flex-1">
                    <h3 className="font-bold text-slate-800 mb-4 text-lg">Objection Handlers</h3>
                    <ObjectionAccordion 
                      objections={[
                        { claim: "We already use Goliath, switching is too painful.", response: "NexusAI actually sits on top of Goliath. You don't have to switch. We pull data from Goliath, use our agents to do the busywork, and push it back. No migration needed." },
                        { claim: "Goliath has an AI copilot too.", response: "Their copilot is reactive—it summarizes text when you ask it to. NexusAI agents are autonomous—they find prospects and draft emails while you sleep. Reactive vs Autonomous." },
                        { claim: "Goliath covers the entire company, not just sales.", response: "Exactly why it's bloated. NexusAI is purpose-built for revenue generation and conversion speed." }
                      ]}
                    />
                  </div>

                  <div className="bg-white border text-left border-slate-200 rounded-xl p-6 shadow-sm">
                     <h3 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                       <Newspaper className="w-5 h-5 text-[#00A4BD]"/> Recent Market Signals
                     </h3>
                     <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                       <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <p className="text-sm font-bold text-slate-800 mb-1">Goliath announces 15% price hike for Q4.</p>
                          <span className="text-xs text-slate-500">TechCrunch • 2 days ago</span>
                       </div>
                       <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <p className="text-sm font-bold text-slate-800 mb-1">Key VP of Product departs Goliath for new startup.</p>
                          <span className="text-xs text-slate-500">LinkedIn • 5 days ago</span>
                       </div>
                     </div>
                  </div>
                  
                  <div className="bg-[#00A4BD]/5 border border-[#00A4BD]/20 rounded-lg p-4 flex items-center justify-between">
                     <div>
                       <h4 className="font-bold text-slate-800 mb-0.5 text-sm">Active Deals vs {activeCompetitor?.name}</h4>
                       <span className="text-xs font-medium text-slate-600">3 deals in pipeline</span>
                     </div>
                     <button className="text-xs font-bold text-[#00A4BD] hover:underline">View Pipeline</button>
                  </div>
               </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}