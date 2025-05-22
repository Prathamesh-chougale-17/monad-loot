"use client";

import type { FrameContext } from "@farcaster/frame-core/dist/context";
import sdk from "@farcaster/frame-sdk";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import FrameWalletProvider from "./FrameWalletProvider";

interface FrameContextValue {
  context: FrameContext | null;
  isSDKLoaded: boolean;
  isEthProviderAvailable: boolean;
  error: string | null;
  actions: typeof sdk.actions | null;
}

const FrameProviderContext = createContext<FrameContextValue | undefined>(
  undefined
);

export function useFrame() {
  const context = useContext(FrameProviderContext);
  if (context === undefined) {
    throw new Error("useFrame must be used within a FrameProvider");
  }
  return context;
}

interface FrameProviderProps {
  children: ReactNode;
}

export function FarcasterProvider({ children }: FrameProviderProps) {
  const [context, setContext] = useState<FrameContext | null>(null);
  const [actions, setActions] = useState<typeof sdk.actions | null>(null);
  const [isEthProviderAvailable, setIsEthProviderAvailable] =
    useState<boolean>(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const sdkContext = await sdk.context;
        if (sdkContext) {
          setContext(sdkContext as FrameContext);
          setActions(sdk.actions);
          setIsEthProviderAvailable(sdk.wallet.ethProvider ? true : false);
        } else {
          // setError("Failed to load Farcaster context"); // Only set error if it's truly an error
          console.log("Farcaster context not available (e.g., running in a normal browser).");
        }
        // Ensure ready is called even if context is not immediately available
        // It might resolve later or handle non-frame environments gracefully
        await sdk.actions.ready(); 
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize SDK";
        setError(errorMessage);
        console.error("SDK initialization error:", err);
      }
    };

    if (sdk && !isSDKLoaded) {
      load().then(() => {
        setIsSDKLoaded(true);
        console.log("Farcaster SDK load attempted.");
      });
    }
  }, [isSDKLoaded]);

  return (
    <FrameProviderContext.Provider
      value={{
        context,
        actions,
        isSDKLoaded,
        isEthProviderAvailable,
        error,
      }}
    >
      <FrameWalletProvider>{children}</FrameWalletProvider>
    </FrameProviderContext.Provider>
  );
}
