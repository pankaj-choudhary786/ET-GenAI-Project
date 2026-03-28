import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../components/auth/AuthCard';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import InputField from '../../components/auth/InputField';
import PasswordInput from '../../components/auth/PasswordInput';
import AlertBanner from '../../components/auth/AlertBanner';
import { useStore } from '../../store/useStore';
import client from '../../api/client';

export default function SignUp() {
  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '', terms: false });
  const [errorBanner, setErrorBanner] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirm) {
        setErrorBanner('Please fill in all fields.');
        return;
    }
    if (formData.password !== formData.confirm) {
        setErrorBanner('Passwords do not match.');
        return;
    }
    if (!formData.terms) {
        setErrorBanner('You must agree to the Terms of Service.');
        return;
    }

    setLoading(true);
    try {
      const { data } = await client.post('/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('salesai_token', data.token);
      setUser(data.user);

      navigate('/app/dashboard');
    } catch (err) {
      setErrorBanner(err.response?.data?.message || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <AuthCard 
      title="Create your account" 
      subtitle="Your AI sales agent is ready to work."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <AlertBanner message={errorBanner} />

        <GoogleAuthButton onClick={handleGoogleAuth} />
        
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium bg-white px-2">or continue with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>
        
        <InputField 
          label="Full Name" 
          placeholder="Jane Doe" 
          value={formData.name}
          onChange={(e) => {
              setFormData({...formData, name: e.target.value});
              if(errorBanner) setErrorBanner('');
          }}
        />
        
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
        
        <PasswordInput 
          label="Password" 
          placeholder="••••••••" 
          value={formData.password}
          onChange={(e) => {
              setFormData({...formData, password: e.target.value});
              if(errorBanner) setErrorBanner('');
          }}
        />
        
        <PasswordInput 
          label="Confirm Password" 
          placeholder="••••••••" 
          value={formData.confirm}
          onChange={(e) => {
              setFormData({...formData, confirm: e.target.value});
              if(errorBanner) setErrorBanner('');
          }}
        />

        <div className="flex items-start gap-3 pt-1">
          <div className="flex items-center h-5 mt-0.5">
            <input 
              id="terms" 
              type="checkbox" 
              checked={formData.terms}
              onChange={(e) => {
                  setFormData({...formData, terms: e.target.checked});
                  if(errorBanner) setErrorBanner('');
              }}
              className="w-4 h-4 rounded border-slate-300 text-[#00A4BD] focus:ring-[#00A4BD]"
            />
          </div>
          <label htmlFor="terms" className="text-sm text-slate-600">
            I agree to the <a href="#" className="font-semibold text-[#00A4BD] hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-[#00A4BD] hover:underline">Privacy Policy</a>
          </label>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 px-4 bg-[#FF7A59] hover:bg-[#ff6a45] disabled:opacity-50 text-white font-bold rounded-lg shadow-sm shadow-[#ff7a59]/20 transition-all focus:ring-4 focus:ring-[#ff7a59]/30"
        >
          {loading ? 'Creating...' : 'Create account'}
        </button>
        
        <p className="text-center text-sm font-medium text-slate-600">
          Already have an account? <Link to="/signin" className="text-[#00A4BD] hover:underline hover:text-[#008f9c]">Sign in</Link>
        </p>
      </form>
    </AuthCard>
  );
}