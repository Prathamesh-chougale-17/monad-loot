// This file is machine-generated - edit at your own risk.
'use server';
/**
 * @fileOverview Generates NFT art image data URI based on a text description.
 *
 * - generateDynamicNftImageDataUri - A function that generates the image data URI.
 * - GenerateDynamicNftImageDataUriInput - The input type.
 * - GenerateDynamicNftImageDataUriOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDynamicNftImageDataUriInputSchema = z.object({
  nftBaseName: z.string().describe('The base name or theme for the NFT art (e.g., "Cosmic Artifact").'),
});
export type GenerateDynamicNftImageDataUriInput = z.infer<typeof GenerateDynamicNftImageDataUriInputSchema>;

const GenerateDynamicNftImageDataUriOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateDynamicNftImageDataUriOutput = z.infer<typeof GenerateDynamicNftImageDataUriOutputSchema>;

export async function generateDynamicNftImageDataUri(input: GenerateDynamicNftImageDataUriInput): Promise<GenerateDynamicNftImageDataUriOutput> {
  return generateDynamicNftImageDataUriFlow(input);
}

// Note: No explicit prompt object here, we'll define the prompt string directly in ai.generate
// This is because the output is just the media data URI, not a complex Zod schema that benefits from definePrompt's output structuring.

const generateDynamicNftImageDataUriFlow = ai.defineFlow(
  {
    name: 'generateDynamicNftImageDataUriFlow',
    inputSchema: GenerateDynamicNftImageDataUriInputSchema,
    outputSchema: GenerateDynamicNftImageDataUriOutputSchema,
  },
  async (input) => {
    const { nftBaseName } = input;
    const nftArtDescription = `A unique digital artwork of a Monad ${nftBaseName}, in a ${nftBaseName.toLowerCase().split(' ').pop()} style. Focus on vibrant purples and electric blues. High fantasy digital art.`;
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: nftArtDescription,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], 
      },
    });
    
    if (!media || !media.url) {
      throw new Error('Image generation failed to return a data URI.');
    }

    return { imageDataUri: media.url };
  }
);
