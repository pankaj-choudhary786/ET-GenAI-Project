import { useState, useEffect } from 'react';
import client from '../api/client';
import { useStore } from '../store/useStore';

export function useRetentionAccounts(filters = {}) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToast = useStore(state => state.addToast);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const { data } = await client.get(`/api/retention/accounts?${params}`);
      setAccounts(data.accounts);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load retention accounts';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAccounts(); 
  }, [JSON.stringify(filters)]);

  return { accounts, loading, error, refetch: fetchAccounts };
}
