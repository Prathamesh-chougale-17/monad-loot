
export interface LootItem {
  id: string;
  name: string;
  flavorText: string;
  imageUrl: string;
  timestamp: number; 
  price?: number; // Added for marketplace functionality
}

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
