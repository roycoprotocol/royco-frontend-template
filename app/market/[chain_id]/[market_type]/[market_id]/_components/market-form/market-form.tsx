"use client";

import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { MarketFormSchema } from "../market-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  MarketSteps,
  MarketUserType,
  MarketViewType,
  useMarketManager,
} from "@/store";
import { useActiveMarket } from "../hooks";
import { MarketActionType, MarketOfferType, MarketType } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseFundingVault, useMarketAction, useTokenQuotes } from "@/sdk/hooks";
import {
  BASE_MARGIN_TOP,
  BASE_PADDING_BOTTOM,
  BASE_PADDING_LEFT,
  BASE_PADDING_RIGHT,
  BASE_PADDING_TOP,
  BASE_UNDERLINE,
  SecondaryLabel,
  TertiaryLabel,
} from "../composables";
import { Button } from "@/components/ui/button";
import { ErrorAlert, HorizontalTabs } from "@/components/composables";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { switchChain } from "@wagmi/core";
import { config } from "@/components/web3-modal/modal-config";
import { ParamsStep } from "./params-step";
import { PreviewStep } from "./preview-step";
import { ChevronLeftIcon } from "lucide-react";
import { motion } from "framer-motion";
import { WithdrawSection } from "./withdraw-section"; // @todo fix it
import { AlertIndicator } from "@/components/common";
import { useMarketFormDetails } from "./use-market-form-details";
import { RoycoMarketVaultIncentiveAction } from "@/sdk/market";

export const MarketForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    marketStep,
    setMarketStep,
    transactions,
    setTransactions,
    actionType,
    setActionType,
    userType,
    setUserType,
    viewType,
  } = useMarketManager();
  const { address, isConnected } = useAccount();
  const { open, close } = useWeb3Modal();
  const { selectedNetworkId, open: isModalOpen } = useWeb3ModalState();

  const { currentMarketData, marketMetadata } = useActiveMarket();

  const marketForm = useForm<z.infer<typeof MarketFormSchema>>({
    resolver: zodResolver(MarketFormSchema),
    defaultValues: {
      offer_type: MarketOfferType.market.id,
      funding_vault: BaseFundingVault,
      incentive_tokens: [],
      no_expiry: false,
      vault_incentive_action: RoycoMarketVaultIncentiveAction.add.id,
    },
  });

  const propsTokenQuotes = useTokenQuotes({
    token_ids: [
      currentMarketData?.input_token_id ?? "",
      ...marketForm.watch("incentive_tokens").map((token) => token.id),
    ].filter(Boolean),
  });

  const {
    isLoading,
    isValid,
    isReady,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    incentiveData,
  } = useMarketFormDetails(marketForm);

  const handleNextStep = async () => {
    try {
      if (!isConnected) {
        open();
      } else if (
        // @ts-ignore
        selectedNetworkId !== marketMetadata.chain_id
      ) {
        try {
          await switchChain(config, {
            chainId: marketMetadata.chain_id,
          });
        } catch (error) {}
      } else if (marketStep === MarketSteps.params.id) {
        if (isValid.status) {
          onSubmit(marketForm.getValues());
        } else {
          toast.custom(<ErrorAlert message={isValid.message} />);
        }
      } else if (
        marketStep === MarketSteps.preview.id &&
        canBePerformedPartially
      ) {
        setTransactions(writeContractOptions);
      }
    } catch (error) {
      toast.custom(<ErrorAlert message="Error submitting offer" />);
    }
  };

  const nextLabel = () => {
    if (!address) {
      return "Connect wallet";
    } else if (
      // @ts-ignore
      selectedNetworkId !== marketMetadata.chain_id
    ) {
      return "Switch chain";
    } else if (marketStep === MarketSteps.params.id) {
      return "Preview offer";
    } else if (marketStep === MarketSteps.preview.id) {
      return "Confirm offer";
    } else {
      return "Offer in progress";
    }
  };

  const onSubmit = (data: any) => {
    if (isValid.status) {
      setMarketStep(MarketSteps.preview.id);
    }
  };

  useEffect(() => {
    if (viewType === MarketViewType.simple.id) {
      setUserType(MarketUserType.ap.id);
    }
  }, [viewType]);

  useEffect(() => {
    if (
      userType === MarketUserType.ip.id &&
      actionType === MarketActionType.withdraw.id
    ) {
      setActionType(MarketActionType.supply.id);
    }
  }, [userType]);

  if (!!currentMarketData) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full shrink-0 grow flex-col",
          "overflow-hidden",
          className
        )}
        {...props}
      >
        {marketStep !== MarketSteps.params.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            className={cn(
              "flex w-full flex-row place-content-start items-center py-3 text-left",
              BASE_PADDING_TOP,
              BASE_PADDING_LEFT,
              BASE_PADDING_RIGHT
            )}
          >
            <div
              onClick={() => setMarketStep(MarketSteps.params.id)}
              className={cn(
                BASE_UNDERLINE.MD,
                "flex flex-row place-content-start items-center space-x-1 text-left decoration-transparent hover:decoration-tertiary"
              )}
            >
              <ChevronLeftIcon
                strokeWidth={1}
                className="h-5 w-5 text-secondary"
              />
              <SecondaryLabel className="mt-[0.15rem] flex h-4 leading-none">
                OFFER PARAMS
              </SecondaryLabel>
            </div>
          </motion.div>
        )}

        {marketStep !== MarketSteps.params.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            key={`market-form:label:${marketStep}`}
          >
            <TertiaryLabel
              className={cn(
                "pt-1",
                BASE_PADDING_TOP,
                BASE_PADDING_LEFT,
                BASE_PADDING_RIGHT
              )}
            >
              {MarketSteps[marketStep].label}
            </TertiaryLabel>
          </motion.div>
        )}

        {/**
         * @note: New version
         * User Type (Simple / Advanced)
         */}
        {marketStep === MarketSteps.params.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            key={`market-form:label`}
            className={cn("flex flex-row items-center justify-between")}
          >
            <TertiaryLabel
              onClick={() => {
                setUserType(MarketUserType.ap.id);
              }}
              className={cn(
                "cursor-pointer",
                "pt-1",
                BASE_PADDING_TOP,
                BASE_PADDING_LEFT,
                BASE_PADDING_RIGHT,
                userType === MarketUserType.ap.id && BASE_UNDERLINE.MD
              )}
            >
              TRANSACT
            </TertiaryLabel>

            {viewType === MarketViewType.advanced.id && (
              <TertiaryLabel
                onClick={() => {
                  setUserType(MarketUserType.ip.id);
                }}
                className={cn(
                  "cursor-pointer",
                  "pt-1",
                  BASE_PADDING_TOP,
                  BASE_PADDING_LEFT,
                  BASE_PADDING_RIGHT,
                  userType === MarketUserType.ip.id && BASE_UNDERLINE.MD
                )}
              >
                INCENTIVIZE
              </TertiaryLabel>
            )}
          </motion.div>
        )}

        {/**
         * @note: Previous version
         * User Type (AP / IP)
         * Currently enabled for both views
         */}
        {/* {marketStep === MarketSteps.params.id &&
          viewType === MarketViewType.advanced.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              className={cn(
                "flex flex-col",
                BASE_PADDING_LEFT,
                BASE_PADDING_RIGHT
              )}
            >
              <HorizontalTabs
                className={cn("", "mt-3")}
                size="sm"
                key="market:user-type:container"
                baseId="market:user-type"
                tabs={Object.values(MarketUserType)}
                activeTab={userType}
                setter={setUserType}
              />
            </motion.div>
          )} */}

        {/**
         * Action Type (Supply / Withdraw)
         */}
        {marketStep === MarketSteps.params.id &&
          userType === MarketUserType.ap.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              className={cn(
                "mt-3 flex flex-col",
                BASE_PADDING_LEFT,
                BASE_PADDING_RIGHT
              )}
            >
              <HorizontalTabs
                className={cn("mt-3")}
                size="sm"
                key="market:action-type:container"
                baseId="market:action-type"
                tabs={Object.values(MarketActionType)}
                activeTab={actionType}
                setter={setActionType}
              />
            </motion.div>
          )}

        {/**
         * Withdraw Section (Input Token / Incentives)
         */}
        {actionType === MarketActionType.withdraw.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            className={cn(
              "flex grow flex-col",
              BASE_PADDING_LEFT,
              BASE_PADDING_RIGHT,
              BASE_PADDING_BOTTOM
            )}
          >
            <AlertIndicator className={cn("h-full")}>
              Withdrawal section is coming soon.
            </AlertIndicator>
            {/* <WithdrawSection /> */}
          </motion.div>
        )}

        {/**
         * Params Step
         */}
        {marketStep === MarketSteps.params.id &&
          actionType === MarketActionType.supply.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              className={cn(
                "flex grow flex-col",
                BASE_PADDING_LEFT,
                BASE_PADDING_RIGHT,
                "mt-5"
              )}
            >
              <ParamsStep
                className={cn(
                  BASE_MARGIN_TOP.LG,
                  BASE_PADDING_LEFT,
                  BASE_PADDING_RIGHT
                )}
                onSubmit={onSubmit}
                marketForm={marketForm}
              />
            </motion.div>
          )}

        {/**
         * Preview Step
         */}
        {marketStep === MarketSteps.preview.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            className="flex grow flex-col overflow-hidden"
          >
            <PreviewStep
              marketForm={marketForm}
              className={cn(
                BASE_MARGIN_TOP.LG,
                BASE_PADDING_LEFT,
                BASE_PADDING_RIGHT
              )}
            />
          </motion.div>
        )}

        {/**
         * Action Button
         */}
        {actionType === MarketActionType.supply.id && (
          <div
            className={cn(
              BASE_PADDING_BOTTOM,
              BASE_PADDING_LEFT,
              BASE_PADDING_RIGHT,
              "mt-5",
              "shrink-0"
            )}
          >
            {/* <div className={cn("w-full")}>
              <div className="h-8 w-full place-content-center rounded-md bg-error text-center font-gt text-sm text-white">
                Warning: Low liquidity in the market.
              </div>
            </div> */}

            <Button
              disabled={
                marketStep === MarketSteps.preview.id &&
                canBePerformedPartially === false
                  ? true
                  : false

                // (marketMetadata.market_type === RoycoMarketType.vault.id &&
                //   userType === RoycoMarketUserType.ap.id &&
                //   marketForm.watch("offer_type") ===
                //     RoycoMarketOfferType.limit.id) ||
                // (marketMetadata.market_type === RoycoMarketType.vault.id &&
                //   userType === RoycoMarketUserType.ip.id &&
                //   marketForm.watch("offer_type") ===
                //     RoycoMarketOfferType.market.id)
                //   ? true
                //   : marketStep === MarketSteps.preview.id &&
                //       canBePerformedPartially === false
                //     ? true
                //     : false
              }
              onClick={async () => {
                await handleNextStep();
              }}
              size="sm"
              type="button"
              className="shrink-0"
            >
              {nextLabel()}
              {/* {(marketMetadata.market_type === RoycoMarketType.vault.id &&
                userType === RoycoMarketUserType.ap.id &&
                marketForm.watch("offer_type") ===
                  RoycoMarketOfferType.limit.id) ||
              (marketMetadata.market_type === RoycoMarketType.vault.id &&
                userType === RoycoMarketUserType.ip.id &&
                marketForm.watch("offer_type") ===
                  RoycoMarketOfferType.market.id)
                ? "Coming Soon"
                : nextLabel()} */}
            </Button>
          </div>
        )}
      </div>
    );
  }
});

{
  /* <Fragment> */
}
{
  /* {viewType === MarketViewType.simple.id && (
  <div
    className={cn(
      "flex w-full flex-col items-start border-b border-divider",
      BASE_PADDING
    )}
  >
    <div className="flex w-fit max-w-full flex-row items-center font-gt text-lg font-medium text-primary">
      <div className="max-w-full grow overflow-hidden truncate text-ellipsis">
        {propsEnrichedMarket.data.title || "Unknown Market"}
      </div>

      {propsEnrichedMarket.data.title && (
        <div className="ml-2 flex h-5 w-5 shrink-0 flex-col place-content-center items-center rounded-full bg-primary">
          <CheckIcon
            strokeWidth={2.5}
            className="h-5 w-5 p-1 text-white"
          />
        </div>
      )}
    </div>
  </div>
)} */
}

// {viewType === MarketViewType.simple.id && (
//   <div
//     className={cn(
//       "flex w-full flex-row items-center justify-between border-t border-divider",
//       BASE_PADDING
//     )}
//   >
//     <div className="font-gt text-sm font-light text-secondary">
//       Advanced Mode
//     </div>
//     <Switch
//       checked={viewType === MarketViewType.advanced.id}
//       onCheckedChange={() => {
//         setViewType(
//           viewType === MarketViewType.advanced.id
//             ? MarketViewType.simple.id
//             : MarketViewType.advanced.id
//         );
//       }}
//     />
//   </div>
// )}
// </Fragment>
