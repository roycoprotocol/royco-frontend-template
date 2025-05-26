import { atomWithQuery } from "jotai-tanstack-query";
import { api } from "@/app/api/royco";
import { defaultQueryOptions } from "@/utils/query";
import { EnrichedVault } from "royco/api";
import { enrichedVaultIdAtom } from "./boring-positions";
import { lastRefreshTimestampAtom } from "../global";
import { customTokenDataAtom } from "../global";

export const loadableEnrichedVaultAtom = atomWithQuery<EnrichedVault>(
  (get) => ({
    queryKey: [
      "enriched-vault",
      {
        enrichedVaultId: get(enrichedVaultIdAtom),
        customTokenData: get(customTokenDataAtom),
        lastRefreshTimestamp: get(lastRefreshTimestampAtom),
      },
    ],
    queryFn: async () => {
      const enrichedVaultId = get(enrichedVaultIdAtom);
      const customTokenData = get(customTokenDataAtom);

      if (!enrichedVaultId) throw new Error("Enriched vault ID is not set");

      return api
        .vaultControllerGetVaultInfo(enrichedVaultId, {
          customTokenData,
        })
        .then((res) => res.data);
    },
    ...defaultQueryOptions,
    enabled: Boolean(get(enrichedVaultIdAtom)),
  })
);
