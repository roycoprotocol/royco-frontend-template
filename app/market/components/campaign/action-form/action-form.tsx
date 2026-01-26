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
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";

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

          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.custom(<ErrorAlert message="New deposits have been disabled." />);
            }}
            className="w-full cursor-pointer"
          >
            <Button
              className="mt-4 h-10 w-full rounded-sm bg-_highlight_"
              disabled={true}
            >
              Deposit via Morpho
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
