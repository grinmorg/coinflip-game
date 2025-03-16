import {
  http,
  createConfig,
} from "wagmi";
import {
  // mainnet,
  sepolia,
} from "wagmi/chains";
import {
  //   injected,
  metaMask,
  //   safe,
} from "wagmi/connectors";

export const config = createConfig({
  // mainnet,
  chains: [sepolia],
  connectors: [
    // injected(),
    metaMask(),
    // safe(),
  ],
  transports: {
    // [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
