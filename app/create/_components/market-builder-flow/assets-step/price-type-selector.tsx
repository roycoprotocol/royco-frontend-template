"use client";

import React from "react";
import { PoolFormUtilities } from "../../market-builder-form";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FallMotion } from "@/components/animations";
import { motion } from "framer-motion";

export const PriceTypeSelector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    PoolFormUtilities & {
      assetIndex: number;
    }
>(
  (
    {
      className,
      assetIndex,
      watchMarketBuilderForm,
      setValueMarketBuilderForm,
      controlMarketBuilderForm,
      ...props
    },
    ref
  ) => {
    const [focusedType, setFocusedType] = React.useState<string | null>(
      watchMarketBuilderForm("assets")[assetIndex].price_type
    );

    return (
      <FormField
        control={controlMarketBuilderForm}
        name="assets"
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={(e) => {
                let newAssets = [...watchMarketBuilderForm("assets")];
                /**
                 * @TODO Strictly type this
                 */
                // @ts-ignore
                newAssets[assetIndex].price_type = e;
                setValueMarketBuilderForm("assets", newAssets);
              }}
              defaultValue={
                watchMarketBuilderForm("assets")[assetIndex].price_type ===
                "hardcoded_price"
                  ? "Fixed Price"
                  : "Dynamic Price"
              }
            >
              <FormControl>
                <SelectTrigger className="body-2 h-10 w-full bg-z2 text-primary">
                  <div className="w-full">
                    <FallMotion
                      height="2.5rem"
                      motionClassName="flex flex-col items-start"
                      contentClassName="body-2 text-left"
                    >
                      {watchMarketBuilderForm("assets")[assetIndex]
                        .price_type === "hardcoded_price"
                        ? "Fixed Price"
                        : "Dynamic Price"}
                    </FallMotion>
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <ul className="list gap-0">
                  {[
                    {
                      id: "hardcoded_price",
                      label: "Fixed Price",
                    },
                    {
                      id: "function_price",
                      label: "Dynamic Price",
                    },
                  ].map((item, index) => {
                    return (
                      <motion.li
                        layout
                        initial={false}
                        key={`offer-type:${item.id}`}
                        tabIndex={0}
                        className="relative w-full cursor-pointer text-center transition-colors duration-200 ease-in-out"
                        onHoverStart={() => setFocusedType(item.id)}
                        onHoverEnd={() => setFocusedType(null)}
                      >
                        {focusedType === item.id ? (
                          <motion.div
                            initial={false}
                            transition={{
                              duration: 0.2,
                              ease: "easeInOut",
                              type: "spring",
                              bounce: 0,
                            }}
                            layoutId="offer-type:indicator"
                            className="absolute inset-0 z-0 rounded-[0.25rem] bg-focus"
                          />
                        ) : null}

                        <SelectItem
                          key={index}
                          className={cn(
                            "body-2 z-10 transition-colors duration-200 ease-in-out focus:bg-transparent",
                            focusedType === item.id
                              ? "text-black"
                              : "text-primary"
                          )}
                          value={item.id}
                        >
                          {item.label}
                        </SelectItem>
                      </motion.li>
                    );
                  })}
                </ul>
              </SelectContent>
            </Select>
            {/* <FormMessage /> */}
          </FormItem>
        )}
      />
    );
  }
);
