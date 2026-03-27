import React, { useState } from 'react';
import { Bell, Search, LogOut, Settings, User } from 'lucide-react';
import Avatar from '../ui/Avatar';

export default function TopNavbar({ title = "Dashboard", userName = "John Doe" }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <h1 className="text-xl font-semibold text-slate-800 tracking-tight">{title}</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00A4BD] focus:border-transparent transition-all w-64 text-slate-800"
          />
        </div>
        
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
        </button>
        
        <div className="relative">
          <button 
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Avatar name={userName} size="sm" />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-slate-100 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-800">{userName}</p>
              </div>
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
