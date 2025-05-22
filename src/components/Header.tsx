import Link from 'next/link';
import { Cube, Package } from 'lucide-react'; // Using Cube as a placeholder for Monad-like icon
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="py-4 px-6 border-b border-border/50 shadow-lg sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
          <Package size={28} />
          <span>Monad Loot</span>
        </Link>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/loot">My Loot</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
