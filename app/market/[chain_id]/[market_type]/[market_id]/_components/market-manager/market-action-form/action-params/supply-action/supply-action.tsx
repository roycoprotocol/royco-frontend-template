import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import {
  MarketOfferType,
  MarketSteps,
  MarketUserType,
  MarketViewType,
  useMarketManager,
} from "@/store";
import { SlideUpWrapper } from "@/components/animations/slide-up-wrapper";
import { RecipeActionForms } from "./recipe-action-forms";
import { Button } from "@/components/ui/button";
import { useAccount, useChainId } from "wagmi";
import { switchChain } from "@wagmi/core";
import { config } from "@/components/rainbow-modal/modal-config";
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { TertiaryLabel } from "../../../../composables";
import { RoycoMarketType } from "royco/market";
import { TokenDisplayer } from "@/components/common";
import { VaultActionForms } from "./vault-action-forms";
import { OfferTypeSelector } from "./components/offer-type-selector";
import LightningIcon from "../../../../icons/lightning";
import { TokenEstimator } from "@/app/_components/token-estimator";
import formatNumber from "@/utils/numbers";
import { SONIC_CHAIN_ID } from "royco/sonic";
import { useMarketFormDetailsApi } from "../../use-market-form-details-api";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useAtomValue } from "jotai";
import { useConnectWallet } from "@/app/_containers/providers/connect-wallet-provider";

export const SupplyAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { address } = useAccount();
  const chainId = useChainId();

  const { connectWalletModal } = useConnectWallet();
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);
  const { viewType, setMarketStep, offerType, userType } = useMarketManager();

  const propsAction = useMarketFormDetailsApi(marketActionForm);

  const highestIncentiveToken = useMemo(() => {
    if (enrichedMarket && enrichedMarket.activeIncentives.length > 0) {
      return enrichedMarket.activeIncentives[0];
    }

    return null;
  }, [enrichedMarket]);

  const selectedIncentiveToken = useMemo(() => {
    if (
      propsAction.data &&
      propsAction.data.incentiveTokens &&
      propsAction.data.incentiveTokens.length > 0
    ) {
      return propsAction.data.incentiveTokens[0];
    }

    return null;
  }, [propsAction]);

  const showIncentiveTokenEstimate = useMemo(() => {
    if (
      highestIncentiveToken &&
      highestIncentiveToken.type === "point" &&
      highestIncentiveToken.yieldRate === 0
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
              marketCategory={
                enrichedMarket && enrichedMarket.chainId === SONIC_CHAIN_ID
                  ? "sonic"
                  : undefined
              }
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
          {enrichedMarket?.marketType === RoycoMarketType.recipe.value && (
            <div className={cn("mt-3")}>
              <RecipeActionForms marketActionForm={marketActionForm} />
            </div>
          )}

          {/**
           * Vault Action Forms
           */}
          {enrichedMarket?.marketType === RoycoMarketType.vault.value && (
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

              if (chainId !== enrichedMarket?.chainId) {
                return (
                  <Button
                    onClick={async () => {
                      try {
                        // @ts-ignore
                        await switchChain(config, {
                          chainId: enrichedMarket?.chainId,
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
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toast.custom(<ErrorAlert message="New deposits have been disabled." />);
                  }}
                  className="cursor-pointer"
                >
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={true}
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
                                {highestIncentiveToken.yieldRate === 0 &&
                                highestIncentiveToken.type === "point"
                                  ? formatNumber(
                                      parseFloat(
                                        marketActionForm.watch(
                                          "quantity.amount"
                                        ) || "0"
                                      ) *
                                        (isNaN(
                                          highestIncentiveToken.perInputToken
                                        )
                                          ? 0
                                          : highestIncentiveToken.perInputToken)
                                    )
                                  : formatNumber(
                                      highestIncentiveToken.yieldRate || 0,
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
                              {selectedIncentiveToken.yieldRate === 0 &&
                              selectedIncentiveToken.type === "point"
                                ? formatNumber(
                                    parseFloat(
                                      marketActionForm.watch("quantity.amount") ||
                                        "0"
                                    ) *
                                      (isNaN(selectedIncentiveToken.perInputToken)
                                        ? 0
                                        : selectedIncentiveToken.perInputToken)
                                  )
                                : formatNumber(
                                    selectedIncentiveToken.yieldRate || 0,
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
                </div>
              );
            })()}

            {offerType === MarketOfferType.market.id &&
              userType === MarketUserType.ap.id &&
              (enrichedMarket?.yieldRate || 0) !== 0 && (
                <TertiaryLabel className="mt-2 space-x-1 italic">
                  <span>Total APY:</span>

                  <span className="flex items-center justify-center">
                    {formatNumber(enrichedMarket?.yieldRate || 0, {
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
