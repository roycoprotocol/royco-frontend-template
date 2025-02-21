"use client";

import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo } from "react";
import {
  getAllBeraMarkets,
  getMarketAssetType,
  MULTIPLIER_ASSET_TYPE,
} from "royco/boyco";
import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const BoycoStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // const { data: vaultTvl, isLoading: isVaultTvlLoading } = useQuery({
  //   queryKey: ["vault-tvl"],
  //   queryFn: async () => {
  //     try {
  //       const response = await axios.get("/api/boyco/stats");
  //       return response.data;
  //     } catch (error) {
  //       throw new Error("Failed to fetch TVL stats");
  //     }
  //   },
  // });

  const client = createClient(
    process.env.NEXT_PUBLIC_ROYCO_ORIGIN_URL!,
    process.env.NEXT_PUBLIC_ROYCO_ORIGIN_KEY!,
    {
      global: {
        headers: {
          "x-royco-api-key": process.env.NEXT_PUBLIC_ROYCO_ORIGIN_ID!,
          "sb-lb-routing-mode": "alpha-all-services",
          "sb-lb-balance-rpc": "read-replicas",
        },
      },
    }
  );

  const { data: marketTvl, isLoading: isMarketTvlLoading } = useQuery({
    queryKey: ["market-tvl"],
    queryFn: async () => {
      const markets = await getAllBeraMarkets({
        client: client as any,
        customTokenData: [],
      });
      return markets.reduce(
        (acc, market) => {
          const poolType = getMarketAssetType(market);
          if (poolType === MULTIPLIER_ASSET_TYPE.MAJOR_ONLY) {
            acc.major_tvl += market.total_value_locked || 0;
          } else {
            acc.third_party_tvl += market.total_value_locked || 0;
          }
          return acc;
        },
        {
          major_tvl: 0,
          third_party_tvl: 0,
        }
      );
    },
  });

  const boycoStats = useMemo(() => {
    let majorTvl = 0;
    let thirdPartyTvl = 0;
    if (marketTvl) {
      majorTvl += marketTvl.major_tvl;
      thirdPartyTvl += marketTvl.third_party_tvl;
    }

    return {
      major_tvl: majorTvl,
      third_party_tvl: thirdPartyTvl,
      tvl: majorTvl + thirdPartyTvl,
    };
  }, [marketTvl]);

  const isBoycoStatsLoading = isMarketTvlLoading;

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-2 place-content-center items-center justify-end gap-3 lg:w-fit xl:flex xl:flex-nowrap",
        className
      )}
      {...props}
    >
      {[
        // {
        //   key: "undeposite_tvl",
        //   name: "Undeposited Vaults",
        // },
        {
          key: "major_tvl",
          name: "Major",
        },
        {
          key: "third_party_tvl",
          name: "Third-Party/Hybrid",
        },
        // {
        //   key: "tvl",
        //   name: "Total",
        // },
      ].map((item, index) => {
        return (
          <div
            key={`stats:${item.key}`}
            className="flex flex-col items-start rounded-xl border border-divider bg-white p-3 pb-1 xl:min-w-40"
          >
            <div className="caption flex items-center gap-1 text-secondary">
              <span>{item.name}</span>
            </div>
            <div className="money-3 mt-1 w-full text-left text-primary">
              <AnimatePresence mode="sync">
                {!isBoycoStatsLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <SpringNumber
                      // @ts-ignore
                      previousValue={0}
                      // @ts-ignore
                      currentValue={boycoStats[item.key] || 0}
                      numberFormatOptions={{
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }}
                    />
                  </motion.div>
                ) : (
                  <div className="relative flex w-full flex-col place-content-center items-center">
                    <div className="text-transparent">.</div>
                    <div className="absolute inset-0 flex flex-col place-content-center items-center">
                      <LoadingSpinner className="h-5 w-5" />
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
});
