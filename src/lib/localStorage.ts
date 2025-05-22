
import type { LootItem } from '@/types';

const COLLECTED_LOOT_STORAGE_KEY = 'monadLootCollected';
const MARKETPLACE_ITEMS_STORAGE_KEY = 'monadMarketplaceListed';

// === Collected Loot Management ===

export function getCollectedLootFromLocalStorage(): LootItem[] {
  if (typeof window === 'undefined') {
    console.warn("localStorage: window is undefined, cannot retrieve loot.");
    return [];
  }
  try {
    const storedLoot = localStorage.getItem(COLLECTED_LOOT_STORAGE_KEY);
    if (storedLoot) {
      const parsedLoot = JSON.parse(storedLoot);
      console.log("localStorage: Retrieved collected loot. Count:", parsedLoot.length, "Data:", storedLoot);
      return parsedLoot;
    } else {
      console.log("localStorage: No collected loot found in storage for key:", COLLECTED_LOOT_STORAGE_KEY);
      return [];
    }
  } catch (error) {
    console.error("localStorage: Failed to retrieve collected loot:", error);
    try {
      localStorage.removeItem(COLLECTED_LOOT_STORAGE_KEY);
      console.log("localStorage: Cleared potentially corrupted collected loot data due to parse error.");
    } catch (removeError) {
      console.error("localStorage: Failed to remove corrupted loot data:", removeError);
    }
    return [];
  }
}

export function saveCollectedLootToLocalStorage(loot: LootItem[]): void {
  if (typeof window === 'undefined') {
    console.warn("localStorage: window is undefined, cannot save collected loot.");
    return;
  }
  try {
    const lootString = JSON.stringify(loot);
    localStorage.setItem(COLLECTED_LOOT_STORAGE_KEY, lootString);
    console.log("localStorage: Successfully saved collected loot. Count:", loot.length, "Data:", lootString);
  } catch (error) {
    console.error("localStorage: Failed to save collected loot:", error);
  }
}

export function addLootItemToLocalStorage(item: LootItem): LootItem[] {
  console.log("localStorage: Attempting to add item:", item);
  const currentLoot = getCollectedLootFromLocalStorage();
  // Prevent adding duplicates if item with same ID already exists
  if (currentLoot.find(i => i.id === item.id)) {
    console.log("localStorage: Item with ID", item.id, "already exists in collected loot. Not adding duplicate.");
    return currentLoot;
  }
  const updatedLoot = [item, ...currentLoot];
  saveCollectedLootToLocalStorage(updatedLoot);
  console.log("localStorage: Item added to collected loot. New list count:", updatedLoot.length);
  return updatedLoot;
}

// === Marketplace Item Management (Simulated with localStorage) ===

export function getMarketplaceListedItemsFromLocalStorage(): LootItem[] {
  if (typeof window === 'undefined') {
    console.warn("localStorage: window is undefined, cannot retrieve marketplace items.");
    return [];
  }
  try {
    const storedItems = localStorage.getItem(MARKETPLACE_ITEMS_STORAGE_KEY);
    if (storedItems) {
      const parsedItems = JSON.parse(storedItems);
      console.log("localStorage: Retrieved marketplace items. Count:", parsedItems.length, "Data:", storedItems);
      return parsedItems;
    } else {
      console.log("localStorage: No marketplace items found in storage for key:", MARKETPLACE_ITEMS_STORAGE_KEY);
      return [];
    }
  } catch (error) {
    console.error("localStorage: Failed to retrieve marketplace items:", error);
     try {
      localStorage.removeItem(MARKETPLACE_ITEMS_STORAGE_KEY);
      console.log("localStorage: Cleared potentially corrupted marketplace data due to parse error.");
    } catch (removeError) {
      console.error("localStorage: Failed to remove corrupted marketplace data:", removeError);
    }
    return [];
  }
}

export function saveMarketplaceListedItemsToLocalStorage(items: LootItem[]): void {
  if (typeof window === 'undefined') {
    console.warn("localStorage: window is undefined, cannot save marketplace items.");
    return;
  }
  try {
    const itemsString = JSON.stringify(items);
    localStorage.setItem(MARKETPLACE_ITEMS_STORAGE_KEY, itemsString);
    console.log("localStorage: Successfully saved marketplace items. Count:", items.length, "Data:", itemsString);
  } catch (error) {
    console.error("localStorage: Failed to save marketplace items to localStorage:", error);
  }
}

export function listLootItemForSaleInLocalStorage(itemToList: LootItem, price: number): void {
  if (typeof window === 'undefined') return;
  console.log("localStorage: Attempting to list item for sale:", itemToList, "Price:", price);
  // 1. Remove from personal collection
  let collectedLoot = getCollectedLootFromLocalStorage();
  const initialCollectedCount = collectedLoot.length;
  collectedLoot = collectedLoot.filter(item => item.id !== itemToList.id);
  if (collectedLoot.length < initialCollectedCount) {
    console.log("localStorage: Item removed from collected loot for listing.");
  } else {
    console.warn("localStorage: Item to list was not found in collected loot:", itemToList.id);
  }
  saveCollectedLootToLocalStorage(collectedLoot);

  // 2. Add to marketplace with price
  const itemWithPrice = { ...itemToList, price };
  const marketplaceItems = getMarketplaceListedItemsFromLocalStorage();
   // Prevent adding duplicates if item with same ID already exists
  if (marketplaceItems.find(i => i.id === itemWithPrice.id)) {
    console.log("localStorage: Item with ID", itemWithPrice.id, "already exists in marketplace. Updating existing item.");
    const updatedMarketplaceItems = marketplaceItems.map(i => i.id === itemWithPrice.id ? itemWithPrice : i);
    saveMarketplaceListedItemsToLocalStorage(updatedMarketplaceItems);
  } else {
    saveMarketplaceListedItemsToLocalStorage([itemWithPrice, ...marketplaceItems]);
    console.log("localStorage: Item added to marketplace.");
  }
}

export function buyLootItemFromMarketplaceInLocalStorage(itemToBuy: LootItem, buyerAddress: string): LootItem | null {
  if (typeof window === 'undefined') return null;
  console.log("localStorage: Attempting to buy item:", itemToBuy, "Buyer:", buyerAddress);
  // 1. Remove from marketplace
  let marketplaceItems = getMarketplaceListedItemsFromLocalStorage();
  const itemExistsInMarket = marketplaceItems.find(item => item.id === itemToBuy.id);

  if (!itemExistsInMarket) {
    console.error("localStorage: Item not found in marketplace for buying:", itemToBuy.id);
    return null;
  }
  marketplaceItems = marketplaceItems.filter(item => item.id !== itemToBuy.id);
  saveMarketplaceListedItemsToLocalStorage(marketplaceItems);
  console.log("localStorage: Item removed from marketplace after purchase.");

  // 2. Add to buyer's personal collection & update owner
  const boughtItem = { ...itemToBuy, ownerAddress: buyerAddress, price: undefined }; // Clear price after buying
  addLootItemToLocalStorage(boughtItem); // This will also log
  console.log("localStorage: Item added to buyer's collected loot.");
  return boughtItem;
}

// === Clear All Loot ===
export function clearAllLootFromLocalStorage(): void {
  if (typeof window === 'undefined') {
    console.warn("localStorage: window is undefined, cannot clear all loot.");
    return;
  }
  try {
    localStorage.removeItem(COLLECTED_LOOT_STORAGE_KEY);
    localStorage.removeItem(MARKETPLACE_ITEMS_STORAGE_KEY);
    console.log("localStorage: All NFT data (collected and marketplace) cleared from localStorage.");
  } catch (error) {
    console.error("localStorage: Failed to clear all loot from localStorage:", error);
  }
}

