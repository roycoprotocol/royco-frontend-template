import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FunctionFormSchema } from "../function-form";
import { MarketBuilderFormSchema } from "../market-builder-form";
import { useSearchContracts } from "@/sdk/hooks";
import { ContractMap } from "@/sdk/contracts";

export const PinnedContracts = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    clickedKey: string | null;
    setClickedKey: React.Dispatch<React.SetStateAction<string | null>>;
    functionForm: UseFormReturn<z.infer<typeof FunctionFormSchema>>;
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(
  (
    {
      className,

      clickedKey,
      setClickedKey,
      functionForm,
      marketBuilderForm,
      ...props
    },
    ref
  ) => {
    const {
      data: dataContractList,
      isLoading: isLoadingContractList,
      isRefetching: isRefetchingContractList,
      totalPages,
      refetch: refetchContractList,
    } = useSearchContracts({
      sorting: [],
      filters: [
        {
          id: "id",
          value: `${marketBuilderForm.watch("chain").id}-${
            ContractMap[
              marketBuilderForm.watch("chain").id as keyof typeof ContractMap
            ]["WeirollWalletHelper"].address ?? ""
          }`,
        },
        {
          id: "id",
          value: `${marketBuilderForm.watch("chain").id}-${
            marketBuilderForm.watch("asset").contract_address.toLowerCase() ??
            ""
          }}`,
        },
      ],
      pageIndex: 0,
    });

    console.log("PinnedContracts", dataContractList);

    return <div ref={ref} className={cn("", className)} {...props} />;
  }
);
