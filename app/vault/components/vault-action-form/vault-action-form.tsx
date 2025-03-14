"use client";

import React from "react";
import { ChevronLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";

export const VaultActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} {...props} className={cn("py-5", className)}></div>;
});
