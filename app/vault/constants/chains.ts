import { RPC_API_KEYS } from "@/components/constants";
import { arbitrum, base, sepolia } from "@wagmi/core/chains";
import { mainnet } from "@wagmi/core/chains";

export const chains = {
  // Ethereum
  1: {
    chainName: "ethereum",
    chainId: 1,
    name: mainnet.name,
    ensAddress: (mainnet.contracts as any)?.ensRegistry?.address,
    rpcUrl: RPC_API_KEYS[1],
  },

  // Base
  8453: {
    chainName: "base",
    chainId: 8453,
    name: base.name,
    ensAddress: (base.contracts as any)?.ensRegistry?.address,
    rpcUrl: RPC_API_KEYS[8453],
  },

  // Arbitrum
  42161: {
    chainName: "arbitrum",
    chainId: 42161,
    name: arbitrum.name,
    ensAddress: (arbitrum.contracts as any)?.ensRegistry?.address,
    rpcUrl: RPC_API_KEYS[42161],
  },

  // Sepolia
  11155111: {
    chainName: "sepolia",
    chainId: 11155111,
    name: sepolia.name,
    ensAddress: (sepolia.contracts as any)?.ensRegistry?.address,
    rpcUrl: RPC_API_KEYS[11155111],
  },
};
