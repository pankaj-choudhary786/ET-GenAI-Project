import { useState, useEffect } from 'react';
import client from '../api/client';
import { useStore } from '../store/useStore';

export function useBattlecards() {
  const [battlecards, setBattlecards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToast = useStore(state => state.addToast);

  const fetchBattlecards = async () => {
    try {
      setLoading(true);
      const { data } = await client.get(`/api/battlecards`);
      setBattlecards(data.battlecards);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load battlecards';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBattlecards(); }, []);

  return { battlecards, loading, error, refetch: fetchBattlecards };
}
