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
      <CardHeader className="p-4">
        <CardTitle className="text-xl truncate text-primary">
          {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col gap-3">
        <div className="aspect-square w-full relative rounded-md overflow-hidden border border-border">
          <Image
            src={item.imageUrl}
            alt={item.name}
            height={200}
            width={200}
            className="object-cover"
            data-ai-hint="digital art"
          />
        </div>
        <ScrollArea className="h-20">
          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
            {item.flavorText}
          </CardDescription>
        </ScrollArea>
        {item.ownerAddress && (
          <div className="flex items-center text-xs text-muted-foreground pt-1 border-t border-border/30 mt-1">
            <UserCircle className="h-4 w-4 mr-2 text-accent" />
            Owner: {truncateAddress(item.ownerAddress)}
          </div>
        )}
        {item.creatorAddress && (
          <div className="flex items-center text-xs text-muted-foreground pt-1">
            <UserSquare2 className="h-4 w-4 mr-2 text-primary" />
            Creator: {item.creatorName || truncateAddress(item.creatorAddress)}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t border-border/50 mt-auto flex flex-col gap-2">
        <p className="text-xs text-muted-foreground w-full">
          Acquired: {new Date(item.timestamp).toLocaleDateString()}
        </p>
        {showListButton && onListForSale && (
          <Button
            onClick={() => onListForSale(item)}
            variant="outline"
            size="sm"
            className="w-full mt-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Tags className="mr-2 h-4 w-4" /> List for Sale
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
