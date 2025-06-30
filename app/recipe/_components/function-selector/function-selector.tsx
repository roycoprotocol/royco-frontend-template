"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

export const FunctionSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex flex-col gap-1 bg-_surface_tertiary p-2", className)}
    >
      <div className="flex flex-row gap-1">
        <div className="h-8 w-8 shrink-0 border border-_divider_ bg-white"></div>
        <Input
          placeholder="Contract Address"
          containerClassName="w-full rounded-none bg-_surface_ border-_divider_ text-xs h-8"
        />
      </div>

      <div>
        <AutosizeTextarea
          placeholder={JSON.stringify(
            [
              {
                inputs: [],
                name: "liquidity",
                outputs: [
                  {
                    internalType: "string",
                    name: "",
                    type: "string",
                  },
                ],
                stateMutability: "view",
                type: "function",
              },
            ],
            null,
            4
          )}
          className={cn(
            "flex-1 rounded-none border-_divider_ bg-_surface_ text-xs"
            // error && "border-error"
          )}
          // {...field}
          value={""}
          // onChange={field.onChange}
          // onChange={(e) => {
          //   field.onChange(e.target.value);
          // }}
        />
      </div>

      <div className="w-full border border-_divider_ bg-_surface_ px-3 py-2 text-xs">
        Function List
      </div>
    </div>
  );
});

FunctionSelector.displayName = "FunctionSelector";
