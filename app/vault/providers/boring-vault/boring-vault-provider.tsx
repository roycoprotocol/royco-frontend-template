"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { BoringVaultV1Provider } from "boring-vault-ui";

import { useEthersProvider } from "../../hook/useEthersProvider";
import { BoringVaultWrapper } from "./boring-vault-wrapper";
import { chains } from "../../constants/chains";
import { cn } from "@/lib/utils";
import { AlertIndicator } from "@/components/common";
import { SlideUpWrapper } from "@/components/animations";

export const VAULT_CONTRACT = "0x3D1aD04e82E595b7295751C35203f542dC986a43";
export const TELLER_CONTRACT = "0xf8C21F673C3DFb11DaEfffdeb9E1E1258351DB2b";
export const ACCOUNTANT_CONTRACT = "0x915565acADb68EDA6DE37A2423Ef7cCa93f6F789";
export const LENS_CONTRACT = "0x90983EBF38E981AE38f7Da9e71804380e316A396";
export const BORING_QUEUE_CONTRACT =
  "0xf7B0f4973B0b6a5457C4aF0B29c11158aF19C03f";
export const VAULT_DECIMALS = 18;
export const VAULT_DEPOSIT_TOKENS = [
  {
    // USDC (Arbitrum)
    address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    decimals: 6,
  },
  {
    // USDT (Arbitrum)
    address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    decimals: 6,
  },
];
export const VAULT_BASE_TOKEN = VAULT_DEPOSIT_TOKENS[0];
export const VAULT_WITHDRAW_TOKENS = [
  {
    // USDC (Arbitrum)
    address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    decimals: 6,
  },
  {
    // USDT (Arbitrum)
    address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    decimals: 6,
  },
];

export const BoringVaultProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { chain_id } = useParams();

  const chain = useMemo(() => {
    return chains[Number(chain_id) as keyof typeof chains];
  }, [chain_id]);

  const provider = useEthersProvider({
    chainId: Number(chain_id),
  });

  if ("error" in provider && provider.error) {
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
      vaultContract={VAULT_CONTRACT}
      tellerContract={TELLER_CONTRACT}
      accountantContract={ACCOUNTANT_CONTRACT}
      lensContract={LENS_CONTRACT}
      boringQueueContract={BORING_QUEUE_CONTRACT}
      withdrawTokens={VAULT_WITHDRAW_TOKENS}
      depositTokens={VAULT_DEPOSIT_TOKENS}
      baseAsset={VAULT_BASE_TOKEN}
      vaultDecimals={VAULT_DECIMALS}
    >
      <BoringVaultWrapper ref={ref} className={className} {...props}>
        {children}
      </BoringVaultWrapper>
    </BoringVaultV1Provider>
  );
});
