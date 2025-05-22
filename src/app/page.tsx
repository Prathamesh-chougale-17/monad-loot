"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageSearch, Sparkles, ArrowRight, Info } from "lucide-react";
import MysteryBox from "@/components/MysteryBox";
import InteractionPanel from "@/components/InteractionPanel";
import LootRevealDialog from "@/components/LootRevealDialog";
import { UserDisplay } from "@/components/farcaster/UserDisplay";
import { FarcasterActionsDisplay } from "@/components/farcaster/FarcasterActionsDisplay";
import { useToast } from "@/hooks/use-toast";
import { addLootItemToLocalStorage } from "@/lib/localStorage";
import type { LootItem } from "@/types";
import {
  generateNftArt,
  type GenerateNftArtOutput,
} from "@/ai/flows/generate-nft-art";
import { generateLootBoxImage } from "@/ai/flows/generate-loot-box-image";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { useMiniAppContext } from "@/hooks/useMiniAppContext";

const nftThemes = [
  "Cybernetic Dragon",
  "Cosmic Artifact",
  "Mystical Forest Spirit",
  "Steampunk Golem",
  "Ancient Relic",
  "Glitchy Cat",
  "Pixelated Hero",
  "Data Stream Orb",
  "Holographic Phoenix",
  "Quantum Entangled Skull",
];

const boxThemes = [
  "futuristic",
  "ancient",
  "elemental",
  "cyberpunk",
  "mythical",
];
const boxContentDescriptions = [
  "rare digital artifacts",
  "powerful game items",
  "exclusive collectibles",
  "unique avatars",
  "legendary weapons",
];

export default function HomePage() {
  const [hasKey, setHasKey] = useState(false); // True if wallet connected to Monad Testnet
  const [isInteractingGeneral, setIsInteractingGeneral] = useState(false);
  const [isBoxOpening, setIsBoxOpening] = useState(false);
  const [isGeneratingBoxImage, setIsGeneratingBoxImage] = useState(true);
  const [boxImageUrl, setBoxImageUrl] = useState<string | null>(null);
  const [revealedItem, setRevealedItem] = useState<LootItem | null>(null);
  const [isRevealDialogOpen, setIsRevealDialogOpen] = useState(false);
  const { toast } = useToast();
  const { address, isConnected, chainId } = useAccount();
  const { context: farcasterContext } = useMiniAppContext();

  // TODO: Add state and effect to fetch and display remaining generations dynamically

  useEffect(() => {
    if (isConnected && chainId === monadTestnet.id) {
      setHasKey(true);
    } else {
      setHasKey(false);
    }
  }, [isConnected, chainId]);

  const fetchNewBoxImage = async () => {
    setIsGeneratingBoxImage(true);
    try {
      const randomTheme =
        boxThemes[Math.floor(Math.random() * boxThemes.length)];
      const randomContent =
        boxContentDescriptions[
          Math.floor(Math.random() * boxContentDescriptions.length)
        ];
      const imageResult = await generateLootBoxImage({
        theme: randomTheme,
        contentDescription: randomContent,
      });
      setBoxImageUrl(imageResult.imageUrl);
    } catch (error) {
      console.error("Failed to generate loot box image:", error);
      toast({
        title: "Error Summoning Box",
        description:
          "Could not generate a new loot box image. Using a default.",
        variant: "destructive",
      });
      setBoxImageUrl("https://placehold.co/320x320.png?text=Mystery+Box");
    } finally {
      setIsGeneratingBoxImage(false);
    }
  };

  useEffect(() => {
    fetchNewBoxImage();
    // TODO: Fetch initial generation count for the user
  }, []);

  const handleOpenBox = async () => {
    if (!hasKey) {
      // hasKey now means wallet is connected and on the right network
      toast({
        title: "Wallet Not Ready!",
        description: "Connect your Farcaster wallet to Monad Testnet.",
        variant: "destructive",
      });
      return;
    }
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please ensure your wallet is connected.",
        variant: "destructive",
      });
      return;
    }
    setIsInteractingGeneral(true);
    setIsBoxOpening(true);

    try {
      const randomTheme =
        nftThemes[Math.floor(Math.random() * nftThemes.length)];

      const generationResult: GenerateNftArtOutput = await generateNftArt({
        nftBaseName: randomTheme,
        userWalletAddress: address,
        userDisplayName: farcasterContext?.user?.displayName,
      });

      if ("error" in generationResult) {
        if (generationResult.limitReached) {
          toast({
            title: "Generation Limit Reached",
            description:
              "You've used all your free NFT generations for now. Please come back later!",
            variant: "destructive",
          });
        } else {
          throw new Error(
            generationResult.error || "Failed to generate NFT art."
          );
        }
        setIsInteractingGeneral(false);
        setIsBoxOpening(false);
        return;
      }

      const newItem = generationResult as LootItem;

      addLootItemToLocalStorage(newItem);
      setRevealedItem(newItem);
      setIsRevealDialogOpen(true);

      // Reset UI for next box opening, but don't reset hasKey if still connected
      fetchNewBoxImage();
      // TODO: Update displayed generation count
    } catch (error: any) {
      console.error("Error opening loot box:", error);
      toast({
        title: "Opening Failed",
        description:
          error.message ||
          "Something went wrong while unveiling your loot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInteractingGeneral(false);
      setIsBoxOpening(false);
    }
  };

  const closeRevealDialog = () => {
    setIsRevealDialogOpen(false);
    setRevealedItem(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-10 py-10 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <Sparkles className="h-16 w-16 text-accent animate-pulse" />
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Monad Loot
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground">
          Connect your Farcaster wallet to the Monad Testnet, unlock enigmatic
          Loot Boxes, and claim your unique AI-generated NFTs.
        </p>
        <Card className="bg-card/70 backdrop-blur-sm border-accent mt-2">
          <CardContent className="p-3">
            <p className="text-sm text-accent-foreground flex items-center gap-2">
              <Info className="h-5 w-5 text-white" />
              You get 3 free NFT generations! Use them wisely.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-around gap-8 lg:gap-16">
        <MysteryBox
          imageUrl={boxImageUrl}
          isSpinning={isInteractingGeneral && !isBoxOpening && hasKey}
          isOpening={isBoxOpening}
          isGeneratingImage={isGeneratingBoxImage}
        />
        <InteractionPanel
          hasKey={hasKey}
          isBoxOpening={isBoxOpening}
          onOpenBox={handleOpenBox}
        />
      </div>

      <div className="w-full max-w-3xl space-y-6 mt-8">
        <UserDisplay />
        <FarcasterActionsDisplay />
      </div>

      <Card className="w-full max-w-2xl mt-8 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-primary">
            <PackageSearch /> How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-left text-card-foreground">
          <p>
            1. <strong className="text-accent">Connect Wallet:</strong> Use the
            Farcaster wallet integration (connect to Monad Testnet).
          </p>
          <p>
            2. <strong className="text-accent">Unlock the Box:</strong> With
            your wallet connected, open the Monad Loot Box.
          </p>
          <p>
            3. <strong className="text-accent">Reveal Your NFT:</strong>{" "}
            Discover a unique, AI-generated NFT. You get 3 free generations!
          </p>
          <p>
            4. <strong className="text-accent">Collect & Admire:</strong> Your
            NFT is saved to your collection (and MongoDB!).
          </p>
          <p>
            5.{" "}
            <strong className="text-accent">(Optional) Monad Actions:</strong>{" "}
            Explore other Monad Testnet interactions via the Farcaster Actions
            panel.
          </p>
        </CardContent>
      </Card>

      <Button
        asChild
        size="lg"
        className="mt-8 bg-primary hover:bg-primary/90 group"
      >
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
