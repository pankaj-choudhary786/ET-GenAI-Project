import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="w-full py-24 px-6 bg-[#f8fbfd] flex flex-col items-center">
      <div className="max-w-7xl w-full text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-[#33475B] mb-6 tracking-tight">Choose the plan that fits your team's growth stage.</h2>
        
        {/* Toggle */}
        <div className="flex items-center justify-center gap-6 mt-12 w-full max-w-sm mx-auto">
          <span className={`text-lg font-bold transition-colors ${annual ? 'text-slate-400' : 'text-[#33475B]'}`}>Monthly</span>
          <button 
            onClick={() => setAnnual(!annual)}
            className="w-16 h-8 rounded-full bg-[#33475B] relative flex items-center px-1 transition-colors cursor-pointer shrink-0"
          >
            <motion.div 
              className="w-6 h-6 rounded-full bg-white shadow-sm"
              animate={{ x: annual ? 32 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <div className="flex items-center gap-3">
            <span className={`text-lg font-bold transition-colors ${annual ? 'text-[#33475B]' : 'text-slate-400'}`}>Annually</span>
            <span className="bg-[#FF7A59] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide shrink-0">Save 20%</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 md:items-stretch gap-6 lg:gap-8 mt-8">
        
        {/* Starter */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-soft border border-slate-100 flex flex-col relative mt-8 md:mt-12 group hover:shadow-card transition-shadow cursor-default z-0">
          <h3 className="text-2xl font-black text-[#33475B] mb-2 tracking-tight">Starter</h3>
          <p className="text-sm text-slate-500 font-medium mb-8 pb-8 border-b border-slate-100">For small teams starting with AI.</p>
          <div className="flex items-baseline gap-1 mb-10">
            <span className="text-5xl font-black text-[#33475B] tracking-tighter">${annual ? '29' : '39'}</span>
            <span className="text-slate-500 font-semibold tracking-wide">/mo</span>
          </div>
          <ul className="space-y-5 mb-auto">
            {['1 Autonomous Agent', 'Up to 500 Leads/mo', 'Basic Integrations', 'Email Support'].map((ft, i) => (
              <li key={i} className="flex items-center gap-3 text-[#4a5568] font-medium text-[15px]">
                <CheckCircle2 className="w-5 h-5 text-[#FF7A59] shrink-0" /> {ft}
              </li>
            ))}
          </ul>
          <Link to="/signup" className="block text-center w-full py-4 mt-12 bg-slate-50 text-[#33475B] hover:bg-slate-100 transition-colors rounded-xl font-bold border border-slate-200 cursor-pointer text-[15px]">
            Start Free Trial
          </Link>
        </div>

        {/* Professional */}
        <div className="bg-[#33475B] rounded-[2rem] p-8 md:p-10 shadow-2xl relative flex flex-col scale-100 md:scale-105 z-10 border border-[#4a5568]">
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <span className="bg-[#FF7A59] text-white text-[11px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
              Most Popular
            </span>
          </div>
          <h3 className="text-2xl font-black text-white mb-2 mt-4 tracking-tight">Professional</h3>
          <p className="text-sm text-slate-300 font-medium mb-8 pb-8 border-b border-slate-600">For high-growth revenue teams.</p>
          <div className="flex items-baseline gap-1 mb-10">
            <span className="text-6xl font-black text-white tracking-tighter">${annual ? '99' : '119'}</span>
            <span className="text-slate-400 font-semibold tracking-wide">/mo</span>
          </div>
          <ul className="space-y-5 mb-auto">
            {['4 Specialized Agents', 'Unlimited Leads', 'Native CRM Sync', 'Priority Support', 'Meeting Intelligence'].map((ft, i) => (
              <li key={i} className="flex items-center gap-3 text-white font-medium text-[15px]">
                <CheckCircle2 className="w-5 h-5 text-[#FF7A59] shrink-0" /> {ft}
              </li>
            ))}
          </ul>
          <Link to="/signup" className="block text-center w-full py-4 mt-12 bg-[#FF7A59] text-white hover:bg-[#ff6a45] transition-colors rounded-xl font-bold shadow-lg cursor-pointer text-[15px]">
            Get Started
          </Link>
        </div>

        {/* Enterprise */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-soft border border-slate-100 flex flex-col relative mt-8 md:mt-12 group hover:shadow-card transition-shadow cursor-default z-0">
          <h3 className="text-2xl font-black text-[#33475B] mb-2 tracking-tight">Enterprise</h3>
          <p className="text-sm text-slate-500 font-medium mb-8 pb-8 border-b border-slate-100">For global sales organizations.</p>
          <div className="flex items-baseline gap-1 mb-10">
            <span className="text-5xl font-black text-[#33475B] tracking-tight">Custom</span>
          </div>
          <ul className="space-y-5 mb-auto">
            {['Custom Agent Training', 'Dedicated Success Manager', 'SLA & Security Audit', 'API Access', 'White-labeling'].map((ft, i) => (
              <li key={i} className="flex items-center gap-3 text-[#4a5568] font-medium text-[15px]">
                <CheckCircle2 className="w-5 h-5 text-[#FF7A59] shrink-0" /> {ft}
              </li>
            ))}
          </ul>
          <Link to="/signup" className="block text-center w-full py-4 mt-12 bg-slate-50 text-[#33475B] hover:bg-slate-100 transition-colors rounded-xl font-bold border border-slate-200 cursor-pointer text-[15px]">
            Contact Sales
          </Link>
        </div>

      </div>
    </section>
  );
}
