"use client";

import { useParams } from "next/navigation";

import { MaxWidthProvider } from "@/app/_container/max-width-provider";
import { ProtectorProvider } from "@/app/_container/protector-provider";
import { VaultManager } from "@/app/vault/components/vault-manager";
import { BoringVaultProvider } from "@/app/vault/providers/boring-vault/boring-vault-provider";

const Page = () => {
  const { vault_type } = useParams();

  return (
    <ProtectorProvider>
      <div className="hide-scrollbar relative min-h-screen bg-background">
        {/**
         * Background
         */}
        <div className="absolute left-0 right-0 top-0 z-0 h-80 w-full bg-[#3b5a4a]"></div>

        {/**
         * Vault Manager
         */}
        <MaxWidthProvider className="relative z-10">
          {vault_type === "boring_vault" && (
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
