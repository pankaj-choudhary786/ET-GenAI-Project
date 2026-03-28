import { useState, useEffect } from 'react';
import client from '../api/client';
import { useStore } from '../store/useStore';

export function useAdminUsers(filters = {}) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToast = useStore(state => state.addToast);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const { data } = await client.get(`/api/admin/users?${params}`);
      setUsers(data.users);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalCount: data.totalCount
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load users';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [JSON.stringify(filters)]);

  return { users, pagination, loading, error, refetch: fetchUsers };
}
