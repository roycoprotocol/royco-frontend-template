"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { BoringVaultV1Provider } from "boring-vault-ui";
import { useEthersProvider } from "../hook/useEthersProvider";

//   "contractAddresses": {
//     "AccountantWithRateProviders": "0x915565acADb68EDA6DE37A2423Ef7cCa93f6F789",
//     "BoringOnChainQueue": "0xf7B0f4973B0b6a5457C4aF0B29c11158aF19C03f",
//     "BoringVault": "0x3D1aD04e82E595b7295751C35203f542dC986a43",
//     "Lens": "0x90983EBF38E981AE38f7Da9e71804380e316A396",
//     "ManagerWithMerkleVerification": "0x1a263299922e6D006236f9488e6bB59913a97ACb",
//     "QueueSolver": "0x608d9351Da3BC8f4C9Ae23082FA54aE923f44f0d",
//     "TellerWithMultiAssetSupport": "0xf8C21F673C3DFb11DaEfffdeb9E1E1258351DB2b",
//   }

export const BoringVaultProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const ethersProvider = useEthersProvider({
    chainId: 1,
  });

  return (
    <BoringVaultV1Provider
      chain="mainnet"
      vaultContract="0x3D1aD04e82E595b7295751C35203f542dC986a43"
      tellerContract="0xf8C21F673C3DFb11DaEfffdeb9E1E1258351DB2b"
      accountantContract="0x915565acADb68EDA6DE37A2423Ef7cCa93f6F789"
      lensContract="0x90983EBF38E981AE38f7Da9e71804380e316A396"
      ethersProvider={ethersProvider as any}
      withdrawTokens={[
        {
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          decimals: 18,
        },
      ]}
      depositTokens={[
        {
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          decimals: 18,
        },
        {
          address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          decimals: 6,
        },
      ]}
      baseAsset={{
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        decimals: 18,
      }}
      vaultDecimals={18}
    >
      {children}
    </BoringVaultV1Provider>
  );
});
