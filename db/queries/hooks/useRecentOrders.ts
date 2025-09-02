import { useState, useEffect } from 'react';
import { RecentOrders, statsService } from '../dasboard.query';

export interface UseRecentOrdersReturn {
  data: RecentOrders | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export default function useRecentOrders(): UseRecentOrdersReturn {
  const [data, setData] = useState<RecentOrders | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await statsService.getRecentOrders();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}


