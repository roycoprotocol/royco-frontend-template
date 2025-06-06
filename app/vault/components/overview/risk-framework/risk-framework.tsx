"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { SlideUpWrapper } from "@/components/animations";

import { Check } from "lucide-react";

const risk_framework = [
  {
    icon: <Check className="h-5 w-5 text-_primary_" />,
    description:
      "Vault will diversify across various markets based on risk-adjusted yield",
  },
  {
    icon: <Check className="h-5 w-5 text-_primary_" />,
    description:
      "Vault can only call functions whitelisted by both Seven Seas and Royco.",
  },
  {
    icon: <Check className="h-5 w-5 text-_primary_" />,
    description:
      "Vault will never swap into assets that are not 1:1 with principle.",
  },
];

export const RiskFramework = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("", className)}>
      <PrimaryLabel className="text-2xl font-medium text-_primary_">
        Risk Framework
      </PrimaryLabel>

      <div className="mt-3">
        <div className="w-full">
          {risk_framework.map((item, index) => (
            <SlideUpWrapper key={index} delay={0.4 + index * 0.01}>
              <div className="flex items-center gap-3 border-b border-_divider_ py-4">
                {item.icon}

                <div className="text-base text-_primary_">
                  {item.description}
                </div>
              </div>
            </SlideUpWrapper>
          ))}
        </div>
      </div>
    </div>
  );
});
