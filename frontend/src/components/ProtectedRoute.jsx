import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const user = useStore(state => state.user);
  if (!user) return <Navigate to="/signin" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/app/dashboard" replace />;
  return children;
}
