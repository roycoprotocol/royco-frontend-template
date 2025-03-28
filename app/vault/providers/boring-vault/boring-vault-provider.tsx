"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { BoringVaultV1Provider } from "boring-vault-ui";
import { vaultContractProviderMap } from "royco/vault";

import { useEthersProvider } from "../../hook/useEthersProvider";
import { BoringVaultWrapper } from "./boring-vault-wrapper";
import { chains } from "../../constants/chains";
import { cn } from "@/lib/utils";
import { AlertIndicator } from "@/components/common";
import { SlideUpWrapper } from "@/components/animations";
import { BoringVaultActionProvider } from "./boring-vault-action-provider";

export const BoringVaultProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { chain_id, vault_id } = useParams();

  const vault = useMemo(() => {
    const chainId = chain_id?.toString()?.toLowerCase();
    const vaultId = vault_id?.toString()?.toLowerCase();

    const _vault = vaultContractProviderMap.find(
      (v) => v.id === `${chainId}_${vaultId}`
    );
    return _vault;
  }, [vault_id]);

  const chain = useMemo(() => {
    return chains[Number(chain_id) as keyof typeof chains];
  }, [chain_id]);

  const provider = useEthersProvider({
    chainId: Number(chain_id),
  });

  if (!vault || ("error" in provider && provider.error)) {
    return (
      <SlideUpWrapper className="flex w-full flex-col place-content-center items-center pt-16">
        <AlertIndicator
          className={cn(
            "h-96 w-full rounded-2xl border border-divider bg-white"
          )}
        >
          Vault could not be found. Please check that you have the correct URL
          and try again.
        </AlertIndicator>
      </SlideUpWrapper>
    );
  }

  return (
    <BoringVaultV1Provider
      chain={chain.name}
      ethersProvider={provider as any}
      vaultContract={vault.contracts.vault}
      tellerContract={vault.contracts.teller}
      accountantContract={vault.contracts.accountant}
      lensContract={vault.contracts.lens}
      boringQueueContract={vault.contracts.boringQueue}
      withdrawTokens={[vault.baseToken]}
      depositTokens={[vault.baseToken]}
      baseAsset={vault.baseToken}
      vaultDecimals={vault.decimals}
    >
      <BoringVaultWrapper ref={ref} className={className} {...props}>
        <BoringVaultActionProvider>{children}</BoringVaultActionProvider>
      </BoringVaultWrapper>
    </BoringVaultV1Provider>
  );
});
