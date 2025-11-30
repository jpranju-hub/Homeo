'use client';

import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { Login, Register } from '@homeo/shared';

export const useAuth = () => {
  const { setUser, setTokens, setError, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (data: Login) => {
      const response = await apiClient.post('/api/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      setTokens(data.data.accessToken, data.data.refreshToken);
      setError(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Register) => {
      const response = await apiClient.post('/api/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      setTokens(data.data.accessToken, data.data.refreshToken);
      setError(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
    logout,
  };
};
