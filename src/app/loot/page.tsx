
"use client";

import { useState, useEffect } from "react";
import LootItemCard from "@/components/LootItemCard";
import type { LootItem } from "@/types";
import {
  getCollectedLootFromLocalStorage,
  listLootItemForSaleInLocalStorage,
  clearAllLootFromLocalStorage, // Import the new function
} from "@/lib/localStorage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Inbox, RotateCcw, Trash2 } from "lucide-react"; // Added Trash2
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function LootPage() {
  const [myLoot, setMyLoot] = useState<LootItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearAlertOpen, setIsClearAlertOpen] = useState(false);
  const { toast } = useToast();
  const { address } = useAccount();

  const loadLoot = () => {
    setIsLoading(true);
    const loot = getCollectedLootFromLocalStorage();
    const userLoot = loot.filter(
      (item) => !item.ownerAddress || item.ownerAddress === address
    );
    setMyLoot(userLoot.sort((a, b) => b.timestamp - a.timestamp));
    setIsLoading(false);
  };

  useEffect(() => {
    if (address) {
      loadLoot();
    } else {
      setMyLoot([]);
      setIsLoading(false);
    }
  }, [address]);

  const handleListForSale = (item: LootItem) => {
    const price = Math.floor(Math.random() * (500 - 10 + 1)) + 10;
    listLootItemForSaleInLocalStorage(item, price);
    toast({
      title: "Item Listed!",
      description: `${item.name} has been listed for ${price} MND (simulated).`,
      className: "bg-primary text-primary-foreground border-primary",
    });
    loadLoot();
  };

  const handleClearAllLoot = () => {
    clearAllLootFromLocalStorage();
    toast({
      title: "NFTs Cleared",
      description: "All your collected and listed NFTs have been cleared from local storage.",
      className: "bg-primary text-primary-foreground border-primary",
    });
    loadLoot(); // Refresh the list (should be empty)
    setIsClearAlertOpen(false); // Close the dialog
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <RotateCcw className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">
          Loading your treasures...
        </p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center">
        <Inbox className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-primary">
          Connect Your Wallet
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Please connect your wallet to view your collected loot.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          My Collected Loot
        </h1>
        <div className="flex gap-2">
          <Button onClick={loadLoot} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" /> Refresh Loot
          </Button>
          <AlertDialog open={isClearAlertOpen} onOpenChange={setIsClearAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={myLoot.length === 0 && getMarketplaceListedItemsFromLocalStorage().length === 0}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete All NFTs
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  your collected and marketplace listed NFTs from local storage.
                  NFTs saved in MongoDB will remain.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllLoot}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {myLoot.length === 0 ? (
        <div className="text-center py-10">
          <Inbox className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold mb-2">Your Loot Cache is Empty</h2>
          <p className="text-muted-foreground mb-4">
            Looks like you haven't unlocked any loot yet or listed everything.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Link href="/">Find Some Loot!</Link>
          </Button>
        </div>
      ) : (
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
      )}
       <p className="text-sm text-muted-foreground text-center pt-4">
        Note: Your loot is currently managed in your browser&apos;s local storage for this demo.
        The &quot;Delete All NFTs&quot; button clears this local data. NFT metadata is also saved to MongoDB.
      </p>
    </div>
  );
}
