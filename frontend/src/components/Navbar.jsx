import React from 'react';
import { Network, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-200 px-6 tracking-wide h-[72px] flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-12 h-full">
        <div className="flex items-center gap-2 cursor-pointer h-full">
          <Network className="w-8 h-8 text-[#FF7A59]" />
          <span className="text-2xl font-black text-[#2d3748] tracking-tight">NexusAI</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-[#4a5568] h-full">
          <div className="flex items-center gap-1 hover:text-[#00A4BD] cursor-pointer transition-colors h-full">
            Software <ChevronDown className="w-4 h-4 mt-0.5" />
          </div>
          <div className="flex items-center gap-1 hover:text-[#00A4BD] cursor-pointer transition-colors h-full">
            Pricing
          </div>
          <div className="flex items-center gap-1 hover:text-[#00A4BD] cursor-pointer transition-colors h-full">
            Resources <ChevronDown className="w-4 h-4 mt-0.5" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/signup" className="hidden md:block text-[#00A4BD] font-bold text-[15px] hover:text-[#33475B] transition-colors cursor-pointer">
          Contact Sales
        </Link>
        <Link to="/signup" className="px-6 py-3 rounded bg-[#FF7A59] text-white font-bold text-[15px] hover:bg-[#ff6a45] transition-all shadow-md cursor-pointer">
          Get started free
        </Link>
      </div>
    </nav>
  );
}
