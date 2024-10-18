import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketFormSchema } from ".././market-form-schema";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  MarketActionType,
  MarketOfferType,
  MarketViewType,
} from "@/store/market-manager-props";
import { useMarketManager } from "@/store";
import { FallMotion } from "@/components/animations";
import { useActiveMarket } from "../../hooks";
import { useFundingVaults } from "@/sdk/hooks";
import { BASE_MARGIN_TOP, FormInputLabel, InputLabel } from "../../composables";

import { motion, AnimatePresence } from "framer-motion";
import { TypedRoycoMarketOfferType } from "@/sdk/market";

export const FormFundingVault = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ className, marketForm, ...props }, ref) => {
  const { viewType, setViewType } = useMarketManager();
  const { currentMarketData } = useActiveMarket();

  const { data: dataFundingVaults } = useFundingVaults();

  const options = dataFundingVaults;

  return (
    <motion.div
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // exit={{ opacity: 0 }}

      // initial={{ opacity: 0, height: 0 }}
      // animate={{ opacity: 1, height: "auto" }}
      // exit={{ opacity: 0, height: 0 }}

      // transition={{
      //   duration: 0.2,
      //   type: "spring",
      //   damping: 25,
      //   stiffness: 300,
      //   bounce: 0,
      // }}
      // ref={ref}
      className={cn(
        "flex w-full flex-col",
        viewType === MarketViewType.simple.id ? "flex-col" : "flex-col",
        // "flex-row items-center",
        // viewType === MarketViewType.advanced.id && "gap-2",
        className
      )}
      // {...props}
    >
      <FormInputLabel
        size="sm"
        label="Source"
        info="Source of funds to be used for the offer"
      />

      <Select
        onValueChange={(e) => {
          // @todo
          // update funding vault
          // marketForm.setValue("intent_type", e as TypedRoycoMarketOfferType);
        }}
        value={marketForm.watch("funding_vault").address}
      >
        <SelectTrigger
          className={cn(
            "w-full bg-white py-0 pr-2 text-sm font-light text-black",
            BASE_MARGIN_TOP.XS
          )}
        >
          <div className="w-full">
            <FallMotion
              customKey={`market:funding-vault-selector:option:${marketForm.watch("funding_vault").address}`}
              height="2rem"
              motionClassName="flex flex-col items-start"
              contentClassName="text-left"
            >
              {marketForm.watch("funding_vault").label}
            </FallMotion>
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              className="text-sm"
              key={option.address}
              value={option.address}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
});
