"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { VaultIncentives } from "./details/vault-incentives";
import { VaultInfo } from "./details/vault-info";

export const VaultDetails = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("rounded-xl bg-white shadow-sm", className)}
    >
      {/**
       * Vault Info
       */}
      <VaultInfo />

      <hr />

      {/**
       * Vault Incentives
       */}
      <VaultIncentives />
    </div>
  );
});
