"use client";

import React, { useMemo } from "react";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import { marketMetadataAtom } from "@/store/market/market";
import { SupportedChainMap } from "royco/constants";
import { MorphoIcon } from "@/assets/icons/morpho";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/_components/common/custom-labels";

interface DetailsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Details = React.forwardRef<HTMLDivElement, DetailsProps>(
  ({ className, ...props }, ref) => {
    const { data } = useAtomValue(marketMetadataAtom);

    const chain = useMemo(() => {
      return SupportedChainMap[data.chainId];
    }, [data.chainId]);

    return (
      <div ref={ref} {...props} className={cn(className)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <PrimaryLabel className="font-shippori text-[40px] font-normal leading-relaxed -tracking-[1.6px]">
              {data.name}
            </PrimaryLabel>

            <SecondaryLabel className="mt-1">{data.description}</SecondaryLabel>

            <div className="mt-4 flex items-center divide-x divide-_divider_">
              <div className={cn("flex items-center gap-1 px-3 pl-0")}>
                <MorphoIcon className="h-4 w-4" />
                <TertiaryLabel>MORPHO</TertiaryLabel>
              </div>

              {data.chainId && (
                <div className="flex items-center gap-1 px-3">
                  <img
                    src={chain.image}
                    alt={chain.name}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                  <TertiaryLabel>{chain.name.toUpperCase()}</TertiaryLabel>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
