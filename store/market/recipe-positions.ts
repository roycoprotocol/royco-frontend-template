import { api } from "@/app/api/royco";
import { atomWithQuery } from "jotai-tanstack-query";
import { enrichedMarketIdAtom } from "./atoms";
import {
  accountAddressAtom,
  customTokenDataAtom,
  lastRefreshTimestampAtom,
} from "../global";
import {
  SpecificRecipePositionResponse,
  RecipePositionResponse,
} from "royco/api";
import {
  defaultQueryOptions,
  defaultQueryOptionsFastRefresh,
} from "@/utils/query";
import { atom } from "jotai";

export const loadableSpecificRecipePositionAtom =
  atomWithQuery<SpecificRecipePositionResponse>((get) => ({
    queryKey: [
      "specific-recipe-position",
      {
        enrichedMarketId: get(enrichedMarketIdAtom),
        accountAddress: get(accountAddressAtom),
        customTokenData: get(customTokenDataAtom),
        lastRefreshTimestamp: get(lastRefreshTimestampAtom),
      },
    ],
    queryFn: async () => {
      const enrichedMarketId = get(enrichedMarketIdAtom);
      const accountAddress = get(accountAddressAtom);
      const customTokenData = get(customTokenDataAtom);

      if (!enrichedMarketId) throw new Error("Enriched market ID is not set");
      if (!accountAddress) throw new Error("Account address is not set");

      return api
        .positionControllerGetSpecificRecipePosition(
          enrichedMarketId,
          accountAddress,
          {
            customTokenData,
          }
        )
        .then((res) => res.data);
    },
    ...defaultQueryOptionsFastRefresh,
    enabled: Boolean(get(enrichedMarketIdAtom)?.split("_")[1] === "0"),
  }));

export const recipePositionsPageIndexAtom = atom(1);
export const loadableRecipePositionsAtom =
  atomWithQuery<RecipePositionResponse>((get) => ({
    queryKey: [
      "recipe-positions",
      {
        enrichedMarketId: get(enrichedMarketIdAtom),
        accountAddress: get(accountAddressAtom),
        customTokenData: get(customTokenDataAtom),
        pageIndex: get(recipePositionsPageIndexAtom),
        lastRefreshTimestamp: get(lastRefreshTimestampAtom),
      },
    ],
    queryFn: async () => {
      const enrichedMarketId = get(enrichedMarketIdAtom);
      const accountAddress = get(accountAddressAtom);
      const customTokenData = get(customTokenDataAtom);

      if (!enrichedMarketId) throw new Error("Enriched market ID is not set");
      if (!accountAddress) throw new Error("Account address is not set");

      const body = {
        filters: [
          {
            id: "rawMarketRefId",
            value: enrichedMarketId,
          },
          {
            id: "accountAddress",
            value: accountAddress,
          },
        ],
        page: {
          index: get(recipePositionsPageIndexAtom),
          size: 20,
        },
        customTokenData,
        sorting: [
          {
            id: "blockTimestamp",
            desc: false,
          },
        ],
      };

      return api
        .positionControllerGetRecipePositions(body)
        .then((res) => res.data);
    },
    ...defaultQueryOptionsFastRefresh,
    enabled: Boolean(get(enrichedMarketIdAtom)?.split("_")[1] === "0"),
  }));
