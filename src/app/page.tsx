import App from "@/components/App";
import { Metadata } from "next";
import { APP_URL } from "@/lib/constants";

const frame = {
  version: "next",
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: "Launch Monad Loot",
    action: {
      type: "launch_frame",
      name: "Monad Loot",
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Monad Loot",
    openGraph: {
      title: "Monad Loot",
      description:
        "Unlock mystery boxes and collect unique NFTs on the Monad ecosystem.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}
const HomePage = () => {
  return <App />;
};

export default HomePage;
