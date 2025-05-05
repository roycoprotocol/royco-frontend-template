import { api } from "@/app/api/royco";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { GlobalPositionResponse } from "royco/api";
import { baseChainFilter } from "../explore/explore-market";

export const userAddressAtom = atom<string | null>(null);

export const loadablePortfolioPositionsAtom =
  atomWithQuery<GlobalPositionResponse>((get) => ({
    queryKey: [
      "portfolio-positions",
      {
        address: get(userAddressAtom),
        filters: get(baseChainFilter),
      },
    ],
    queryFn: async ({ queryKey: [, params] }) => {
      const _params = params as any;

      const body: any = {};
      if (_params.filters.length > 0) {
        body.filters = _params.filters;
      }

      const response = await api.positionControllerGetGlobalPositions(
        _params.address,
        body
      );

      return response.data;
    },
    enabled: !!get(userAddressAtom),
  }));

export const portfolioPositionsAtom = atom<{ data: GlobalPositionResponse }>(
  // @ts-ignore
  (get) => {
    const { data } = get(loadablePortfolioPositionsAtom);
    return { data };
  }
);
