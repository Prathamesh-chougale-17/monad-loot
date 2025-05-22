import Image from 'next/image';
import type { LootItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LootItemCardProps {
  item: LootItem;
}

export default function LootItemCard({ item }: LootItemCardProps) {
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
      </CardContent>
      <CardFooter className="p-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">Acquired: {new Date(item.timestamp).toLocaleDateString()}</p>
      </CardFooter>
    </Card>
  );
}
