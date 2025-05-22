
'use client';

import Link from 'next/link';
import { Package, Store, Wallet, LogOut, Loader2 } from 'lucide-react'; // Added Wallet, LogOut, Loader2 icons
import { Button } from '@/components/ui/button';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import { useMiniAppContext } from '@/hooks/useMiniAppContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function Header() {
  const { isConnected, address } = useAccount();
  const { connect, isPending: isConnectPending, error: connectError } = useConnect();
  const { disconnect, isPending: isDisconnectPending, error: disconnectError } = useDisconnect();
  const { isEthProviderAvailable } = useMiniAppContext();
  const { toast } = useToast();

  useEffect(() => {
    if (connectError) {
      toast({ title: "Connection Failed", description: connectError.message, variant: "destructive" });
    }
  }, [connectError, toast]);

  useEffect(() => {
    if (disconnectError) {
      toast({ title: "Disconnection Failed", description: disconnectError.message, variant: "destructive" });
    }
  }, [disconnectError, toast]);

  const handleConnect = () => {
    connect({ connector: farcasterFrame() });
  };

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="py-4 px-6 border-b border-border/50 shadow-lg sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
          <Package size={28} />
          <span>Monad Loot</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/loot">My Loot</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/marketplace" className="flex items-center gap-1">
              <Store size={20} />
              Marketplace
            </Link>
          </Button>
          {isEthProviderAvailable && (
            <>
              {isConnected && address ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">{truncateAddress(address)}</span>
                  <Button 
                    variant="outline" 
                    onClick={() => disconnect()} 
                    disabled={isDisconnectPending}
                    size="sm"
                    aria-label="Disconnect wallet"
                  >
                    {isDisconnectPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4 sm:mr-1" />
                    )}
                    <span className="hidden sm:inline">Disconnect</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="default" 
                  onClick={handleConnect} 
                  disabled={isConnectPending}
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  aria-label="Connect wallet"
                >
                  {isConnectPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wallet className="h-4 w-4 sm:mr-1" />
                  )}
                  <span className="hidden sm:inline">Connect Wallet</span>
                </Button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
