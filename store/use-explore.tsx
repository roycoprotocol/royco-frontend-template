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
import { getSubdomain } from "./use-global-states";

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
  name: "Incentivized Action",
  input_token_id: "Asset",
  chain_id: "Chain",
  market_type: "Exit",
  total_incentive_amounts_usd: "Incentives Offered",
  locked_quantity_usd: "TVL",
  annual_change_ratio: "Net APY",
  chain: "Chain",
};

export const useExplore = create<ExploreState>((set) => ({
  exploreView: "list" as string,
  setExploreView: (exploreView: string) => set({ exploreView }),
  exploreSortKey: "total_incentive_amounts_usd" as string,
  setExploreSortKey: (exploreSortKey: string) => set({ exploreSortKey }),
  exploreFilters: [
    ...(process.env.NEXT_PUBLIC_FRONTEND_TYPE !== "TESTNET"
      ? [
          {
            id: "chain_id",
            value: sepolia.id,
            condition: "NOT",
          },
        ]
      : []),
    ...(typeof window !== "undefined"
      ? (() => {
          const subdomain = getSubdomain();

          switch (subdomain) {
            case "ethereum":
              return [
                {
                  id: "chain_id",
                  value: EthereumMainnet.id,
                },
              ];
            case "sepolia":
              return [
                {
                  id: "chain_id",
                  value: EthereumSepolia.id,
                },
              ];
            case "base":
              return [
                {
                  id: "chain_id",
                  value: Base.id,
                },
              ];
            case "arbitrum":
              return [
                {
                  id: "chain_id",
                  value: ArbitrumOne.id,
                },
              ];
            case "corn":
              return [
                {
                  id: "chain_id",
                  value: Corn.id,
                },
              ];
            case "plume":
              return [
                {
                  id: "chain_id",
                  value: Plume.id,
                },
              ];
            default:
              return [];
          }
        })()
      : []),
  ] as Array<MarketFilter>,
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
