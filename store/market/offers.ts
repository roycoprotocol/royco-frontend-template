import { api } from "@/app/api/royco";
import { atomWithQuery } from "jotai-tanstack-query";
import { enrichedMarketIdAtom } from "./atoms";
import {
  accountAddressAtom,
  customTokenDataAtom,
  lastRefreshTimestampAtom,
} from "../global";
import { RecipeOfferResponse, VaultOfferResponse } from "royco/api";
import { atom } from "jotai";
import { defaultQueryOptions } from "@/utils/query";
import { userTypeAtom } from "./atoms";

export const recipeOffersPageIndexAtom = atom(1);
export const loadableRecipeOffersAtom = atomWithQuery<RecipeOfferResponse>(
  (get) => ({
    queryKey: [
      "recipe-offers",
      {
        enrichedMarketId: get(enrichedMarketIdAtom),
        userType: get(userTypeAtom),
        accountAddress: get(accountAddressAtom),
        customTokenData: get(customTokenDataAtom),
        pageIndex: get(recipeOffersPageIndexAtom),
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
        .offerControllerGetRecipeOffers({
          filters: [
            {
              id: "rawMarketRefId",
              value: enrichedMarketId,
            },
            {
              id: "accountAddress",
              value: accountAddress,
            },
            {
              id: "offerSide",
              value: get(userTypeAtom),
            },
          ],
          page: {
            index: get(recipeOffersPageIndexAtom),
            size: 100,
          },
          customTokenData,
        })
        .then((res) => res.data);
    },
    ...defaultQueryOptions,
    enabled: Boolean(
      get(enrichedMarketIdAtom)?.split("_")[1] === "0" &&
        get(accountAddressAtom)
    ),
  })
);

export const vaultOffersPageIndexAtom = atom(1);
export const loadableVaultOffersAtom = atomWithQuery<VaultOfferResponse>(
  (get) => ({
    queryKey: [
      "vault-offers",
      {
        enrichedMarketId: get(enrichedMarketIdAtom),
        accountAddress: get(accountAddressAtom),
        customTokenData: get(customTokenDataAtom),
        pageIndex: get(vaultOffersPageIndexAtom),
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
        .offerControllerGetVaultOffers({
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
            index: get(vaultOffersPageIndexAtom),
            size: 100,
          },
          customTokenData,
        })
        .then((res) => res.data);
    },
    ...defaultQueryOptions,
  })
);
