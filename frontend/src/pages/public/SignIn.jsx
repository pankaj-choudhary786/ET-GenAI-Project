import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../components/auth/AuthCard';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import InputField from '../../components/auth/InputField';
import PasswordInput from '../../components/auth/PasswordInput';
import AlertBanner from '../../components/auth/AlertBanner';
import { useStore } from '../../store/useStore';
import client from '../../api/client';

export default function SignIn() {
  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [errorBanner, setErrorBanner] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorBanner('Please enter your email and password.');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await client.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('salesai_token', data.token);
      setUser(data.user);

      if (data.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/app/dashboard');
      }
    } catch (err) {
      setErrorBanner(err.response?.data?.message || 'Email or password is incorrect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <AuthCard 
      title="Welcome back" 
      subtitle="Your agent has been working while you were away."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <AlertBanner message={errorBanner} />

        <GoogleAuthButton onClick={handleGoogleAuth} />

        <button 
          type="button"
          onClick={async () => {
            setLoading(true);
            try {
              const { data } = await client.post('/api/auth/demo-login');
              localStorage.setItem('salesai_token', data.token);
              setUser(data.user);
              navigate('/app/dashboard');
            } catch (err) {
              setErrorBanner('Problem loading demo mode. Please try again.');
            } finally {
              setLoading(false);
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-lg shadow-sm transition-all"
        >
          🚀 Continue in Demo Mode (For Judges)
        </button>
        
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
          disabled={loading}
          className="w-full py-3 px-4 bg-[#FF7A59] hover:bg-[#ff6a45] disabled:opacity-50 text-white font-bold rounded-lg shadow-sm shadow-[#ff7a59]/20 transition-all focus:ring-4 focus:ring-[#ff7a59]/30"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        
        <p className="text-center text-sm font-medium text-slate-600 pt-2">
          Don't have an account? <Link to="/signup" className="text-[#00A4BD] hover:underline hover:text-[#008f9c]">Sign up</Link>
        </p>
      </form>
    </AuthCard>
  );
}