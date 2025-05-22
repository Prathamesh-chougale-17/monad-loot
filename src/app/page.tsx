
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PackageSearch, Sparkles, ArrowRight, Info, UploadCloud, RotateCcw, Loader2 } from "lucide-react";
import MysteryBox from "@/components/MysteryBox";
import InteractionPanel from "@/components/InteractionPanel";
import LootRevealDialog from "@/components/LootRevealDialog";
import { UserDisplay } from "@/components/farcaster/UserDisplay";
import { FarcasterActionsDisplay } from "@/components/farcaster/FarcasterActionsDisplay";
import { useToast } from "@/hooks/use-toast";
import { addLootItemToLocalStorage } from "@/lib/localStorage";
import type { LootItem, UserGenerationStatusOutput } from "@/types";
import {
  generateNftArt,
  type GenerateNftArtOutput,
} from "@/ai/flows/generate-nft-art";
import { getUserGenerationStatus } from "@/ai/flows/get-user-generation-status";
import { generateLootBoxImage } from "@/ai/flows/generate-loot-box-image";
import { generateDynamicNftImageDataUri } from "@/ai/flows/generate-dynamic-nft-image-data-uri";
import { useState, useEffect } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { useMiniAppContext } from "@/hooks/useMiniAppContext";
import { NFT_GENERATION_COST_MONAD, TREASURY_ADDRESS } from "@/lib/constants";
import { parseEther } from "viem";


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
  const [hasKey, setHasKey] = useState(false);
  const [isInteractingGeneral, setIsInteractingGeneral] = useState(false);
  const [isBoxOpening, setIsBoxOpening] = useState(false);
  const [isGeneratingBoxImage, setIsGeneratingBoxImage] = useState(true);
  const [boxImageUrl, setBoxImageUrl] = useState<string | null>(null);
  const [revealedItem, setRevealedItem] = useState<LootItem | null>(null);
  const [isRevealDialogOpen, setIsRevealDialogOpen] = useState(false);

  const [userGenerationStatus, setUserGenerationStatus] = useState<UserGenerationStatusOutput | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { toast } = useToast();
  const { address, isConnected, chainId } = useAccount();
  const { context: farcasterContext } = useMiniAppContext();
  const { sendTransactionAsync, error: transactionError, isPending: isTransactionPending } = useSendTransaction();


  useEffect(() => {
    if (isConnected && chainId === monadTestnet.id) {
      setHasKey(true);
    } else {
      setHasKey(false);
    }
  }, [isConnected, chainId]);

  const fetchNewBoxImage = async () => {
    setIsGeneratingBoxImage(true);
    setBoxImageUrl(null);
    try {
      const randomTheme = boxThemes[Math.floor(Math.random() * boxThemes.length)];
      const randomContent = boxContentDescriptions[Math.floor(Math.random() * boxContentDescriptions.length)];

      const genkitResult = await generateLootBoxImage({
        theme: randomTheme,
        contentDescription: randomContent,
      });
      setBoxImageUrl(genkitResult.imageDataUri);
    } catch (error) {
      console.error("Failed to generate loot box image:", error);
      toast({
        title: "Error Summoning Box",
        description: "Could not get a new loot box image. Using a default.",
        variant: "destructive",
      });
      setBoxImageUrl("https://placehold.co/320x320.png?text=Mystery+Box");
    } finally {
      setIsGeneratingBoxImage(false);
    }
  };

  useEffect(() => {
    fetchNewBoxImage();
  }, []);

  const proceedWithGeneration = async (isFree: boolean) => {
    if (!address) {
      toast({ title: "Wallet Not Connected", description: "Please ensure your wallet is connected.", variant: "destructive" });
      return;
    }
    setIsInteractingGeneral(true);
    setIsBoxOpening(true);
    try {
      const randomTheme = nftThemes[Math.floor(Math.random() * nftThemes.length)];
      const imageGenResult = await generateDynamicNftImageDataUri({ nftBaseName: randomTheme });
      const nftImageDataUri = imageGenResult.imageDataUri;

      if (!nftImageDataUri) throw new Error("Failed to generate NFT image data.");

      const metadataResult: GenerateNftArtOutput = await generateNftArt({
        nftBaseName: randomTheme,
        userWalletAddress: address,
        userDisplayName: farcasterContext?.user?.displayName,
        nftImageDataUri: nftImageDataUri,
        isFreeGeneration: isFree,
      });

      if ("error" in metadataResult) {
        throw new Error(metadataResult.error || "Failed to process NFT metadata.");
      }

      const newItem = metadataResult as LootItem;
      console.log("Attempting to add to localStorage:", newItem);
      addLootItemToLocalStorage(newItem);
      setRevealedItem(newItem);
      setIsRevealDialogOpen(true);
      fetchNewBoxImage(); // Get a new box for next time
      // Refresh generation status if it was a free one
      if (isFree && userGenerationStatus) {
        setUserGenerationStatus(prev => prev ? {...prev, generationsUsed: prev.generationsUsed + 1, canGenerateForFree: (prev.generationsUsed + 1) < prev.nftGenerationLimit } : null);
      }
    } catch (error: any) {
      console.error("Error opening loot box:", error);
      toast({
        title: "Opening Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInteractingGeneral(false);
      setIsBoxOpening(false);
    }
  };

  const initiateOpenBoxSequence = async () => {
    if (!hasKey || !address) {
      toast({ title: "Wallet Not Ready!", description: "Connect your Farcaster wallet to Monad Testnet.", variant: "destructive" });
      return;
    }
    setIsCheckingStatus(true);
    try {
      const status = await getUserGenerationStatus({ userWalletAddress: address });
      setUserGenerationStatus(status);
      if (status.canGenerateForFree) {
        await proceedWithGeneration(true);
      } else {
        setShowPaymentDialog(true);
      }
    } catch (error: any) {
      toast({ title: "Error Checking Status", description: error.message || "Could not check your generation status.", variant: "destructive"});
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handlePaymentAndGenerate = async () => {
    if (!address) return;
    setIsProcessingPayment(true);
    try {
      await sendTransactionAsync({
        to: TREASURY_ADDRESS,
        value: parseEther(NFT_GENERATION_COST_MONAD),
      });
      toast({ title: "Payment Successful!", description: `Sent ${NFT_GENERATION_COST_MONAD} Monad. Generating your NFT...`, className: "bg-primary text-primary-foreground border-primary" });
      setShowPaymentDialog(false);
      await proceedWithGeneration(false);
    } catch (error: any) {
      console.error("Payment or post-payment generation failed:", error);
      const message = transactionError?.message || error.shortMessage || error.message || "Payment or generation failed.";
      toast({ title: "Payment Failed", description: message, variant: "destructive" });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const closeRevealDialog = () => {
    setIsRevealDialogOpen(false);
    setRevealedItem(null);
  };
  
  const generationsLeftText = () => {
    if (!userGenerationStatus) return "Connect wallet to see free generations.";
    const left = userGenerationStatus.nftGenerationLimit - userGenerationStatus.generationsUsed;
    if (left > 0) return `${left} free NFT generation${left > 1 ? 's' : ''} left!`;
    return `All free generations used. Next generation costs ${NFT_GENERATION_COST_MONAD} Monad.`;
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
              {generationsLeftText()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-around gap-8 lg:gap-16">
        <MysteryBox
          imageUrl={boxImageUrl}
          isSpinning={(isInteractingGeneral || isCheckingStatus) && !isBoxOpening && hasKey}
          isOpening={isBoxOpening}
          isGeneratingImage={isGeneratingBoxImage || isInteractingGeneral || isCheckingStatus}
        />
        <InteractionPanel
          hasKey={hasKey}
          isBoxOpening={isBoxOpening || isCheckingStatus || isProcessingPayment}
          onOpenBox={initiateOpenBoxSequence}
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
            2. <strong className="text-accent">Unlock the Box:</strong> Open the Monad Loot Box. First 3 are free!
          </p>
          <p>
            3. <strong className="text-accent">Pay (if needed):</strong> After free trials, generation costs {NFT_GENERATION_COST_MONAD} Monad.
          </p>
          <p>
            4. <strong className="text-accent">AI Generates:</strong> A unique
            NFT image is AI-generated and its metadata is saved to MongoDB.
          </p>
          <p>
            5. <strong className="text-accent">Collect & Admire:</strong> Your
            NFT is saved to your local collection.
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

      {showPaymentDialog && (
        <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>NFT Generation Cost</AlertDialogTitle>
              <AlertDialogDescription>
                You've used all your free NFT generations.
                To generate another NFT, a payment of {NFT_GENERATION_COST_MONAD} Monad is required.
                This transaction will be sent to the treasury address: {TREASURY_ADDRESS}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessingPayment || isTransactionPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handlePaymentAndGenerate}
                disabled={isProcessingPayment || isTransactionPending}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isProcessingPayment || isTransactionPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Pay {NFT_GENERATION_COST_MONAD} Monad & Generate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
