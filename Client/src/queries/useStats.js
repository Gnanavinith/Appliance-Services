import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/stats.api';

export const useStats = (role, filters = {}) => {
  return useQuery({
    queryKey: ['stats', role, filters],
    queryFn: () => statsApi.getStats(role, filters),
  });
};

export const useDashboardMetrics = (role) => {
  return useQuery({
    queryKey: ['dashboard-metrics', role],
    queryFn: () => statsApi.getDashboardMetrics(role),
  });
};
