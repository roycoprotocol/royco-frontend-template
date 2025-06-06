import { api } from "@/app/api/royco";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import {
  ActivityResponse,
  BaseEnrichedTokenData,
  Filter,
  GlobalPositionResponse,
} from "royco/api";
import { baseChainFilter } from "../explore/explore-market";
import {
  accountAddressAtom,
  isAuthenticatedAtom,
  lastRefreshTimestampAtom,
} from "../global";
import { ModalTxOption } from "@/types";
import { defaultQueryOptions } from "@/utils/query";

export const portfolioActivityPageIndexAtom = atom(1);
export const loadableActivityAtom = atomWithQuery<ActivityResponse>((get) => ({
  queryKey: [
    "portfolio-activity",
    {
      accountAddress: get(accountAddressAtom),
      lastRefreshTimestamp: get(lastRefreshTimestampAtom),
      pageIndex: get(portfolioActivityPageIndexAtom),
      filters: [...get(baseChainFilter)],
    },
  ],
  queryFn: async () => {
    const accountAddress = get(accountAddressAtom);
    const baseChainFilters =
      process.env.NEXT_PUBLIC_FRONTEND_TAG === "testnet" ||
      process.env.NEXT_PUBLIC_FRONTEND_TAG === "dev" ||
      process.env.NEXT_PUBLIC_FRONTEND_TAG === "internal"
        ? []
        : get(baseChainFilter);

    if (!accountAddress) {
      throw new Error("Wallet not connected");
    }

    let filters: Filter[] = [
      {
        id: "accountAddress",
        value: accountAddress,
      },
      ...baseChainFilters,
    ];

    return api
      .activityControllerGetActivities({
        filters,
        sorting: [
          {
            id: "blockTimestamp",
            desc: true,
          },
        ],
        page: {
          index: get(portfolioActivityPageIndexAtom),
          size: 6,
        },
      })
      .then((res) => res.data);
  },
  ...defaultQueryOptions,
}));

export const loadablePortfolioPositionsAtom =
  atomWithQuery<GlobalPositionResponse>((get) => ({
    queryKey: [
      "portfolio-positions",
      {
        address: get(accountAddressAtom),
        filters: [...get(baseChainFilter)],
        lastRefreshTimestamp: get(lastRefreshTimestampAtom),
      },
    ],
    queryFn: async ({ queryKey: [, params] }) => {
      const accountAddress = get(accountAddressAtom);
      const baseChainFilters =
        process.env.NEXT_PUBLIC_FRONTEND_TAG === "testnet" ||
        process.env.NEXT_PUBLIC_FRONTEND_TAG === "dev" ||
        process.env.NEXT_PUBLIC_FRONTEND_TAG === "internal"
          ? []
          : get(baseChainFilter);

      if (!accountAddress) {
        throw new Error("Wallet not connected");
      }

      const _params = params as any;

      // const body: any = {};
      // if (_params.filters.length > 0) {
      //   body.filters = _params.filters;
      // }

      return api
        .positionControllerGetGlobalPositions(_params.address, {
          // ...body,
          filters: [...baseChainFilters],
          sorting: [
            {
              id: "depositToken.tokenAmountUsd",
              desc: true,
            },
            {
              id: "yieldRate",
              desc: true,
            },
            {
              id: "name",
              desc: false,
            },
          ],
        })
        .then((res) => res.data);
    },
    ...defaultQueryOptions,
    enabled: Boolean(get(accountAddressAtom)),
    // staleTime: (query) => {
    //   const params = query.queryKey[1] as any;
    //   return params.address === get(accountAddressAtom) ? 30000 : 0;
    // },
  }));

export const portfolioTransactionsAtom = atom<{
  title: string;
  description?: string;
  successTitle?: string;
  steps: ModalTxOption[];
  token: BaseEnrichedTokenData;
  metadata?: {
    label: string;
    value: string;
  }[];
} | null>(null);
