import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      loginWithToken(token).then((res) => {
        if (res.success) {
          if (res.user?.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/app/dashboard', { replace: true });
          }
        } else {
          navigate('/signin', { replace: true });
        }
      });
    } else {
      navigate('/signin', { replace: true });
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#00A4BD] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium animate-pulse">Authenticating...</p>
      </div>
    </div>
  );
}