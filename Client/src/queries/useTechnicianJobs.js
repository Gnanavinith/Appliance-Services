import { useQuery } from '@tanstack/react-query';
import { technicianApi } from '../api/technician.api';

export const useTechnicianJobs = (technicianId, filters = {}) => {
  return useQuery({
    queryKey: ['technician-jobs', technicianId, filters],
    queryFn: () => technicianApi.getTechnicianJobs(technicianId, filters),
    enabled: !!technicianId,
  });
};

export const useTodayJobs = (technicianId) => {
  return useQuery({
    queryKey: ['today-jobs', technicianId],
    queryFn: () => technicianApi.getTodayJobs(technicianId),
    enabled: !!technicianId,
  });
};
