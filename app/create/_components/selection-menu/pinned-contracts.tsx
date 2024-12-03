import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FunctionFormSchema } from "../function-form";
import { MarketBuilderFormSchema } from "../market-builder-form";
import { useSearchContracts } from "@/sdk/hooks";
import { ContractMap } from "@/sdk/contracts";
import { ContractRow } from "./contract-row";

export const PinnedContracts = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: any[];
    clickedKey: string | null;
    setClickedKey: React.Dispatch<React.SetStateAction<string | null>>;
    functionForm: UseFormReturn<z.infer<typeof FunctionFormSchema>>;
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(
  (
    {
      data,
      className,
      clickedKey,
      setClickedKey,
      functionForm,
      marketBuilderForm,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("", className)}>
        {!!data &&
          data.map(
            (
              // @ts-ignore
              contract,
              // @ts-ignore
              index
            ) => {
              const baseKey = `contract-list:${contract.id}`;

              return (
                <ContractRow
                  contract={contract}
                  baseKey={baseKey}
                  index={index}
                  clickedKey={clickedKey}
                  setClickedKey={setClickedKey}
                  functionForm={functionForm}
                  marketBuilderForm={marketBuilderForm}
                  isPinned={true}
                />
              );
            }
          )}
      </div>
    );
  }
);
