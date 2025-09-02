import { useState, useEffect } from 'react';
import { MonthlyTargetStats, ChartData, ClientServiceData, RecentOrders, statsService } from '../dasboard.query';

export interface DashboardData {
  monthlyTargetStats: MonthlyTargetStats;
  monthlySalesData: ChartData;
  statisticsData: ChartData;
  clientServiceData: ClientServiceData;
  recentOrders: RecentOrders;
}

export interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: (timeRange?: 'month' | 'year' | 'all') => Promise<void>;
  setTimeRange: (timeRange: 'month' | 'year' | 'all') => void;
  timeRange: 'month' | 'year' | 'all';
}

export default function useDashboardData(initialTimeRange: 'month' | 'year' | 'all' = 'all'): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRangeState] = useState<'month' | 'year' | 'all'>(initialTimeRange);

  const fetchData = async (range?: 'month' | 'year' | 'all') => {
    try {
      setLoading(true);
      setError(null);
      const currentRange = range || timeRange;
      const result = await statsService.getAllDashboardData(currentRange);
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


