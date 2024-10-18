"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { MarketFormSchema } from "../market-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MarketSteps, MarketUserType, useMarketManager } from "@/store";
import { useActiveMarket } from "../hooks";
import { MarketActionType, MarketOfferType, MarketType } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseFundingVault, useMarketAction } from "@/sdk/hooks";
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
import { isSolidityIntValid } from "@/sdk/utils";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { switchChain } from "@wagmi/core";
import { config } from "@/components/web3-modal/modal-config";
import { ParamsStep } from "./params-step";
import { PreviewStep } from "./preview-step";
import { isValid } from "date-fns";
import { SlideUpWrapper } from "@/components/animations";
import { ChevronLeftIcon } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { TypedRoycoMarketUserType } from "@/sdk/market";
import { WithdrawSection } from "./withdraw-section";

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
    },
  });

  const {
    isValid,
    isValidMessage,
    isReady,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    // incentivesInfo: incentivesInfoCreateOfferRecipe,
  } = useMarketAction({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    market_type: marketMetadata.market_type,
    funding_vault: marketForm.watch("funding_vault").address,
    quantity: marketForm.watch("offer_raw_amount"),
    expiry:
      marketForm.watch("no_expiry") === true
        ? "0"
        : !marketForm.watch("expiry")
          ? undefined
          : Math.floor(
              (marketForm.watch("expiry") ?? new Date()).getTime() / 1000
            ).toString(),

    // Incentive Token IDs
    incentive_token_ids: marketForm
      .watch("incentive_tokens")
      .map((token) => token.id),

    // Incentive Token Amounts
    incentive_token_amounts: marketForm
      .watch("incentive_tokens")
      .map((token) => token.raw_amount ?? "0"),

    // Incentive Rates
    incentive_rates: marketForm
      .watch("incentive_tokens")
      .map((token) => token.rate ?? "0"),

    // Incentive Start timestamps
    incentive_start_timestamps: marketForm
      .watch("incentive_tokens")
      .map((token) =>
        Math.floor(
          (token.start_timestamp ?? new Date()).getTime() / 1000
        ).toString()
      ),

    // Incentive End timestamps
    incentive_end_timestamps: marketForm
      .watch("incentive_tokens")
      .map((token) =>
        Math.floor(
          (token.end_timestamp ?? new Date()).getTime() / 1000
        ).toString()
      ),

    user_type: userType,
    offer_type: marketForm.watch("offer_type"),
    account: address,
    frontendFeeRecipient: process.env.NEXT_PUBLIC_FRONTEND_FEE_RECIPIENT || "",
    enabled: marketStep !== MarketSteps.params.id,
    simulation_url: process.env.NEXT_PUBLIC_SIMULATION_URL || "",
  });

  // console.log("marketForm incentives", marketForm.watch("incentive_tokens"));

  // const isOfferValid = async () => {
  //   try {
  //     if (!currentMarketData) return false;

  //     if (marketMetadata.market_type === MarketType.recipe.id) {
  //       if (marketForm.watch("offer_type") === MarketOfferType.limit.id) {
  //         // limit offer
  //         if (
  //           !isSolidityIntValid("uint256", marketForm.watch("offer_raw_amount"))
  //         ) {
  //           toast.custom(<ErrorAlert message="Invalid offer amount" />);
  //           return false;
  //         } else if (marketForm.watch("incentive_tokens").length === 0) {
  //           toast.custom(<ErrorAlert message="No incentive token added" />);
  //           return false;
  //         } else if (
  //           marketForm
  //             .watch("incentive_tokens")
  //             .some((token) => !isSolidityIntValid("uint256", token.raw_amount))
  //         ) {
  //           toast.custom(<ErrorAlert message="Invalid incentive amount" />);
  //           return false;
  //         } else if (marketForm.watch("no_expiry") === false) {
  //           if (!!marketForm.watch("expiry")) {
  //             const currentUTC = new Date().getTime();
  //             const expiryUTC = marketForm.watch("expiry")?.getTime();

  //             if (expiryUTC && expiryUTC < currentUTC) {
  //               toast.custom(
  //                 <ErrorAlert message="Offer expiry can't be in the past" />
  //               );
  //               return false;
  //             }
  //           } else {
  //             toast.custom(<ErrorAlert message="Offer expiry not set" />);
  //             return false;
  //           }
  //         }

  //         return true;
  //       } else {
  //         // market offer
  //         if (
  //           !isSolidityIntValid("uint256", marketForm.watch("offer_raw_amount"))
  //         ) {
  //           toast.custom(<ErrorAlert message="Invalid offer amount" />);
  //           return false;
  //         } else {
  //           return true;
  //         }
  //       }
  //     } else {
  //       if (
  //         !isSolidityIntValid("uint256", marketForm.watch("offer_raw_amount"))
  //       ) {
  //         toast.custom(<ErrorAlert message="Invalid offer amount" />);
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //   } catch (e) {
  //     return false;
  //   }
  // };

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
        if (isValid) {
          onSubmit(marketForm.getValues());
        } else {
          toast.custom(<ErrorAlert message={isValidMessage} />);
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
    if (isValid === true) {
      setMarketStep(MarketSteps.preview.id);
    }
  };

  // const setUserType = (value: TypedRoycoMarketUserType) => {
  //   marketForm.setValue("user_type", value);
  // };

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
                BASE_UNDERLINE.SM,
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

        {/**
         * User Type (AP / IP)
         */}
        {marketStep === MarketSteps.params.id && (
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
        )}

        {/**
         * Action Type (Supply / Withdraw)
         */}
        {marketStep === MarketSteps.params.id && (
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
              className={cn("mb-5", "mt-3")}
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
            <WithdrawSection />
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
                BASE_PADDING_RIGHT
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
              }
              onClick={async () => {
                await handleNextStep();
              }}
              size="sm"
              type="button"
              className="shrink-0"
            >
              {nextLabel()}
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
