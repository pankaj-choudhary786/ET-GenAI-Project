import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

const RISKY_DEALS = [];

export default function RiskMiniTable() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden col-span-full">
      <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 tracking-tight flex items-center gap-2 text-left">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          At-Risk Pipeline
        </h3>
        <Link to="/app/pipeline" className="text-sm font-semibold text-[#00A4BD] hover:text-[#008f9c] hover:underline transition-colors pb-0.5 border-b border-transparent hover:border-[#008f9c]">
          View all deals
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3 border-b border-slate-200 border-r border-slate-100">Company</th>
              <th className="px-6 py-3 border-b border-slate-200 border-r border-slate-100">Deal Value</th>
              <th className="px-6 py-3 border-b border-slate-200 border-r border-slate-100">Risk Score</th>
              <th className="px-6 py-3 border-b border-slate-200">AI Flag Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {RISKY_DEALS.map((deal) => (
              <tr key={deal.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-semibold text-slate-800 border-r border-slate-100">{deal.company}</td>
                <td className="px-6 py-4 text-slate-600 font-medium border-r border-slate-100 tracking-tight">{deal.value}</td>
                <td className="px-6 py-4 border-r border-slate-100">
                  <div className={clsx(
                    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold",
                    deal.status === 'critical' ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                  )}>
                    {deal.score}/100
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{deal.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
