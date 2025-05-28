"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { ErrorAlert, LoadingSpinner } from "@/components/composables";
import { toast } from "sonner";
import NumberFlow from "@number-flow/react";
import { useAccountAirdrop } from "../hooks/use-account-airdrop";
import { useMarketManager } from "@/store";
import { TransactionOptionsType } from "royco/types";
import {
  BERA_AIRDROP_ABI,
  BERA_AIRDROP_ADDRESS,
} from "@/app/api/boyco/bera/constants";
import { RoycoMarketType } from "royco/market";
import { berachain } from "viem/chains";

import { useParams } from "next/navigation";
import { BerachainTestnet } from "royco/constants";
import { ethers } from "ethers";
import { useConnectWallet } from "@/app/_containers/providers/connect-wallet-provider";

export const ClaimCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { id } = useParams();

  const { data, isLoading, isError } = useAccountAirdrop();

  const { connectWalletModal } = useConnectWallet();
  const { isConnected, address } = useAccount();

  const { setTransactions } = useMarketManager();

  const handleOnClick = async () => {
    if (!isConnected) {
      try {
        connectWalletModal();
      } catch (error) {
        toast.error("Error connecting wallet.");
      }
    } else {
      if (!!data && data.is_eligible) {
        if (data.is_claimed) {
          toast.error("You have already claimed your BERA airdrop.");
        } else {
          if (!!data.tx_options) {
            setTransactions([data.tx_options]);
          } else {
            toast.error("No eligible BERA airdrop found.");
          }
        }
      } else {
        toast.error("You are not eligible for BERA airdrop.");
      }
    }
  };

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex h-fit w-full flex-col items-center justify-between rounded-2xl border border-divider bg-white px-4 py-6 sm:flex-row sm:px-8 sm:py-12",
        className
      )}
    >
      <div className="flex w-full flex-col">
        <div className="flex flex-row items-center  text-3xl">
          <NumberFlow
            format={{
              style: "decimal",
              notation: "compact",
              useGrouping: true,
            }}
            value={
              data?.amount ? parseFloat(ethers.formatEther(data.amount)) : 0
            }
          />
          <div className="ml-2">BERA</div>
          <img
            src="https://coin-images.coingecko.com/coins/images/25235/large/BERA.png?1738822008"
            alt="bera"
            className="ml-4 h-10 w-10"
          />
        </div>

        <div className="mt-2 text-sm text-secondary sm:max-w-80">
          All eligible BERA across Boyco positions connected to this address.
        </div>
      </div>

      <Button
        disabled={isLoading}
        onClick={async () => {
          await handleOnClick();
        }}
        size="lg"
        className={cn(
          "mt-5 w-full drop-shadow-sm sm:mt-0 sm:max-w-44",
          isConnected && !isLoading && !data?.is_eligible && "bg-error",
          isConnected &&
            !isLoading &&
            data?.is_eligible &&
            data?.is_claimed &&
            "bg-success"
        )}
      >
        {!isConnected ? (
          "Connect Wallet"
        ) : isLoading ? (
          <LoadingSpinner className="h-5 w-5" />
        ) : !!data && data.is_eligible ? (
          !data.is_claimed ? (
            "Claim"
          ) : (
            "Claimed"
          )
        ) : (
          "Not Eligible"
        )}
      </Button>
    </div>
  );
});
