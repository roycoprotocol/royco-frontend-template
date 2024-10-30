"use client";

import { useWindowSize } from "@react-hook/window-size";

import { useMarketBuilderManager, useSelectionMenu } from "@/store";
import { MarketBuilderManager } from "./market-builder-manager";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  PoolFormDefaults,
  MarketBuilderFormSchema,
} from "./market-builder-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TopNavigator } from "./market-builder-manager";
import { useSearchContracts } from "@/sdk/hooks";
import { MarketBuilderSteps } from "@/store/";
import { AlertIndicator } from "@/components/common";
import { mainnet, sepolia } from "viem/chains";

export const MarketBuilder = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const [width, height] = useWindowSize();

  const { filters, sorting, searchKey, pageIndex } = useSelectionMenu();

  const {
    activeStep,
    isContractAddressUpdated,
    setIsContractAddressUpdated,
    isContractAbiUpdated,
    setIsContractAbiUpdated,
  } = useMarketBuilderManager();

  /**
   * @description Central Market Form
   */
  const marketBuilderForm = useForm<z.infer<typeof MarketBuilderFormSchema>>({
    resolver: zodResolver(MarketBuilderFormSchema),
    // @ts-ignore
    defaultValues:
      PoolFormDefaults[
        process.env.NEXT_PUBLIC_FRONTEND_TYPE === "TESTNET"
          ? sepolia.id
          : mainnet.id
      ],
  });

  // pre fetching contract list
  const {
    data: dataContractList,
    isLoading: isLoadingContractList,
    isRefetching: isRefetchingContractList,
    totalPages,
  } = useSearchContracts({
    sorting,
    filters: [
      ...filters,
      {
        id: "chain_id",
        value: marketBuilderForm.watch("chain").id,
      },
    ],
    searchKey,
    pageIndex,
  });

  const resetAsset = () => {
    const currentChain = marketBuilderForm.watch("chain");
    const currentAsset = marketBuilderForm.watch("asset");

    if (
      currentChain &&
      currentAsset &&
      currentChain.id === currentAsset.chain_id
    ) {
      return;
    } else {
      // @ts-ignore
      marketBuilderForm.setValue("asset", undefined);
    }
  };

  const resetActions = () => {
    marketBuilderForm.setValue("enter_actions", []);
    marketBuilderForm.setValue("exit_actions", []);
  };

  useEffect(() => {
    resetAsset();
    resetActions();
  }, [marketBuilderForm.watch("chain")]);

  useEffect(() => {
    if (isContractAddressUpdated === true) {
      setTimeout(() => {
        setIsContractAddressUpdated(false);
      }, 500);
    }
  }, [isContractAddressUpdated]);

  useEffect(() => {
    if (isContractAbiUpdated === true) {
      setTimeout(() => {
        setIsContractAbiUpdated(false);
      }, 500);
    }
  }, [isContractAbiUpdated]);

  /**
   * @description Below code is causing error in the app and wallet connect is not working
   * @note Add relative absolute solution to hide
   */
  // /**
  //  *
  //  */
  // if (width < 1024) {
  //   return (
  //     <div className="rounded-2xl border border-divider bg-white">
  //       <AlertIndicator
  //         ref={ref}
  //         message="Only screen sizes >= 1024px are supported yet."
  //       />
  //     </div>
  //   );
  // }

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-divider bg-white p-4 md:p-10",
        (activeStep === MarketBuilderSteps.info.id ||
          activeStep === MarketBuilderSteps.vault.id ||
          activeStep === MarketBuilderSteps.review.id) &&
          "max-w-screen-md",
        activeStep === MarketBuilderSteps.params.id && "max-w-screen-lg",
        activeStep === MarketBuilderSteps.actions.id && "max-w-[83.625rem]",
        activeStep === MarketBuilderSteps.actions.id && "h-[800px]",
        activeStep === MarketBuilderSteps.params.id && "h-[1100px]",
        activeStep === MarketBuilderSteps.transaction.id && "max-w-[83.625rem]"
      )}
    >
      {activeStep !== MarketBuilderSteps.transaction.id && (
        <TopNavigator
          className="pb-8 md:pb-12"
          marketBuilderForm={marketBuilderForm}
        />
      )}

      <MarketBuilderManager marketBuilderForm={marketBuilderForm} />
    </div>
  );
});
