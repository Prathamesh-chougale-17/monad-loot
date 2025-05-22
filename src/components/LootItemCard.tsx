
import Image from 'next/image';
import type { LootItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCircle } from 'lucide-react';

interface LootItemCardProps {
  item: LootItem;
}

export default function LootItemCard({ item }: LootItemCardProps) {
  const truncateAddress = (address: string | undefined) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300 h-full bg-card/90">
      <CardHeader className="p-4">
        <CardTitle className="text-xl truncate text-primary">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col gap-4">
        <div className="aspect-square w-full relative rounded-md overflow-hidden border border-border">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="digital art"
          />
        </div>
        <ScrollArea className="h-24"> {/* Fixed height for description with scroll */}
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
            {item.flavorText}
          </CardDescription>
        </ScrollArea>
        {item.ownerAddress && (
          <div className="flex items-center text-xs text-muted-foreground pt-2 border-t border-border/30 mt-2">
            <UserCircle className="h-4 w-4 mr-2 text-accent" />
            Owner: {truncateAddress(item.ownerAddress)}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t border-border/50 mt-auto">
        <p className="text-xs text-muted-foreground">Acquired: {new Date(item.timestamp).toLocaleDateString()}</p>
      </CardFooter>
    </Card>
  );
}
