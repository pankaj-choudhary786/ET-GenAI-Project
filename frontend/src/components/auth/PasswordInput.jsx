import React, { useState } from 'react';
import InputField from './InputField';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput(props) {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative w-full">
      <InputField 
        type={show ? "text" : "password"} 
        {...props} 
      />
      <button 
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-[36px] -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
