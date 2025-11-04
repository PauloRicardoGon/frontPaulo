import type { Metadata } from 'next';
import { AppHeader } from '@/components/layout/app-header';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  title: 'Área interna | App Assistência Técnica',
};

const PrivateLayout = ({ children }: { children: React.ReactNode }) => (
  <AppShell header={<AppHeader title="App Assistência Técnica" />}>{children}</AppShell>
);

export default PrivateLayout;
