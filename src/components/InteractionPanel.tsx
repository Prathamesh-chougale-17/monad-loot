
'use client';

import { Button } from '@/components/ui/button';
import { PackageOpen, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletActions } from '@/components/farcaster/WalletActions'; // This component handles connection and Monad actions

interface InteractionPanelProps {
  hasKey: boolean; // True if wallet connected to Monad Testnet
  isBoxOpening: boolean;
  onOpenBox: () => void;
}

export default function InteractionPanel({
  hasKey,
  isBoxOpening,
  onOpenBox,
}: InteractionPanelProps) {
  return (
    <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-primary">Control Panel</CardTitle>
        <CardDescription className="text-center">
          {hasKey
            ? "You're ready to unlock the Monad Loot Box!"
            : "Connect your Farcaster wallet to the Monad Testnet to proceed."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!hasKey && (
          // WalletActions includes the "Connect Wallet" button if not connected,
          // and Monad actions if connected but not on the right chain, etc.
          <WalletActions />
        )}

        {hasKey && (
          <Button
            onClick={onOpenBox}
            disabled={isBoxOpening}
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
