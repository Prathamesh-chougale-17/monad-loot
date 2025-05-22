import type { ReactNode } from 'react';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster />
      <footer className="py-6 text-center text-muted-foreground border-t border-border/50">
        <p>&copy; {new Date().getFullYear()} Monad Loot. All rights reserved (not really).</p>
      </footer>
    </div>
  );
}
