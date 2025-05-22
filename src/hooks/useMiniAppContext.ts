import { useFrame } from "@/components/farcaster/FarcasterProvider";
import type { FrameContext } from "@farcaster/frame-core/dist/context";
import type sdk from "@farcaster/frame-sdk";

// Define specific types for each context
interface FarcasterContextResult {
  context: FrameContext;
  actions: typeof sdk.actions | null;
  isEthProviderAvailable: boolean;
}

interface NoContextResult {
  context: null;
  actions: null;
  isEthProviderAvailable: boolean;
}

// Union type of all possible results
type ContextResult = FarcasterContextResult | NoContextResult;

export const useMiniAppContext = (): ContextResult => {
  // Try to get Farcaster context
  try {
    const farcasterContext = useFrame(); // This hook provides the Farcaster context values
    if (farcasterContext.context) {
      return {
        context: farcasterContext.context,
        actions: farcasterContext.actions,
        isEthProviderAvailable: farcasterContext.isEthProviderAvailable,
      } as FarcasterContextResult;
    }
    // If context is null but SDK loaded, still return provider availability
    return {
        context: null,
        actions: farcasterContext.actions, // actions might be available even if context.user isn't
        isEthProviderAvailable: farcasterContext.isEthProviderAvailable,
    } as NoContextResult;

  } catch (e) {
    // This catch is for when useFrame throws (not within provider)
    // or for other unexpected errors.
    // console.warn("Error accessing Farcaster context, possibly not in a Farcaster frame:", e);
  }

  // Default fallback if not in Farcaster environment or error during context access
  return {
    context: null,
    actions: null,
    isEthProviderAvailable: false, // Default to false if context cannot be established
  } as NoContextResult;
};
