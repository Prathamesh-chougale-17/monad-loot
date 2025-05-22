'use client';

import { Button } from '@/components/ui/button';
import { KeyRound, PackageOpen, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface InteractionPanelProps {
  hasKey: boolean;
  isInteracting: boolean; // General loading state for key acquisition or box opening
  isBoxOpening: boolean; // Specific state for box opening animation/process
  onGetKey: () => void;
  onOpenBox: () => void;
}

export default function InteractionPanel({
  hasKey,
  isInteracting,
  isBoxOpening,
  onGetKey,
  onOpenBox,
}: InteractionPanelProps) {
  return (
    <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-primary">Control Panel</CardTitle>
        <CardDescription className="text-center">
          {hasKey ? "You have a key! Ready to unlock?" : "Acquire a key to open the Monad Loot Box."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!hasKey && (
          <Button
            onClick={onGetKey}
            disabled={isInteracting || hasKey}
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isInteracting && !isBoxOpening ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <KeyRound className="mr-2 h-5 w-5" />
            )}
            Simulate Monad Interaction & Get Key
          </Button>
        )}
        {hasKey && (
          <Button
            onClick={onOpenBox}
            disabled={isInteracting || !hasKey}
            size="lg"
            variant="default"
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isInteracting && isBoxOpening ? (
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
