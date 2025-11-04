'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginRequestSchema } from '@/lib/validators/auth';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

export const useAuth = () => {
  const router = useRouter();
  const { login, logout, isAuthenticated } = useAuthStore((state) => ({
    login: state.login,
    logout: state.logout,
    isAuthenticated: state.isAuthenticated,
  }));

  const signIn = useCallback(
    async (credentials: unknown) => {
      const parsed = loginRequestSchema.parse(credentials);
      const { data } = await api.post('/users/login', parsed, {
        headers: { 'cache-control': 'no-store' },
      });
      login({
        tokenType: data.tokenType,
        token: data.token,
        refreshToken: data.refreshToken ?? null,
        expiresIn: data.expiresIn ?? null,
        user: data.user,
      });
      if (typeof document !== 'undefined') {
        document.cookie = `auth-token=${data.token}; path=/; sameSite=Lax`;
      }
      router.push('/clientes');
    },
    [login, router],
  );

  const signOut = useCallback(() => {
    logout();
    if (typeof document !== 'undefined') {
      document.cookie = 'auth-token=; path=/; max-age=0; sameSite=Lax';
    }
    router.push('/login');
  }, [logout, router]);

  return { signIn, signOut, isAuthenticated };
};
