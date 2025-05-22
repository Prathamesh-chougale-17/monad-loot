import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    // TODO: Add account association
    "accountAssociation": {
    "header": "eyJmaWQiOjEwODcwOTIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhCQWMwODdFRWNlRTUxMkRlZTNkOTZDRmY5ZmJmM2M5NDIxQjllYWJFIn0",
    "payload": "eyJkb21haW4iOiJtb25hZC1sb290LnZlcmNlbC5hcHAifQ",
    "signature": "MHhjN2VkNGQwMzc3ODIyNTk3NDNlYTM4NDIwMDMxMDU5N2U1MjBhMmUxOWU3ODQ2MDJjMTlmYzEzMDE5ZjdmMjg5MDlhZDAxZjU3YmVkMzgwZGY4ODI0NzQ3MjBmZmNiZGE5N2JjNDg2ZWNmYjVhM2VkN2U2M2MzNDZmMDVhMTMyOTFj"
  },
    frame: {
      version: "1",
      name: "Monad Loot",
      iconUrl: `${APP_URL}/images/icon.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/feed.png`,
      screenshotUrls: [`${APP_URL}/screenshots/image.png`],
      tags: ["monad", "farcaster", "miniapp", "template"],
      primaryCategory: "developer-tools",
      buttonTitle: "Launch Template",
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#ffffff",
      webhookUrl: `${APP_URL}/api/webhook`,
    },
  };

  return NextResponse.json(farcasterConfig);
}
