import { useMemo } from "react";
import { providers } from "ethers";
import { toast } from "react-hot-toast";

import { chains } from "../constants/chains";

export function getEthersProviderFromChainId(chainId: number) {
  const chain = chains[chainId as keyof typeof chains];

  if (!chain) {
    return {
      error: "Error: chain not supported",
    };
  }

  if (!chain.rpcUrl) {
    return {
      error: "Error: no rpc url found for chain.",
    };
  }

  return new providers.StaticJsonRpcProvider(chain.rpcUrl, {
    chainId: chain.chainId,
    name: chain.name,
    ensAddress: chain.ensAddress,
  });
}

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const provider = useMemo(() => {
    if (!chainId) {
      return {
        error: "Error: no chain id provided",
      };
    }

    return getEthersProviderFromChainId(chainId);
  }, [chainId]);

  return provider;
}
