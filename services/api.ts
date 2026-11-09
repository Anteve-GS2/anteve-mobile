import axios, { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import { getToken } from '@/storage/session';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
});

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const url = error.config?.url ?? '';
    if (error.response?.status === 401 && url !== ENDPOINTS.login) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);