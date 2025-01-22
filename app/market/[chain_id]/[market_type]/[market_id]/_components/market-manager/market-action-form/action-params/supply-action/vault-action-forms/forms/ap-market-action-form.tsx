import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";
import { SlideUpWrapper } from "@/components/animations";
import { useMarketManager } from "@/store/use-market-manager";

export const APMarketActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { viewType } = useMarketManager();

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Input Amount
       */}
      <SlideUpWrapper
        layout="position"
        layoutId={`motion:market:vault:ap-market:input-amount-wrapper:${viewType}`}
        delay={0.1}
      >
        <InputAmountWrapper marketActionForm={marketActionForm} />
      </SlideUpWrapper>
    </div>
  );
});
