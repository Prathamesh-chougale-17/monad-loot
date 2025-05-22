"use client";

import { useMiniAppContext } from "@/hooks/useMiniAppContext";
import { parseEther } from "viem";
import { monadTestnet } from "viem/chains";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
} from "wagmi";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface WalletActionsProps {
  onTransactionSuccess?: (hash: string) => void;
}

export function WalletActions({ onTransactionSuccess }: WalletActionsProps) {
  const { isEthProviderAvailable } = useMiniAppContext();
  const { isConnected, address, chain, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    data: hash,
    sendTransaction,
    error: transactionError,
    isPending: isTransactionPending,
  } = useSendTransaction();
  const {
    switchChain,
    error: switchChainError,
    isPending: isSwitchChainPending,
  } = useSwitchChain();
  const {
    connect,
    error: connectError,
    isPending: isConnectPending,
  } = useConnect();
  const { toast } = useToast();

  useEffect(() => {
    if (hash && onTransactionSuccess) {
      onTransactionSuccess(hash);
      toast({
        title: "Transaction Successful!",
        description: "Your transaction has been submitted.",
        className: "bg-green-600 text-white border-green-700",
      });
    }
  }, [hash, onTransactionSuccess, toast]);

  useEffect(() => {
    if (transactionError) {
      toast({
        title: "Transaction Failed",
        description: transactionError.message,
        variant: "destructive",
      });
    }
    if (switchChainError) {
      toast({
        title: "Switch Chain Failed",
        description: switchChainError.message,
        variant: "destructive",
      });
    }
    if (connectError) {
      toast({
        title: "Connection Failed",
        description: connectError.message,
        variant: "destructive",
      });
    }
  }, [transactionError, switchChainError, connectError, toast]);

  async function sendTransactionHandler() {
    sendTransaction({
      to: "0x99baB9217791937CAa2909E980f777c70fad98CF", // Example address
      value: parseEther("0.001"), // Sending a small amount for testing
    });
  }

  const isLoading =
    isConnectPending || isSwitchChainPending || isTransactionPending;

  if (!isEthProviderAvailable) {
    return (
      <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-md text-center">
        <AlertTriangle className="inline-block mr-2" />
        Wallet interactions are available within a Farcaster Frame environment
        (e.g., Warpcast).
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm p-3 bg-green-500/10 border border-green-500/30 rounded-md">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            Connected:{" "}
            <span className="font-mono text-xs break-all">{address}</span>
            <br />
            Chain: {chain?.name} ({chainId})
          </div>
        </div>

        {chainId === monadTestnet.id ? (
          <div className="space-y-2">
            <Button
              onClick={sendTransactionHandler}
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isTransactionPending && (
                <Loader2 className="animate-spin mr-2" />
              )}
              Perform Monad Action (Send Test TX)
            </Button>
            {hash && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  window.open(
                    `https://testnet.monadexplorer.com/tx/${hash}`,
                    "_blank"
                  )
                }
              >
                View Transaction <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={() => switchChain({ chainId: monadTestnet.id })}
            disabled={isLoading}
            className="w-full"
          >
            {isSwitchChainPending && <Loader2 className="animate-spin mr-2" />}
            Switch to Monad Testnet
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => disconnect()}
          className="w-full"
        >
          Disconnect Wallet
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: farcasterFrame() })}
      disabled={isLoading}
      className="w-full bg-primary hover:bg-primary/90"
    >
      {isConnectPending && <Loader2 className="animate-spin mr-2" />}
      Connect Farcaster Wallet
    </Button>
  );
}
