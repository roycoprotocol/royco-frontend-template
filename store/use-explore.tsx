import { MarketFilter } from "royco/queries";
import { BaseSortingFilter } from "royco/types";
import { sepolia } from "viem/chains";
import { create } from "zustand";
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
  exploreAllMarkets: boolean;
  setExploreAllMarkets: (exploreAllMarkets: boolean) => void;
}

export const exploreColumnNames = {
  name: "Market",
  input_token_id: "Asset",
  chain_id: "Chain",
  market_type: "Lockup",
  total_incentive_amounts_usd: "Incentives",
  locked_quantity_usd: "TVL",
  annual_change_ratio: "Net APY",
  chain: "Chain",
  pool_type: "Pool Type",
  app_type: "Gem Allocation",
  quantity_ip_usd: "Fillable",
};

export const exploreColumnTooltips = {
  name: (
    <span>
      A Royco Action Market is a market that incentives an onchain action.{" "}
      <a
        className="underline"
        target="_blank"
        rel="noreferrer noopener"
        href="https://docs.royco.org/for-users/faqs#what-is-an-a-royco-action-market"
      >
        Learn more
      </a>
    </span>
  ),
  annual_change_ratio: (
    <span>
      The combined incentives you receive for performing the action.{" "}
      <a
        className="underline"
        target="_blank"
        rel="noreferrer noopener"
        href="https://docs.royco.org/for-users/faqs#what-types-of-incentives-can-i-receive"
      >
        Learn more
      </a>
    </span>
  ),
  market_type: (
    <span>
      If the market requires a lockup. Some markets may allow early exit, but
      you must forfeit all incentives.{" "}
      <a
        className="underline"
        target="_blank"
        rel="noreferrer noopener"
        href="https://docs.royco.org/for-users/faqs#what-types-of-incentives-can-i-receive"
      >
        Learn more
      </a>
    </span>
  ),
};

export const getExploreFilters = () => {
  let filters: MarketFilter[] = [];

  const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

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

  // if (frontendTag !== "boyco" && frontendTag !== "dev") {
  //   filters.push({
  //     id: "category",
  //     value: "boyco",
  //     condition: "NOT",
  //   });
  // }

  // Filters based on Chain
  if (frontendTag === "ethereum") {
    filters.push({
      id: "chain_id",
      value: EthereumMainnet.id,
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
  } else if (frontendTag === "sonic") {
    filters.push({
      id: "chain_id",
      value: Sonic.id,
    });
  } else if (frontendTag === "hyperliquid") {
    filters.push({
      id: "chain_id",
      value: Hyperevm.id,
    });
  }

  if (frontendTag === "boyco") {
    filters.push({
      id: "category",
      value: "boyco",
    });
  }

  return filters;
};

export const useExplore = create<ExploreState>((set) => ({
  exploreView: "list" as string,
  setExploreView: (exploreView: string) => set({ exploreView }),
  exploreSortKey: "total_incentive_amounts_usd" as string,
  setExploreSortKey: (exploreSortKey: string) => set({ exploreSortKey }),
  exploreFilters: getExploreFilters(),
  setExploreFilters: (exploreFilters: Array<MarketFilter>) =>
    set({ exploreFilters }),
  exploreSort: [
    {
      id: "total_incentive_amounts_usd",
      desc: true,
    },
    {
      id: "quantity_ip_usd",
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
    pool_type: true,
    app_type: true,
    quantity_ip_usd: true,
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
  exploreAllMarkets: false,
  setExploreAllMarkets: (exploreAllMarkets: boolean) =>
    set({ exploreAllMarkets }),
}));
