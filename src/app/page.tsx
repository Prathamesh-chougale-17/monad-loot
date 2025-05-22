
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageSearch, Sparkles, ArrowRight } from 'lucide-react';
import MysteryBox from '@/components/MysteryBox';
import InteractionPanel from '@/components/InteractionPanel';
import LootRevealDialog from '@/components/LootRevealDialog';
import { useToast } from '@/hooks/use-toast';
import { addLootItem } from '@/lib/localStorage';
import type { LootItem } from '@/types';
import { generateNftArt } from '@/ai/flows/generate-nft-art';
import { generateNftFlavorText } from '@/ai/flows/generate-nft-flavor-text';
import { generateLootBoxImage } from '@/ai/flows/generate-loot-box-image';
import { useState, useEffect } from 'react';

const nftThemes = [
  "Cybernetic Dragon", "Cosmic Artifact", "Mystical Forest Spirit", "Steampunk Golem", "Ancient Relic",
  "Glitchy Cat", "Pixelated Hero", "Data Stream Orb", "Holographic Phoenix", "Quantum Entangled Skull"
];

const boxThemes = ["futuristic", "ancient", "elemental", "cyberpunk", "mythical"];
const boxContentDescriptions = [
  "rare digital artifacts", "powerful game items", "exclusive collectibles", "unique avatars", "legendary weapons"
];

export default function HomePage() {
  const [hasKey, setHasKey] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false); // For key acquisition or box opening
  const [isBoxOpening, setIsBoxOpening] = useState(false); // Specifically for the box opening process
  const [isGeneratingBoxImage, setIsGeneratingBoxImage] = useState(true);
  const [boxImageUrl, setBoxImageUrl] = useState<string | null>(null);
  const [revealedItem, setRevealedItem] = useState<LootItem | null>(null);
  const [isRevealDialogOpen, setIsRevealDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchNewBoxImage = async () => {
    setIsGeneratingBoxImage(true);
    try {
      const randomTheme = boxThemes[Math.floor(Math.random() * boxThemes.length)];
      const randomContent = boxContentDescriptions[Math.floor(Math.random() * boxContentDescriptions.length)];
      const imageResult = await generateLootBoxImage({ theme: randomTheme, contentDescription: randomContent });
      setBoxImageUrl(imageResult.imageUrl);
    } catch (error) {
      console.error('Failed to generate loot box image:', error);
      toast({
        title: 'Error Summoning Box',
        description: 'Could not generate a new loot box image. Using a default.',
        variant: 'destructive',
      });
      setBoxImageUrl('https://placehold.co/320x320.png?text=Mystery+Box'); // Default fallback
    } finally {
      setIsGeneratingBoxImage(false);
    }
  };

  useEffect(() => {
    fetchNewBoxImage();
  }, []);

  const handleGetKey = async () => {
    setIsInteracting(true);
    // Simulate a delay for "interacting with Monad"
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHasKey(true);
    setIsInteracting(false);
    toast({
      title: 'Key Acquired!',
      description: 'You simulated a Monad transaction and got a key!',
      className: 'bg-accent text-accent-foreground border-accent',
    });
  };

  const handleOpenBox = async () => {
    if (!hasKey) {
      toast({ title: 'No Key!', description: 'You need a key to open the box.', variant: 'destructive' });
      return;
    }
    setIsInteracting(true);
    setIsBoxOpening(true);

    try {
      // 1. Generate NFT Art (Simulated)
      const randomTheme = nftThemes[Math.floor(Math.random() * nftThemes.length)];
      const nftName = `Monad ${randomTheme}`;
      const nftDescription = `A unique ${randomTheme} from the depths of the Monad ecosystem.`;

      const artResult = await generateNftArt({ nftDescription: `A digital artwork of a ${nftName}, ${randomTheme.toLowerCase()} style.` });

      // 2. Generate Flavor Text
      const flavorTextResult = await generateNftFlavorText({ nftName, nftDescription });

      const newItem: LootItem = {
        id: crypto.randomUUID(),
        name: nftName,
        flavorText: flavorTextResult.flavorText,
        imageUrl: artResult.nftImageDataUri,
        timestamp: Date.now(),
      };

      addLootItem(newItem);
      setRevealedItem(newItem);
      setIsRevealDialogOpen(true);
      setHasKey(false); // Key is consumed
      fetchNewBoxImage(); // Get a new box image for the next round

    } catch (error) {
      console.error('Error opening loot box:', error);
      toast({
        title: 'Opening Failed',
        description: 'Something went wrong while unveiling your loot. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsInteracting(false);
      setIsBoxOpening(false);
    }
  };

  const closeRevealDialog = () => {
    setIsRevealDialogOpen(false);
    setRevealedItem(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-12 py-10 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <Sparkles className="h-16 w-16 text-accent animate-pulse" />
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Monad Loot
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground">
          Unlock enigmatic Monad Loot Boxes, unveil unique digital collectibles, and claim your procedurally generated NFTs powered by AI.
        </p>
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-around gap-8 lg:gap-16">
        <MysteryBox
          imageUrl={boxImageUrl}
          isSpinning={isInteracting && !isBoxOpening}
          isOpening={isBoxOpening}
          isGeneratingImage={isGeneratingBoxImage}
        />
        <InteractionPanel
          hasKey={hasKey}
          isInteracting={isInteracting}
          isBoxOpening={isBoxOpening}
          onGetKey={handleGetKey}
          onOpenBox={handleOpenBox}
        />
      </div>

      <Card className="w-full max-w-2xl mt-8 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-primary"><PackageSearch /> How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-left text-card-foreground">
          <p>1. <strong className="text-accent">Acquire a Key:</strong> Simulate an interaction with the Monad network to get your entry key.</p>
          <p>2. <strong className="text-accent">Unlock the Box:</strong> Use your key to open the mysterious Monad Loot Box.</p>
          <p>3. <strong className="text-accent">Reveal Your NFT:</strong> Discover a unique, AI-generated NFT with distinct art and flavor text.</p>
          <p>4. <strong className="text-accent">Collect & Admire:</strong> Your new NFT is added to your personal loot collection.</p>
        </CardContent>
      </Card>

      <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 group">
        <Link href="/loot">
          View My Collected Loot
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>

      <LootRevealDialog
        item={revealedItem}
        isOpen={isRevealDialogOpen}
        onClose={closeRevealDialog}
      />
    </div>
  );
}
