import { LoadingSpinner } from "@/components/composables";
import { cn } from "@/lib/utils";
import {
  MarketType,
  MarketUserType,
  MarketWithdrawType,
  useMarketManager,
} from "@/store";
import React, { useState, Fragment } from "react";
import {
  getRecipeIncentiveTokenWithdrawalTransactionOptions,
  getVaultIncentiveTokenWithdrawalTransactionOptions,
  getRecipeInputTokenWithdrawalTransactionOptions,
  useEnrichedPositionsRecipe,
  useEnrichedPositionsVault,
} from "royco/hooks";

import { useAccount } from "wagmi";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { Button } from "@/components/ui/button";
import { SecondaryLabel } from "../../../../composables";
import { SlideUpWrapper } from "@/components/animations";
import { RoycoMarketUserType } from "royco/market";
import { WithdrawTypeSelector } from "./withdraw-type-selector";
import { VaultWithdrawModal } from "./vault-withdraw-modal";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useAtomValue } from "jotai";

export const WithdrawIncentiveTokenRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token: any;
    disabled: boolean;
  }
>(({ className, token, disabled, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full grow flex-row items-center justify-between gap-2",
        className
      )}
      {...props}
    >
      <div className="flex h-4 flex-row items-center space-x-2">
        <SecondaryLabel>
          {Intl.NumberFormat("en-US", {
            style: "decimal",
            notation: "standard",
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          }).format(token.token_amount)}
        </SecondaryLabel>

        <TokenDisplayer size={4} tokens={[token]} symbols={true} />
      </div>
      <div className="w-24">
        <Button
          disabled={disabled || enrichedMarket?.category === "boyco"}
          onClick={(e) => props.onClick?.(e as any)}
          className="py-1 text-sm"
        >
          {enrichedMarket?.category === "boyco" ? "Locked" : "Withdraw"}
        </Button>
      </div>
    </div>
  );
});

export const WithdrawInputTokenRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token: any;
  }
>(({ className, token, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex w-full flex-row", className)} {...props}>
      <div className="flex flex-row items-center space-x-2 whitespace-nowrap break-normal">
        <SecondaryLabel className="h-4">
          {Intl.NumberFormat("en-US", {
            style: "decimal",
            notation: "standard",
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          }).format(token.token_amount)}
        </SecondaryLabel>

        <TokenDisplayer size={4} tokens={[token]} symbols={true} />
      </div>
    </div>
  );
});

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

  const {
    isLoading: isLoadingPositionsRecipe,
    data: positionsRecipe,
    isError,
    error,
  } = useEnrichedPositionsRecipe({
    chain_id: enrichedMarket?.chainId,
    market_id: enrichedMarket?.marketId,
    account_address: (address?.toLowerCase() as string) ?? "",
    page_index: withdrawSectionPage,
    filters: [
      {
        id:
          withdrawType === MarketWithdrawType.input_token.id
            ? "can_withdraw"
            : "can_claim",
        value: true,
      },
      {
        id: "offer_side",
        value: 0,
      },
    ],
    custom_token_data: undefined,
  });

  const {
    isLoading: isLoadingPositionsVault,
    data: positionsVault,
    isError: isErrorPositionsVault,
    error: errorPositionsVault,
  } = useEnrichedPositionsVault({
    chain_id: enrichedMarket?.chainId,
    market_id: enrichedMarket?.marketId,
    account_address: (address?.toLowerCase() as string) ?? "",
    page_index: withdrawSectionPage,
    filters: [
      {
        id: "offer_side",
        value: RoycoMarketUserType.ap.value,
      },
    ],
    custom_token_data: undefined,
  });

  // const { isLoading: isLoadingPositionsVault, data: positionsVault } =
  //   useEnrichedPositionsVault({
  //     chain_id: marketMetadata.chain_id,
  //     market_id: marketMetadata.market_id,
  //     account_address: (address?.toLowerCase() as string) ?? "",
  //   });

  const totalCount =
    enrichedMarket?.marketType === MarketType.recipe.value
      ? !!positionsRecipe && "count" in positionsRecipe
        ? (positionsRecipe.count ?? 0)
        : 0
      : !!positionsVault && "count" in positionsVault
        ? (positionsVault.count ?? 0)
        : 0;

  const positions =
    enrichedMarket?.marketType === MarketType.recipe.value
      ? Array.isArray(positionsRecipe?.data)
        ? positionsRecipe.data
        : []
      : Array.isArray(positionsVault?.data)
        ? positionsVault.data.filter((position) => {
            if (!!position) {
              if (withdrawType === MarketWithdrawType.input_token.id) {
                // Check if the raw input token amount is greater than 0
                if (BigInt(position.input_token_data.shares) > BigInt(0)) {
                  return true;
                } else {
                  return false;
                }
              } else {
                // Check if value of at least one token is greater than 0
                if (
                  position.tokens_data.some(
                    (token) => BigInt(token.raw_amount) > BigInt(0)
                  )
                ) {
                  return true;
                } else {
                  return false;
                }
              }
            }
            return false;
          })
        : [];

  const isLoading = isLoadingPositionsRecipe || isLoadingPositionsVault;

  // state for vault withdraw modal
  const [isVaultWithdrawModalOpen, setIsVaultWithdrawModalOpen] =
    useState(false);
  const [selectedVaultPosition, setSelectedVaultPosition] = useState<any>(null);

  return (
    <div
      ref={ref}
      className={cn("flex w-full grow flex-col", className)}
      {...props}
    >
      {userType === MarketUserType.ap.id ? (
        <Fragment>
          <WithdrawTypeSelector />

          <div className="mt-5 flex w-full grow flex-col">
            <div className="flex grow flex-col place-content-start items-center gap-3">
              {isConnected && isLoading && (
                <LoadingSpinner className="h-5 w-5" />
              )}

              {!isConnected && (
                <div className="h-full w-full place-content-center items-start">
                  <AlertIndicator>Wallet not connected</AlertIndicator>
                </div>
              )}

              {!isLoading &&
                isConnected &&
                !!positions &&
                positions.length === 0 && (
                  <div className="h-full w-full place-content-center items-start">
                    <AlertIndicator>
                      No withdrawable positions found
                    </AlertIndicator>
                  </div>
                )}

              {!!positions &&
                !isLoading &&
                totalCount > 0 &&
                positions.map((position, positionIndex) => {
                  return (
                    <SlideUpWrapper
                      delay={0.1 + positionIndex * 0.1}
                      className="w-full"
                      key={`withdraw-position:${positionIndex}-${withdrawType}`}
                    >
                      <div className="flex w-full flex-row items-center justify-between gap-2 rounded-2xl border border-divider p-3">
                        <div className="hide-scrollbar flex w-full grow flex-col items-start space-y-1 overflow-x-scroll">
                          <SecondaryLabel className="whitespace-nowrap break-normal text-black">
                            Value:{" "}
                            {Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              notation: "standard",
                              useGrouping: true,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 8,
                            }).format(
                              withdrawType === MarketWithdrawType.input_token.id
                                ? (position?.input_token_data
                                    ?.token_amount_usd ?? 0)
                                : (position?.tokens_data?.reduce(
                                    (acc, token) =>
                                      acc + token.token_amount_usd,
                                    0
                                  ) ?? 0)
                            )}
                          </SecondaryLabel>

                          <div className="flex w-full grow flex-col space-y-3">
                            {withdrawType ===
                            MarketWithdrawType.input_token.id ? (
                              <WithdrawInputTokenRow
                                key={`withdraw-input-token-row:${positionIndex}`}
                                token={position?.input_token_data}
                              />
                            ) : (
                              position?.tokens_data?.map(
                                (token, tokenIndex) => {
                                  return (
                                    <WithdrawIncentiveTokenRow
                                      disabled={
                                        enrichedMarket?.marketType ===
                                        MarketType.recipe.value
                                          ? // @ts-ignore
                                            position?.is_claimed[tokenIndex] ===
                                            true
                                          : BigInt(token.raw_amount) ===
                                            BigInt(0)
                                      }
                                      onClick={() => {
                                        if (
                                          enrichedMarket?.marketType ===
                                          MarketType.recipe.value
                                        ) {
                                          const contractOptions =
                                            getRecipeIncentiveTokenWithdrawalTransactionOptions(
                                              {
                                                account:
                                                  address?.toLowerCase() as string,
                                                chain_id:
                                                  enrichedMarket?.chainId,
                                                position: {
                                                  weiroll_wallet:
                                                    /**
                                                     * @TODO Strictly type this
                                                     */
                                                    // @ts-ignore
                                                    position.weiroll_wallet,
                                                  token_data: token,
                                                },
                                              }
                                            );

                                          setTransactions([contractOptions]);
                                        } else {
                                          const contractOptions =
                                            getVaultIncentiveTokenWithdrawalTransactionOptions(
                                              {
                                                account:
                                                  address?.toLowerCase() as string,
                                                market_id:
                                                  enrichedMarket?.marketId ??
                                                  "",
                                                chain_id:
                                                  enrichedMarket?.chainId ?? 1,
                                                position: {
                                                  token_data: token,
                                                },
                                              }
                                            );

                                          setTransactions([contractOptions]);
                                        }
                                      }}
                                      key={`withdraw-incentive-token-row:${positionIndex}-${tokenIndex}`}
                                      token={token}
                                    />
                                  );
                                }
                              )
                            )}
                          </div>
                        </div>

                        {withdrawType === MarketWithdrawType.input_token.id && (
                          <div className="w-24 shrink-0">
                            <Button
                              disabled={
                                BigInt(
                                  position?.input_token_data?.raw_amount
                                ) === BigInt(0) ||
                                currentMarketData?.category === "boyco"
                              }
                              onClick={() => {
                                if (!!position) {
                                  if (
                                    enrichedMarket?.marketType ===
                                    MarketType.recipe.value
                                  ) {
                                    const contractOptions =
                                      getRecipeInputTokenWithdrawalTransactionOptions(
                                        {
                                          chain_id: marketMetadata.chain_id,
                                          position: {
                                            weiroll_wallet:
                                              /**
                                               * @TODO Strictly type this
                                               */
                                              // @ts-ignore
                                              position.weiroll_wallet,
                                            token_data:
                                              position.input_token_data,
                                          },
                                        }
                                      );

                                    setTransactions([contractOptions]);
                                  } else {
                                    setSelectedVaultPosition(position);
                                    setIsVaultWithdrawModalOpen(true);
                                  }
                                }
                              }}
                              className="text-sm"
                            >
                              {currentMarketData?.category === "boyco"
                                ? "Locked"
                                : "Withdraw"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </SlideUpWrapper>
                  );
                })}
            </div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="flex grow flex-col place-content-center items-center">
            <AlertIndicator>Only AP can withdraw</AlertIndicator>
          </div>
        </Fragment>
      )}

      {selectedVaultPosition && (
        <VaultWithdrawModal
          isOpen={isVaultWithdrawModalOpen}
          onOpenChange={setIsVaultWithdrawModalOpen}
          position={{
            token_data: selectedVaultPosition.input_token_data,
          }}
          marketId={marketMetadata.market_id}
          chainId={marketMetadata.chain_id}
        />
      )}
    </div>
  );
});
