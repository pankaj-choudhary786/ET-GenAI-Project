import { useState, useEffect } from 'react';
import client from '../api/client';
import { useStore } from '../store/useStore';

export function useAgentFeed(filters = {}) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToast = useStore(state => state.addToast);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const { data } = await client.get(`/api/feed?${params}`);
      setFeed(data.events);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load event feed';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeed(); }, [JSON.stringify(filters)]);

  return { feed, loading, error, refetch: fetchFeed };
}
