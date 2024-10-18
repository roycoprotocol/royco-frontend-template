"use client";

import { cn } from "@/lib/utils";
import { BadgeAlert, BadgeCheckIcon } from "lucide-react";
import React from "react";
import { SlideUpWrapper } from "../animations";

export const AlertIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    iconClassName?: string;
    contentClassName?: string;
    type?: "error" | "success";
  }
>(
  (
    { className, type = "error", iconClassName, contentClassName, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full shrink-0 flex-col items-center justify-center space-y-1 px-5 py-5",
          className
        )}
        {...props}
      >
        <SlideUpWrapper className="" delay={0}>
          {type === "error" && (
            <BadgeAlert
              strokeWidth={1}
              className={cn(
                "h-6 w-6 text-secondary md:h-8 md:w-8",
                iconClassName
              )}
            />
          )}
          {type === "success" && (
            <BadgeCheckIcon
              strokeWidth={1}
              className={cn(
                "h-6 w-6 text-secondary md:h-8 md:w-8",
                iconClassName
              )}
            />
          )}
        </SlideUpWrapper>

        <SlideUpWrapper
          className="flex w-full flex-col place-content-center items-center"
          delay={0.1}
        >
          <div
            className={cn(
              "text-center text-sm font-300 text-secondary md:text-base lg:text-lg",
              contentClassName,
              "font-ortica"
            )}
          >
            {props.children}
            {/* {message} */}
          </div>
        </SlideUpWrapper>
      </div>
    );
  }
);
