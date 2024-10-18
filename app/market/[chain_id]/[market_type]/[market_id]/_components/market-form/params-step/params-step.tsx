import { Form } from "@/components/ui/form";
import React, { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketFormSchema } from "../market-form-schema";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { HorizontalTabs } from "@/components/composables";
import { FormOfferType } from "./form-offer-type";
import { FormOfferAmount } from "./form-offer-amount";
import { FormIncentiveTokens } from "./form-incentive-tokens";
import { FormExpiry } from "./form-expiry";
import { BASE_MARGIN_TOP } from "../../composables";
import { FormFundingVault } from "./form-funding-vault";
import {
  MarketOfferType,
  MarketType,
  MarketUserType,
  useMarketManager,
} from "@/store";
import { useActiveMarket } from "../../hooks";
import { TypedRoycoMarketUserType } from "@/sdk/market";

export const ParamsStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    onSubmit: (data: any) => void;
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ className, onSubmit, marketForm, ...props }, ref) => {
  const { currentMarketData, marketMetadata } = useActiveMarket();

  const { userType } = useMarketManager();

  return (
    <Form {...marketForm}>
      <form
        onSubmit={marketForm.handleSubmit(onSubmit)}
        className={cn("contents")}
      >
        <AnimatePresence mode="popLayout">
          {/* <HorizontalTabs
            className={cn("mb-5", "mt-3")}
            size="sm"
            key="market:user-type:container"
            baseId="market:user-type"
            tabs={Object.values(MarketUserType)}
            activeTab={marketForm.watch("user_type")}
            setter={setActionType}
          /> */}

          {/**
           * @weird somehow setting custom height enables scrolling
           */}
          <div className="h-12 w-full grow overflow-x-hidden overflow-y-scroll">
            <FormOfferType
              // className={cn(BASE_MARGIN_TOP.LG)}
              marketForm={marketForm}
            />

            {marketForm.watch("offer_type") === MarketOfferType.limit.id &&
              userType === MarketUserType.ap.id && (
                <FormFundingVault
                  className={cn(BASE_MARGIN_TOP.MD)}
                  marketForm={marketForm}
                />
              )}

            {marketMetadata.market_type === MarketType.vault.id &&
            userType === MarketUserType.ip.id &&
            marketForm.watch("offer_type") === MarketOfferType.limit.id ? (
              <Fragment />
            ) : (
              <FormOfferAmount
                className={cn(BASE_MARGIN_TOP.MD)}
                marketForm={marketForm}
              />
            )}

            {marketForm.watch("offer_type") === MarketOfferType.limit.id && (
              <FormIncentiveTokens
                className={cn(BASE_MARGIN_TOP.MD)}
                marketForm={marketForm}
              />
            )}

            {(marketForm.watch("offer_type") === MarketOfferType.limit.id &&
              marketMetadata.market_type === MarketType.vault.id &&
              userType === MarketUserType.ip.id) ||
            marketForm.watch("offer_type") === MarketOfferType.market.id ? (
              <Fragment />
            ) : (
              <FormExpiry
                className={cn(BASE_MARGIN_TOP.MD)}
                marketForm={marketForm}
              />
            )}
          </div>
        </AnimatePresence>
      </form>
    </Form>
  );
});
