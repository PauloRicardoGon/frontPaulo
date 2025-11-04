import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { enqueueRequest, buildQueueRequest } from './queue';
import { useAuthStore } from '@/stores/auth';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL,
  withCredentials: false,
});

type QueueableMethods = 'post' | 'put' | 'delete';

const shouldQueue = (config: AxiosRequestConfig): config is AxiosRequestConfig & {
  method: QueueableMethods;
} => {
  const method = (config.method ?? 'get').toLowerCase();
  return ['post', 'put', 'delete'].includes(method);
};

api.interceptors.request.use((config) => {
  const { token, tokenType } = useAuthStore.getState();
  if (token && tokenType) {
    config.headers = {
      ...config.headers,
      Authorization: `${tokenType} ${token}`,
    };
  }

  if (config.headers) {
    config.headers['cache-control'] = 'no-store';
  }

  return config;
});

const queueAndResolve = async (config: AxiosRequestConfig) => {
  const headers: Record<string, string> = {};
  Object.entries(config.headers ?? {}).forEach(([key, value]) => {
    if (typeof value === 'string') {
      headers[key] = value;
    }
  });

  const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

  await enqueueRequest(
    buildQueueRequest({
      url: `${config.baseURL ?? baseURL}${config.url}`,
      method: (config.method ?? 'post') as QueueableMethods,
      body,
      headers,
    }),
  );

  return {
    status: 202,
    statusText: 'Accepted (queued)',
    data: { queuedAt: dayjs().toISOString(), url: config.url },
    headers: {},
    config,
  } as AxiosResponse;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (typeof window !== 'undefined' && originalRequest && shouldQueue(originalRequest) && !navigator.onLine) {
      return queueAndResolve(originalRequest);
    }

    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      const store = useAuthStore.getState();
      if (!store.refreshToken) {
        store.logout();
        return Promise.reject(error);
      }

      try {
        (originalRequest as any)._retry = true;
        const refreshResponse = await axios.post(
          `${baseURL}/users/refresh`,
          { token: store.token, refreshToken: store.refreshToken },
          { headers: { 'cache-control': 'no-store' } },
        );

        store.login({
          tokenType: 'Bearer',
          token: refreshResponse.data.token,
          refreshToken: refreshResponse.data.refreshToken ?? store.refreshToken,
          expiresIn: refreshResponse.data.expiresIn ?? store.expiresIn ?? null,
          user: store.user!,
        });

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${refreshResponse.data.token}`,
        };

        return api(originalRequest);
      } catch (refreshError) {
        store.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { api };
