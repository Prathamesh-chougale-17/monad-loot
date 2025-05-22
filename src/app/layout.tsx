import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import MainLayout from '@/components/layout/MainLayout';
import { FarcasterProvider } from '@/components/farcaster/FarcasterProvider';
import { EdgeStoreProvider } from '@/lib/edgestore-provider'; // Corrected path

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Monad Loot',
  description: 'Unlock mystery boxes and collect unique NFTs on the Monad ecosystem.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground bg-background`}>
        <EdgeStoreProvider>
          <FarcasterProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </FarcasterProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
