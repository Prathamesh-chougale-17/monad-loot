
import type { LootItem } from '@/types';

const COLLECTED_LOOT_STORAGE_KEY = 'monadLootCollected';
const MARKETPLACE_ITEMS_STORAGE_KEY = 'monadMarketplaceListed';

// === Collected Loot Management ===

export function getCollectedLootFromLocalStorage(): LootItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedLoot = localStorage.getItem(COLLECTED_LOOT_STORAGE_KEY);
    return storedLoot ? JSON.parse(storedLoot) : [];
  } catch (error) {
    console.error("Failed to retrieve collected loot from localStorage:", error);
    return [];
  }
}

export function saveCollectedLootToLocalStorage(loot: LootItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(COLLECTED_LOOT_STORAGE_KEY, JSON.stringify(loot));
  } catch (error) {
    console.error("Failed to save collected loot to localStorage:", error);
  }
}

export function addLootItemToLocalStorage(item: LootItem): LootItem[] {
  const currentLoot = getCollectedLootFromLocalStorage();
  // Prevent adding duplicates if item with same ID already exists
  if (currentLoot.find(i => i.id === item.id)) {
    return currentLoot;
  }
  const updatedLoot = [item, ...currentLoot];
  saveCollectedLootToLocalStorage(updatedLoot);
  return updatedLoot;
}

// === Marketplace Item Management (Simulated with localStorage) ===

export function getMarketplaceListedItemsFromLocalStorage(): LootItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedItems = localStorage.getItem(MARKETPLACE_ITEMS_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error("Failed to retrieve marketplace items from localStorage:", error);
    return [];
  }
}

export function saveMarketplaceListedItemsToLocalStorage(items: LootItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(MARKETPLACE_ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save marketplace items to localStorage:", error);
  }
}

export function listLootItemForSaleInLocalStorage(itemToList: LootItem, price: number): void {
  if (typeof window === 'undefined') return;
  // 1. Remove from personal collection
  let collectedLoot = getCollectedLootFromLocalStorage();
  collectedLoot = collectedLoot.filter(item => item.id !== itemToList.id);
  saveCollectedLootToLocalStorage(collectedLoot);

  // 2. Add to marketplace with price
  const itemWithPrice = { ...itemToList, price };
  const marketplaceItems = getMarketplaceListedItemsFromLocalStorage();
  saveMarketplaceListedItemsToLocalStorage([itemWithPrice, ...marketplaceItems]);
}

export function buyLootItemFromMarketplaceInLocalStorage(itemToBuy: LootItem, buyerAddress: string): LootItem | null {
  if (typeof window === 'undefined') return null;
  // 1. Remove from marketplace
  let marketplaceItems = getMarketplaceListedItemsFromLocalStorage();
  const itemExistsInMarket = marketplaceItems.find(item => item.id === itemToBuy.id);
  if (!itemExistsInMarket) {
    console.error("Item not found in marketplace for buying:", itemToBuy.id);
    return null;
  }
  marketplaceItems = marketplaceItems.filter(item => item.id !== itemToBuy.id);
  saveMarketplaceListedItemsToLocalStorage(marketplaceItems);

  // 2. Add to buyer's personal collection & update owner
  const boughtItem = { ...itemToBuy, ownerAddress: buyerAddress, price: undefined }; // Clear price after buying
  addLootItemToLocalStorage(boughtItem);
  return boughtItem;
}

// === Clear All Loot ===
export function clearAllLootFromLocalStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.removeItem(COLLECTED_LOOT_STORAGE_KEY);
    localStorage.removeItem(MARKETPLACE_ITEMS_STORAGE_KEY);
    console.log("All NFT data cleared from localStorage.");
  } catch (error) {
    console.error("Failed to clear all loot from localStorage:", error);
  }
}
