
'use client';

import { useState, useEffect } from 'react';
import LootItemCard from '@/components/LootItemCard';
import type { LootItem } from '@/types';
import { getCollectedLootFromLocalStorage, listLootItemForSaleInLocalStorage } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Inbox, RotateCcw, Tags } from 'lucide-react'; // Added Tags for list button
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi'; // For getting owner address

export default function LootPage() {
  const [myLoot, setMyLoot] = useState<LootItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { address } = useAccount();

  const loadLoot = () => {
    setIsLoading(true);
    const loot = getCollectedLootFromLocalStorage();
    // Filter to show only items owned by the current user, or items without an ownerAddress (legacy items)
    const userLoot = loot.filter(item => !item.ownerAddress || item.ownerAddress === address);
    setMyLoot(userLoot.sort((a, b) => b.timestamp - a.timestamp));
    setIsLoading(false);
  };

  useEffect(() => {
    if (address) { // Only load loot if address is available
      loadLoot();
    } else {
      // Handle case where wallet is not connected or address is not yet available
      // You might want to set myLoot to empty or show a message
      setMyLoot([]);
      setIsLoading(false); 
    }
  }, [address]); // Reload loot when address changes

  const handleListForSale = (item: LootItem) => {
    const price = Math.floor(Math.random() * (500 - 10 + 1)) + 10; // Random price for simulation
    listLootItemForSaleInLocalStorage(item, price);
    toast({
      title: 'Item Listed!',
      description: `${item.name} has been listed for ${price} MND (simulated).`,
      className: 'bg-primary text-primary-foreground border-primary',
    });
    loadLoot(); // Refresh the loot list
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <RotateCcw className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading your treasures...</p>
      </div>
    );
  }
  
  if (!address) {
     return (
      <div className="text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center">
        <Inbox className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-primary">Connect Your Wallet</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Please connect your wallet to view your collected loot.
        </p>
        {/* Optionally, add a connect button here if not in header, or direct to header */}
      </div>
    );
  }

  if (myLoot.length === 0) {
    return (
      <div className="text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center">
        <Inbox className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-primary">Your Loot Cache is Empty</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Looks like you haven't unlocked any loot yet.
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/">Find Some Loot!</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">My Collected Loot</h1>
        <Button onClick={loadLoot} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" /> Refresh Loot
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {myLoot.map((item) => (
          <LootItemCard 
            key={item.id} 
            item={item} 
            showListButton={true} 
            onListForSale={handleListForSale}
          />
        ))}
      </div>
    </div>
  );
}
