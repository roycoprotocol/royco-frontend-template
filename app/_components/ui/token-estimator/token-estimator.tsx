"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TokenSelector } from "./token-selector";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { useGlobalStates } from "@/store/use-global-states";
import { TokenEditor } from "./token-editor";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SlideUpWrapper } from "@/components/animations/slide-up-wrapper";
import LightningIcon from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/icons/lightning";
import { CustomTokenDataElementType } from "royco/types";
import { LoadingSpinner } from "@/components/composables";
import { useTokenQuotes } from "royco/hooks";
import { AlertIndicator } from "@/components/common";

export const EstimatorCustomTokenDataSchema = z.object({
  customTokenData: z.array(
    z.object({
      token_id: z.string(),
      fdv: z.string(),
      total_supply: z.string(),
      price: z.string(),
    })
  ),
});

export const TokenEstimator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultTokenId?: string;
  }
>(({ className, children, defaultTokenId, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { customTokenData, setCustomTokenData } = useGlobalStates();

  const form = useForm<z.infer<typeof EstimatorCustomTokenDataSchema>>({
    resolver: zodResolver(EstimatorCustomTokenDataSchema),
    defaultValues: {
      customTokenData: [],
    },
  });

  useEffect(() => {
    const tokens = customTokenData.map((token) => ({
      token_id: token.token_id,
      fdv: token.fdv || "0",
      total_supply: token.total_supply || "0",
      price: token.price || "0",
    }));

    form.setValue("customTokenData", tokens);
  }, [customTokenData, open]);

  const handleTokenSelect = (token: CustomTokenDataElementType) => {
    const currentTokens = form.getValues("customTokenData");
    const hasToken = currentTokens.some((t) => t.token_id === token.token_id);

    if (!hasToken) {
      const formToken = [token, ...currentTokens] as any;
      form.setValue("customTokenData", formToken);
    }
  };

  const { data: defaultTokenQuotes } = useTokenQuotes({
    token_ids: [defaultTokenId || ""],
  });

  useEffect(() => {
    if (
      open &&
      defaultTokenId &&
      defaultTokenQuotes &&
      defaultTokenQuotes.length > 0
    ) {
      const token = {
        token_id: defaultTokenId,
        fdv: defaultTokenQuotes[0].fdv.toString(),
        total_supply: defaultTokenQuotes[0].total_supply.toString(),
        price: defaultTokenQuotes[0].price.toString(),
      };
      handleTokenSelect(token);
    }
  }, [defaultTokenQuotes, defaultTokenId, open]);

  const handleRemoveToken = (index: number) => {
    const formTokens = form.getValues("customTokenData");
    formTokens.splice(index, 1);
    form.setValue("customTokenData", formTokens);
  };

  const estimatorCustomTokenData = form.watch("customTokenData");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent side="right" className="w-full p-0 sm:max-w-[520px]">
        <div
          ref={ref}
          className={cn("flex h-full flex-col  bg-white p-6", className)}
          {...props}
        >
          {/**
           * Sheet header
           */}
          <SheetHeader className="flex flex-col items-start">
            <Button
              variant="ghost"
              className="flex w-fit px-1"
              onClick={() => setOpen(false)}
            >
              <SecondaryLabel className="flex gap-1 text-tertiary">
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back</span>
              </SecondaryLabel>
            </Button>

            <SheetTitle className="text-left text-3xl font-bold">
              Estimate APY
            </SheetTitle>
            <SheetDescription className="text-left text-base">
              Adjust token FDV or points to re-estimate APY.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <div className="my-6 flex-1 grow overflow-y-auto">
              {/**
               * Token selector
               */}
              {/* <SlideUpWrapper className="flex flex-col overflow-x-auto">
                <TokenSelector
                  customTokenForm={form}
                  onTokenSelect={(token) => handleTokenSelect(token)}
                />
              </SlideUpWrapper> */}

              {/**
               * Custom token editor
               */}
              <form className="space-y-4">
                {estimatorCustomTokenData.length > 0 ? (
                  estimatorCustomTokenData.map((token, index) => (
                    <SlideUpWrapper className="flex flex-col">
                      <TokenEditor
                        key={token.token_id}
                        index={index}
                        token={token}
                        customTokenForm={form}
                        onRemove={() => handleRemoveToken(index)}
                      />
                    </SlideUpWrapper>
                  ))
                ) : (
                  <div>
                    <AlertIndicator className="w-full rounded-md border border-dashed">
                      No tokens selected
                    </AlertIndicator>
                  </div>
                )}
              </form>
            </div>

            <SheetClose asChild>
              <Button
                className="flex w-full items-center justify-center gap-2"
                disabled={loading || estimatorCustomTokenData.length === 0}
                onClick={() => {
                  setCustomTokenData(form.getValues().customTokenData);
                  setLoading(true);

                  setTimeout(() => {
                    setLoading(false);
                    setOpen(false);
                  }, 1000);
                }}
              >
                {loading ? (
                  <LoadingSpinner className="h-5 w-5" />
                ) : (
                  <LightningIcon className="h-5 w-5" />
                )}
                <span className="text-sm font-medium">Estimate APY</span>
              </Button>
            </SheetClose>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
});
