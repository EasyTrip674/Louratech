import { useState, useEffect } from 'react';
import { ChartData, statsService } from '../dasboard.query';

export interface UseStatisticsDataReturn {
  data: ChartData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export default function useStatisticsData(): UseStatisticsDataReturn {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await statsService.getStatisticsData();
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


