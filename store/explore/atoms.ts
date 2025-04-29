import {
  CustomTokenDataElement,
  ExploreMarketResponse,
  Filter,
  Sorting,
} from "@/app/api/royco/data-contracts";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { api } from "@/app/api/royco";
import { atomWithStorage } from "jotai/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArbitrumOne,
  Base,
  Corn,
  EthereumMainnet,
  EthereumSepolia,
  Hyperevm,
  Plume,
  Sonic,
} from "royco/constants";

export const EXPLORE_PAGE_SIZE = 20;

export const getBaseChainIdFilter = () => {
  let filters: Filter[] = [];

  const chainIds: number[] = [];

  const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

  // Add chainIds for chain specific environments
  if (frontendTag === "ethereum") {
    chainIds.push(EthereumMainnet.id);
  } else if (frontendTag === "base") {
    chainIds.push(Base.id);
  } else if (frontendTag === "arbitrum") {
    chainIds.push(ArbitrumOne.id);
  } else if (frontendTag === "plume") {
    chainIds.push(Plume.id);
  } else if (frontendTag === "corn") {
    chainIds.push(Corn.id);
  } else if (frontendTag === "sonic") {
    chainIds.push(Sonic.id);
  } else if (frontendTag === "hyperliquid") {
    chainIds.push(Hyperevm.id);
  }

  if (chainIds.length > 0) {
    filters.push({
      id: "chainId",
      value: chainIds,
      condition: "inArray",
    });
  }

  // Hide Sepolia from non-dev, testnet, and internal environments
  if (
    process.env.NEXT_PUBLIC_FRONTEND_TAG !== "dev" &&
    process.env.NEXT_PUBLIC_FRONTEND_TAG !== "testnet" &&
    process.env.NEXT_PUBLIC_FRONTEND_TAG !== "internal"
  ) {
    filters.push({
      id: "chainId",
      value: EthereumSepolia.id,
      condition: "ne",
    });
  }

  return filters;
};

export const getBoycoFilters = () => {
  let filters: Filter[] = [];

  const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

  if (frontendTag === "boyco") {
    filters.push({
      id: "category",
      value: "boyco",
    });
  }

  return filters;
};

export const getDefaultFilters = () => {
  let filters: Filter[] = [
    {
      id: "isVerified",
      value: true,
    },
  ];

  const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

  if (frontendTag !== "boyco") {
    filters.push({
      id: "fillableUsd",
      value: 0,
      condition: "gt",
    });
  }

  return filters;
};

// Request Body
export const exploreSearchKeyAtom = atom<string>("");
export const exploreFiltersAtom = atom<Filter[]>([
  ...getDefaultFilters(),
  ...getBaseChainIdFilter(),
  ...getBoycoFilters(),
]);
export const exploreSortingAtom = atom<Sorting[]>([
  {
    id: "fillableUsd",
    desc: true,
  },
]);

export const explorePageAtom = atom(1);

export const exploreCustomTokenDataAtom = atom<CustomTokenDataElement[]>([]);

// Loadable Atoms
export const loadableExploreMarketAtom = atomWithQuery<ExploreMarketResponse>(
  (get) => ({
    queryKey: [
      "explore-market",
      {
        filters: get(exploreFiltersAtom),
        sorting: get(exploreSortingAtom),
        page: get(explorePageAtom),
        searchKey: get(exploreSearchKeyAtom).trim(),
        customTokenData: get(exploreCustomTokenDataAtom),
      },
    ],
    queryFn: async ({ queryKey: [, params] }) => {
      const body = {
        ...(get(exploreSearchKeyAtom).trim().length > 0 && {
          searchKey: get(exploreSearchKeyAtom).trim(),
        }),
        filters: get(exploreFiltersAtom),
        sorting: get(exploreSortingAtom),
        page: {
          index: get(explorePageAtom),
          size: EXPLORE_PAGE_SIZE,
        },
        customTokenData: get(exploreCustomTokenDataAtom),
      };

      const response = await api.marketControllerGetMarkets(body);

      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    // refetchInterval: 1000 * 60, // 1 min
    keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    cacheTime: 1000 * 60 * 5, // Keep data in cache for 5 minutes
  })
);
