import { api } from "@/app/api/royco";
import { atomWithQuery } from "jotai-tanstack-query";
import {
  accountAddressAtom,
  customTokenDataAtom,
  lastRefreshTimestampAtom,
} from "../global";
import {
  SpecificBoringPositionResponse,
  BoringPositionResponse,
} from "royco/api";
import { defaultQueryOptions } from "@/utils/query";
import { atom } from "jotai";
import { locationAtom } from "../market";

export const enrichedVaultIdAtom = atom(
  (get) => {
    const location = get(locationAtom);
    const pathSegments = (location.pathname ?? "").split("/").filter(Boolean);

    // The URL pattern is /vault/boring/[chain_id]/[vault_address]
    if (
      pathSegments.length >= 4 &&
      pathSegments[0] === "vault" &&
      pathSegments[1] === "boring"
    ) {
      const chainId = pathSegments[2];
      const vaultAddress = pathSegments[3];
      return `${chainId}_${vaultAddress}`;
    }

    return null;
  },
  (get, set, newValue: string | null) => {
    // No need to update URL since we're using path parameters
    // This is a read-only atom for the enrichedMarketId
  }
);

export const loadableSpecificBoringPositionAtom =
  atomWithQuery<SpecificBoringPositionResponse>((get) => ({
    queryKey: [
      "specific-boring-position",
      {
        enrichedVaultId: get(enrichedVaultIdAtom),
        accountAddress: get(accountAddressAtom),
        customTokenData: get(customTokenDataAtom),
        lastRefreshTimestamp: get(lastRefreshTimestampAtom),
      },
    ],
    queryFn: async () => {
      const enrichedVaultId = get(enrichedVaultIdAtom);
      const accountAddress = get(accountAddressAtom);
      const customTokenData = get(customTokenDataAtom);

      if (!enrichedVaultId) throw new Error("Enriched vault ID is not set");
      if (!accountAddress) throw new Error("Account address is not set");

      return api
        .positionControllerGetSpecificBoringPosition(
          enrichedVaultId,
          accountAddress,
          {
            customTokenData,
          }
        )
        .then((res) => res.data);
    },
    ...defaultQueryOptions,
    enabled: Boolean(get(enrichedVaultIdAtom)),
  }));

export const boringPositionsPageIndexAtom = atom(1);
export const loadableBoringPositionsAtom =
  atomWithQuery<BoringPositionResponse>((get) => ({
    queryKey: [
      "boring-positions",
      {
        enrichedVaultId: get(enrichedVaultIdAtom),
        accountAddress: get(accountAddressAtom),
        customTokenData: get(customTokenDataAtom),
        pageIndex: get(boringPositionsPageIndexAtom),
        lastRefreshTimestamp: get(lastRefreshTimestampAtom),
      },
    ],
    queryFn: async () => {
      const enrichedVaultId = get(enrichedVaultIdAtom);
      const accountAddress = get(accountAddressAtom);
      const customTokenData = get(customTokenDataAtom);

      if (!enrichedVaultId) throw new Error("Enriched vault ID is not set");
      if (!accountAddress) throw new Error("Account address is not set");

      const body = {
        filters: [
          {
            id: "boringVaultRefId",
            value: enrichedVaultId,
          },
          {
            id: "accountAddress",
            value: accountAddress,
          },
        ],
        page: {
          index: get(boringPositionsPageIndexAtom),
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
        .positionControllerGetBoringPositions(body)
        .then((res) => res.data);
    },
    ...defaultQueryOptions,
    enabled: Boolean(get(enrichedVaultIdAtom)),
  }));
