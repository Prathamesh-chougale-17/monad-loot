// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Generates humorous and quirky flavor text descriptions for NFTs.
 *
 * - generateNftFlavorText - A function that generates the flavor text.
 * - GenerateNftFlavorTextInput - The input type for the generateNftFlavorText function.
 * - GenerateNftFlavorTextOutput - The return type for the generateNftFlavorText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNftFlavorTextInputSchema = z.object({
  nftName: z.string().describe('The name of the NFT.'),
  nftDescription: z.string().describe('The description of the NFT.'),
});
export type GenerateNftFlavorTextInput = z.infer<typeof GenerateNftFlavorTextInputSchema>;

const GenerateNftFlavorTextOutputSchema = z.object({
  flavorText: z.string().describe('A humorous and quirky flavor text description of the NFT.'),
});
export type GenerateNftFlavorTextOutput = z.infer<typeof GenerateNftFlavorTextOutputSchema>;

export async function generateNftFlavorText(input: GenerateNftFlavorTextInput): Promise<GenerateNftFlavorTextOutput> {
  return generateNftFlavorTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNftFlavorTextPrompt',
  input: {schema: GenerateNftFlavorTextInputSchema},
  output: {schema: GenerateNftFlavorTextOutputSchema},
  prompt: `You are a creative copywriter specializing in generating humorous and quirky flavor text descriptions for NFTs.

  Given the following NFT name and description, generate a flavor text description that is both engaging and funny.

  NFT Name: {{{nftName}}}
  NFT Description: {{{nftDescription}}}

  Flavor Text:`, // Ensure that the prompt ends with "Flavor Text:"
});

const generateNftFlavorTextFlow = ai.defineFlow(
  {
    name: 'generateNftFlavorTextFlow',
    inputSchema: GenerateNftFlavorTextInputSchema,
    outputSchema: GenerateNftFlavorTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
