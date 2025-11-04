import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tecnico {
  idTecnico: number;
  email: string | null;
  celular: string | null;
}

export interface AuthUser {
  login: string;
  nome: string;
  tecnico: Tecnico;
}

export interface AuthState {
  tokenType: 'Bearer' | null;
  token: string | null;
  refreshToken?: string | null;
  expiresIn?: number | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: {
    tokenType: 'Bearer';
    token: string;
    refreshToken?: string | null;
    expiresIn?: number | null;
    user: AuthUser;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokenType: null,
      token: null,
      refreshToken: null,
      expiresIn: null,
      user: null,
      isAuthenticated: false,
      login: ({ tokenType, token, refreshToken, expiresIn, user }) =>
        set({
          tokenType,
          token,
          refreshToken: refreshToken ?? null,
          expiresIn: expiresIn ?? null,
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          tokenType: null,
          token: null,
          refreshToken: null,
          expiresIn: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'app-assistencia-auth',
      partialize: (state) => ({
        tokenType: state.tokenType,
        token: state.token,
        refreshToken: state.refreshToken ?? null,
        expiresIn: state.expiresIn ?? null,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
