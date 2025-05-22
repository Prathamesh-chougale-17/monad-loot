"use client";

import { useMiniAppContext } from "@/hooks/useMiniAppContext";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle2 } from "lucide-react";

export function UserDisplay() {
  const { context } = useMiniAppContext();

  if (!context?.user?.fid) { // Check for fid as a more reliable indicator of user context
    return (
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><UserCircle2 /> Farcaster User</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            User context not available. Are you in a Farcaster frame?
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2"><UserCircle2 /> Farcaster User</CardTitle>
      </CardHeader>
      <CardContent className="flex items-start gap-4">
        {context.user.pfpUrl && (
          <Image
            src={context.user.pfpUrl}
            className="w-14 h-14 rounded-full border-2 border-primary"
            alt="User Profile Picture"
            width={56}
            height={56}
            data-ai-hint="profile avatar"
          />
        )}
        <div className="space-y-1.5 text-sm">
          <p>
            Display Name:{" "}
            <span className="font-semibold text-accent">{context.user.displayName}</span>
          </p>
          <p>
            Username:{" "}
            <span className="font-mono text-xs bg-muted p-1 rounded">{context.user.username}</span>
          </p>
          <p>
            FID: <span className="font-mono text-xs bg-muted p-1 rounded">{context.user.fid}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
