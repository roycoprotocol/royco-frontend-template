import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";
import { SlideUpWrapper } from "@/components/animations";
import { EnsoShortcutsWidget } from "../../components/enso-shortcuts-widget.tsx";
import { SONIC_CHAIN_ID } from "royco/sonic";
import { loadableEnrichedMarketAtom } from "@/store/market";
import { useAtom, useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import { DottedBracket } from "../../../../../../icons/dotted-bracket";
import { showEnsoShortcutsWidgetAtom } from "@/store/global";

export const APMarketActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);
  const [showEnsoWidget, setShowEnsoWidget] = useAtom(
    showEnsoShortcutsWidgetAtom
  );

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Enso Shortcuts Widget
       */}
      {enrichedMarket?.chainId !== SONIC_CHAIN_ID &&
        enrichedMarket?.inputToken && (
          <div className="mt-2">
            <EnsoShortcutsWidget
              token={enrichedMarket?.inputToken?.contractAddress!}
              symbol={enrichedMarket?.inputToken?.symbol!}
              chainId={enrichedMarket?.chainId!}
            >
              <div className="flex w-full justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-sm"
                  onClick={() => setShowEnsoWidget(!showEnsoWidget)}
                >
                  <div className="flex items-center gap-2">
                    <DottedBracket className="h-5 w-5 text-inherit" />
                    <span>Get {enrichedMarket?.inputToken?.symbol!}</span>
                  </div>
                </Button>
              </div>
            </EnsoShortcutsWidget>
          </div>
        )}

      {!showEnsoWidget && (
        <>
          {/**
           * Input Amount
           */}
          <div className="mt-3">
            <SlideUpWrapper delay={0.1}>
              <InputAmountWrapper marketActionForm={marketActionForm} />
            </SlideUpWrapper>
          </div>
        </>
      )}
    </div>
  );
});
