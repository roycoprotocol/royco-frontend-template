import {
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
import { defaultQueryOptions } from "@/utils/query";
import { atomWithLocation } from "jotai-location";
import { atomWithStorage } from "jotai/vanilla/utils";
import { customTokenDataAtom } from "../global";

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
    // show all markets (verified and unverified) on explore/all page
    filters.push({
      id: "isVerified",
      value: get(marketFiltersVerifiedAtom),
    });
  } else {
    // or show only verified markets on home page
    filters.push({
      id: "isVerified",
      value: true,
    });
  }

  const tag = get(tagAtom);

  // hide markets with fillableUsd less than 0 on all frontend except "boyco" and "plume"
  if (tag !== "boyco" && tag !== "plume") {
    filters.push({
      id: "fillableUsd",
      value: 0,
      condition: "gt",
      join: "or",
    });

    filters.push({
      id: "marketType",
      value: 2,
      join: "or",
    });
  }

  // show only "boyco" markets on "boyco" frontend
  if (tag === "boyco") {
    filters.push({
      id: "category",
      value: "boyco",
    });
  }

  return filters;
});

export const baseChainFilter = atom<Filter[]>((get) => {
  const chainIds: number[] = [];
  const tag = get(tagAtom);

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

  const filters: Filter[] = [];

  if (chainIds.length > 0) {
    filters.push({
      id: "chainId",
      value: chainIds,
      condition: "inArray",
    });
  }

  // remove sepolia if it is not testnet frontend
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

export const marketPageAtom = atom<number>(1);

// explore asset filter options
export const loadableExploreAssetFilterOptionsAtom =
  atomWithQuery<ExploreSettingsMarketResponse>((get) => ({
    queryKey: [
      "explore-asset-filter-options",
      {
        filters: [
          ...get(baseFilter),
          ...get(baseChainFilter),
          ...get(marketFiltersAtom),
        ],
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

          if (
            filter.id === "incentiveTokenIds" ||
            filter.id === "inputTokenId"
          ) {
            return false;
          }

          return true;
        });
      }

      const response = await api.marketControllerGetMarketSettings(body);

      return response.data;
    },
    ...defaultQueryOptions,
  }));

// explore markets
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

// explore vaults
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
    ...defaultQueryOptions,
  })
);
