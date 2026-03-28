import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import client from '../../api/client';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useStore(state => state.user);

  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));
        localStorage.setItem('salesai_token', token);
        useStore.getState().setUser(user);
        
        if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/app/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Error parsing user data in callback', err);
        navigate('/signin', { replace: true });
      }
    } else {
      navigate('/signin', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#00A4BD] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium animate-pulse">Authenticating...</p>
      </div>
    </div>
  );
}