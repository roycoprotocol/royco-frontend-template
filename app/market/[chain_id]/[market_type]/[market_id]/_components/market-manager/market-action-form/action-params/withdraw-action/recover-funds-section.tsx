"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { loadableRecipePositionsAtom } from "@/store/market";
import { useAtomValue } from "jotai";
import { InfoIcon, TriangleAlertIcon } from "lucide-react";
import { MarkdownRenderer } from "@/app/_components/common/markdown-renderer";
import { shortAddress } from "royco/utils";
import { Button } from "@/components/ui/button";
import { EnrichedTxOption } from "royco/transaction";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useMarketManager } from "@/store";
import {
  manualExecuteWeirollTxOptions,
  forfeitRecipePositionTxOptions,
  withdrawRecipeInputTokenTxOptions,
} from "royco/transaction";
import formatNumber from "@/utils/numbers";

export const RecoverFundsSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);
  const { data: recipePositions } = useAtomValue(loadableRecipePositionsAtom);
  const { setTransactions } = useMarketManager();

  if (!enrichedMarket || !recipePositions || recipePositions.data.length === 0)
    return null;

  if (
    recipePositions.data.every(
      (position) => position.inputToken.isWithdrawn === false
    )
  )
    return null;

  return (
    <div
      ref={ref}
      className={cn(
        "mb-5 flex  w-full grow flex-col rounded-2xl border border-divider bg-z2 p-3 text-black transition-all duration-200 ease-in-out hover:bg-focus",
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center gap-2">
        <InfoIcon className="h-5 w-5 text-error" />
        <div className="font-bold text-error">NOTICE</div>
      </div>

      <div className="mt-3 flex flex-col">
        <div className="text-light text-sm text-secondary">
          <MarkdownRenderer>
            {`If you have not received your funds after withdrawing, please recover your
          funds by clicking the **"Recover Funds"** button corresponding to the
          position whose funds are missing from your wallet. <br /> <br /> *If the issue still persists, then please reach out to us via email on [support@royco.org](mailto:support@royco.org)*`}
          </MarkdownRenderer>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {recipePositions.data.map((position, positionIndex) => {
            return (
              <div
                key={`recover-funds-${position.id}`}
                className="flex w-full flex-row items-center gap-2 rounded-xl border border-divider bg-white p-3 text-sm"
              >
                <div className="flex w-full flex-col items-center gap-3">
                  <div className="flex w-full flex-col items-start gap-1">
                    <div className="font-light text-secondary">
                      <b>Weiroll Wallet:</b>{" "}
                      {shortAddress(position.weirollWallet)}
                    </div>

                    <div className="font-light text-secondary">
                      <b>Amount:</b>{" "}
                      {formatNumber(position.inputToken.tokenAmountUsd, {
                        type: "currency",
                      })}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      let txOptions: EnrichedTxOption[] = [];

                      txOptions = manualExecuteWeirollTxOptions({
                        rawMarketRefId: enrichedMarket.id,
                        chainId: position.chainId,
                        weirollWallet: position.weirollWallet,
                      });

                      setTransactions(txOptions);
                    }}
                    className="w-full"
                  >
                    Recover Funds
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

RecoverFundsSection.displayName = "RecoverFundsSection";
