"use client";

import { WagmiProvider } from "wagmi";
import { config } from "./config";

export default function WagmiContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  );
}
