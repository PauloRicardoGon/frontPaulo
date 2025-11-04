import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'App Assistência Técnica',
  description:
    'PWA para gestão de clientes, equipamentos e ordens de serviço, com funcionamento offline.',
  manifest: '/manifest.webmanifest',
  themeColor: '#3E2A78',
};

export const viewport: Viewport = {
  themeColor: '#3E2A78',
  backgroundColor: '#ffffff',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="pt-BR" className={inter.variable}>
    <body className="min-h-screen bg-neutral-100 text-neutral-900 antialiased">
      {children}
    </body>
  </html>
);

export default RootLayout;
