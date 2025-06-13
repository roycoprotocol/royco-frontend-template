"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations";
import { Check } from "lucide-react";
import { PrimaryLabel } from "@/app/_components/common/custom-labels";

const requirements = [
  {
    icon: <Check className="h-5 w-5 text-_primary_" />,
    description:
      "Maintain a minimum time-weighted average balance of required tokens",
  },
  {
    icon: <Check className="h-5 w-5 text-_primary_" />,
    description: "Provide liquidity in designated concentrated liquidity pools",
  },
  {
    icon: <Check className="h-5 w-5 text-_primary_" />,
    description:
      "Participate in lending or borrowing activities on supported protocols",
  },
  {
    icon: <Check className="h-5 w-5 text-_primary_" />,
    description:
      "Meet the minimum duration requirement for campaign participation",
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
