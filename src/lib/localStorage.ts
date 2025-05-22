import type { LootItem } from '@/types';

const LOOT_STORAGE_KEY = 'monadLootCollected';

export function getCollectedLoot(): LootItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedLoot = localStorage.getItem(LOOT_STORAGE_KEY);
    return storedLoot ? JSON.parse(storedLoot) : [];
  } catch (error) {
    console.error("Failed to retrieve loot from localStorage:", error);
    return [];
  }
}

export function saveCollectedLoot(loot: LootItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(LOOT_STORAGE_KEY, JSON.stringify(loot));
  } catch (error) {
    console.error("Failed to save loot to localStorage:", error);
  }
}

export function addLootItem(item: LootItem): LootItem[] {
  const currentLoot = getCollectedLoot();
  const updatedLoot = [item, ...currentLoot]; // Add new item to the beginning
  saveCollectedLoot(updatedLoot);
  return updatedLoot;
}
