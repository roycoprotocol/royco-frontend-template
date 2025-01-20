import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../market-action-form-schema";
import { MarketUserType, MarketOfferType, useMarketManager } from "@/store";
import { APLimitActionForm } from "./forms/ap-limit-action-form";
import { APMarketActionForm } from "./forms/ap-market-action-form";
import { IPMarketActionForm } from "./forms/ip-market-action-form";
import { IPLimitActionForm } from "./forms/ip-limit-action-form";

export const VaultActionForms = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { userType, offerType } = useMarketManager();

  if (userType === MarketUserType.ap.id) {
    if (offerType === MarketOfferType.limit.id) {
      return <APLimitActionForm marketActionForm={marketActionForm} />;
    } else {
      return <APMarketActionForm marketActionForm={marketActionForm} />;
    }
  } else {
    if (offerType === MarketOfferType.limit.id) {
      return <IPLimitActionForm marketActionForm={marketActionForm} />;
    } else {
      return <IPMarketActionForm marketActionForm={marketActionForm} />;
    }
  }
});
