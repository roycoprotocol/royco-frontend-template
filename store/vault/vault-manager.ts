import { atom } from "jotai";

import { BoringVault, boringVaultAtom } from "./atom/boring-vault";

export enum VaultType {
  BoringVault = "boring_vault",
}

export const vaultParamsAtom = atom<
  | {
      vault_type: VaultType;
      chain_id: number;
      vault_id: string;
    }
  | undefined
>(undefined);

export const vaultManagerAtom = atom<BoringVault | null | undefined>((get) => {
  const vault_params = get(vaultParamsAtom);

  if (vault_params?.vault_type === VaultType.BoringVault) {
    return get(boringVaultAtom);
  }

  return undefined;
});
