'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LogOut, Menu, Settings, Users, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/ui';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'Tela Inicial', icon: Home },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/equipamentos', label: 'Equipamentos', icon: Wrench },
];

export const AppDrawer = () => {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { isDrawerOpen, setDrawerOpen } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-72 transform bg-primary text-white shadow-lg transition-transform duration-200 ease-in-out',
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      )}
    >
      <div className="flex items-center justify-between px-6 py-6 text-lg font-semibold">
        <span>App Assistência</span>
        <button
          type="button"
          className="rounded-full p-1 text-white focus:outline-none focus:ring-2 focus:ring-white md:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <nav className="space-y-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium hover:bg-white/10',
                (pathname === item.href || pathname.startsWith(`${item.href}/`)) && 'bg-white/10',
              )}
              onClick={() => setDrawerOpen(false)}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-2 px-4 py-6 text-sm">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-4 py-3 font-medium hover:bg-white/10"
          onClick={() => {
            setDrawerOpen(false);
            signOut();
          }}
        >
          <LogOut className="h-5 w-5" />
          Sair do APP
        </button>
      </div>
    </aside>
  );
};
