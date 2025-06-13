"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations";
import { Check } from "lucide-react";
import { PrimaryLabel } from "@/app/_components/common/custom-labels";

const requirements = [
  {
    icon: <Check className="h-5 w-5 text-_primary_" />,
    description: "Hold TacUSD on Ethereum Mainnet",
  },
  {
    icon: <Check className="h-5 w-5 text-_primary_" />,
    description:
      "Vault can only call functions whitelisted by both VEDA and Royco.",
  },
  {
    icon: <Check className="h-5 w-5 text-_primary_" />,
    description:
      "Vault will never swap into assets that are not 1:1 with principle.",
  },
];

interface RequirementsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Requirements = React.forwardRef<HTMLDivElement, RequirementsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={cn("", className)}>
        <PrimaryLabel>Requirements</PrimaryLabel>

        <div className="mt-3">
          <div className="w-full">
            {requirements.map((item, index) => (
              <SlideUpWrapper key={index} delay={0.4 + index * 0.01}>
                <div className="flex items-center gap-3 border-b border-_divider_ py-4">
                  {item.icon}

                  <PrimaryLabel className="text-base font-normal">
                    {item.description}
                  </PrimaryLabel>
                </div>
              </SlideUpWrapper>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
