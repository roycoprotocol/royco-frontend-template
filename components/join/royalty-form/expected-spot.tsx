"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { RoyaltyFormSchema } from "./royality-form-schema";
import { z } from "zod";
import { useExpectedSpot } from "royco/hooks";
import { useTotalWalletsBalance } from "../hooks";
import { useImmer } from "use-immer";
import { isEqual } from "lodash";
import { produce } from "immer";
import { SpringNumber } from "@/components/composables";

export const ExpectedSpot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const { data: totalWalletsBalance, isLoading: totalWalletsBalanceLoading } =
    useTotalWalletsBalance({
      wallets: royaltyForm
        .watch("wallets")
        .filter((wallet) => wallet.proof.length > 0)
        .map((wallet) => wallet.account_address.toLowerCase()),
    });

  const propsExpectedSpot = useExpectedSpot({
    balance: (totalWalletsBalance ?? []).reduce((acc, curr) => {
      return acc + curr.balance;
    }, 0),
  });

  const [placeholderExpectedSpot, setPlaceholderExpectedSpot] = useImmer<
    Array<number | null | undefined>
  >([null, null]);

  useEffect(() => {
    if (
      propsExpectedSpot.isLoading === false &&
      propsExpectedSpot.isRefetching === false &&
      !isEqual(propsExpectedSpot.data, placeholderExpectedSpot[1])
    ) {
      setPlaceholderExpectedSpot((prevDatas) => {
        return produce(prevDatas, (draft) => {
          // Prevent overwriting previous data with the same object reference
          if (!isEqual(draft[1], propsExpectedSpot.data)) {
            draft[0] = draft[1] as typeof propsExpectedSpot.data; // Set previous data to the current data
            draft[1] = propsExpectedSpot.data as typeof propsExpectedSpot.data; // Set current data to the new data
          }
        });
      });
    }
  }, [
    propsExpectedSpot.isLoading,
    propsExpectedSpot.isRefetching,
    propsExpectedSpot.data,
  ]);

  return (
    <div ref={ref} {...props} className={cn("flex w-full flex-col", className)}>
      <div className="flex flex-row items-center text-lg font-medium text-black">
        Expected Spot: #
        <SpringNumber
          className=""
          previousValue={placeholderExpectedSpot[0] ?? 0}
          currentValue={placeholderExpectedSpot[1] ?? 0}
          numberFormatOptions={{
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            style: "decimal",
            useGrouping: true,
          }}
        />
      </div>

      <div className="text-sm font-light text-tertiary">
        Connect more assets to move up.
      </div>
    </div>
  );
});
