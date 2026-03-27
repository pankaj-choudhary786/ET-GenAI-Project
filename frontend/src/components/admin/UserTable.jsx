import React from 'react';
import Avatar from '../ui/Avatar';
import clsx from 'clsx';
import { MoreHorizontal, Download, Filter } from 'lucide-react';

const USERS = [];

function StatusBadge({ status }) {
  return (
    <span className={clsx(
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
      status === 'Active' ? "bg-emerald-100 text-emerald-700" :
      status === 'Inactive' ? "bg-slate-100 text-slate-600" :
      "bg-rose-100 text-rose-700"
    )}>
      {status}
    </span>
  );
}

function PlanBadge({ plan }) {
  return (
    <span className={clsx(
      "px-2 py-0.5 rounded text-xs font-bold border",
      plan === 'Enterprise' ? "bg-purple-50 text-purple-700 border-purple-200" :
      plan === 'Pro' ? "bg-blue-50 text-blue-700 border-blue-200" :
      "bg-slate-50 text-slate-600 border-slate-200"
    )}>
      {plan}
    </span>
  );
}

export default function UserTable({ showControls = false }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in">
      
      {showControls && (
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search users by name or email..." className="w-72 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00A4BD] outline-none" />
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg text-sm hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors shadow-sm">
             <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      )}

      {!showControls && (
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 tracking-tight">Recent Users</h3>
        </div>
      )}

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Emails Sent</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {USERS.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="sm" />
                    <div>
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><PlanBadge plan={user.plan} /></td>
                <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                <td className="px-6 py-4 font-mono text-slate-600">{user.emailsSent.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{user.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-[#00A4BD] hover:bg-[#00A4BD]/10 rounded transition-colors inline-block">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showControls && (
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white text-sm">
           <span className="text-slate-500 font-medium">Showing 0 users</span>
           <div className="flex gap-1">
              <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium disabled:opacity-50 hover:bg-slate-50">Prev</button>
              <button className="px-3 py-1.5 border border-[#00A4BD] bg-[#00A4BD] rounded-md text-white font-bold">1</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50">2</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50">3</button>
              <span className="px-2 py-1.5 text-slate-400">...</span>
              <button className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50">Next</button>
           </div>
        </div>
      )}
    </div>
  );
}
