// import { FormLabel } from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CircleHelpIcon } from "lucide-react";
import React from "react";

export const InputLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label: string;
  }
>(({ className, label, ...props }, ref) => {
  return (
    <div ref={ref} className="contents">
      <div
        className={cn(
          "shrink-0 flex-nowrap text-sm font-500 text-black",
          className
        )}
      >
        {label}
      </div>
      {/* <FormLabel
        className={cn(
          "shrink-0 flex-nowrap text-sm font-500 text-black",
          className
        )}
      >
        {label}
      </FormLabel> */}
    </div>
  );
});

export const FormInputLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label: string;
    size?: "sm" | "md" | "lg";
    info?: string;
  }
>(({ className, label, size = "md", info, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 flex-row items-center justify-between",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "shrink-0 flex-nowrap font-500 text-black",
          size === "sm" && "text-sm",
          size === "md" && "text-base"
        )}
      >
        {label}
      </div>

      {info && (
        <Tooltip>
          <TooltipTrigger>
            <CircleHelpIcon
              strokeWidth={1.5}
              className={cn(
                "text-tertiary",
                size === "sm" && "h-4 w-4",
                size === "md" && "h-5 w-5"
              )}
            />
          </TooltipTrigger>
          <TooltipContent
            className={cn(
              size === "sm" && "text-sm",
              size === "md" && "text-base",
              "max-w-60 font-light leading-snug text-black"
            )}
          >
            {info}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
});
