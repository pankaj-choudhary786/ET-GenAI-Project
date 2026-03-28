import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Avatar from '../ui/Avatar';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  ShieldAlert, 
  Swords, 
  Mail, 
  Settings,
  LogOut
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Prospecting', path: '/app/prospecting', icon: Users },
  { name: 'Pipeline', path: '/app/pipeline', icon: BarChart3 },
  { name: 'Retention', path: '/app/retention', icon: ShieldAlert },
  { name: 'Battlecards', path: '/app/battlecards', icon: Swords },
  { name: 'Email Outbox', path: '/app/outbox', icon: Mail },
  { name: 'Settings', path: '/app/settings', icon: Settings },
];

export default function UserSidebar() {
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);
  const userName = user?.name || "User";

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] h-screen fixed left-0 top-0 flex flex-col z-20 shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0] bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF7A59] flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-[#33475B]">NexusAI</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
        <div className="text-xs font-bold text-[#7C98B6] uppercase tracking-wider mb-2 px-3">Main Menu</div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-[#FF7A59]/10 border-l-[3px] border-[#FF7A59] text-[#FF7A59]" 
                : "text-[#516F90] hover:bg-[#F5F8FA] border-l-[3px] border-transparent"
            )}
            style={({ isActive }) => ({
                paddingLeft: isActive ? '9px' : '12px'
            })}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F5F8FA]/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar user={user} size="sm" />
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-bold text-[#33475B] truncate">{userName}</span>
            <span className="text-xs text-[#7C98B6] truncate">{user?.email}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="mt-3 flex items-center gap-2 px-3 py-2 text-sm text-[#FF7A59] font-medium hover:bg-[#FF7A59]/10 rounded-md w-full transition-colors"
        >
          <LogOut className="w-4 h-4"/> Logout
        </button>
      </div>
    </aside>
  );
}
