import { useState, useEffect } from 'react';
import client from '../api/client';
import { useStore } from '../store/useStore';

export function useAdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToast = useStore(state => state.addToast);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await client.get(`/api/admin/stats`);
      setStats(data.stats);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load admin stats';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return { stats, loading, error, refetch: fetchStats };
}
