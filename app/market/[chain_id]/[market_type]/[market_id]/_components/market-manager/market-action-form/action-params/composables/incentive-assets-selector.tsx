import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { SlideUpWrapper } from "@/components/animations";
import { FormInputLabel } from "@/components/composables";
import { IncentiveTokenSelector } from "./incentive-token-selector";
import { MarketActionFormSchema } from "../..";
import { UseFormReturn } from "react-hook-form";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { useMarketManager } from "@/store";

export const IncentiveAssetsSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
    delayTitle?: number;
    delayContent?: number;
  }
>(
  (
    { className, marketActionForm, delayTitle, delayContent, ...props },
    ref
  ) => {
    const { userType } = useMarketManager();

    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <SlideUpWrapper className="mt-5" delay={delayTitle}>
          <FormInputLabel
            size="sm"
            label="Incentive Assets"
            info="Select the incentives you want to offer"
          />
          <IncentiveTokenSelector
            selected_token_ids={
              marketActionForm
                .watch("incentive_assets")
                ?.map((token) => token.id) ?? []
            }
            onSelect={(token) => {
              const incentiveAssets =
                marketActionForm.watch("incentive_assets") ?? [];

              if (incentiveAssets?.some((t) => t.id === token.id)) {
                marketActionForm.setValue(
                  "incentive_assets",
                  incentiveAssets?.filter((t) => t.id !== token.id)
                );
              } else {
                marketActionForm.setValue("incentive_assets", [
                  ...incentiveAssets,
                  token,
                ]);
              }
            }}
            className="mt-2"
          />
        </SlideUpWrapper>

        <SlideUpWrapper className="mt-2" delay={delayContent}>
          <div className="flex h-fit w-full flex-row flex-wrap gap-1 rounded-xl border border-divider bg-z2 p-1">
            {marketActionForm.watch("incentive_assets") === undefined ||
            marketActionForm.watch("incentive_assets")?.length === 0 ? (
              <AlertIndicator className="w-full ">
                No incentive assets selected
              </AlertIndicator>
            ) : (
              marketActionForm.watch("incentive_assets")?.map((token) => {
                return (
                  <div
                    key={`incentive-asset-${token.id}`}
                    className="flex w-fit flex-col items-center gap-1 rounded-xl border border-divider bg-white p-2"
                  >
                    <TokenDisplayer size={4} tokens={[token]} symbols={true} />
                  </div>
                );
              })
            )}
          </div>
        </SlideUpWrapper>
      </div>
    );
  }
);
