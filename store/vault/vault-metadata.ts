import { atomWithRefresh, loadable } from "jotai/utils";

import { vaultParamsAtom } from "./vault-manager";
import { api } from "@/app/api/royco";
import { atom } from "jotai";
import { VaultInfoResponse } from "@/app/api/royco/data-contracts";

export const asyncVaultMetadataAtom = atomWithRefresh(async (get) => {
  const vault_params = get(vaultParamsAtom);

  if (!vault_params) {
    return null;
  }

  const vault_info = await api.vaultControllerGetVaultInfo(
    `${vault_params.chain_id}_${vault_params.vault_id}`
  );

  return vault_info?.data;
});

export const loadableVaultMetadataAtom = loadable(asyncVaultMetadataAtom);

export const vaultMetadataAtom = atom<{
  isLoading: boolean;
  data: VaultInfoResponse;
  isError: boolean;
  error: any;
  // @ts-ignore
}>((get) => {
  const vault = get(loadableVaultMetadataAtom);

  return {
    isLoading: vault.state === "loading",
    data:
      vault.state === "hasData"
        ? {
            ...vault.data,
            chainId: Number(vault.data?.chainId),
            yieldRate: Number(vault.data?.yieldRate),
          }
        : null,
    isError: vault.state === "hasError",
    error: vault.state === "hasError" ? vault.error : null,
  };
});
