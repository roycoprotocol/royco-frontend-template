"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { marketMetadataAtom } from "@/store/market/market";
import { useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/_components/common/custom-labels";

interface ActionFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ActionForm = React.forwardRef<HTMLDivElement, ActionFormProps>(
  ({ className, ...props }, ref) => {
    const { data } = useAtomValue(marketMetadataAtom);

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex flex-col rounded-sm border border-_divider_ bg-_surface_",
          className
        )}
      >
        <div
          className="flex flex-col items-start justify-between p-8 py-20"
          style={{
            background: `linear-gradient(to bottom left, #1A6FBB0D, transparent, transparent)`,
          }}
        >
          <PrimaryLabel>Deposit via Morpho</PrimaryLabel>

          <TertiaryLabel className="mt-2">MORPHO.ORG</TertiaryLabel>

          <SecondaryLabel className="mt-2">
            This is a Royco Turbo. This means positions created outside of Royco
            are eligible for rewards.
          </SecondaryLabel>

          <a
            target="_blank"
            href={data.campaignMetadata?.depositLink}
            className="w-full"
          >
            <Button className="mt-4 h-10 w-full rounded-sm bg-_highlight_">
              Deposit via Morpho
            </Button>
          </a>
        </div>
      </div>
    );
  }
);
