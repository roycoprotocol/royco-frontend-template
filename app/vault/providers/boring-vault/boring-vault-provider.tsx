"use client";

import React, { useMemo } from "react";
import { BoringVaultV1Provider } from "boring-vault-ui";
import { vaultContractProviderMap } from "royco/vault";
import { useAtomValue } from "jotai";

import { useEthersProvider } from "../../hook/useEthersProvider";
import { BoringVaultWrapper } from "./boring-vault-wrapper";
import { chains } from "../../constants/chains";
import { cn } from "@/lib/utils";
import { AlertIndicator } from "@/components/common";
import { SlideUpWrapper } from "@/components/animations";
import { BoringVaultActionProvider } from "./boring-vault-action-provider";
import { vaultParamsAtom } from "@/store/vault/vault-manager";

export const BoringVaultProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const vaultParams = useAtomValue(vaultParamsAtom);

  const vault = useMemo(() => {
    if (!vaultParams) {
      return null;
    }

    const chainId = vaultParams.chainId;
    const vaultId = vaultParams.vaultId;

    const _vault = vaultContractProviderMap.find(
      (v) => v.id === `${chainId}_${vaultId}`
    );
    return _vault;
  }, [vaultParams]);

  const chain = useMemo(() => {
    if (!vaultParams) {
      return null;
    }

    return chains[vaultParams.chainId as keyof typeof chains];
  }, [vaultParams]);

  const provider = useEthersProvider({
    chainId: Number(chain?.chainId || 0),
  });

  if (!vault || !chain || ("error" in provider && provider.error)) {
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
