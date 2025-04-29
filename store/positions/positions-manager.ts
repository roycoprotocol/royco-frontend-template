import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

import { api } from "@/app/api/royco";
import { VaultInfoResponse } from "@/app/api/royco/data-contracts";

export const loadableVaultPositionsManagerAtom =
  atomWithQuery<VaultInfoResponse>((get) => ({
    queryKey: ["vaults", get(vaultParamsAtom)],
    queryFn: async ({ queryKey: [, params] }) => {
      const response = await api.vaultControllerGetVaultInfo(
        `${(params as any)?.chainId}_${(params as any)?.vaultId}`
      );

      return response.data;
    },
    enabled: !!get(vaultParamsAtom),
  }));

// @ts-ignore
export const vaultPositionsManagerAtom = atom<{ data: VaultInfoResponse }>(
  (get) => {
    const { data } = get(loadableVaultPositionsManagerAtom);
    return { data };
  }
);

export const loadableRecipePositionsManagerAtom =
  atomWithQuery<VaultInfoResponse>((get) => ({
    queryKey: ["vaults", get(vaultParamsAtom)],
    queryFn: async ({ queryKey: [, params] }) => {
      const response = await api.vaultControllerGetVaultInfo(
        `${(params as any)?.chainId}_${(params as any)?.vaultId}`
      );

      return response.data;
    },
    enabled: !!get(vaultParamsAtom),
  }));

// @ts-ignore
export const recipePositionsManagerAtom = atom<{ data: VaultInfoResponse }>(
  (get) => {
    const { data } = get(loadableRecipePositionsManagerAtom);
    return { data };
  }
);
