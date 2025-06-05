import {
  CustomTokenDataElement,
  ExploreMarketResponse,
  ExploreSettingsMarketResponse,
  ExploreVaultResponse,
  Filter,
  Sorting,
} from "royco/api";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { api } from "@/app/api/royco";
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
import { isTestnetAtom, tagAtom } from "../protector/protector";
import { keepPreviousData } from "@tanstack/react-query";
import { defaultQueryOptions } from "@/utils/query";
import { atomWithLocation } from "jotai-location";
import { atomWithStorage } from "jotai/vanilla/utils";

export const EXPLORE_PAGE_SIZE = 20;

const locationAtom = atomWithLocation();
export const marketFiltersVerifiedAtom = atomWithStorage<boolean>(
  "royco_verified_market_filter_type",
  true
);

export const baseFilter = atom<Filter[]>((get) => {
  const filters: Filter[] = [];

  const location = get(locationAtom);
  if (location.pathname === "/explore/all") {
    filters.push({
      id: "isVerified",
      value: get(marketFiltersVerifiedAtom),
    });
  } else {
    filters.push({
      id: "isVerified",
      value: true,
    });
  }

  const tag = get(tagAtom);

  if (tag !== "boyco") {
    filters.push({
      id: "fillableUsd",
      value: 0,
      condition: "gt",
    });
  }

  if (tag === "boyco") {
    filters.push({
      id: "category",
      value: "boyco",
    });
  }

  return filters;
});

export const baseChainFilter = atom<Filter[]>((get) => {
  const tag = get(tagAtom);

  const filters: Filter[] = [];
  const chainIds: number[] = [];

  switch (tag) {
    case "ethereum":
      chainIds.push(EthereumMainnet.id);
      break;
    case "base":
      chainIds.push(Base.id);
      break;
    case "arbitrum":
      chainIds.push(ArbitrumOne.id);
      break;
    case "plume":
      chainIds.push(Plume.id);
      break;
    case "corn":
      chainIds.push(Corn.id);
      break;
    case "sonic":
      chainIds.push(Sonic.id);
      break;
    case "hyperliquid":
      chainIds.push(Hyperevm.id);
      break;
    default:
      break;
  }

  if (chainIds.length > 0) {
    filters.push({
      id: "chainId",
      value: chainIds,
      condition: "inArray",
    });
  }

  const isTestnet = get(isTestnetAtom);
  if (!isTestnet) {
    filters.push({
      id: "chainId",
      value: EthereumSepolia.id,
      condition: "ne",
    });
  }

  return filters;
});

export const marketFiltersAtom = atom<Filter[]>([]);

export const marketSortAtom = atom<Sorting[]>([
  {
    id: "yieldRate",
    desc: true,
  },
]);

export const marketSearchAtom = atom<string>("");

export const customTokenDataAtom = atom<CustomTokenDataElement[]>([]);

export const marketPageAtom = atom<number>(1);

export const loadableExploreAssetFilterOptionsAtom =
  atomWithQuery<ExploreSettingsMarketResponse>((get) => ({
    queryKey: [
      "explore-asset-filter-options",
      {
        marketFilters: get(marketFiltersAtom),
        baseFilters: get(baseFilter),
        baseChainFilters: get(baseChainFilter),
      },
    ],
    queryFn: async () => {
      const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG;

      const filters: Filter[] = [];

      const baseFilters = get(baseFilter);
      const baseChainFilters = get(baseChainFilter);
      const marketFilters = get(marketFiltersAtom);

      for (let i = 0; i < marketFilters.length; i++) {
        const newFilter = marketFilters[i];

        if (Array.isArray(newFilter.value) && newFilter.value.length === 0) {
          // skip
        } else if (
          newFilter.id === "incentiveTokenIds" ||
          newFilter.id === "inputTokenId"
        ) {
          // skip
        } else {
          filters.push(newFilter);
        }
      }

      filters.push(...baseFilters);
      filters.push(...baseChainFilters);

      return api
        .marketControllerGetMarketSettings({
          filters,
        })
        .then((res) => res.data);
    },
    ...defaultQueryOptions,
  }));

export const loadableExploreMarketAtom = atomWithQuery<ExploreMarketResponse>(
  (get) => ({
    queryKey: [
      "explore-market",
      {
        filters: [
          ...get(baseFilter),
          ...get(baseChainFilter),
          ...get(marketFiltersAtom),
        ],
        sorting: get(marketSortAtom),
        page: get(marketPageAtom),
        searchKey: get(marketSearchAtom).trim(),
        customTokenData: get(customTokenDataAtom),
      },
    ],
    queryFn: async ({ queryKey: [, params] }) => {
      const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG;

      let filters: Filter[] = [];

      const baseFilters = get(baseFilter);
      const baseChainFilters = get(baseChainFilter);
      const marketFilters = get(marketFiltersAtom);

      filters.push(...baseFilters);
      filters.push(...baseChainFilters);
      filters.push(...marketFilters);

      /**
       * @todo PLUME -- Remove this on Plume launch
       * @note Hides Plume markets from everywhere except testnet.royco.org and plume.royco.org
       */
      const hidePlumeMarketsFilter: Filter[] =
        frontendTag !== "testnet" &&
        frontendTag !== "plume" &&
        frontendTag !== "dev" &&
        frontendTag !== "internal"
          ? [
              {
                id: "chainId",
                value: Plume.id,
                condition: "ne",
              },
            ]
          : [];
      filters.push(...hidePlumeMarketsFilter);

      // Remove empty filters
      filters = filters.filter((filter) => {
        if (Array.isArray(filter.value) && filter.value.length === 0) {
          return false;
        }
        return true;
      });

      const customTokenData = get(customTokenDataAtom);
      const sorting = get(marketSortAtom);
      const page = get(marketPageAtom) ?? 1;
      const searchKey = get(marketSearchAtom);

      const response = await api.marketControllerGetMarkets({
        filters,
        sorting,
        customTokenData,
        page: {
          index: page,
          size: EXPLORE_PAGE_SIZE,
        },
        searchKey,
      });

      return response.data;
    },
    ...defaultQueryOptions,
  })
);

export const vaultPageAtom = atom<number>(1);

export const loadableExploreVaultAtom = atomWithQuery<ExploreVaultResponse>(
  (get) => ({
    queryKey: [
      "explore-vault",
      {
        filters: [
          {
            id: "chainId",
            value: EthereumMainnet.id,
          },
        ],
        page: get(vaultPageAtom),
      },
    ],
    queryFn: async ({ queryKey: [, params] }) => {
      const _params = params as any;

      const body: any = {};

      if (_params.filters.length > 0) {
        body.filters = _params.filters.filter((filter: Filter) => {
          if (
            filter.condition === "inArray" &&
            Array.isArray(filter.value) &&
            filter.value.length === 0
          ) {
            return false;
          }
          return true;
        });
      }

      body.page = {
        index: _params.page,
        size: EXPLORE_PAGE_SIZE,
      };

      const response = await api.vaultControllerGetVaults(body);

      return response.data;
    },
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchIntervalInBackground: true, // Refetch in background
    placeholderData: keepPreviousData, // Keep previous data while fetching new data
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    cacheTime: 1000 * 60 * 5, // Keep data in cache for 5 minutes
  })
);
