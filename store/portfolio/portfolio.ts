import { api } from "@/app/api/royco";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { BaseEnrichedTokenData, GlobalPositionResponse } from "royco/api";
import { baseChainFilter } from "../explore/explore-market";
import { accountAddressAtom, lastRefreshTimestampAtom } from "../global";
import { ModalTxOption } from "@/types";
import { defaultQueryOptions } from "@/utils/query";

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
      const _params = params as any;

      const body: any = {};
      if (_params.filters.length > 0) {
        body.filters = _params.filters;
      }

      return api
        .positionControllerGetGlobalPositions(_params.address, {
          ...body,
          sorting: [
            {
              id: "yieldRate",
              desc: true,
            },
            {
              id: "unlockTimestamp",
              desc: false,
            },
            {
              id: "name",
              desc: false,
            },
          ],
        })
        .then((res) => res.data);
    },
    enabled: Boolean(get(accountAddressAtom)),
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchIntervalInBackground: true, // Refetch in background
    refetchInterval: 1000 * 60, // Check for updates every 1 minute
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 5, // Keep data in cache for 5 minutes
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
