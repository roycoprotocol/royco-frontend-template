"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSetAtom } from "jotai";

import { MaxWidthProvider } from "@/app/_container/max-width-provider";
import { ProtectorProvider } from "@/app/_container/protector-provider";
import { VaultManager } from "@/app/vault/components/vault-manager";
import { BoringVaultProvider } from "@/app/vault/providers/boring-vault/boring-vault-provider";
import { vaultParamsAtom, Vaults } from "@/store/vault/vault-manager";

const Page = () => {
  const { vault_type, chain_id, vault_id } = useParams();

  const setVaultParams = useSetAtom(vaultParamsAtom);

  useEffect(() => {
    if (vault_type && chain_id && vault_id) {
      setVaultParams({
        vaultType: vault_type.toString().toLowerCase() as Vaults,
        chainId: Number(chain_id),
        vaultId: vault_id.toString().toLowerCase() as string,
      });
    }
  }, [vault_type, chain_id, vault_id]);

  return (
    <ProtectorProvider>
      <div className="hide-scrollbar relative min-h-screen bg-background">
        {/**
         * Background
         */}
        <div className="absolute left-0 right-0 top-0 z-0 h-48 w-full bg-[#3b5a4a]"></div>

        {/**
         * Vault Manager
         */}
        <MaxWidthProvider className="relative z-10">
          {vault_type === Vaults.BoringVault && (
            <BoringVaultProvider>
              <VaultManager />
            </BoringVaultProvider>
          )}
        </MaxWidthProvider>
      </div>
    </ProtectorProvider>
  );
};

export default Page;
