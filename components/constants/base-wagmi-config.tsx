import { http, createConfig } from "@wagmi/core";
import {
  baseSepolia,
  base,
  arbitrumSepolia,
  mainnet,
  sepolia,
  arbitrum,
} from "@wagmi/core/chains";
import { RPC_API_KEYS } from "@/components/constants";

export const config = createConfig({
  chains: [baseSepolia, base, arbitrumSepolia, mainnet, sepolia, arbitrum],
  transports: {
    [sepolia.id]: http(RPC_API_KEYS[sepolia.id]),
    [mainnet.id]: http(RPC_API_KEYS[mainnet.id]),
    [arbitrumSepolia.id]: http(RPC_API_KEYS[arbitrumSepolia.id]),
    [arbitrum.id]: http(RPC_API_KEYS[arbitrum.id]),
    [baseSepolia.id]: http(RPC_API_KEYS[baseSepolia.id]),
    [base.id]: http(RPC_API_KEYS[base.id]),
  },
});
