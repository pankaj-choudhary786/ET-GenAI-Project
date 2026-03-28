import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

export default function RiskMiniTable({ accounts = [], loading = false }) {
  // We'll show the top 5 highest churn score accounts here
  const riskyAccounts = accounts
    .sort((a, b) => b.churnScore - a.churnScore)
    .slice(0, 5);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden col-span-full">
      <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 tracking-tight flex items-center gap-2 text-left">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          High-Risk Accounts
        </h3>
        <Link to="/app/retention" className="text-sm font-semibold text-[#00A4BD] hover:text-[#008f9c] hover:underline transition-colors pb-0.5 border-b border-transparent hover:border-[#008f9c]">
          View all risk signals
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3 border-b border-slate-200 border-r border-slate-100">Company</th>
              <th className="px-6 py-3 border-b border-slate-200 border-r border-slate-100">Contract Value</th>
              <th className="px-6 py-3 border-b border-slate-200 border-r border-slate-100">Churn Risk Score</th>
              <th className="px-6 py-3 border-b border-slate-200">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-400 font-medium">Loading high-risk data...</td>
              </tr>
            )}
            {!loading && riskyAccounts.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-400 font-medium italic">No high-risk accounts detected.</td>
              </tr>
            )}
            {!loading && riskyAccounts.map((acc) => (
              <tr key={acc._id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-semibold text-slate-800 border-r border-slate-100">{acc.companyName}</td>
                <td className="px-6 py-4 text-slate-600 font-medium border-r border-slate-100 tracking-tight">${acc.contractValue?.toLocaleString()}</td>
                <td className="px-6 py-4 border-r border-slate-100">
                  <div className={clsx(
                    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold",
                    acc.churnScore > 75 ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                  )}>
                    {acc.churnScore}/100
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-wider text-[10px]">
                  {acc.interventionStatus === 'none' ? 'Monitoring' : acc.interventionStatus.replace('_', ' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
