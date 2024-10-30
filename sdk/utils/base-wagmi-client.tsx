import {
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
} from "viem/chains";
import { http, createConfig } from "@wagmi/core";

export const baseWagmiClient = createConfig({
  chains: [mainnet, sepolia, arbitrum, arbitrumSepolia, base, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
