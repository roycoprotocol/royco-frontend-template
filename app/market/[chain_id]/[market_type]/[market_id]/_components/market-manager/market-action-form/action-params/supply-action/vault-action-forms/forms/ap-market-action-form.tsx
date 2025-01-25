import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";
import { SlideUpWrapper } from "@/components/animations";
import { useMarketManager } from "@/store/use-market-manager";
import { useActiveMarket } from "../../../../../../hooks/use-active-market";
import { EnsoShortcutsWidget } from "../../components/enso-shortcuts-widget.tsx";

export const APMarketActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { viewType } = useMarketManager();
  const { currentMarketData } = useActiveMarket();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Enso Shortcuts Widget
       */}
      <EnsoShortcutsWidget
        token={currentMarketData?.input_token_data.contract_address!}
        symbol={currentMarketData?.input_token_data.symbol}
        chainId={currentMarketData?.chain_id!}
      />

      {/**
       * Input Amount
       */}
      <div className="mt-3">
        <SlideUpWrapper delay={0.1}>
          <InputAmountWrapper marketActionForm={marketActionForm} />
        </SlideUpWrapper>
      </div>
    </div>
  );
});
