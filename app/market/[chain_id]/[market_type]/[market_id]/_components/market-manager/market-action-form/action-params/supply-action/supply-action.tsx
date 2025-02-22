import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import {
  MarketOfferType,
  MarketSteps,
  MarketType,
  MarketUserType,
  MarketViewType,
  useMarketManager,
} from "@/store";
import { SlideUpWrapper } from "@/components/animations/slide-up-wrapper";
import { useActiveMarket } from "../../../../hooks";
import { RecipeActionForms } from "./recipe-action-forms";
import { Button } from "@/components/ui/button";
import { useAccount, useChainId } from "wagmi";
import { switchChain } from "@wagmi/core";
import { useConnectWallet } from "@/app/_components/provider/connect-wallet-provider";
import { config } from "@/components/rainbow-modal/modal-config";
import { useMarketFormDetails } from "../../use-market-form-details";
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { TertiaryLabel } from "../../../../composables";
import { RoycoMarketType } from "royco/market";
import { BigNumber } from "ethers";
import { TokenDisplayer } from "@/components/common";
import { VaultActionForms } from "./vault-action-forms";
import { OfferTypeSelector } from "./components/offer-type-selector";
import LightningIcon from "../../../../icons/lightning";
import { TokenEstimator } from "@/app/_components/ui/token-estimator";
import formatNumber from "@/utils/numbers";

export const SupplyAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { address } = useAccount();
  const chainId = useChainId();

  const { connectWalletModal } = useConnectWallet();

  const { marketMetadata, currentMarketData, currentHighestOffers } =
    useActiveMarket();
  const { viewType, setMarketStep, offerType, userType } = useMarketManager();

  const { isValid, incentiveData } = useMarketFormDetails(marketActionForm);

  const highestIncentiveToken = useMemo(() => {
    if (marketMetadata.market_type === RoycoMarketType.recipe.id) {
      if (
        !currentHighestOffers ||
        currentHighestOffers.ip_offers.length === 0 ||
        currentHighestOffers.ip_offers[0].tokens_data.length === 0
      ) {
        return null;
      }

      return currentHighestOffers.ip_offers[0].tokens_data[0];
    }

    if (marketMetadata.market_type === RoycoMarketType.vault.id) {
      if (
        !currentMarketData ||
        currentMarketData.incentive_tokens_data.length === 0
      ) {
        return null;
      }

      return currentMarketData.incentive_tokens_data.find((token_data) => {
        return BigNumber.from(token_data.raw_amount ?? "0").gt(0);
      });
    }
  }, [currentMarketData, currentHighestOffers, marketMetadata]);

  const selectedIncentiveToken = useMemo(() => {
    if (incentiveData && incentiveData.length > 0) {
      return incentiveData[0];
    }

    return null;
  }, [incentiveData]);

  const showIncentiveTokenEstimate = useMemo(() => {
    if (
      highestIncentiveToken &&
      highestIncentiveToken.type === "point" &&
      highestIncentiveToken.annual_change_ratio === 0
    ) {
      return true;
    }

    return false;
  }, [highestIncentiveToken]);

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      {viewType === MarketViewType.advanced.id && (
        <SlideUpWrapper delay={0.1}>
          <OfferTypeSelector />
        </SlideUpWrapper>
      )}

      {userType === MarketUserType.ap.id &&
      offerType === MarketOfferType.limit.id &&
      showIncentiveTokenEstimate ? (
        <div className="mt-3">
          <SlideUpWrapper delay={0.2}>
            <TokenEstimator
              defaultTokenId={
                highestIncentiveToken?.id ? [highestIncentiveToken.id] : []
              }
              market={currentMarketData}
            >
              <Button className="flex w-full items-center justify-center gap-2">
                <LightningIcon className="h-5 w-5 fill-white" />
                <span className="text-sm font-medium">
                  Estimate APY to Place Limit Offer
                </span>
              </Button>
            </TokenEstimator>
          </SlideUpWrapper>
        </div>
      ) : (
        <>
          {/**
           * Recipe Action Forms
           */}
          {marketMetadata.market_type === MarketType.recipe.id && (
            <div className={cn("mt-3")}>
              <RecipeActionForms marketActionForm={marketActionForm} />
            </div>
          )}

          {/**
           * Vault Action Forms
           */}
          {marketMetadata.market_type === MarketType.vault.id && (
            <div className={cn("mt-3")}>
              <VaultActionForms marketActionForm={marketActionForm} />
            </div>
          )}

          <div className="mt-5">
            {(() => {
              if (!address) {
                return (
                  <Button
                    onClick={() => {
                      try {
                        connectWalletModal();
                      } catch (error) {
                        toast.custom(
                          <ErrorAlert message="Error connecting wallet" />
                        );
                      }
                    }}
                    size="sm"
                    className="w-full"
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chainId !== marketMetadata.chain_id) {
                return (
                  <Button
                    onClick={async () => {
                      try {
                        // @ts-ignore
                        await switchChain(config, {
                          chainId: marketMetadata.chain_id,
                        });
                      } catch (error) {
                        toast.custom(
                          <ErrorAlert message="Error switching chain" />
                        );
                        console.log("Failed:", error);
                      }
                    }}
                    size="sm"
                    className="w-full"
                  >
                    Switch Chain
                  </Button>
                );
              }

              return (
                <Button
                  onClick={() => {
                    try {
                      if (isValid.status) {
                        setMarketStep(MarketSteps.preview.id);
                      } else {
                        toast.custom(<ErrorAlert message={isValid.message} />);
                      }
                    } catch (error) {
                      toast.custom(
                        <ErrorAlert message="Error submitting offer" />
                      );
                    }
                  }}
                  size="sm"
                  className="w-full"
                >
                  {offerType === MarketOfferType.market.id ? (
                    userType === MarketUserType.ap.id &&
                    highestIncentiveToken &&
                    marketActionForm.watch("quantity.amount") ? (
                      <>
                        {highestIncentiveToken && (
                          <div className="ml-1 flex items-center gap-1">
                            <span>Supply</span>

                            <span>for</span>

                            <span>
                              {highestIncentiveToken.annual_change_ratio ===
                                0 && highestIncentiveToken.type === "point"
                                ? formatNumber(
                                    parseFloat(
                                      marketActionForm.watch(
                                        "quantity.amount"
                                      ) || "0"
                                    ) *
                                      (isNaN(
                                        highestIncentiveToken.per_input_token
                                      )
                                        ? 0
                                        : highestIncentiveToken.per_input_token)
                                  )
                                : formatNumber(
                                    highestIncentiveToken.annual_change_ratio ||
                                      0,
                                    {
                                      type: "percent",
                                    }
                                  )}
                            </span>

                            <span className="font-regular text-white">
                              {highestIncentiveToken?.symbol}
                            </span>

                            <span className="mb-px">
                              <TokenDisplayer
                                size={4}
                                tokens={[highestIncentiveToken] as any}
                                symbols={false}
                                symbolClassName="text-white font-regular"
                              />
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <span>Supply Now</span>
                    )
                  ) : userType === MarketUserType.ap.id &&
                    selectedIncentiveToken &&
                    marketActionForm.watch("quantity.amount") ? (
                    <>
                      {selectedIncentiveToken && (
                        <div className="ml-1 flex items-center gap-1">
                          <span>Bid</span>

                          <span>for</span>

                          <span>
                            {selectedIncentiveToken.annual_change_ratio === 0 &&
                            selectedIncentiveToken.type === "point"
                              ? formatNumber(
                                  parseFloat(
                                    marketActionForm.watch("quantity.amount") ||
                                      "0"
                                  ) *
                                    (isNaN(
                                      selectedIncentiveToken.per_input_token
                                    )
                                      ? 0
                                      : selectedIncentiveToken.per_input_token)
                                )
                              : formatNumber(
                                  selectedIncentiveToken.annual_change_ratio ||
                                    0,
                                  {
                                    type: "percent",
                                  }
                                )}
                          </span>

                          <span className="font-regular text-white">
                            {selectedIncentiveToken.symbol}
                          </span>

                          <span className="mb-px">
                            <TokenDisplayer
                              size={4}
                              tokens={[selectedIncentiveToken]}
                              symbols={false}
                              symbolClassName="text-white font-regular"
                            />
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <span>Supply Now</span>
                  )}
                </Button>
              );
            })()}

            {offerType === MarketOfferType.market.id &&
              userType === MarketUserType.ap.id && (
                <TertiaryLabel className="mt-2 space-x-1 italic">
                  <span>Total APY:</span>

                  <span className="flex items-center justify-center">
                    {formatNumber(currentMarketData?.annual_change_ratio || 0, {
                      type: "percent",
                    })}
                  </span>
                </TertiaryLabel>
              )}
          </div>
        </>
      )}
    </div>
  );
});
