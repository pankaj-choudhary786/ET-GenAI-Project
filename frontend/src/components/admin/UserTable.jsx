import React, { useState } from 'react';
import Avatar from '../ui/Avatar';
import clsx from 'clsx';
import { MoreHorizontal, Download, Filter } from 'lucide-react';
import { useAdminUsers } from '../../hooks/useAdminUsers';

function StatusBadge({ status }) {
  return (
    <span className={clsx(
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
      status === 'active' ? "bg-emerald-100 text-emerald-700" :
      status === 'inactive' ? "bg-slate-100 text-slate-600" :
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
      {plan || 'Free'}
    </span>
  );
}

export default function UserTable({ showControls = false }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { users, pagination, loading } = useAdminUsers(page, 10, search);

  const handleSearchChange = (e) => {
      setSearch(e.target.value);
      setPage(1); // reset to page 1 on search
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in relative">
      
      {loading && (
           <div className="absolute inset-x-0 bottom-0 top-16 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
             <div className="w-8 h-8 rounded-full border-4 border-[#00A4BD]/30 border-t-[#00A4BD] animate-spin"></div>
           </div>
      )}

      {showControls && (
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={search}
              onChange={handleSearchChange}
              className="w-72 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00A4BD] outline-none" 
            />
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
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              {showControls && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} size="sm" />
                    <div>
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">{user.company || '-'}</td>
                <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                <td className="px-6 py-4 capitalize font-medium text-slate-600">{user.role}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{new Date(user.createdAt).toLocaleDateString()}</td>
                {showControls && (
                    <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-[#00A4BD] hover:bg-[#00A4BD]/10 rounded transition-colors inline-block">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    </td>
                )}
              </tr>
            ))}
            {users.length === 0 && !loading && (
                <tr>
                    <td colSpan={showControls ? 6 : 5} className="px-6 py-8 text-center text-slate-500">No users found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {showControls && pagination && (
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white text-sm">
           <span className="text-slate-500 font-medium">Showing {users.length} of {pagination.total} users</span>
           <div className="flex gap-1">
              <button 
                 onClick={() => setPage(Math.max(1, page - 1))}
                 disabled={page === 1}
                 className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium disabled:opacity-50 hover:bg-slate-50"
              >
                  Prev
              </button>
              <button className="px-3 py-1.5 border border-[#00A4BD] bg-[#00A4BD] rounded-md text-white font-bold">{page}</button>
              <button 
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.pages}
                  className="px-3 py-1.5 border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                  Next
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
