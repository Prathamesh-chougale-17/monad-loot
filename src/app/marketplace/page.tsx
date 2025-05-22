
'use client';

import { useState, useEffect } from 'react';
import MarketplaceItemCard from '@/components/MarketplaceItemCard';
import type { LootItem } from '@/types';
import { getCollectedLoot } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, RotateCcw, SearchX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper function to generate a random price
const getRandomPrice = () => Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

export default function MarketplacePage() {
  const [marketItems, setMarketItems] = useState<LootItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadMarketplaceItems = () => {
    setIsLoading(true);
    const collectedLoot = getCollectedLoot();
    const itemsWithPrices = collectedLoot.map(item => ({
      ...item,
      // Assign a dynamic price if not already present (for simulation)
      // In a real app, price would be set when listing.
      price: item.price || getRandomPrice(), 
    }));
    // Sort by most recent first, or some other logic for a marketplace
    setMarketItems(itemsWithPrices.sort((a, b) => b.timestamp - a.timestamp));
    setIsLoading(false);
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  const handleBuyItem = (item: LootItem) => {
    console.log('Attempting to buy:', item);
    toast({
      title: 'Coming Soon!',
      description: `Buying ${item.name} is not yet implemented.`,
      className: 'bg-accent text-accent-foreground border-accent',
    });
    // In a real app, this would involve:
    // 1. Checking user balance
    // 2. Simulating a transaction with Monad
    // 3. Transferring ownership of the NFT
    // 4. Updating the item's status or removing it from the marketplace
    // 5. Adding it to the buyer's collection
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <RotateCcw className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading marketplace treasures...</p>
      </div>
    );
  }

  if (marketItems.length === 0) {
    return (
      <div className="text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center">
        <SearchX className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-primary">Marketplace is Quiet</h1>
        <p className="text-lg text-muted-foreground mb-6">
          No NFTs are currently listed for sale. Check back soon!
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/">Discover Some NFTs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" /> NFT Marketplace
        </h1>
        <Button onClick={loadMarketplaceItems} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" /> Refresh Listings
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {marketItems.map((item) => (
          <MarketplaceItemCard key={item.id} item={item} onBuy={handleBuyItem} />
        ))}
      </div>
       <p className="text-sm text-muted-foreground text-center pt-4">
        Note: Prices are simulated. Buying functionality is a placeholder.
      </p>
    </div>
  );
}
