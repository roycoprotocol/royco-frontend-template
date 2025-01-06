import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage, http } from "wagmi";

/**
 * @todo
 * Replace viem/chains with royco/constants
 */
import { sepolia, mainnet, arbitrum, base, corn } from "viem/chains";
import { getFrontendTag } from "@/store";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const metadata = {
  name: "Royco",
  description:
    "Royco is a marketplace for exclusive incentives from the best projects.",
  // url: "http://localhost:3000", // origin must match your domain & subdomain
  url: "https://royco.org", // origin must match your domain & subdomain
  icons: ["/icon.png"],
};

const frontendTag =
  typeof window !== "undefined" ? getFrontendTag() : "default";

// Create wagmiConfig
const chains = [
  mainnet,
  arbitrum,
  base,
  corn,
  ...(frontendTag === "dev" ? [sepolia] : []),
] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage:
      typeof window !== "undefined" ? window.localStorage : cookieStorage,
  }),
  batch: {
    multicall: true,
  },
  // transports: {
  //   [mainnet.id]: http(),
  //   [sepolia.id]: http(
  //     "https://eth-sepolia.g.alchemy.com/v2/1loBE7C025PbFMLCiTAhbG3WrIqH0J1y"
  //   ),
  //   // [sepolia.id]: http(),
  //   [arbitrum.id]: http(),
  //   [arbitrumSepolia.id]: http(),
  // },
  // ...wagmiOptions, // Optional - Override createConfig parameters
});
