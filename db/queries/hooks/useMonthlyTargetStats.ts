import { useState, useEffect } from 'react';
import { MonthlyTargetStats, statsService } from '../dasboard.query';

export interface UseMonthlyTargetStatsReturn {
  data: MonthlyTargetStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export default function useMonthlyTargetStats(): UseMonthlyTargetStatsReturn {
  const [data, setData] = useState<MonthlyTargetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await statsService.getMonthlyTargetStats();
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


