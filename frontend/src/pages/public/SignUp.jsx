import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../components/auth/AuthCard';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import InputField from '../../components/auth/InputField';
import PasswordInput from '../../components/auth/PasswordInput';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '', terms: false });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Work email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Must be at least 8 characters";
    if (formData.password !== formData.confirm) newErrors.confirm = "Passwords do not match";
    if (!formData.terms) newErrors.terms = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    validate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simulate API call
      setTimeout(() => navigate('/app/dashboard'), 800);
    }
  };

  return (
    <AuthCard 
      title="Create your account" 
      subtitle="Your AI sales agent is ready to work."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <GoogleAuthButton onClick={() => navigate('/auth/callback')} />
        
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium bg-white px-2">or continue with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>
        
        <InputField 
          label="Full Name" 
          placeholder="Jane Doe" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          onBlur={() => handleBlur('name')}
          error={errors.name}
        />
        
        <InputField 
          label="Work Email" 
          type="email"
          placeholder="jane@company.com" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          onBlur={() => handleBlur('email')}
          error={errors.email}
        />
        
        <PasswordInput 
          label="Password" 
          placeholder="••••••••" 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          onBlur={() => handleBlur('password')}
          error={errors.password}
        />
        
        <PasswordInput 
          label="Confirm Password" 
          placeholder="••••••••" 
          value={formData.confirm}
          onChange={(e) => setFormData({...formData, confirm: e.target.value})}
          onBlur={() => handleBlur('confirm')}
          error={errors.confirm}
        />

        <div className="flex items-start gap-3 pt-1">
          <div className="flex items-center h-5 mt-0.5">
            <input 
              id="terms" 
              type="checkbox" 
              checked={formData.terms}
              onChange={(e) => setFormData({...formData, terms: e.target.checked})}
              className="w-4 h-4 rounded border-slate-300 text-[#00A4BD] focus:ring-[#00A4BD]"
            />
          </div>
          <label htmlFor="terms" className="text-sm text-slate-600">
            I agree to the <a href="#" className="font-semibold text-[#00A4BD] hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-[#00A4BD] hover:underline">Privacy Policy</a>
          </label>
        </div>
        {errors.terms && <span className="text-xs text-rose-500 font-medium">{errors.terms}</span>}
        
        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-[#FF7A59] hover:bg-[#ff6a45] text-white font-bold rounded-lg shadow-sm shadow-[#ff7a59]/20 transition-all focus:ring-4 focus:ring-[#ff7a59]/30"
        >
          Create account
        </button>
        
        <p className="text-center text-sm font-medium text-slate-600">
          Already have an account? <Link to="/signin" className="text-[#00A4BD] hover:underline hover:text-[#008f9c]">Sign in</Link>
        </p>
      </form>
    </AuthCard>
  );
}