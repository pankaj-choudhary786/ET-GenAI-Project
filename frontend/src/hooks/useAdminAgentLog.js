import { useState, useEffect } from 'react';
import client from '../api/client';
import { useStore } from '../store/useStore';

export function useAdminAgentLog(page = 1, limit = 50, search = '') {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToast = useStore(state => state.addToast);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search
      }).toString();
      
      const { data } = await client.get(`/api/admin/agent-log?${params}`);
      
      if (data.success) {
        setLogs(data.logs);
        setPagination({
          total: data.totalCount,
          pages: data.totalPages,
          current: data.currentPage
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load global agent logs';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, limit, search]);

  return { logs, pagination, loading, error, refetch: fetchLogs };
}
