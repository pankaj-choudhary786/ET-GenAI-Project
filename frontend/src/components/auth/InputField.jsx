import React from 'react';
import clsx from 'clsx';

export default function InputField({ label, error, className, ...props }) {
  return (
    <div className={clsx("flex flex-col gap-1.5 w-full", className)}>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input 
        className={clsx(
          "w-full px-4 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2",
          error 
            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30" 
            : "border-slate-200 focus:border-[#00A4BD] focus:ring-[#00A4BD]/20 bg-white hover:border-slate-300"
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
}
