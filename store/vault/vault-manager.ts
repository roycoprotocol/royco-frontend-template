import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

import { api } from "@/app/api/royco";
import { BoringVault, boringVaultAtom } from "./atom/boring-vault";
import { VaultInfoResponse } from "royco/api";

export enum Vaults {
  BoringVault = "boring",
}

export type TypeVaultParams = {
  vaultType: Vaults;
  chainId: number;
  vaultId: string;
};
export const vaultParamsAtom = atom<TypeVaultParams | null>(null);

export const vaultManagerAtom = atom<BoringVault | null>((get) => {
  const vault_params = get(vaultParamsAtom);

  if (vault_params?.vaultType === Vaults.BoringVault) {
    return get(boringVaultAtom);
  }

  return null;
});

export const loadableVaultMetadataAtom = atomWithQuery<VaultInfoResponse>(
  (get) => ({
    queryKey: ["vaults", get(vaultParamsAtom)],
    queryFn: async ({ queryKey: [, params] }) => {
      const response = await api.vaultControllerGetVaultInfo(
        `${(params as any)?.chainId}_${(params as any)?.vaultId}`
      );

      return response.data;
    },
    enabled: !!get(vaultParamsAtom),
  })
);

// @ts-ignore
export const vaultMetadataAtom = atom<{ data: VaultInfoResponse }>((get) => {
  const { data } = get(loadableVaultMetadataAtom);
  return { data };
});
