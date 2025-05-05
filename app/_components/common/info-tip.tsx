"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { InfoSquareIcon } from "@/app/vault/assets/info-square";

interface InfoTipProps {
  triggerClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
}

export const InfoTip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & InfoTipProps
>(
  (
    {
      className,
      children,
      contentClassName,
      triggerClassName,
      iconClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} {...props} className={cn("")}>
        <Tooltip>
          <TooltipTrigger
            className={cn("flex cursor-pointer items-center", triggerClassName)}
          >
            <InfoSquareIcon className={cn(iconClassName)} />
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            align="start"
            className={cn(
              "max-w-[320px] rounded-sm border border-_divider_ bg-_surface_ p-2 shadow-none",
              contentClassName
            )}
          >
            <div
              className={cn(
                "break-normal text-sm font-normal text-_secondary_",
                className
              )}
            >
              {children}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
);
