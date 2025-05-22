
import { config } from 'dotenv';
config({ path: '../../.env.local' }); // Ensure .env.local is loaded if dev.ts is run from src/ai

import '@/ai/flows/generate-nft-art.ts';
import '@/ai/flows/generate-loot-box-image.ts';
import '@/ai/flows/generate-nft-flavor-text.ts';
import '@/ai/flows/generate-dynamic-nft-image-data-uri.ts';
import '@/ai/flows/get-user-generation-status.ts'; // Added new flow
// Add any new flows here if you create them, e.g., for fetching generation counts
