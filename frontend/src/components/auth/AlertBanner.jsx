import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AlertBanner({ message, type = "error", className }) {
  if (!message) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 p-3.5 rounded-lg border text-sm font-medium ${
        type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
      } ${className}`}
    >
      <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`} />
      <div className="leading-snug">{message}</div>
    </motion.div>
  );
}
