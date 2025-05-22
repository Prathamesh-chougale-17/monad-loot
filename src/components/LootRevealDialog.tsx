
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LootItemCard from './LootItemCard';
import type { LootItem } from '@/types';
import { Sparkles } from 'lucide-react';

interface LootRevealDialogProps {
  item: LootItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LootRevealDialog({ item, isOpen, onClose }: LootRevealDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-card border-primary shadow-xl shadow-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-primary flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            Loot Unveiled!
            <Sparkles className="h-6 w-6 text-accent" />
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            Congratulations! You've discovered:
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <LootItemCard item={item} />
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
