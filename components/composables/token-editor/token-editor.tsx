"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { TokenEditorSchema } from "./token-editor-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { parseFormattedValueToText } from "royco/utils";
import { Input } from "@/components/ui/input";
import { parseTextToFormattedValue } from "royco/utils";
import { SupportedToken } from "@/sdk/constants";
import { Button } from "@/components/ui/button";
import { useGlobalStates } from "@/store";
import useMeasure from "react-use-measure";
import { TokenEditorSuccessScreen } from "./success-screen";
import formatNumber from "@/utils/numbers";

export const TokenEditorInputSelector = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLDivElement> & {
    currentValue: string;
    setCurrentValue: (value: string) => void;
    containerClassName?: string;
    Prefix?: React.FC;
    Suffix?: React.FC;
    disabled?: boolean;
    placeholder?: string;
  }
>(
  (
    {
      className,
      currentValue,
      setCurrentValue,
      containerClassName,
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Input
        ref={ref}
        type="text"
        disabled={disabled}
        containerClassName={cn(
          "h-9 text-sm bg-white rounded-lg grow",
          containerClassName
        )}
        className={cn("", className)}
        placeholder={placeholder}
        value={parseTextToFormattedValue(currentValue)}
        onChange={(e) => {
          setCurrentValue(parseFormattedValueToText(e.target.value));
        }}
        {...props}
      />
    );
  }
);

export const TokenEditor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token_data: SupportedToken & {
      fdv: number;
      total_supply: number;
      price: number;
      allocation: number;
      token_amount: number;
    };
    closeHoverCard?: () => void;
  }
>(({ className, token_data, closeHoverCard, ...props }, ref) => {
  const [containerRef, bounds] = useMeasure();

  const { customTokenData, setCustomTokenData } = useGlobalStates();

  const [status, setStatus] = useState<"edit" | "success">("edit");

  const TokenEditorForm = useForm<z.infer<typeof TokenEditorSchema>>({
    resolver: zodResolver(TokenEditorSchema),
    defaultValues: {
      fdv: token_data.fdv.toString(),
      allocation: token_data.allocation.toString(),
      price: token_data.fdv / token_data.allocation,
    },
  });

  const onSubmit = (data: z.infer<typeof TokenEditorSchema>) => {
    const fdv = parseFloat(TokenEditorForm.watch("fdv") ?? "0");
    const allocation = parseFloat(TokenEditorForm.watch("allocation") ?? "0");

    const new_fdv = fdv;
    const new_total_supply = token_data.token_amount / (allocation / 100);

    let price = new_fdv / new_total_supply;

    if (isNaN(price)) {
      price = 0;
    }

    const newCustomTokenData = [
      ...customTokenData,
      {
        token_id: token_data.id,
        fdv: new_fdv.toString(),
        price: price.toString(),
        total_supply: new_total_supply.toString(),
      },
    ];

    setCustomTokenData(newCustomTokenData);

    setStatus("success");
  };

  const isValid = () => {
    const fdv = parseFloat(TokenEditorForm.watch("fdv") ?? "0");
    const allocation = parseFloat(TokenEditorForm.watch("allocation") ?? "0");

    if (fdv === token_data.fdv && allocation === token_data.allocation) {
      return false;
    }

    return true;
  };

  const resetStatus = () => {
    if (status === "success") {
      setTimeout(() => {
        if (closeHoverCard) {
          closeHoverCard();
        }
      }, 2000);
    }
  };

  useEffect(() => {
    resetStatus();
  }, [status]);

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col text-base font-light text-black", className)}
      {...props}
    >
      <Form {...TokenEditorForm}>
        <form
          onSubmit={TokenEditorForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-3"
        >
          <div className="flex flex-col gap-1">
            <div className="font-medium">Set FDV & Points Assumptions</div>
            <div className="w-full border-b border-divider "></div>
            <div className="text-sm text-secondary">
              Set the assumptions below to update the royco yield
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div>Fully diluted valution (FDV)</div>

            <TokenEditorInputSelector
              placeholder={formatNumber(token_data.fdv) as string}
              currentValue={TokenEditorForm.watch("fdv")}
              setCurrentValue={(value) => {
                TokenEditorForm.setValue("fdv", value);
              }}
            />
          </div>

          {token_data.type === "point" && (
            <div className="flex flex-col gap-1">
              <div>% of network allocated to the campaign</div>

              <TokenEditorInputSelector
                placeholder={formatNumber(token_data.allocation) as string}
                currentValue={TokenEditorForm.watch("allocation") ?? ""}
                setCurrentValue={(value) => {
                  TokenEditorForm.setValue("allocation", value);
                }}
              />
            </div>
          )}

          <Button
            disabled={!isValid()}
            type="submit"
            className="h-9 font-medium"
          >
            Update Yield
          </Button>
        </form>
      </Form>

      {status === "success" && (
        <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-transparent p-1">
          <div className="h-full w-full bg-white/80 bg-blend-screen backdrop-blur-sm">
            <TokenEditorSuccessScreen />
          </div>
        </div>
      )}
    </div>
  );
});
