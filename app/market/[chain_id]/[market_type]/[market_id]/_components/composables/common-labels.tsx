import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import React from "react";

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
    displayCheck?: boolean;
  }
>(({ className, displayCheck, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-fit w-fit max-w-full flex-row items-center font-gt text-lg font-medium text-black",
        className
      )}
      {...props}
    >
      <div className="flex h-8 max-w-full grow overflow-hidden truncate text-ellipsis">
        <span className="leading-9">{props.children}</span>
      </div>
      {displayCheck === true && (
        <div className="flex h-6 flex-col place-content-center items-center">
          <div className="ml-2 flex h-6 w-6 shrink-0 flex-col place-content-center items-center rounded-full bg-primary">
            <CheckIcon strokeWidth={2.5} className="h-6 w-6 p-1 text-white" />
          </div>
        </div>
      )}
    </div>
  );
});
