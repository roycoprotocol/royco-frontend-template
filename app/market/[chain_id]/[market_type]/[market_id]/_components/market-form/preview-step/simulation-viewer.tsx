import { cn } from "@/lib/utils";
import React from "react";
import {
  BASE_LABEL_BORDER,
  BASE_MARGIN_TOP,
  SecondaryLabel,
  TertiaryLabel,
} from "../../composables";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTransactionSimulation } from "@/sdk/hooks";
import { useMarketFormDetails } from "../use-market-form-details";
import { MarketFormSchema } from "../market-form-schema";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useAccount } from "wagmi";
import { useActiveMarket } from "../../hooks";
import { Address } from "abitype";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { LoadingSpinner } from "@/components/composables";

export const SimulationViewer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ marketForm, className, ...props }, ref) => {
  const { address } = useAccount();

  const { marketMetadata } = useActiveMarket();

  const { writeContractOptions } = useMarketFormDetails(marketForm);

  const { data, isLoading } = useTransactionSimulation({
    chainId: marketMetadata.chain_id,
    writeContractOptions,
    simulationUrl: process.env.NEXT_PUBLIC_SIMULATION_URL ?? "",
    account: address as Address,
  });

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <SecondaryLabel className={cn(BASE_LABEL_BORDER, "font-normal")}>
        Tenderly Simulation
      </SecondaryLabel>

      <ScrollArea
        className={cn(BASE_MARGIN_TOP.SM, "flex h-fit w-full flex-row gap-2")}
      >
        <div className="flex h-fit w-full flex-row gap-2">
          {isLoading && (
            <div className="flex h-20 w-full items-center justify-center">
              <LoadingSpinner className="h-5 w-5" />
            </div>
          )}

          {!isLoading &&
            !!data &&
            data.map((tokenData, txIndex) => {
              const key = `simulation-data:${tokenData.id}:${txIndex}`;

              return (
                <div
                  key={key}
                  className={cn(
                    "flex h-fit w-[49%] shrink-0 flex-col rounded-xl bg-z2 p-3"
                  )}
                >
                  <TokenDisplayer symbols={false} tokens={[tokenData]} />
                  <SecondaryLabel className="mt-2 font-normal text-black">
                    {`${tokenData.type === "in" ? "+" : "-"}${Intl.NumberFormat(
                      "en-US",
                      {
                        style: "decimal",
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    ).format(
                      tokenData.token_amount
                    )} ${tokenData.symbol.toUpperCase()}`}
                  </SecondaryLabel>

                  <TertiaryLabel className="text-xs">
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      useGrouping: true,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(tokenData.token_amount_usd)}
                  </TertiaryLabel>
                </div>
              );
            })}

          {!isLoading && !!data && data.length === 0 && (
            <AlertIndicator className="">
              No asset changes detected
            </AlertIndicator>
          )}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
});
