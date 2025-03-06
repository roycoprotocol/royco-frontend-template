"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useClaimDetails } from "../hooks/use-claim-details";
import { useEnrichedMarkets } from "royco/hooks";
import { TokenDisplayer } from "@/components/common";
import { ExternalLinkIcon, Link, LockOpenIcon } from "lucide-react";
import { LoadingSpinner } from "@/components/composables";

export const MarketList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    data: claimDetails,
    isLoading: isLoadingClaimDetails,
    isError: isErrorClaimDetails,
  } = useClaimDetails();

  const { data: enrichedMarkets, isLoading: isLoadingEnrichedMarkets } =
    useEnrichedMarkets({
      chain_id: 1,
      category: "boyco",
      page_index: 0,
      page_size: 100,
      filters: claimDetails?.market_ids?.map((market_id) => ({
        id: "id",
        value: `1_0_${market_id.toLowerCase()}`,
      })),
      enabled:
        !!claimDetails?.market_ids && claimDetails?.market_ids.length > 0,
    });

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-divider bg-white font-light",
        className
      )}
    >
      <div className="flex w-full items-center gap-2 border-b border-divider bg-z2 px-4 py-2 text-sm font-light text-tertiary">
        <LockOpenIcon strokeWidth={1.5} className="h-4 w-4 text-tertiary" />
        <div className="text-sm text-secondary">UNLOCKED MARKETS</div>
      </div>

      <div className="flex max-h-56 w-full flex-col overflow-y-scroll ">
        {!!enrichedMarkets && enrichedMarkets.length > 0 ? (
          enrichedMarkets?.map((market, index) => (
            <a
              target="_blank"
              key={`market-${market.id}`}
              href={`/market/${market.chain_id}/${market.market_type}/${market.id}`}
              className={cn(
                "border-px flex h-12 w-full cursor-pointer flex-col border-y border-divider px-4 py-2 duration-200 ease-in-out hover:bg-focus",
                {
                  "border-t-0": index === 0,
                  "border-b-0": index === enrichedMarkets.length - 1,
                }
              )}
            >
              <div className="flex flex-row items-center justify-between gap-2">
                <TokenDisplayer
                  tokens={[market.input_token_data]}
                  symbols={false}
                />
                <div className="flex-1 text-black">{market.name}</div>

                <ExternalLinkIcon
                  strokeWidth={1.5}
                  className="h-5 w-5 shrink-0 text-tertiary"
                />
              </div>
            </a>
          ))
        ) : (
          <div className="flex w-full flex-col items-center justify-center p-5">
            <LoadingSpinner className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
});
