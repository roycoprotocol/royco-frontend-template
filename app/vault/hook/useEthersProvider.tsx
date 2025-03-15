import { providers } from "ethers";
import { RPC_API_KEYS } from "@/components/constants";
import { Chain } from "viem";
import {
  baseSepolia,
  base,
  arbitrumSepolia,
  mainnet,
  sepolia,
  arbitrum,
} from "@wagmi/core/chains";
import { useMemo } from "react";

export const chains = {
  [mainnet.id]: mainnet,
  [base.id]: base,
  [arbitrum.id]: arbitrum,
  [sepolia.id]: sepolia,
  [baseSepolia.id]: baseSepolia,
  [arbitrumSepolia.id]: arbitrumSepolia,
};

export function getEthersProviderFromChainId(chainId: number) {
  const chains: Record<number, Chain> = {
    [mainnet.id]: mainnet,
    [base.id]: base,
    [arbitrum.id]: arbitrum,
    [sepolia.id]: sepolia,
    [baseSepolia.id]: baseSepolia,
    [arbitrumSepolia.id]: arbitrumSepolia,
  };

  const chain = chains[chainId];
  if (!chain) {
    throw new Error(`Error: chain ${chainId} not supported`);
  }

  const rpcUrl = RPC_API_KEYS[chainId];
  if (!rpcUrl) {
    throw new Error(`Error: no rpc url found for chain ${chainId}`);
  }

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  return new providers.StaticJsonRpcProvider(rpcUrl, network);
}

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  return useMemo(() => {
    if (!chainId) {
      return undefined;
    }

    return getEthersProviderFromChainId(chainId);
  }, [chainId]);
}
