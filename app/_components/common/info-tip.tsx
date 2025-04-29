"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { InfoSquareIcon } from "@/app/vault/assets/info-square";

interface InfoTipProps {
  triggerClassName?: string;
  contentClassName?: string;
}

export const InfoTip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & InfoTipProps
>(
  (
    { className, children, contentClassName, triggerClassName, ...props },
    ref
  ) => {
    return (
      <div ref={ref} {...props} className={cn("")}>
        <Tooltip>
          <TooltipTrigger className={cn("cursor-pointer", triggerClassName)}>
            <InfoSquareIcon />
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            align="start"
            className={cn(
              "max-w-[320px] rounded-sm border border-_divider_ bg-_surface_",
              contentClassName
            )}
          >
            <div
              className={cn("text-sm font-normal text-_secondary_", className)}
            >
              {children}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
);
