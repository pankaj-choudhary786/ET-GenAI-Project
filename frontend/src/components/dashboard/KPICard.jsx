import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

export default function KPICard({ label, value, trend, isPositive = true, colorClass = "text-[#00A4BD]" }) {
  return (
    <div className="bg-white border text-left border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-sm font-semibold text-slate-500 mb-2">{label}</h4>
      <div className="flex items-end justify-between">
        <span className={clsx("text-3xl font-bold font-mono tracking-tight", colorClass)}>{value}</span>
        {trend && (
          <div className={clsx(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md",
            isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}%
          </div>
        )}
      </div>
    </div>
  );
}
