
'use client';

import { useState, useEffect } from 'react';
import MarketplaceItemCard from '@/components/MarketplaceItemCard';
import type { LootItem } from '@/types';
import { getCollectedLootFromLocalStorage, buyLootItemFromMarketplaceInLocalStorage } from '@/lib/localStorage'; // Updated import
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, RotateCcw, SearchX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi'; // For getting buyer address

// Helper function to generate a random price
const getRandomPrice = () => Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

export default function MarketplacePage() {
  const [marketItems, setMarketItems] = useState<LootItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();

  const loadMarketplaceItems = () => {
    setIsLoading(true);
    // For the marketplace, we should load items specifically listed for sale.
    // The current `getCollectedLootFromLocalStorage` fetches all items regardless of listing status.
    // We'll keep using it for now, but in a real marketplace, you'd fetch from a dedicated "for sale" list.
    // The `listLootItemForSaleInLocalStorage` function already moves items to a separate (simulated) list,
    // so ideally we'd fetch from `getMarketplaceListedItemsFromLocalStorage` here.
    // However, for simplicity and to match previous behavior of showing ALL collected items, we'll use this.
    // We'll still rely on the `price` field to differentiate.
    const allLoot = getCollectedLootFromLocalStorage(); 
    const itemsForSale = allLoot.filter(item => item.price !== undefined); // Only show items with a price (listed)
    
    // If items don't have a price (e.g., directly from generation without listing), assign one
    const itemsWithPrices = itemsForSale.map(item => ({
      ...item,
      price: item.price || getRandomPrice(), 
    }));
    
    setMarketItems(itemsWithPrices.sort((a, b) => b.timestamp - a.timestamp));
    setIsLoading(false);
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  const handleBuyItem = (item: LootItem) => {
    if (!isConnected || !address) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to buy items.',
        variant: 'destructive',
      });
      return;
    }

    const boughtItem = buyLootItemFromMarketplaceInLocalStorage(item, address);

    if (boughtItem) {
      toast({
        title: 'Purchase Successful!',
        description: `You bought ${boughtItem.name}! It's now in your loot.`,
        className: 'bg-primary text-primary-foreground border-primary',
      });
      loadMarketplaceItems(); // Refresh marketplace
      // Potentially trigger a refresh on the /loot page if the user navigates there
    } else {
      toast({
        title: 'Purchase Failed',
        description: 'Could not complete the purchase. The item might no longer be available.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <RotateCcw className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading marketplace treasures...</p>
      </div>
    );
  }
  
  if (!isConnected) {
     return (
      <div className="text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center">
        <ShoppingCart className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-primary">Connect Your Wallet</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Please connect your wallet to browse and buy NFTs.
        </p>
      </div>
    );
  }

  if (marketItems.length === 0) {
    return (
      <div className="text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center">
        <SearchX className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-primary">Marketplace is Quiet</h1>
        <p className="text-lg text-muted-foreground mb-6">
          No NFTs are currently listed for sale. Check back soon or list one from your collection!
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/loot">List Your Loot</Link>
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
        Note: Marketplace interactions are simulated using local storage.
      </p>
    </div>
  );
}
