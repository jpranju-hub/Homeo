'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export const usePatients = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['patients', page, limit],
    queryFn: async () => {
      const response = await apiClient.get('/api/patients', {
        params: { page, limit },
      });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePatient = (id: string | null) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get(`/api/patients/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
