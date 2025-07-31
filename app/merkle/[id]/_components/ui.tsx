"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useAccount, useConnect } from "wagmi";
import { useAtomValue } from "jotai";
import {
  loadableMerkleClaimFamilyAtom,
  loadableMerkleMetadataFamilyAtom,
} from "@/store/merkle";
import { Address } from "abitype";
import { Tilt } from "@/components/motion-primitives/tilt";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { cn } from "@/lib/utils";
import { AlertIndicator } from "@/components/common";
import { ethers } from "ethers";
import NumberFlow from "@number-flow/react";
import { Button } from "@/components/ui/button";
import { useConnectWallet } from "@/app/_containers/providers/connect-wallet-provider";
import { toast } from "sonner";
import { useMarketManager } from "@/store";
import { getMerkleClaimTxOptions } from "./txOptions";
import { lastRefreshTimestampAtom } from "@/store/global";

export const MerkleUI = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { id } = useParams();
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { connectWalletModal } = useConnectWallet();
  const { setTransactions } = useMarketManager();

  const searchParamsMerkleMetadata = useMemo(() => {
    return {
      batchId: id as string,
    };
  }, [id]);

  const searchParamsMerkleClaim = useMemo(() => {
    return {
      batchId: id as string,
      accountAddress: address as Address,
    };
  }, [id, address]);

  const { data: merkleMetadata, isLoading: isLoadingMerkleMetadata } =
    useAtomValue(loadableMerkleMetadataFamilyAtom(searchParamsMerkleMetadata));

  const { data: merkleClaim, isLoading: isLoadingMerkleClaim } = useAtomValue(
    loadableMerkleClaimFamilyAtom(searchParamsMerkleClaim)
  );

  const handleOnClick = async () => {
    if (!isConnected) {
      try {
        connectWalletModal();
      } catch (error) {
        toast.error("Error connecting wallet.");
      }
    } else {
      if (!merkleClaim || !merkleClaim?.isEligible || !merkleClaim?.claimInfo) {
        toast.error("You are not eligible for this airdrop.");
      } else {
        if (merkleClaim?.claimInfo?.isClaimed) {
          toast.error("You have already claimed your airdrop.");
        } else {
          const [chainId, contractAddress] =
            merkleClaim.claimInfo.merkleContractRefId.split("_");

          const txOptions = getMerkleClaimTxOptions({
            chainId: Number(chainId),
            contractAddress: contractAddress,
            accountAddress: merkleClaim?.accountAddress,
            tokenAddress:
              merkleClaim.claimInfo?.unclaimedIncentiveTokenData
                ?.contractAddress,
            tokenAmount:
              merkleClaim.claimInfo.unclaimedIncentiveTokenData.rawAmount,
            merkleProof: merkleClaim.claimInfo.merkleProof,
          });

          setTransactions([txOptions]);
        }
      }
    }
  };

  if (isLoadingMerkleMetadata) {
    return <LoadingCircle className="h-10 w-10" />;
  }

  if (!merkleMetadata) {
    return (
      <AlertIndicator className="w-full rounded-md border border-dashed">
        Merkle claim data not found
      </AlertIndicator>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("flex w-full max-w-2xl flex-col items-center", className)}
      {...props}
    >
      <h1 className="font-morion text-4xl font-bold">
        {merkleMetadata?.title}
      </h1>

      <p className="mt-5 max-w-xl text-center font-gt text-base text-secondary">
        {merkleMetadata?.description}
      </p>

      <Tilt rotationFactor={8} isRevese className="mt-9 w-full">
        <img
          src={merkleMetadata?.bannerUrl}
          alt={`Boyco Banner`}
          className="aspect-[16/7] w-full rounded-2xl object-cover object-center"
        />
      </Tilt>

      <div className="mt-9 flex h-fit w-full flex-col items-center justify-between rounded-2xl border border-divider bg-white px-4 py-6 sm:flex-row sm:px-8 sm:py-12">
        {/**
         * @dev Claimable token amount
         */}
        <div className="flex w-full flex-col">
          <div className="flex flex-row items-center  text-3xl">
            <NumberFlow
              format={{
                style: "decimal",
                notation: "compact",
                useGrouping: true,
              }}
              value={
                (merkleClaim?.claimInfo?.unclaimedIncentiveTokenData
                  ?.tokenAmount ?? 0) +
                (merkleClaim?.claimInfo?.claimedIncentiveTokenData
                  ?.tokenAmount ?? 0)
              }
            />
            <div className="ml-2">
              {merkleMetadata?.incentiveTokenData.symbol}
            </div>
            <img
              src={merkleMetadata?.incentiveTokenData.image}
              alt="bera"
              className="ml-4 h-10 w-10"
            />
          </div>

          <div className="mt-2 text-sm text-secondary sm:max-w-80">
            {merkleMetadata?.description}
          </div>
        </div>

        <Button
          disabled={isConnected && isLoadingMerkleClaim}
          onClick={handleOnClick}
          size="lg"
          className={cn(
            "mt-5 w-full drop-shadow-sm sm:mt-0 sm:max-w-44",
            isConnected &&
              !isLoadingMerkleClaim &&
              !merkleClaim?.isEligible &&
              "bg-error",
            isConnected &&
              !isLoadingMerkleClaim &&
              merkleClaim?.isEligible &&
              merkleClaim?.claimInfo?.isClaimed &&
              "bg-success"
          )}
        >
          {!isConnected ? (
            "Connect Wallet"
          ) : isLoadingMerkleClaim ? (
            <LoadingCircle className="h-5 w-5" />
          ) : !!merkleClaim && merkleClaim.isEligible ? (
            !merkleClaim.claimInfo?.isClaimed ? (
              "Claim"
            ) : (
              "Claimed"
            )
          ) : (
            "Not Eligible"
          )}
        </Button>
      </div>
    </div>
  );
});
