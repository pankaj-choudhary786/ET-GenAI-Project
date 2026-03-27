import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Does NexusAI replace my current CRM?",
      a: "No. NexusAI is an intelligence layer that sits on top of your existing CRM (HubSpot, Salesforce, Pipedrive). It acts as a copilot, reading data and writing updates back to your CRM automatically without replacing your underlying system of record."
    },
    {
      q: "Is my customer data secure?",
      a: "Absolutely. We are SOC-2 Type II compliant and employ AES-256 encryption. We never use your proprietary pipeline data to train our foundational models. Your data remains completely isolated and secure within your tenant."
    },
    {
      q: "How reliable are the AI-generated emails?",
      a: "Our Prospecting and Recovery Agents don't just 'guess' what to say. They use your closed-won historical emails as a baseline, combining them with real-time web scrapes to ensure the messaging framework matches your top-performing reps."
    },
    {
      q: "Can I review the automated actions before they fire?",
      a: "Yes. By default, NexusAI runs in 'Copilot Mode' requiring a human click to approve emails, pipeline movements, and interventions. Once you build trust, you can switch specific campaigns to 'Autopilot Mode' for full automation."
    },
    {
      q: "How long does implementation take?",
      a: "Most teams are fully integrated within 5 minutes. You simply authenticate via OAuth to your CRM, and our agents immediately begin indexing your historical data. Meaningful insights populate identically within 24 hours."
    }
  ];

  return (
    <section className="w-full py-32 px-6 bg-[#fcfdfe] flex flex-col items-center">
      <div className="max-w-3xl w-full text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-[#33475B] mb-6 tracking-tight">Frequently asked questions</h2>
        <p className="text-xl text-slate-500 font-light leading-relaxed">Everything you need to know about the product and billing.</p>
      </div>

      <div className="max-w-3xl w-full flex flex-col gap-4 relative z-10">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className={`border ${isOpen ? 'border-[#00A4BD] bg-white shadow-card' : 'border-slate-200 bg-white shadow-sm hover:border-[#00A4BD]'} rounded-2xl overflow-hidden transition-all duration-300`}
            >
              <button 
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="w-full px-8 py-6 flex justify-between items-center text-left focus:outline-none cursor-pointer group"
              >
                <span className={`text-lg font-bold ${isOpen ? 'text-[#00A4BD]' : 'text-[#33475B] group-hover:text-[#00A4BD]'} pr-8 transition-colors`}>{faq.q}</span>
                <div className={`p-2 rounded-full shrink-0 transition-colors ${isOpen ? 'bg-[#00A4BD]/10 text-[#00A4BD]' : 'bg-slate-50 text-slate-400 group-hover:bg-[#00A4BD]/5 group-hover:text-[#00A4BD]'}`}>
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 text-[#4a5568] leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
