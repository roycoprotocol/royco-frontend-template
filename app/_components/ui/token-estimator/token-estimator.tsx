"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import {
  CustomTokenDataElement,
  useGlobalStates,
} from "@/store/use-global-states";
import { SONIC_CHAIN_ID, TokenEditor } from "./token-editor";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SlideUpWrapper } from "@/components/animations/slide-up-wrapper";
import LightningIcon from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/icons/lightning";
import { LoadingSpinner } from "@/components/composables";
import { useTokenQuotes } from "royco/hooks";
import { AlertIndicator } from "@/components/common";
import { SupportedTokenList } from "royco/constants";
import { sonicPointsMap } from "royco/sonic";

export const EstimatorCustomTokenDataSchema = z.object({
  customTokenData: z.array(
    z.object({
      token_id: z.string(),
      fdv: z.string(),
      total_supply: z.string(),
      price: z.string(),
      allocation: z.string(),
    })
  ),
});

export const TokenEstimator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultTokenId?: string[];
    marketCategory?: string;
  }
>(({ className, children, defaultTokenId, marketCategory, ...props }, ref) => {
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
      allocation: token.allocation || "100",
    }));

    form.setValue("customTokenData", tokens);
  }, [customTokenData, open]);

  const tokenIds = useMemo(() => {
    if (marketCategory && marketCategory === "sonic") {
      return sonicPointsMap.map((point) => point.id);
    }

    return defaultTokenId;
  }, [form.getValues("customTokenData")]);

  const handleTokenSelect = (token: CustomTokenDataElement) => {
    const currentTokens = form.getValues("customTokenData");
    const hasToken = currentTokens.some((t) => t.token_id === token.token_id);

    if (!hasToken) {
      const formToken = [token, ...currentTokens] as any;
      form.setValue("customTokenData", formToken);
    }
  };

  const { data: tokenQuotes } = useTokenQuotes({
    token_ids: tokenIds || [],
  });

  useEffect(() => {
    if (
      open &&
      tokenIds &&
      tokenIds.length > 0 &&
      tokenQuotes &&
      tokenQuotes.length > 0
    ) {
      for (const index in tokenIds) {
        let token = {
          token_id: tokenIds[index],
          fdv: tokenQuotes[index].fdv.toString(),
          total_supply: tokenQuotes[index].total_supply.toString(),
          price: tokenQuotes[index].price.toString(),
          allocation: "100",
        };

        const tokenData = SupportedTokenList.find(
          (t) => t.id === tokenIds[index]
        );
        if (
          tokenData &&
          tokenData.chain_id === SONIC_CHAIN_ID &&
          tokenData.type === "point"
        ) {
          token = {
            ...token,
            allocation: "",
          };
        }

        handleTokenSelect(token);
      }
    }
  }, [tokenQuotes, tokenIds, open]);

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
            <form className="flex flex-1 grow flex-col overflow-y-auto">
              <div className="my-6 flex-1">
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
                <div className="space-y-4">
                  {estimatorCustomTokenData.length > 0 ? (
                    marketCategory === "sonic" ? (
                      <SlideUpWrapper className="flex flex-col">
                        <TokenEditor
                          index={0}
                          tokens={estimatorCustomTokenData}
                          customTokenForm={form}
                          onRemove={() => form.setValue("customTokenData", [])}
                          marketCategory={marketCategory}
                        />
                      </SlideUpWrapper>
                    ) : (
                      estimatorCustomTokenData.map((token, index) => (
                        <SlideUpWrapper className="flex flex-col">
                          <TokenEditor
                            key={token.token_id}
                            index={index}
                            tokens={[token]}
                            customTokenForm={form}
                            onRemove={() => handleRemoveToken(index)}
                          />
                        </SlideUpWrapper>
                      ))
                    )
                  ) : (
                    <div>
                      <AlertIndicator className="w-full rounded-md border border-dashed">
                        No tokens selected
                      </AlertIndicator>
                    </div>
                  )}
                </div>
              </div>

              <SheetClose asChild>
                <Button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2"
                  disabled={loading}
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
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
});
