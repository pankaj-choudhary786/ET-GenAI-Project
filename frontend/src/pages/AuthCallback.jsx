import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('salesai_token', token);
        setUser(decodedUser);
        navigate('/app/dashboard');
      } catch (err) {
        console.error('Failed to parse URL user param:', err);
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex bg-slate-50 items-center justify-center min-h-screen">
      <div className="animate-pulse flex items-center gap-2">
         <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
         <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
         <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}
