import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Drawer({ isOpen, onClose, title, children, width = 'w-[500px]' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        />
        
        {/* Drawer Panel */}
        <motion.div 
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`relative ${width} bg-white shadow-2xl h-full flex flex-col border-l border-slate-100`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800 tracking-tight">{title}</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
