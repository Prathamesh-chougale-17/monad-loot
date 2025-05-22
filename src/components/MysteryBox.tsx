'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface MysteryBoxProps {
  imageUrl: string | null;
  isSpinning: boolean;
  isOpening: boolean;
  isGeneratingImage: boolean;
}

export default function MysteryBox({ imageUrl, isSpinning, isOpening, isGeneratingImage }: MysteryBoxProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-card/50 shadow-2xl" style={{ perspective: '1000px' }}>
      {isGeneratingImage || !imageUrl ? (
        <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-muted/50 rounded-lg">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="ml-2 text-sm text-muted-foreground">Summoning Box...</p>
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt="Mystery Box"
          width={320}
          height={320}
          className={cn(
            'object-contain rounded-lg transition-all duration-500 ease-out',
            'w-64 h-64 md:w-80 md:h-80',
            isSpinning && !isOpening && 'animate-[spin_7s_linear_infinite]',
            isOpening && 'animate-[shakeAndShine_1s_ease-in-out_infinite]',
             // Add pulse-glow animation when idle and not opening for extra flair
            !isOpening && !isSpinning && 'animate-[pulse-glow_3s_ease-in-out_infinite]'
          )}
          style={{ transformStyle: 'preserve-3d' }}
          data-ai-hint="treasure chest"
          priority
        />
      )}
      <div className="mt-6 text-center">
        {isOpening && <p className="text-lg font-semibold text-accent animate-pulse">Opening the void...</p>}
        {!isOpening && isSpinning && <p className="text-sm text-muted-foreground">The box hums with potential...</p>}
        {!isOpening && !isSpinning && !isGeneratingImage && <p className="text-sm text-muted-foreground">Awaiting your command.</p>}
      </div>
    </div>
  );
}
