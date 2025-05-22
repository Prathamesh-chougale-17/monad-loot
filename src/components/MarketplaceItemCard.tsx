
'use client';

import Image from 'next/image';
import type { LootItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tag, ShoppingBag, UserCircle } from 'lucide-react'; // Using Tag for price

interface MarketplaceItemCardProps {
  item: LootItem;
  onBuy: (item: LootItem) => void;
}

export default function MarketplaceItemCard({ item, onBuy }: MarketplaceItemCardProps) {
  const formattedPrice = item.price != null ? `${item.price} MND` : 'Price not set';
  const truncateAddress = (address: string | undefined) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300 h-full bg-card/90">
      <CardHeader className="p-4">
        <CardTitle className="text-xl truncate text-primary">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col gap-3"> {/* Reduced gap slightly */}
        <div className="aspect-square w-full relative rounded-md overflow-hidden border border-border">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="digital art collectible"
          />
        </div>
        <ScrollArea className="h-16"> {/* Adjusted height for description */}
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
            {item.flavorText}
          </CardDescription>
        </ScrollArea>
        {item.ownerAddress && (
          <div className="flex items-center text-xs text-muted-foreground">
            <UserCircle className="h-4 w-4 mr-1.5 text-accent" />
            Owner: {truncateAddress(item.ownerAddress)}
          </div>
        )}
        <div className="flex items-center text-lg font-semibold text-accent mt-1">
          <Tag className="mr-2 h-5 w-5" />
          <span>{formattedPrice}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-border/50 mt-auto">
        <Button 
          onClick={() => onBuy(item)} 
          className="w-full bg-primary hover:bg-primary/90"
          aria-label={`Buy ${item.name} for ${formattedPrice}`}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
