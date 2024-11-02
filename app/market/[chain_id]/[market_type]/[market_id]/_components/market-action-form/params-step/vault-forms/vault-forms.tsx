import React from "react";
import { cn } from "@/lib/utils";
import { useActiveMarket } from "../../../hooks";
import { MarketOfferType, MarketUserType, useMarketManager } from "@/store";
import { IPLimitOfferUI } from "./ip-limit-offer-ui";
import { UseFormReturn } from "react-hook-form";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { z } from "zod";
import { APOfferUI } from "./ap-offer-ui";
import { IPMarketOfferUI } from "./ip-market-offer-ui";

export const VaultForms = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { currentMarketData, marketMetadata } = useActiveMarket();

  const { userType, offerType } = useMarketManager();

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <div className="h-12 grow overflow-x-hidden overflow-y-scroll">
        {userType === MarketUserType.ap.id && (
          <APOfferUI marketActionForm={marketActionForm} />
        )}

        {userType === MarketUserType.ip.id &&
          offerType === MarketOfferType.market.id && (
            <IPMarketOfferUI marketActionForm={marketActionForm} />
          )}

        {userType === MarketUserType.ip.id &&
          offerType === MarketOfferType.limit.id && (
            <IPLimitOfferUI marketActionForm={marketActionForm} />
          )}
      </div>
    </div>
  );
});
