import React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { MarketType, useMarketManager } from "@/store";
import { useActiveMarket } from "../../hooks";
import { VaultForms } from "./vault-forms/vault-forms";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../market-action-form-schema";
import { RecipeForms } from "./recipe-forms";

export const ParamsStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { marketMetadata } = useActiveMarket();

  return (
    <div
      ref={ref}
      className={cn("flex min-h-[200px] grow flex-col", className)}
      {...props}
    >
      {marketMetadata.market_type === MarketType.recipe.id && (
        <RecipeForms marketActionForm={marketActionForm} />
      )}

      {marketMetadata.market_type === MarketType.vault.id && (
        <VaultForms marketActionForm={marketActionForm} />
      )}
    </div>
  );
});
