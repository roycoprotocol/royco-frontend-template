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
    enabled: Boolean(get(accountAddressAtom)),
    ...defaultQueryOptions,
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
