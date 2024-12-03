"use client";

import React, { useEffect } from "react";

import { cn } from "@/lib/utils";

import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { type MarketBuilderFormSchema } from "../../market-builder-form";
import { isSolidityAddressValid } from "royco/utils";
import { FormInputLabel, LoadingSpinner } from "@/components/composables";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BadgeAlertIcon, BadgeCheckIcon } from "lucide-react";
import { useErc4626VaultChecker } from "royco/hooks";

export const FormVaultAddress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, ...props }, ref) => {
  const { isLoading, data } = useErc4626VaultChecker({
    chain_id: marketBuilderForm.watch("chain").id,
    contract_address: marketBuilderForm.watch("vault_address"),
  });

  return (
    <FormField
      control={marketBuilderForm.control}
      name="vault_address"
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormInputLabel className="mb-2" label="ERC4626 Address" />

          <FormControl>
            <Input
              Suffix={() => {
                if (
                  isSolidityAddressValid(
                    "address",
                    marketBuilderForm.watch("vault_address")
                  ) &&
                  isLoading
                ) {
                  return <LoadingSpinner className="h-5 w-5" />;
                }

                if (
                  isSolidityAddressValid(
                    "address",
                    marketBuilderForm.watch("vault_address")
                  ) &&
                  !isLoading
                ) {
                  return (
                    <Tooltip>
                      <TooltipTrigger>
                        {data === true ? (
                          <BadgeCheckIcon
                            strokeWidth={1.5}
                            className="h-5 w-5 text-success"
                          />
                        ) : (
                          <BadgeAlertIcon
                            strokeWidth={1.5}
                            className="h-5 w-5 text-error"
                          />
                        )}
                      </TooltipTrigger>
                      <TooltipContent className="">
                        {data === true
                          ? "It may be an ERC-4626 vault."
                          : "We couldn't verify vault validity."}
                      </TooltipContent>
                    </Tooltip>
                  );
                }
              }}
              placeholder="Enter Address"
              {...field}
            />
          </FormControl>
          <FormDescription className="mt-2">
            Address of the compliant 4626 Vault. Learn what vault are compatible{" "}
            <a
              href="https://docs.royco.org/developers/creating-an-iam"
              className="text-tertiary"
            >
              here.
            </a>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});
