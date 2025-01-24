"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { SearchIcon } from "lucide-react";
import { SupportedToken, SupportedTokenList } from "royco/constants";
import { EstimatorCustomTokenDataSchema } from "./token-estimator";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { CustomTokenDataElementType } from "royco/types";
import { useTokenQuotes } from "royco/hooks";

export const TokenSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    customTokenForm: UseFormReturn<
      z.infer<typeof EstimatorCustomTokenDataSchema>
    >;
    onTokenSelect: (token: CustomTokenDataElementType) => void;
  }
>(({ className, customTokenForm, onTokenSelect, ...props }, ref) => {
  const [search, setSearch] = useState("");

  const [selectedToken, setSelectedToken] = useState<SupportedToken>();

  const { data: tokenQuotes } = useTokenQuotes({
    token_ids: [selectedToken?.id || ""],
  });

  useEffect(() => {
    if (selectedToken && tokenQuotes && tokenQuotes.length > 0) {
      const token = {
        token_id: selectedToken?.id,
        fdv: tokenQuotes[0].fdv.toString(),
        total_supply: tokenQuotes[0].total_supply.toString(),
        price: tokenQuotes[0].price.toString(),
      };
      onTokenSelect(token);
    }
  }, [tokenQuotes]);

  const estimatorCustomTokenData = customTokenForm.watch("customTokenData");

  const tokenData = useMemo(() => {
    let tokens = SupportedTokenList;

    if (search && search.trim().length > 0) {
      tokens = SupportedTokenList.filter((token) => {
        const searchTerm = search.toLowerCase();
        return (
          token.symbol.toLowerCase().startsWith(searchTerm) ||
          token.name.toLowerCase().includes(searchTerm) ||
          token.contract_address.toLowerCase().includes(searchTerm)
        );
      });
    }

    const excludedTokenIds = estimatorCustomTokenData.map(
      (token) => token.token_id
    );
    tokens = tokens.filter((token) => {
      return !excludedTokenIds.includes(token.id);
    });

    return tokens;
  }, [search, estimatorCustomTokenData]);

  return (
    <div
      ref={ref}
      className={cn("rounded-lg border px-4 py-3", className)}
      {...props}
    >
      {/**
       * label
       */}
      <PrimaryLabel>Add a Token to estimate</PrimaryLabel>

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
          placeholder="Search Tokens"
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
