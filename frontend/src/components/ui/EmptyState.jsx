import React from 'react';
import { DatabaseBackup } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = DatabaseBackup, 
  title = "No data to display", 
  description = "Get started by creating your first record.", 
  action 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 w-full h-full">
      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
