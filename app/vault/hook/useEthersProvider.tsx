import { useMemo } from "react";
import { JsonRpcProvider } from "ethers";

import { chains } from "../constants/chains";

export function getEthersProviderFromChainId(chainId: number, origin?: string) {
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

  const rpcUrl = chain.rpcUrl.startsWith("/")
    ? `${origin}${chain.rpcUrl}`
    : chain.rpcUrl;

  return new JsonRpcProvider(
    rpcUrl,
    {
      chainId: chain.chainId,
      name: chain.name,
      ensAddress: chain.ensAddress,
    },
    {
      staticNetwork: true,
    }
  );
}

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    []
  );

  const provider = useMemo(() => {
    if (!chainId) {
      return {
        error: "Error: no chain id provided",
      };
    }

    return getEthersProviderFromChainId(chainId, origin);
  }, [chainId, origin]);

  return provider;
}
