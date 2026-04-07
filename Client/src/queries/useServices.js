import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/services.api';

export const useServices = (filters = {}) => {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => servicesApi.getServices(filters),
  });
};

export const useService = (serviceId) => {
  return useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => servicesApi.getService(serviceId),
    enabled: !!serviceId,
  });
};
