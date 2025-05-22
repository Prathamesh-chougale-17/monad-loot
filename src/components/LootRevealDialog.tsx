"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LootItemCard from "./LootItemCard";
import type { LootItem } from "@/types";
import { Sparkles } from "lucide-react";

interface LootRevealDialogProps {
  item: LootItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LootRevealDialog({
  item,
  isOpen,
  onClose,
}: LootRevealDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-[380px] bg-card border-primary shadow-xl shadow-primary/30 p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl sm:text-2xl text-center text-primary flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            Loot Unveiled!
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-1 text-sm sm:text-base">
            Congratulations! You've discovered:
          </DialogDescription>
        </DialogHeader>

        <div className="py-1">
          <LootItemCard item={item} />
        </div>

        <DialogFooter className="pt-2">
          <Button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 h-9 sm:h-10 text-sm sm:text-base"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
