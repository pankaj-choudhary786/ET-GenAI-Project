import { useState, useEffect } from 'react';
import client from '../api/client';
import { useStore } from '../store/useStore';

export function useProspects(filters = {}) {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToast = useStore(state => state.addToast);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const { data } = await client.get(`/api/prospects?${params}`);
      setProspects(data.prospects);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load prospects';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProspects(); 
  }, [JSON.stringify(filters)]);

  return { prospects, loading, error, refetch: fetchProspects };
}
