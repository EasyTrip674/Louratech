import { useState, useEffect } from 'react';
import { ClientServiceData, statsService } from '../dasboard.query';

export interface UseClientServiceDataReturn {
  data: ClientServiceData | null;
  loading: boolean;
  error: string | null;
  refetch: (timeRange?: 'month' | 'year' | 'all') => Promise<void>;
  setTimeRange: (timeRange: 'month' | 'year' | 'all') => void;
  timeRange: 'month' | 'year' | 'all';
}

export default function useClientServiceData(initialTimeRange: 'month' | 'year' | 'all' = 'all'): UseClientServiceDataReturn {
  const [data, setData] = useState<ClientServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRangeState] = useState<'month' | 'year' | 'all'>(initialTimeRange);

  const fetchData = async (range?: 'month' | 'year' | 'all') => {
    try {
      setLoading(true);
      setError(null);
      const currentRange = range || timeRange;
      const result = await statsService.getClientServiceData(currentRange);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const setTimeRange = (newTimeRange: 'month' | 'year' | 'all') => {
    setTimeRangeState(newTimeRange);
    fetchData(newTimeRange);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData, setTimeRange, timeRange };
}


