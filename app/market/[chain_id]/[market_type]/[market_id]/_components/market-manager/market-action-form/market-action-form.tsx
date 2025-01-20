"use client";

import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  MarketSteps,
  MarketUserType,
  MarketViewType,
  useMarketManager,
} from "@/store";
import { useActiveMarket } from "../../hooks";
import { MarketActionType, MarketOfferType, MarketType } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { MarketActionFormSchema } from "./market-action-form-schema";
import { ActionParams } from "./action-params";
import { ActionPreview } from "./action-preview/action-preview";

export const MarketActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    marketStep,
    actionType,
    setActionType,
    userType,
    setUserType,
    viewType,
    offerType,
    setOfferType,
    vaultIncentiveActionType,
  } = useMarketManager();

  const { currentMarketData } = useActiveMarket();

  const marketActionForm = useForm<z.infer<typeof MarketActionFormSchema>>({
    resolver: zodResolver(MarketActionFormSchema),
    defaultValues: {
      funding_vault: "" as string,
      incentive_tokens: [],
      no_expiry: true,
    },
  });

  useEffect(() => {
    if (viewType === MarketViewType.simple.id) {
      setOfferType(MarketOfferType.market.id);
      setUserType(MarketUserType.ap.id);
    }
  }, [viewType]);

  useEffect(() => {
    if (
      userType === MarketUserType.ip.id &&
      actionType === MarketActionType.withdraw.id
    ) {
      setActionType(MarketActionType.supply.id);
    }
  }, [userType]);

  useEffect(() => {
    marketActionForm.setValue("incentive_tokens", []);
  }, [vaultIncentiveActionType]);

  useEffect(() => {
    marketActionForm.reset({
      funding_vault: "" as string,
      incentive_tokens: [],
      no_expiry: true,
    });
  }, [userType, offerType]);

  if (!!currentMarketData) {
    return (
      <div
        key={`market-action-form:container:${marketStep}:${viewType}`}
        ref={ref}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {marketStep === MarketSteps.params.id && (
          <ActionParams marketActionForm={marketActionForm} />
        )}

        {marketStep === MarketSteps.preview.id && (
          <ActionPreview marketActionForm={marketActionForm} />
        )}
      </div>
    );
  }
});
