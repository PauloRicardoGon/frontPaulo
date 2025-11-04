'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useSW } from '@/hooks/useSW';
import { AppDrawer } from './app-drawer';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  header?: React.ReactNode;
}

export const AppShell = ({ children, title, header }: AppShellProps) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const hasHydrated = ((useAuthStore as typeof useAuthStore & {
    persist?: { hasHydrated?: () => boolean };
  }).persist?.hasHydrated?.() ?? false);
  useSW();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <AppDrawer />
      <div className="md:pl-72">
        {header}
        <main className="p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            {title ? <h2 className="text-2xl font-semibold text-neutral-800">{title}</h2> : null}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
