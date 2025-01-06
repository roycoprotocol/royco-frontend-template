import { MarketFilter } from "@/sdk/queries";
import { BaseSortingFilter } from "@/sdk/types";
import { sepolia } from "viem/chains";
import { create } from "zustand";
import {
  ArbitrumOne,
  Base,
  Corn,
  EthereumMainnet,
  EthereumSepolia,
  Plume,
} from "royco/constants";
import { getFrontendTag } from "./use-global-states";

export type ExploreCustomPoolParam = {
  id: string;
  type: string;
  value: number;
  ref: string | null;
};

interface ExploreState {
  exploreView: string;
  setExploreView: (exploreView: string) => void;
  exploreSortKey: string;
  setExploreSortKey: (exploreSortKey: string) => void;
  exploreFilters: Array<MarketFilter>;
  setExploreFilters: (exploreFilters: Array<MarketFilter>) => void;
  exploreSort: Array<BaseSortingFilter>;
  setExploreSort: (exploreSort: Array<BaseSortingFilter>) => void;
  explorePoolSelected: string | null;
  setExplorePoolSelected: (explorePoolSelected: string | null) => void;
  exploreSearch: string;
  setExploreSearch: (exploreSearch: string) => void;
  explorePageIndex: number;
  setExplorePageIndex: (explorePageIndex: number) => void;
  exploreColumnVisibility: {
    [key: string]: boolean;
  };
  setExploreColumnVisibility: (exploreColumnVisibility: {
    [key: string]: boolean;
  }) => void;
  exploreColumnNames: {
    [key: string]: string;
  };
  exploreCustomPoolParams: Array<ExploreCustomPoolParam>;
  setExploreCustomPoolParams: (
    exploreCustomPoolParams: Array<ExploreCustomPoolParam>
  ) => void;
  exploreIsVerified: boolean;
  setExploreIsVerified: (exploreIsVerified: boolean) => void;
}

export const exploreColumnNames = {
  name: "Title",
  input_token_id: "Asset",
  chain_id: "Chain",
  market_type: "Payout",
  total_incentive_amounts_usd: "Add. Incentives",
  locked_quantity_usd: "TVL",
  annual_change_ratio: "Net APR",
  chain: "Chain",
};

export const getExploreFilters = () => {
  let filters: MarketFilter[] = [];

  const frontendTag =
    typeof window !== "undefined" ? getFrontendTag() : "default";

  if (
    frontendTag !== "dev" &&
    frontendTag !== "testnet" &&
    frontendTag !== "internal"
  ) {
    filters.push({
      id: "chain_id",
      value: sepolia.id,
      condition: "NOT",
    });
  }

  // Filters based on Chain
  if (frontendTag === "ethereum") {
    filters.push({
      id: "chain_id",
      value: EthereumMainnet.id,
    });
  } else if (frontendTag === "testnet") {
    filters.push({
      id: "chain_id",
      value: EthereumSepolia.id,
    });
  } else if (frontendTag === "base") {
    filters.push({
      id: "chain_id",
      value: Base.id,
    });
  } else if (frontendTag === "arbitrum") {
    filters.push({
      id: "chain_id",
      value: ArbitrumOne.id,
    });
  } else if (frontendTag === "plume") {
    filters.push({
      id: "chain_id",
      value: Plume.id,
    });
  } else if (frontendTag === "corn") {
    filters.push({
      id: "chain_id",
      value: Corn.id,
    });
  }

  return filters;
};

export const useExplore = create<ExploreState>((set) => ({
  exploreView: "list" as string,
  setExploreView: (exploreView: string) => set({ exploreView }),
  exploreSortKey: "total_incentive_amounts_usd" as string,
  setExploreSortKey: (exploreSortKey: string) => set({ exploreSortKey }),
  exploreFilters: typeof window !== "undefined" ? getExploreFilters() : [],
  setExploreFilters: (exploreFilters: Array<MarketFilter>) =>
    set({ exploreFilters }),
  exploreSort: [
    {
      id: "locked_quantity_usd",
      desc: true,
    },
  ],
  setExploreSort: (exploreSort: Array<BaseSortingFilter>) =>
    set({ exploreSort }),
  explorePoolSelected: null,
  setExplorePoolSelected: (explorePoolSelected: string | null) =>
    set({ explorePoolSelected }),
  exploreSearch: "",
  setExploreSearch: (exploreSearch: string) => set({ exploreSearch }),
  explorePageIndex: 0,
  setExplorePageIndex: (explorePageIndex: number) => set({ explorePageIndex }),
  exploreColumnVisibility: {
    name: true,
    input_token_id: true,
    market_type: true,
    locked_quantity_usd: true,
    total_incentive_amounts_usd: true,
    annual_change_ratio: true,
    chain_id: true,
  },
  exploreColumnNames: exploreColumnNames,
  setExploreColumnVisibility: (exploreColumnVisibility) =>
    set({ exploreColumnVisibility }),
  exploreCustomPoolParams: [],
  setExploreCustomPoolParams: (exploreCustomPoolParams) =>
    set({ exploreCustomPoolParams }),
  exploreIsVerified: true,
  setExploreIsVerified: (exploreIsVerified: boolean) =>
    set({ exploreIsVerified }),
}));
