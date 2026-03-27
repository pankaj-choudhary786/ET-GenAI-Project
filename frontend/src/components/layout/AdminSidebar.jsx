import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Database,
  Settings 
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Agent Activity', path: '/admin/agents', icon: Activity },
  { name: 'Data Sources', path: '/admin/data-sources', icon: Database },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-orange-50 via-amber-50/30 to-white border-r border-orange-100 h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-orange-200/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-[#FF7A59] flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-orange-950">Nexus Admin</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
        <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 px-3">System Control</div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
              isActive 
                ? "bg-gradient-to-r from-orange-500 to-[#FF7A59] text-white shadow-md shadow-orange-200" 
                : "text-slate-600 hover:bg-white hover:text-orange-900 border border-transparent hover:border-orange-100 hover:shadow-sm"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
        
        <div className="mt-6 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 px-3">Configuration</div>
        <NavLink
            to="/app/settings"
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
              isActive 
                ? "bg-gradient-to-r from-orange-500 to-[#FF7A59] text-white shadow-md shadow-orange-200" 
                : "text-slate-600 hover:bg-white hover:text-orange-900 border border-transparent hover:border-orange-100 hover:shadow-sm"
            )}
          >
            <Settings className="w-5 h-5" />
            Settings
        </NavLink>
      </div>
      
      <div className="p-4 border-t border-orange-200/50">
        <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-orange-100 shadow-sm hover:shadow transition-shadow cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF7A59] to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-orange-950">System Admin</span>
            <span className="text-xs font-medium text-orange-500">Root Access</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
