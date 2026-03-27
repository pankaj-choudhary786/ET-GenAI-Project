import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({ 
  placeholder = "Search...", 
  onChange, 
  delay = 300,
  className = ""
}) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) onChange(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay, onChange]);

  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input 
        type="text" 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder} 
        className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A4BD]/50 focus:border-[#00A4BD] transition-all text-slate-800 placeholder:text-slate-400"
      />
      {value && (
        <button 
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
