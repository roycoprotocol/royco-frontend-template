import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BadgeAlertIcon, BadgeCheckIcon, CheckIcon } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

export const SecondaryLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-fit items-center font-gt text-sm font-normal leading-tight text-secondary",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
});

export const TertiaryLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-fit items-center font-gt text-xs font-light text-tertiary",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
});

export const PrimaryLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isVerified?: boolean;
  }
>(({ className, isVerified, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-fit w-fit max-w-full flex-row items-start font-gt text-lg font-medium text-black",
        className
      )}
      {...props}
    >
      <div className={cn("flex h-fit flex-1 leading-tight")}>
        {props.children}
      </div>
      {isVerified !== undefined && (
        <Tooltip>
          <TooltipTrigger className="ml-2 flex flex-col place-content-center items-center">
            {isVerified ? (
              <BadgeCheckIcon className="-mt-[0.15rem] h-7 w-7 fill-success text-white" />
            ) : (
              <BadgeAlertIcon className="-mt-[0.15rem] h-7 w-7 fill-error text-white" />
            )}
          </TooltipTrigger>
          {typeof window !== "undefined" &&
            createPortal(
              <TooltipContent className="z-9999">
                {isVerified ? (
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-medium text-black">
                      This market is verified.
                    </div>
                    <a
                      className="text-xs underline"
                      href="https://docs.royco.org/for-incentive-providers/verify-a-market"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more.
                    </a>
                  </div>
                ) : (
                  "WARNING: UNVERIFIED MARKET"
                )}
              </TooltipContent>,
              document.body
            )}
        </Tooltip>
      )}
    </div>
  );
});
