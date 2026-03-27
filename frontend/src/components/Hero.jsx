import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="w-full pt-16 pb-20 px-6 bg-[#F5F8FA] flex flex-col items-center overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-start z-10 mt-12 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[#00A4BD] text-xs font-bold mb-6 tracking-wide shadow-sm"
          >
            <span className="bg-[#FF7A59] text-white px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider mr-1">New</span>
            AI Revenue Retention Agent
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-[4rem] font-black tracking-tight text-[#33475B] mb-6 leading-[1.1]"
          >
            The #1 CRM Platform for <span className="text-[#00A4BD]">Scaling Teams.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[#4a5568] max-w-xl mb-10 leading-relaxed font-normal"
          >
            NexusAI sits natively on top of your existing CRM. Our autonomous agents automatically prospect, negotiate, and predict churn—so your reps only spend time closing.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto"
          >
            <Link to="/signup" className="px-8 py-4 bg-[#FF7A59] text-white rounded font-bold text-lg hover:bg-[#ff6a45] transition-all shadow-md flex justify-center items-center gap-2 hover:-translate-y-0.5">
              Get started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/signup" className="px-8 py-4 bg-white border border-slate-300 text-[#33475B] rounded font-bold text-lg hover:bg-slate-50 transition-all flex justify-center items-center">
              Contact Sales
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 text-[#4a5568] text-sm font-medium"
          >
            <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#00A4BD]" /> No credit card required</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#00A4BD]" /> Setup in 5 minutes</span>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-0 w-full rounded-2xl shadow-2xl overflow-hidden border border-slate-200 bg-white"
        >
          {/* Subtle browser window decoration */}
          <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
          </div>
          <img src="/crm_dashboard.png" alt="NexusAI Dashboard" className="w-full h-auto block object-cover" />
        </motion.div>
      </div>
    </section>
  );
}
