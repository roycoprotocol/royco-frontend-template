"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { SearchIcon } from "lucide-react";
import { EstimatorCustomTokenDataSchema } from "./token-estimator";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/api/royco";
import { CustomTokenDataElement } from "@/store/global";
import { TokenQuote } from "royco/api";

export const TokenSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    customTokenForm: UseFormReturn<
      z.infer<typeof EstimatorCustomTokenDataSchema>
    >;
    onTokenSelect: (token: CustomTokenDataElement) => void;
  }
>(({ className, customTokenForm, onTokenSelect, ...props }, ref) => {
  const [search, setSearch] = useState("");

  const [selectedToken, setSelectedToken] = useState<TokenQuote>();

  const { data: tokenQuotes } = useQuery({
    queryKey: ["token-quotes-token-selector", selectedToken?.id],
    queryFn: () =>
      api
        .tokenControllerGetTokenDirectory({
          filters: [{ id: "id", value: selectedToken?.id || "" }],
        })
        .then((res) => res.data.data),
    enabled: Boolean(selectedToken?.id && selectedToken?.id.length > 0),
  });

  useEffect(() => {
    if (selectedToken && tokenQuotes && tokenQuotes.length > 0) {
      const token: CustomTokenDataElement = {
        id: selectedToken?.id,
        fdv: tokenQuotes[0].fdv,
        totalSupply: tokenQuotes[0].totalSupply,
        price: tokenQuotes[0].price,
      };
      onTokenSelect(token);
    }
  }, [tokenQuotes]);

  const estimatorCustomTokenData = customTokenForm.watch("customTokenData");

  const { data: tokenData } = useQuery({
    queryKey: ["token-data-token-selector", search, estimatorCustomTokenData],
    queryFn: () =>
      api
        .tokenControllerGetTokenDirectory({
          searchKey: search.trim().length > 0 ? search : undefined,
          filters: [
            // exclude tokens that are already in the estimator
            {
              id: "id",
              value: estimatorCustomTokenData.map((token) => token.id),
              condition: "notInArray",
            },
          ],
        })
        .then((res) => res.data.data),
  });

  return (
    <div
      ref={ref}
      className={cn("rounded-lg border px-4 py-3", className)}
      {...props}
    >
      {/**
       * label
       */}
      <PrimaryLabel>Add Tokens or Points to estimate</PrimaryLabel>

      {/**
       * Search input
       */}
      <div className="mt-2">
        <Input
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
          Prefix={() => {
            return (
              <SearchIcon className="h-4 w-4 text-black" strokeWidth={1} />
            );
          }}
          className="w-full"
          containerClassName="font-light px-3 py-2 gap-2"
          placeholder="Search"
        />
      </div>

      {/**
       * Suggested token list
       */}
      <div className="mt-3">
        <div className="flex flex-wrap gap-2">
          {tokenData && tokenData.length > 0 ? (
            tokenData.slice(0, 10).map((token) => (
              <Button
                variant="outline"
                key={token.id}
                className="flex w-fit rounded-full border px-2 py-1"
                onClick={() => {
                  setSelectedToken(token);
                  setSearch("");
                }}
              >
                <TokenDisplayer
                  tokens={[token]}
                  size={4}
                  symbols={true}
                  symbolClassName="font-medium"
                />
              </Button>
            ))
          ) : (
            <div ref={ref} className={cn("contents", className)} {...props}>
              <AlertIndicator className="w-full rounded-md border border-dashed">
                No tokens found
              </AlertIndicator>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
