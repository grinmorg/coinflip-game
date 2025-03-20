"use client";

import {
  Config,
  cookieToInitialState,
  WagmiProvider,
} from "wagmi";
import {
  projectId,
  wagmiAdapter,
} from "./config";
import { createAppKit } from "@reown/appkit";
import { sepolia } from "viem/chains";
import { APPKIT_DOMAIN } from "@/lib/constants/appkit";

if (!projectId) {
  throw new Error(
    "Project ID is not defined"
  );
}

if (!APPKIT_DOMAIN) {
  throw new Error(
    "APPKIT_DOMAIN is not defined"
  );
}

// Set up metadata
const metadata = {
  name: "Coinflip",
  description: "Try your luck!",
  url: APPKIT_DOMAIN, // origin must match your domain & subdomain
  icons: [
    "https://assets.reown.com/reown-profile-pic.png",
  ],
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [sepolia],
  defaultNetwork: sepolia,
  includeWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamask
    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // phantom
  ],
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false, // default to true
    socials: [],
    emailShowWallets: false, // default to true
  },
});

export default function WagmiContextProvider({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  const initialState =
    cookieToInitialState(
      wagmiAdapter.wagmiConfig as Config,
      cookies
    );

  return (
    <WagmiProvider
      config={
        wagmiAdapter.wagmiConfig as Config
      }
      initialState={initialState}>
      {children}
    </WagmiProvider>
  );
}
