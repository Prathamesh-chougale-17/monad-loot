"use client";

import { useMiniAppContext } from "@/hooks/useMiniAppContext";
import { APP_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Link, UserCog, LogOut, SquarePlus, Send } from "lucide-react"; // Added LogOut for close

export function FarcasterActionsDisplay() {
  const { actions } = useMiniAppContext();

  if (!actions) {
    return (
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><Share2 /> Farcaster Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Farcaster actions not available. Are you in a Farcaster frame?
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2"><Share2 /> Farcaster Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => actions.addFrame()}>
          <SquarePlus className="mr-2" /> Add Frame
        </Button>
        <Button variant="outline" onClick={() => actions.close()}>
          <LogOut className="mr-2" /> Close MiniApp
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            actions.composeCast({
              text: "Check out this Monad Loot Box App!",
              embeds: [`${APP_URL}`],
            })
          }
        >
          <Send className="mr-2" /> Compose Cast
        </Button>
        <Button variant="outline" onClick={() => actions.openUrl("https://docs.monad.xyz")}>
          <Link className="mr-2" /> Open Monad Docs
        </Button>
        <Button variant="outline" onClick={() => actions.signIn({ nonce: "MonadLootNonce" })}>
           Sign In (Nonce)
        </Button>
        <Button variant="outline" onClick={() => actions.viewProfile({ fid: 1 })}> {/* Example FID */}
          <UserCog className="mr-2" /> View Profile (fid:1)
        </Button>
      </CardContent>
    </Card>
  );
}
