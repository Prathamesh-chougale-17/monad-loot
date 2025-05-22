
import type { LootItem } from '@/types';

const COLLECTED_LOOT_STORAGE_KEY = 'monadLootCollected';
const MARKETPLACE_ITEMS_STORAGE_KEY = 'monadMarketplaceListed';
const LEAN_IMAGE_PLACEHOLDER = 'image_stored_in_db';

// Helper to create a lean version of the item for localStorage
const createLeanLootItem = (item: LootItem): LootItem => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageUrl, ...rest } = item; // Destructure to remove imageUrl
  return { ...rest, imageUrl: LEAN_IMAGE_PLACEHOLDER }; // Add placeholder
};

// === Collected Loot Management ===

export function getCollectedLootFromLocalStorage(): LootItem[] {
  if (typeof window === 'undefined') {
    console.warn("localStorage: window is undefined, cannot retrieve loot.");
    return [];
  }
  try {
    const storedLoot = localStorage.getItem(COLLECTED_LOOT_STORAGE_KEY);
    if (storedLoot) {
      const parsedLoot = JSON.parse(storedLoot) as LootItem[];
      console.log("localStorage: Retrieved collected loot. Count:", parsedLoot.length);
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
    // Ensure all items being saved are lean
    const leanLoot = loot.map(item => item.imageUrl === LEAN_IMAGE_PLACEHOLDER ? item : createLeanLootItem(item));
    const lootString = JSON.stringify(leanLoot);
    localStorage.setItem(COLLECTED_LOOT_STORAGE_KEY, lootString);
    console.log("localStorage: Successfully saved collected loot. Count:", leanLoot.length);
  } catch (error: any) {
    if (error.name === 'QuotaExceededError') {
        console.error("localStorage: QuotaExceededError while trying to save collected loot. The data is too large for localStorage even after trimming. This should ideally not happen with lean items.", error);
    } else {
        console.error("localStorage: Failed to save collected loot:", error);
    }
  }
}

export function addLootItemToLocalStorage(item: LootItem): LootItem[] {
  console.log("localStorage: Attempting to add item (full details received):", item.id, item.name);
  const currentLoot = getCollectedLootFromLocalStorage();
  // Prevent adding duplicates if item with same ID already exists
  if (currentLoot.find(i => i.id === item.id)) {
    console.log("localStorage: Item with ID", item.id, "already exists in collected loot. Not adding duplicate.");
    return currentLoot;
  }
  const leanItem = createLeanLootItem(item); // Create lean version for storage
  const updatedLoot = [leanItem, ...currentLoot];
  saveCollectedLootToLocalStorage(updatedLoot);
  console.log("localStorage: Lean item added to collected loot. New list count:", updatedLoot.length);
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
      const parsedItems = JSON.parse(storedItems) as LootItem[];
      console.log("localStorage: Retrieved marketplace items. Count:", parsedItems.length);
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
    // Ensure all items being saved are lean
    const leanItems = items.map(item => item.imageUrl === LEAN_IMAGE_PLACEHOLDER ? item : createLeanLootItem(item));
    const itemsString = JSON.stringify(leanItems);
    localStorage.setItem(MARKETPLACE_ITEMS_STORAGE_KEY, itemsString);
    console.log("localStorage: Successfully saved marketplace items. Count:", leanItems.length);
  } catch (error: any) {
     if (error.name === 'QuotaExceededError') {
        console.error("localStorage: QuotaExceededError while trying to save marketplace items. The data is too large for localStorage even after trimming.", error);
    } else {
        console.error("localStorage: Failed to save marketplace items to localStorage:", error);
    }
  }
}

export function listLootItemForSaleInLocalStorage(itemToList: LootItem, price: number): void {
  if (typeof window === 'undefined') return;
  console.log("localStorage: Attempting to list item for sale:", itemToList.id, "Price:", price);
  // 1. Remove from personal collection (which should already be lean)
  let collectedLoot = getCollectedLootFromLocalStorage();
  const initialCollectedCount = collectedLoot.length;
  collectedLoot = collectedLoot.filter(item => item.id !== itemToList.id);
  if (collectedLoot.length < initialCollectedCount) {
    console.log("localStorage: Item removed from collected loot for listing.");
  } else {
    console.warn("localStorage: Item to list was not found in collected loot:", itemToList.id);
  }
  saveCollectedLootToLocalStorage(collectedLoot);

  // 2. Add to marketplace with price (ensure it's lean)
  const leanItemToList = itemToList.imageUrl === LEAN_IMAGE_PLACEHOLDER ? itemToList : createLeanLootItem(itemToList);
  const itemWithPrice = { ...leanItemToList, price };
  const marketplaceItems = getMarketplaceListedItemsFromLocalStorage();

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
  console.log("localStorage: Attempting to buy item:", itemToBuy.id, "Buyer:", buyerAddress);
  // 1. Remove from marketplace (itemToBuy here is lean from marketplace)
  let marketplaceItems = getMarketplaceListedItemsFromLocalStorage();
  const itemExistsInMarket = marketplaceItems.find(item => item.id === itemToBuy.id);

  if (!itemExistsInMarket) {
    console.error("localStorage: Item not found in marketplace for buying:", itemToBuy.id);
    return null;
  }
  marketplaceItems = marketplaceItems.filter(item => item.id !== itemToBuy.id);
  saveMarketplaceListedItemsToLocalStorage(marketplaceItems);
  console.log("localStorage: Item removed from marketplace after purchase.");

  // 2. Add to buyer's personal collection & update owner (ensure it's lean before adding)
  // itemToBuy from marketplace already has imageUrl: LEAN_IMAGE_PLACEHOLDER
  const boughtItemForStorage = { ...itemToBuy, ownerAddress: buyerAddress, price: undefined };
  
  // addLootItemToLocalStorage expects the full item if it were new, but since we are just moving
  // an already lean item, we can directly manipulate the collected loot.
  // However, to keep addLootItemToLocalStorage as the single entry point for adding to collection:
  // We'll pass the lean item, and addLootItemToLocalStorage will ensure it's stored lean.
  // This is slightly redundant but maintains consistency.
  const currentCollectedLoot = getCollectedLootFromLocalStorage();
  if (currentCollectedLoot.find(i => i.id === boughtItemForStorage.id)) {
    console.log("localStorage: Item with ID", boughtItemForStorage.id, "already exists in collected loot. This is unexpected during a buy operation. Overwriting owner.");
     const updatedCollectedLoot = currentCollectedLoot.map(i => i.id === boughtItemForStorage.id ? boughtItemForStorage : i);
     saveCollectedLootToLocalStorage(updatedCollectedLoot);
  } else {
    const updatedCollectedLoot = [boughtItemForStorage, ...currentCollectedLoot];
    saveCollectedLootToLocalStorage(updatedCollectedLoot);
  }

  console.log("localStorage: Item added to buyer's collected loot.");
  // Return the item with potentially full details if we were to fetch it, but for now return what was 'bought'
  return { ...itemToBuy, ownerAddress: buyerAddress, price: undefined }; // Return it as if it were full, though storage is lean.
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
