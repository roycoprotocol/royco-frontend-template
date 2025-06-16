import { LoadingSpinner } from "@/components/composables";
import { cn } from "@/lib/utils";
import { MarketType, MarketWithdrawType, useMarketManager } from "@/store";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { Button } from "@/components/ui/button";
import { SecondaryLabel, TertiaryLabel } from "../../../../composables";
import { SlideUpWrapper } from "@/components/animations";
import { WithdrawTypeSelector } from "./withdraw-type-selector";
import { VaultWithdrawModal } from "./vault-withdraw-modal";
import {
  loadableEnrichedMarketAtom,
  loadableRecipePositionsAtom,
  loadableSpecificRecipePositionAtom,
  loadableSpecificVaultPositionAtom,
} from "@/store/market";
import { useAtomValue } from "jotai";
import formatNumber from "@/utils/numbers";
import {
  claimRecipeIncentiveTokenTxOptions,
  claimVaultIncentiveTokenTxOptions,
  EnrichedTxOption,
  forfeitRecipePositionTxOptions,
  withdrawRecipeInputTokenTxOptions,
} from "royco/transaction";
import { formatDistanceToNow } from "date-fns";

export const WithdrawSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const { address, isConnected } = useAccount();

  const { transactions, setTransactions } = useMarketManager();

  const {
    withdrawType,
    setWithdrawType,
    withdrawSectionPage,
    setWithdrawSectionPage,
    userType,
  } = useMarketManager();

  const propsRecipePosition = useAtomValue(loadableSpecificRecipePositionAtom);
  const propsVaultPosition = useAtomValue(loadableSpecificVaultPositionAtom);

  const isLoading =
    propsRecipePosition.isLoading || propsVaultPosition.isLoading;

  const [isVaultWithdrawModalOpen, setIsVaultWithdrawModalOpen] =
    useState(false);
  const [selectedVaultPosition, setSelectedVaultPosition] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-5">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center p-5">
        <AlertIndicator>Wallet not connected</AlertIndicator>
      </div>
    );
  }

  if (
    (enrichedMarket?.marketType === MarketType.recipe.value &&
      ((withdrawType === MarketWithdrawType.input_token.id &&
        propsRecipePosition.data?.lockedInputToken.length === 0) ||
        (withdrawType === MarketWithdrawType.incentives.id &&
          propsRecipePosition.data?.incentiveTokens.length === 0))) ||
    (enrichedMarket?.marketType === MarketType.vault.value &&
      ((withdrawType === MarketWithdrawType.input_token.id &&
        propsVaultPosition.data?.lockedInputToken.length === 0) ||
        (withdrawType === MarketWithdrawType.incentives.id &&
          propsVaultPosition.data?.incentiveTokens.length === 0)))
  ) {
    return (
      <div className="flex flex-col items-center justify-center p-5">
        <AlertIndicator>No withdrawable positions found</AlertIndicator>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("flex w-full grow flex-col", className)}
      {...props}
    >
      <div className="mt-5 flex w-full grow flex-col">
        <div className="flex grow flex-col place-content-start items-center gap-3">
          {/**
           * Recipe Input Token
           */}
          {withdrawType === MarketWithdrawType.input_token.id &&
            enrichedMarket?.marketType === MarketType.recipe.value &&
            propsRecipePosition.data &&
            propsRecipePosition.data?.lockedInputToken.length > 0 &&
            propsRecipePosition.data?.lockedInputToken.map(
              (position, positionIndex) => {
                return (
                  <SlideUpWrapper
                    delay={0.1 + positionIndex * 0.1}
                    className="w-full"
                    key={`withdraw-position:${positionIndex}-${withdrawType}`}
                  >
                    <div className="flex w-full flex-row items-center justify-between gap-2 rounded-2xl border border-divider p-3">
                      {/**
                       * Left side
                       */}
                      <div className="hide-scrollbar flex w-full grow flex-col items-start space-y-1 overflow-x-scroll">
                        <SecondaryLabel className="whitespace-nowrap break-normal text-black">
                          Value:{" "}
                          {formatNumber(position.tokenAmountUsd, {
                            type: "currency",
                          })}
                        </SecondaryLabel>

                        <div className="flex w-full grow flex-col space-y-3">
                          <div className="flex flex-row items-center space-x-2 whitespace-nowrap break-normal">
                            <SecondaryLabel className="h-4">
                              {Intl.NumberFormat("en-US", {
                                style: "decimal",
                                notation: "standard",
                                useGrouping: true,
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 8,
                              }).format(position.tokenAmount)}
                            </SecondaryLabel>

                            <TokenDisplayer
                              size={4}
                              tokens={[position]}
                              symbols={true}
                            />
                          </div>
                        </div>

                        {!position.isUnlocked && (
                          <div className="flex flex-row items-center space-x-2 italic">
                            <SecondaryLabel className="h-4">
                              Unlocks in{" "}
                              {formatDistanceToNow(
                                new Date(
                                  Number(position.unlockTimestamp) * 1000
                                )
                              )}
                            </SecondaryLabel>
                          </div>
                        )}
                      </div>

                      {/**
                       * Right side
                       */}
                      <div className="w-24 shrink-0">
                        <Button
                          disabled={
                            position.rewardStyle === 2
                              ? false
                              : !position.isUnlocked
                          }
                          onClick={() => {
                            let txOptions: EnrichedTxOption[] = [];

                            if (
                              position.rewardStyle === 2 &&
                              !position.isUnlocked
                            ) {
                              txOptions = forfeitRecipePositionTxOptions({
                                rawMarketRefId: enrichedMarket.id,
                                chainId: position.chainId,
                                weirollWallet: position.weirollWallet,
                              });
                            } else {
                              txOptions = withdrawRecipeInputTokenTxOptions({
                                rawMarketRefId: enrichedMarket.id,
                                chainId: position.chainId,
                                weirollWallet: position.weirollWallet,
                              });
                            }

                            setTransactions(txOptions);
                          }}
                          className="text-sm"
                        >
                          {position.rewardStyle === 2 && !position.isUnlocked
                            ? "Forfeit"
                            : position.isUnlocked
                              ? "Withdraw"
                              : "Locked"}
                        </Button>
                      </div>
                    </div>
                  </SlideUpWrapper>
                );
              }
            )}

          {/**
           * Recipe Incentive Token
           */}
          {withdrawType === MarketWithdrawType.incentives.id &&
            enrichedMarket?.marketType === MarketType.recipe.value &&
            propsRecipePosition.data &&
            propsRecipePosition.data?.unclaimedIncentiveTokens.length > 0 &&
            propsRecipePosition.data?.unclaimedIncentiveTokens.map(
              (position, positionIndex) => {
                return (
                  <SlideUpWrapper
                    delay={0.1 + positionIndex * 0.1}
                    className="w-full"
                    key={`withdraw-position:${positionIndex}-${withdrawType}`}
                  >
                    <div className="flex w-full flex-row items-center justify-between gap-2 rounded-2xl border border-divider p-3">
                      {/**
                       * Left side
                       */}
                      <div className="hide-scrollbar flex w-full grow flex-col items-start space-y-1 overflow-x-scroll">
                        <div className="flex w-full grow flex-col space-y-2">
                          <div className="flex flex-row items-center space-x-2 whitespace-nowrap break-normal">
                            <SecondaryLabel className="h-4">
                              {Intl.NumberFormat("en-US", {
                                style: "decimal",
                                notation: "standard",
                                useGrouping: true,
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 8,
                              }).format(position.tokenAmount)}
                            </SecondaryLabel>

                            <TokenDisplayer
                              size={4}
                              tokens={[position]}
                              symbols={true}
                            />
                          </div>

                          {!position.isUnlocked && (
                            <div className="flex flex-row items-center space-x-2 italic">
                              <SecondaryLabel className="h-4">
                                Unlocks in{" "}
                                {formatDistanceToNow(
                                  new Date(
                                    Number(position.unlockTimestamp) * 1000
                                  )
                                )}
                              </SecondaryLabel>
                            </div>
                          )}
                        </div>
                      </div>

                      {/**
                       * Right side
                       */}
                      <div className="w-24 shrink-0">
                        <Button
                          disabled={!position.isUnlocked}
                          onClick={() => {
                            const txOptions =
                              claimRecipeIncentiveTokenTxOptions({
                                chainId: position.chainId,
                                weirollWallet: position.weirollWallet,
                                accountAddress: address?.toLowerCase() ?? "",
                                tokenAddress: position.contractAddress,
                              });

                            setTransactions(txOptions);
                          }}
                          className="text-sm"
                        >
                          {position.isUnlocked ? "Withdraw" : "Locked"}
                        </Button>
                      </div>
                    </div>
                  </SlideUpWrapper>
                );
              }
            )}

          {/**
           * Vault Input Token
           */}
          {withdrawType === MarketWithdrawType.input_token.id &&
            enrichedMarket?.marketType === MarketType.vault.value &&
            propsVaultPosition.data &&
            propsVaultPosition.data?.lockedInputToken.length > 0 &&
            propsVaultPosition.data?.lockedInputToken.map(
              (position, positionIndex) => {
                return (
                  <SlideUpWrapper
                    delay={0.1 + positionIndex * 0.1}
                    className="w-full"
                    key={`withdraw-position:${positionIndex}-${withdrawType}`}
                  >
                    <div className="flex w-full flex-row items-center justify-between gap-2 rounded-2xl border border-divider p-3">
                      {/**
                       * Left side
                       */}
                      <div className="hide-scrollbar flex w-full grow flex-col items-start space-y-1 overflow-x-scroll">
                        <SecondaryLabel className="whitespace-nowrap break-normal text-black">
                          Value:{" "}
                          {formatNumber(position.tokenAmountUsd, {
                            type: "currency",
                          })}
                        </SecondaryLabel>

                        <div className="flex w-full grow flex-col space-y-3">
                          <div className="flex flex-row items-center space-x-2 whitespace-nowrap break-normal">
                            <SecondaryLabel className="h-4">
                              {Intl.NumberFormat("en-US", {
                                style: "decimal",
                                notation: "standard",
                                useGrouping: true,
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 8,
                              }).format(position.tokenAmount)}
                            </SecondaryLabel>

                            <TokenDisplayer
                              size={4}
                              tokens={[position]}
                              symbols={true}
                            />
                          </div>
                        </div>
                      </div>

                      {/**
                       * Right side
                       */}
                      <div className="w-24 shrink-0">
                        <Button
                          onClick={() => {
                            setSelectedVaultPosition({
                              chainId: enrichedMarket?.chainId ?? 1,
                              vaultAddress: enrichedMarket?.marketId ?? "",
                              tokenData: position,
                            });
                            setIsVaultWithdrawModalOpen(true);
                          }}
                          className="text-sm"
                        >
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  </SlideUpWrapper>
                );
              }
            )}

          {/**
           * Vault Incentive Token
           */}
          {withdrawType === MarketWithdrawType.incentives.id &&
            enrichedMarket?.marketType === MarketType.vault.value &&
            propsVaultPosition.data &&
            propsVaultPosition.data?.unclaimedIncentiveTokens.length > 0 &&
            propsVaultPosition.data?.unclaimedIncentiveTokens.map(
              (position, positionIndex) => {
                return (
                  <SlideUpWrapper
                    delay={0.1 + positionIndex * 0.1}
                    className="w-full"
                    key={`withdraw-position:${positionIndex}-${withdrawType}`}
                  >
                    <div className="flex w-full flex-row items-center justify-between gap-2 rounded-2xl border border-divider p-3">
                      {/**
                       * Left side
                       */}
                      <div className="hide-scrollbar flex w-full grow flex-col items-start space-y-1 overflow-x-scroll">
                        <div className="flex w-full grow flex-col space-y-3">
                          <div className="flex flex-row items-center space-x-2 whitespace-nowrap break-normal">
                            <SecondaryLabel className="h-4">
                              {Intl.NumberFormat("en-US", {
                                style: "decimal",
                                notation: "standard",
                                useGrouping: true,
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 8,
                              }).format(position.tokenAmount)}
                            </SecondaryLabel>

                            <TokenDisplayer
                              size={4}
                              tokens={[position]}
                              symbols={true}
                            />
                          </div>
                        </div>
                      </div>

                      {/**
                       * Right side
                       */}
                      <div className="w-24 shrink-0">
                        <Button
                          onClick={() => {
                            const txOptions = claimVaultIncentiveTokenTxOptions(
                              {
                                chainId: position.chainId,
                                vaultAddress: enrichedMarket?.marketId ?? "",
                                accountAddress: address?.toLowerCase() ?? "",
                                tokenAddress: position.contractAddress,
                              }
                            );

                            setTransactions(txOptions);
                          }}
                          className="text-sm"
                        >
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  </SlideUpWrapper>
                );
              }
            )}
        </div>
      </div>

      {selectedVaultPosition && (
        <VaultWithdrawModal
          isOpen={isVaultWithdrawModalOpen}
          onOpenChange={setIsVaultWithdrawModalOpen}
          position={selectedVaultPosition}
        />
      )}
    </div>
  );
});
