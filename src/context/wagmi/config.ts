import {
  cookieStorage,
  createStorage,
  webSocket,
} from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia } from "@reown/appkit/networks";
import { APPKIT_PROJECT_ID } from "@/lib/constants/appkit";

export const projectId =
  APPKIT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Project ID is not defined"
  );
}

export const networks = [sepolia];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter =
  new WagmiAdapter({
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    projectId,
    networks,
    transports: {
      [sepolia.id]: webSocket(
        "wss://ethereum-sepolia-rpc.publicnode.com"
      ),
    },
  });

export const config =
  wagmiAdapter.wagmiConfig;
