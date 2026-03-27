import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../components/auth/AuthCard';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import InputField from '../../components/auth/InputField';
import PasswordInput from '../../components/auth/PasswordInput';
import AlertBanner from '../../components/auth/AlertBanner';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [errorBanner, setErrorBanner] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorBanner('Please enter your email and password.');
      return;
    }
    
    // Simulate API logic where user@admin.com goes to admin dashboard
    if (formData.email === 'admin@nexus.ai') {
      navigate('/admin/dashboard');
    } else if (formData.email === 'error@nexus.ai') {
      setErrorBanner('Email or password is incorrect. Please try again.');
    } else {
      navigate('/app/dashboard');
    }
  };

  return (
    <AuthCard 
      title="Welcome back" 
      subtitle="Your agent has been working while you were away."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <AlertBanner message={errorBanner} />

        <GoogleAuthButton onClick={() => navigate('/auth/callback')} />
        
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium bg-white px-2">or sign in with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>
        
        <div className="space-y-5">
          <InputField 
            label="Work Email" 
            type="email"
            placeholder="jane@company.com" 
            value={formData.email}
            onChange={(e) => {
              setFormData({...formData, email: e.target.value});
              if(errorBanner) setErrorBanner('');
            }}
          />
          
          <div className="relative">
            <PasswordInput 
              label="Password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                if(errorBanner) setErrorBanner('');
              }}
            />
            <Link 
              to="/forgot-password" 
              className="absolute right-0 top-0 text-sm font-semibold text-[#00A4BD] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input 
            id="remember" 
            type="checkbox" 
            checked={formData.remember}
            onChange={(e) => setFormData({...formData, remember: e.target.checked})}
            className="w-4 h-4 rounded border-slate-300 text-[#00A4BD] focus:ring-[#00A4BD]"
          />
          <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">
            Remember me for 30 days
          </label>
        </div>
        
        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-[#FF7A59] hover:bg-[#ff6a45] text-white font-bold rounded-lg shadow-sm shadow-[#ff7a59]/20 transition-all focus:ring-4 focus:ring-[#ff7a59]/30"
        >
          Sign in
        </button>
        
        <p className="text-center text-sm font-medium text-slate-600 pt-2">
          Don't have an account? <Link to="/signup" className="text-[#00A4BD] hover:underline hover:text-[#008f9c]">Sign up</Link>
        </p>
      </form>
    </AuthCard>
  );
}