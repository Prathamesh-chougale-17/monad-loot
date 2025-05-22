
export interface LootItem {
  id: string; // Unique ID for the item (crypto.randomUUID())
  name: string;
  flavorText: string;
  imageUrl: string; // Can be data URI or HTTPS URL
  timestamp: number; 
  price?: number; 
  ownerAddress?: string; 
  creatorAddress?: string; // Wallet address of the user who generated/created the item
  creatorName?: string; // Display name of the creator (e.g., from Farcaster)
}

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// MongoDB Document Interfaces
export interface NftDocument {
  _id?: any; // MongoDB ObjectId
  nftId: string; // Corresponds to LootItem.id
  name: string;
  flavorText: string;
  imageUrl: string; // Storing as string (Data URI or later HTTPS URL)
  timestamp: number;
  ownerAddress?: string;
  creatorAddress?: string;
  creatorName?: string;
  theme?: string; // e.g., "Cybernetic Dragon"
}

export interface UserGenerationDoc {
  _id?: any; // MongoDB ObjectId
  walletAddress: string; // User's wallet address (indexed)
  generationsUsed: number;
  nftGenerationLimit: number; // e.g., 3
  lastGenerationTimestamp?: number;
}
