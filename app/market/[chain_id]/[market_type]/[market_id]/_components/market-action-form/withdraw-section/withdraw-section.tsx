import { LoadingSpinner } from "@/components/composables";
import { cn } from "@/lib/utils";
import {
  MarketType,
  MarketUserType,
  MarketWithdrawType,
  useMarketManager,
} from "@/store";
import React, { Fragment } from "react";
import { SelectWithdrawType } from "./select-withdraw-type";
import {
  getRecipeIncentiveTokenWithdrawalTransactionOptions,
  getVaultIncentiveTokenWithdrawalTransactionOptions,
  getRecipeInputTokenWithdrawalTransactionOptions,
  getVaultInputTokenWithdrawalTransactionOptions,
  useEnrichedPositionsRecipe,
  useEnrichedPositionsVault,
} from "@/sdk/hooks";
import { useActiveMarket } from "../../hooks";
import { useAccount } from "wagmi";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { Button } from "@/components/ui/button";
import { PrimaryLabel, SecondaryLabel } from "../../composables";
import { SlideUpWrapper } from "@/components/animations";
import { RoycoMarketUserType } from "@/sdk/market";
import { BigNumber } from "ethers";

export const WithdrawIncentiveTokenRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token: any;
    disabled: boolean;
  }
>(({ className, token, disabled, ...props }, ref) => {
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
          disabled={disabled}
          onClick={(e) => props.onClick?.(e as any)}
          className="py-1 text-sm"
        >
          Withdraw
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
      <div className="flex flex-row items-center space-x-2">
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
  const { marketMetadata } = useActiveMarket();
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
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
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
    ],
  });

  const {
    isLoading: isLoadingPositionsVault,
    data: positionsVault,
    isError: isErrorPositionsVault,
    error: errorPositionsVault,
  } = useEnrichedPositionsVault({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    account_address: (address?.toLowerCase() as string) ?? "",
    page_index: withdrawSectionPage,
    filters: [
      {
        id: "offer_side",
        value: RoycoMarketUserType.ap.value,
      },
    ],
  });

  // const { isLoading: isLoadingPositionsVault, data: positionsVault } =
  //   useEnrichedPositionsVault({
  //     chain_id: marketMetadata.chain_id,
  //     market_id: marketMetadata.market_id,
  //     account_address: (address?.toLowerCase() as string) ?? "",
  //   });

  const totalCount =
    marketMetadata.market_type === MarketType.recipe.id
      ? !!positionsRecipe && "count" in positionsRecipe
        ? (positionsRecipe.count ?? 0)
        : 0
      : !!positionsVault && "count" in positionsVault
        ? (positionsVault.count ?? 0)
        : 0;

  const positions =
    marketMetadata.market_type === MarketType.recipe.id
      ? Array.isArray(positionsRecipe?.data)
        ? positionsRecipe.data
        : []
      : Array.isArray(positionsVault?.data)
        ? positionsVault.data.filter((position) => {
            if (!!position) {
              if (withdrawType === MarketWithdrawType.input_token.id) {
                // Check if the raw input token amount is greater than 0
                if (
                  BigNumber.from(position.input_token_data.raw_amount).gt(0)
                ) {
                  return true;
                } else {
                  return false;
                }
              } else {
                // Check if value of at least one token is greater than 0
                if (
                  position.tokens_data.some((token) =>
                    BigNumber.from(token.raw_amount).gt(0)
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

  return (
    <div
      ref={ref}
      className={cn("flex w-full grow flex-col", className)}
      {...props}
    >
      {userType === MarketUserType.ap.id ? (
        <Fragment>
          <SelectWithdrawType />

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
                        <div className="flex w-full grow flex-col items-start space-y-1">
                          <SecondaryLabel className="text-black">
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
                                        marketMetadata.market_type ===
                                        MarketType.recipe.id
                                          ? // @ts-ignore
                                            position?.is_claimed[tokenIndex] ===
                                            true
                                          : BigNumber.from(
                                              token.raw_amount
                                            ).isZero()
                                      }
                                      onClick={() => {
                                        if (
                                          marketMetadata.market_type ===
                                          MarketType.recipe.id
                                        ) {
                                          const contractOptions =
                                            getRecipeIncentiveTokenWithdrawalTransactionOptions(
                                              {
                                                account:
                                                  address?.toLowerCase() as string,
                                                chain_id:
                                                  marketMetadata.chain_id,
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
                                                  marketMetadata.market_id,
                                                chain_id:
                                                  marketMetadata.chain_id,
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
                              disabled={BigNumber.from(
                                position?.input_token_data?.raw_amount
                              ).isZero()}
                              onClick={() => {
                                if (!!position) {
                                  if (
                                    marketMetadata.market_type ===
                                    MarketType.recipe.id
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
                                    const contractOptions =
                                      getVaultInputTokenWithdrawalTransactionOptions(
                                        {
                                          chain_id: marketMetadata.chain_id,
                                          market_id: marketMetadata.market_id,
                                          account:
                                            address?.toLowerCase() as string,
                                          position: {
                                            token_data:
                                              position.input_token_data,
                                          },
                                        }
                                      );

                                    setTransactions([contractOptions]);
                                  }
                                }
                              }}
                              className="text-sm"
                            >
                              Withdraw
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
    </div>
  );
});
