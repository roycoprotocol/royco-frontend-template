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

export const EXPLORE_PAGE_SIZE = 20;

export const baseFilter = atom<Filter[]>((get) => {
  const filters: Filter[] = [];

  filters.push({
    id: "isVerified",
    value: true,
  });

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

const _marketSearchAtom = atom<string>("");
export const marketSearchAtom = atom<string, [string], void>(
  (get) => get(_marketSearchAtom),
  (get, set, update) => {
    set(_marketSearchAtom, update.trim());
  }
);

export const customTokenDataAtom = atom<CustomTokenDataElement[]>([]);

export const marketPageAtom = atom<number>(1);

export const loadableExploreAssetFilterOptionsAtom =
  atomWithQuery<ExploreSettingsMarketResponse>((get) => ({
    queryKey: ["explore-asset-filter-options"],
    queryFn: async ({ queryKey: [, params] }) => {
      const response = await api.marketControllerGetMarketSettings();

      return response.data;
    },
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
        searchKey: get(marketSearchAtom),
        customTokenData: get(customTokenDataAtom),
      },
    ],
    queryFn: async ({ queryKey: [, params] }) => {
      const _params = params as any;

      const body: any = {};

      if (_params.searchKey.length > 0) {
        body.searchKey = _params.searchKey;
      }
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
      if (_params.sorting.length > 0) {
        body.sorting = _params.sorting;
      }
      if (_params.customTokenData.length > 0) {
        body.customTokenData = _params.customTokenData;
      }

      body.page = {
        index: _params.page,
        size: EXPLORE_PAGE_SIZE,
      };

      const response = await api.marketControllerGetMarkets(body);

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
