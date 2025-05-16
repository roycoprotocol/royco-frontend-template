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
import { CustomTokenDataElement } from "@/store/global";
import { SONIC_CHAIN_ID, TokenEditor } from "./token-editor";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SlideUpWrapper } from "@/components/animations/slide-up-wrapper";
import LightningIcon from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/icons/lightning";
import { LoadingSpinner } from "@/components/composables";
import { AlertIndicator } from "@/components/common";
import { sonicPointsMap } from "royco/sonic";
import { useAtom } from "jotai";
import { customTokenDataAtom } from "@/store/global";
import { api } from "@/app/api/royco";
import { useQuery } from "@tanstack/react-query";

export const EstimatorCustomTokenDataSchema = z.object({
  customTokenData: z.array(
    z.object({
      id: z.string(),
      fdv: z.string(),
      totalSupply: z.string(),
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

  const [customTokenData, setCustomTokenData] = useAtom(customTokenDataAtom);

  const form = useForm<z.infer<typeof EstimatorCustomTokenDataSchema>>({
    resolver: zodResolver(EstimatorCustomTokenDataSchema),
    defaultValues: {
      customTokenData: [],
    },
  });

  useEffect(() => {
    const tokens = customTokenData.map((token) => ({
      id: token.id,
      fdv: (token.fdv || 0).toString(),
      totalSupply: (token.totalSupply || 0).toString(),
      price: (token.price || 0).toString(),
      allocation: (token.allocation || 100).toString(),
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
    const hasToken = currentTokens.some((t) => t.id === token.id);

    if (!hasToken) {
      const formToken = [token, ...currentTokens];

      // @ts-ignore
      form.setValue("customTokenData", formToken);
    }
  };

  const {
    data: tokenQuotes,
    isLoading: tokenQuotesLoading,
    isError: tokenQuotesError,
  } = useQuery({
    queryKey: [
      "token-quotes-token-estimator-quotes",
      {
        tokenIds,
      },
    ],
    queryFn: () =>
      api
        .tokenControllerGetTokenDirectory({
          filters: [{ id: "id", value: tokenIds || [], condition: "inArray" }],
        })
        .then((res) => res.data.data),
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
          id: tokenIds[index],
          fdv: tokenQuotes[index].fdv,
          totalSupply: tokenQuotes[index].totalSupply,
          price: tokenQuotes[index].price,
          allocation: 100,
        };

        const tokenData = tokenQuotes?.find((t) => t.id === tokenIds[index]);
        if (
          tokenData &&
          tokenData.chainId === SONIC_CHAIN_ID &&
          tokenData.type === "point"
        ) {
          token = {
            ...token,
            allocation: 100,
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
                          tokens={estimatorCustomTokenData.map((token) => ({
                            ...token,
                            price: parseFloat(token.price),
                            fdv: parseFloat(token.fdv),
                            totalSupply: parseFloat(token.totalSupply),
                            allocation: parseFloat(token.allocation),
                          }))}
                          customTokenForm={form}
                          onRemove={() => form.setValue("customTokenData", [])}
                          marketCategory={marketCategory}
                        />
                      </SlideUpWrapper>
                    ) : (
                      estimatorCustomTokenData.map((token, index) => (
                        <SlideUpWrapper className="flex flex-col">
                          <TokenEditor
                            key={token.id}
                            index={index}
                            tokens={[
                              {
                                id: token.id,
                                fdv: parseFloat(token.fdv),
                                totalSupply: parseFloat(token.totalSupply),
                                price: parseFloat(token.price),
                                allocation: parseFloat(token.allocation),
                              },
                            ]}
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
                    setCustomTokenData(
                      form.getValues().customTokenData.map((token) => ({
                        ...token,
                        price: parseFloat(token.price),
                        fdv: parseFloat(token.fdv),
                        totalSupply: parseFloat(token.totalSupply),
                        allocation: parseFloat(token.allocation),
                      }))
                    );
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
