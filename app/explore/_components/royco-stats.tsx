"use client";

import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { cn } from "@/lib/utils";
import { useEnrichedRoycoStats } from "@/sdk/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { produce } from "immer";
import { isEqual } from "lodash";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";

export const RoycoStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data, isLoading, isRefetching } = useEnrichedRoycoStats({
    testnet: process.env.NEXT_PUBLIC_FRONTEND_TYPE === "TESTNET" ? true : false,
  });

  const [placeholderDatas, setPlaceholderDatas] = useImmer([
    {
      volume: 0,
      tvl: 0,
      rewards: 0,
    },
    {
      volume: 0,
      tvl: 0,
      rewards: 0,
    },
  ]);

  useEffect(() => {
    if (
      isLoading === false &&
      data !== undefined &&
      data !== null &&
      !isEqual(data, placeholderDatas[1])
    ) {
      // @ts-ignore
      setPlaceholderDatas((prevDatas: any) => {
        return produce(prevDatas, (draft: any) => {
          draft.push(data);

          if (draft.length > 2) {
            draft.shift();
          }
        });
      });
    }
  }, [data, isLoading, isRefetching, placeholderDatas]);

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-2 flex-nowrap place-content-center items-center gap-3 sm:grid-cols-3 lg:w-fit",
        // "md:w-1/2",
        className
      )}
      {...props}
    >
      {[
        {
          key: "total_volume",
          name: "Total Volume",
        },
        {
          key: "total_tvl",
          name: "Total Value Locked",
        },
        {
          key: "total_incentives",
          name: "Incentives",
        },
      ].map((item, index) => {
        return (
          <div
            key={`stats:${item.key}`}
            className="flex flex-col items-start rounded-xl border border-divider bg-white p-3 pb-1"
          >
            <div className="caption text-secondary">{item.name}</div>
            <div className="money-3 mt-1 w-full text-primary">
              <AnimatePresence mode="sync">
                {!!data ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <SpringNumber
                      // @ts-ignore
                      previousValue={placeholderDatas[0][item.key]}
                      // @ts-ignore
                      currentValue={data[item.key] || 0}
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
