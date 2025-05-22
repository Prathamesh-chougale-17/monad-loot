
'use server';
/**
 * @fileOverview Retrieves the user's NFT generation status from MongoDB.
 *
 * - getUserGenerationStatus - A function that gets the user's generation count and limit.
 * - GetUserGenerationStatusInput - The input type.
 * - UserGenerationStatusOutput - The return type (defined in @/types).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import clientPromise from '@/lib/mongodb';
import type { UserGenerationDoc, UserGenerationStatusOutput } from '@/types';

const NFT_GENERATION_LIMIT = 3;

const GetUserGenerationStatusInputSchema = z.object({
  userWalletAddress: z.string().describe("The wallet address of the user."),
});
export type GetUserGenerationStatusInput = z.infer<typeof GetUserGenerationStatusInputSchema>;

// Output schema is implicitly UserGenerationStatusOutput from @/types
// but Genkit requires an explicit Zod schema for flow output.
const UserGenerationStatusOutputSchema = z.object({
    generationsUsed: z.number(),
    nftGenerationLimit: z.number(),
    canGenerateForFree: z.boolean(),
});


export async function getUserGenerationStatus(input: GetUserGenerationStatusInput): Promise<UserGenerationStatusOutput> {
  return getUserGenerationStatusFlow(input);
}

const getUserGenerationStatusFlow = ai.defineFlow(
  {
    name: 'getUserGenerationStatusFlow',
    inputSchema: GetUserGenerationStatusInputSchema,
    outputSchema: UserGenerationStatusOutputSchema, // Use the Zod schema here
  },
  async ({ userWalletAddress }) => {
    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db();
      const userGenerationsCollection = db.collection<UserGenerationDoc>('userGenerations');

      let userGenerationData = await userGenerationsCollection.findOne({ walletAddress: userWalletAddress });

      if (!userGenerationData) {
        // If user has no record, they are new and can generate for free
        return {
          generationsUsed: 0,
          nftGenerationLimit: NFT_GENERATION_LIMIT,
          canGenerateForFree: true,
        };
      }

      const canGenerateForFree = userGenerationData.generationsUsed < userGenerationData.nftGenerationLimit;

      return {
        generationsUsed: userGenerationData.generationsUsed,
        nftGenerationLimit: userGenerationData.nftGenerationLimit,
        canGenerateForFree,
      };
    } catch (error: any) {
      console.error('Error in getUserGenerationStatusFlow:', error);
      // In case of DB error, default to not allowing free generation to be safe, or handle as appropriate
      throw new Error('Failed to retrieve user generation status.');
    }
  }
);
