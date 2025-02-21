import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { MarketBuilderFormSchema } from "../../market-builder-form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const BytecodeStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  return (
    <div className="grid flex-1 grid-cols-2 gap-6">
      <FormField
        control={marketBuilderForm.control}
        name="enter_actions_bytecode"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <h2 className="heading-3">Enter Action</h2>
            <p className="caption mt-2 pb-5 text-tertiary">
              <span>Enter JSON bytecode for market entry in</span>{" "}
              <span className="font-bold">{`{ commands: [], state: [] }`}</span>{" "}
              <span>
                format. This bytecode will be executed when users enter the
                market.
              </span>
            </p>
            <FormControl className="flex-1">
              <Textarea
                placeholder={`{
    "commands": [
        "0xf29d...d95e",
        "0x1a8b...6789"
    ],
    "state": [
        "0x9a8b...b5c4",
        "0x2b3c...a6d7"
    ]
}`}
                className={cn("grow bg-z2 text-primary")}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={marketBuilderForm.control}
        name="exit_actions_bytecode"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <h2 className="heading-3">Exit Action</h2>
            <p className="caption mt-2 pb-5 text-tertiary">
              <span>Enter JSON bytecode for market exit in</span>{" "}
              <span className="font-bold">{`{ commands: [], state: [] }`}</span>{" "}
              <span>
                format. This bytecode will be executed when users exit the
                market.
              </span>
            </p>

            <FormControl>
              <Textarea
                placeholder={`{
    "commands": [
        "0xf29d...d95e",
        "0x1a8b...6789"
    ],
    "state": [  
        "0x9a8b...b5c4",
        "0x2b3c...a6d7"
    ]
}`}
                className={cn("grow bg-z2 text-primary")}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});
