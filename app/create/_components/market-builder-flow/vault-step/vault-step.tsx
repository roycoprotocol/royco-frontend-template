"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { PoolFormType } from "../../market-builder-form";
import { MotionWrapper } from "../animations";
import { FormVaultAddress } from "./form-vault-address";
import { BuilderSectionWrapper } from "../../composables";

export const VaultStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: PoolFormType;
  }
>(({ marketBuilderForm, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "hide-scrollbar flex w-full shrink-0 grow flex-col overflow-y-scroll",
        className
      )}
      {...props}
    >
      <BuilderSectionWrapper>
        <div className={cn("subtitle-1 text-black")}>Basic Details</div>

        <FormVaultAddress
          className="mt-9"
          marketBuilderForm={marketBuilderForm}
        />
      </BuilderSectionWrapper>
    </div>
  );
});
