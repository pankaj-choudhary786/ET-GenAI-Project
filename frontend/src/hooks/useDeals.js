import { useState, useEffect } from 'react';
import client from '../api/client';
import { useStore } from '../store/useStore';

export function useDeals(filters = {}) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToast = useStore(state => state.addToast);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const { data } = await client.get(`/api/deals?${params}`);
      setDeals(data.deals);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load deals';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchDeals(); 
  }, [JSON.stringify(filters)]);

  return { deals, loading, error, refetch: fetchDeals };
}
