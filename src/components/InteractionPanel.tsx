'use client';

import { Button } from '@/components/ui/button';
import { PackageOpen, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletActions } from '@/components/farcaster/WalletActions';

interface InteractionPanelProps {
  hasKey: boolean; // True if wallet connected to Monad Testnet & potentially after a specific action
  isBoxOpening: boolean; // Specific state for box opening animation/process
  onOpenBox: () => void;
  onTransactionSuccessForKey?: (hash: string) => void; // Callback when key-granting transaction is successful
}

export default function InteractionPanel({
  hasKey,
  isBoxOpening,
  onOpenBox,
  onTransactionSuccessForKey,
}: InteractionPanelProps) {
  return (
    <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-primary">Control Panel</CardTitle>
        <CardDescription className="text-center">
          {hasKey 
            ? "You're ready to unlock the Monad Loot Box!" 
            : "Connect your Farcaster wallet and interact with Monad Testnet to proceed."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!hasKey && (
          <WalletActions onTransactionSuccess={onTransactionSuccessForKey} />
        )}
        
        {hasKey && (
          <Button
            onClick={onOpenBox}
            disabled={isBoxOpening} // Only disable if box is currently opening
            size="lg"
            variant="default"
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isBoxOpening ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <PackageOpen className="mr-2 h-5 w-5" />
            )}
            Open Loot Box
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
