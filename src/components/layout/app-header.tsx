'use client';

import { Menu, WifiOff } from 'lucide-react';
import { useUIStore } from '@/stores/ui';
import { useOnline } from '@/hooks/useOnline';
import { useQueue } from '@/hooks/useQueue';
import { Badge } from '@/components/ui/badge';

interface AppHeaderProps {
  title: string;
}

export const AppHeader = ({ title }: AppHeaderProps) => {
  const { setDrawerOpen } = useUIStore();
  const isOnline = useOnline();
  const { pending } = useQueue();

  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md border border-neutral-200 p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary md:hidden"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-neutral-800">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {!isOnline && (
          <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
            <WifiOff className="h-4 w-4" /> Você está offline
          </span>
        )}
        {pending > 0 && <Badge variant="warning">Fila: {pending}</Badge>}
      </div>
    </header>
  );
};
