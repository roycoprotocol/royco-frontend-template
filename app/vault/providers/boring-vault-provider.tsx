"use client";

import React from "react";
import { BoringVaultV1Provider } from "boring-vault-ui";
import { useEthersProvider } from "../hook/useEthersProvider";
import { useParams } from "next/navigation";

//   "contractAddresses": {
//     "AccountantWithRateProviders": "0x915565acADb68EDA6DE37A2423Ef7cCa93f6F789",
//     "BoringOnChainQueue": "0xf7B0f4973B0b6a5457C4aF0B29c11158aF19C03f",
//     "BoringVault": "0x3D1aD04e82E595b7295751C35203f542dC986a43",
//     "Lens": "0x90983EBF38E981AE38f7Da9e71804380e316A396",
//     "ManagerWithMerkleVerification": "0x1a263299922e6D006236f9488e6bB59913a97ACb",
//     "QueueSolver": "0x608d9351Da3BC8f4C9Ae23082FA54aE923f44f0d",
//     "TellerWithMultiAssetSupport": "0xf8C21F673C3DFb11DaEfffdeb9E1E1258351DB2b",
//   }

const VAULT_CONTRACT = "0x3D1aD04e82E595b7295751C35203f542dC986a43";
const TELLER_CONTRACT = "0xf8C21F673C3DFb11DaEfffdeb9E1E1258351DB2b";
const ACCOUNTANT_CONTRACT = "0x915565acADb68EDA6DE37A2423Ef7cCa93f6F789";
const LENS_CONTRACT = "0x90983EBF38E981AE38f7Da9e71804380e316A396";

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

  const ethersProvider = useEthersProvider({
    chainId: Number(chain_id),
  });

  return (
    <BoringVaultV1Provider
      chain="arbitrum"
      vaultContract={VAULT_CONTRACT}
      tellerContract={TELLER_CONTRACT}
      accountantContract={ACCOUNTANT_CONTRACT}
      lensContract={LENS_CONTRACT}
      ethersProvider={ethersProvider as any}
      withdrawTokens={VAULT_WITHDRAW_TOKENS}
      depositTokens={VAULT_DEPOSIT_TOKENS}
      baseAsset={VAULT_DEPOSIT_TOKENS[0]}
      vaultDecimals={18}
    >
      {children}
    </BoringVaultV1Provider>
  );
});
