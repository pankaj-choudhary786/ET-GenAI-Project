import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../../components/auth/AuthCard';
import InputField from '../../components/auth/InputField';
import AlertBanner from '../../components/auth/AlertBanner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSuccess(true);
    }
  };

  return (
    <AuthCard 
      title="Reset your password" 
      subtitle="We'll send you an email with a link to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        
        {success ? (
          <div className="space-y-6">
            <AlertBanner 
              type="success" 
              message="Check your email — we sent a reset link to your inbox." 
            />
            <div className="pt-2">
              <Link to="/signin" className="w-full flex justify-center py-3 px-4 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-all">
                Back to Sign in
              </Link>
            </div>
          </div>
        ) : (
          <>
            <InputField 
              label="Work Email" 
              type="email"
              placeholder="jane@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-[#00A4BD] hover:bg-[#008f9c] text-white font-bold rounded-lg shadow-sm shadow-[#00A4BD]/20 transition-all focus:ring-4 focus:ring-[#00A4BD]/30"
            >
              Send reset link
            </button>
            
            <p className="text-center text-sm font-medium text-slate-600 pt-2">
              Remember your password? <Link to="/signin" className="text-[#ff7a59] hover:underline">Back to sign in</Link>
            </p>
          </>
        )}
      </form>
    </AuthCard>
  );
}