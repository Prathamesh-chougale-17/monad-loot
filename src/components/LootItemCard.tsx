import Image from "next/image";
import type { LootItem } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCircle, Tags, UserSquare2 } from "lucide-react"; // Added Tags for list button, UserSquare2 for creator
import { Button } from "@/components/ui/button";

interface LootItemCardProps {
  item: LootItem;
  showListButton?: boolean;
  onListForSale?: (item: LootItem) => void;
}

export default function LootItemCard({
  item,
  showListButton = false,
  onListForSale,
}: LootItemCardProps) {
  const truncateAddress = (address: string | undefined) => {
    if (!address) return "N/A";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300 h-full bg-card/90">
      <CardHeader className="p-2 pb-1">
        <CardTitle className="text-base sm:text-lg truncate text-primary">
          {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-grow flex flex-col gap-2">
        <div className="aspect-square w-full relative rounded-md overflow-hidden border border-border max-h-48">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw"
            className="object-cover"
            data-ai-hint="digital art"
          />
        </div>
        <ScrollArea className="h-14 sm:h-16">
          <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {item.flavorText}
          </CardDescription>
        </ScrollArea>
        {item.ownerAddress && (
          <div className="flex items-center text-xs text-muted-foreground border-t border-border/30 pt-1 mt-0">
            <UserCircle className="h-3 w-3 mr-1 text-accent" />
            Owner: {truncateAddress(item.ownerAddress)}
          </div>
        )}
        {item.creatorAddress && (
          <div className="flex items-center text-xs text-muted-foreground pt-0.5">
            <UserSquare2 className="h-3 w-3 mr-1 text-primary" />
            Creator: {item.creatorName || truncateAddress(item.creatorAddress)}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 border-t border-border/50 mt-auto flex flex-col gap-1">
        <p className="text-xs text-muted-foreground w-full">
          Acquired: {new Date(item.timestamp).toLocaleDateString()}
        </p>
        {showListButton && onListForSale && (
          <Button
            onClick={() => onListForSale(item)}
            variant="outline"
            size="sm"
            className="w-full mt-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground h-7 text-xs"
          >
            <Tags className="mr-1 h-3 w-3" /> List for Sale
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
