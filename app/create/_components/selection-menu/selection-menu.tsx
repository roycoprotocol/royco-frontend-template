"use client";

import React, { useEffect } from "react";

import { useSelectionMenu } from "@/store";
// import { ContractTypeSelector } from "./contract-type-selector"; // @notice currently removed
import { SearchBar } from "./search-bar";
import { ContractList } from "./contract-list";
import { useSearchContracts } from "@/sdk/hooks";
import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { isEqual } from "lodash";
import { FunctionFormSchema } from "../function-form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketBuilderFormSchema } from "../market-builder-form";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { AlertIndicator } from "@/components/common";
import { isSolidityAddressValid } from "@/sdk/utils";

export const SelectionMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    functionForm: UseFormReturn<z.infer<typeof FunctionFormSchema>>;
    marketBuilderForm: UseFormReturn<z.infer<typeof MarketBuilderFormSchema>>;
  }
>(({ className, marketBuilderForm, functionForm, ...props }, ref) => {
  const {
    activeTab,
    filters,
    sorting,
    searchKey,
    placeholderContractList,
    setPlaceholderContractList,
    pageIndex,
    setPageIndex,
    placeholderCounts,
    setPlaceholderCounts,
  } = useSelectionMenu();

  const {
    data: dataContractList,
    isLoading: isLoadingContractList,
    isRefetching: isRefetchingContractList,
    totalPages,
    refetch: refetchContractList,
  } = useSearchContracts({
    sorting,
    filters: [
      ...filters,
      {
        id: "chain_id",
        value: marketBuilderForm.watch("chain").id,
      },
      {
        id: "is_whitelisted",
        value: true,
      },
    ],
    searchKey,
    pageIndex,
  });

  const updatePlaceholderCounts = () => {
    let newPlaceholderCounts = [...placeholderCounts, totalPages];
    if (newPlaceholderCounts.length > 2) {
      newPlaceholderCounts.shift();
    }
    setPlaceholderCounts(newPlaceholderCounts);
  };

  const canPrevPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;

  const handleNextPage = () => {
    if (canNextPage) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (canPrevPage) {
      setPageIndex(pageIndex - 1);
    }
  };

  const resetPageIndex = () => {
    setPageIndex(0);
  };

  const refreshContractList = () => {
    if (
      isSolidityAddressValid("address", functionForm.watch("contract_address"))
    ) {
      refetchContractList();
    }
  };

  useEffect(() => {
    refreshContractList();
  }, [functionForm.watch("contract_address")]);

  useEffect(() => {
    resetPageIndex();
  }, [searchKey]);

  useEffect(() => {
    if (
      isLoadingContractList === false &&
      isRefetchingContractList === false &&
      !isEqual(dataContractList, placeholderContractList[1])
    ) {
      let newPlaceholderContractList = [
        ...placeholderContractList,
        dataContractList,
      ];

      if (newPlaceholderContractList.length > 2) {
        newPlaceholderContractList.shift();
      }
      setPlaceholderContractList(newPlaceholderContractList);
    }
  }, [dataContractList]);

  useEffect(() => {
    updatePlaceholderCounts();
  }, [totalPages]);

  return (
    <div ref={ref} id="selection-menu" className="contents">
      <h2 className="heading-3 pb-5">Contracts</h2>

      {/* {activeTab.id === "contracts" && <ContractTypeSelector />} */}

      <SearchBar className="" />

      <div className="hide-scrollbar mt-5 w-full grow overflow-y-scroll rounded-xl rounded-b-none border border-b-0 border-t border-divider bg-z2">
        {isLoadingContractList && (
          <div className="flex w-full flex-col items-center p-5">
            <LoadingSpinner className="h-4 w-4" />
          </div>
        )}

        {dataContractList && (
          <ContractList
            marketBuilderForm={marketBuilderForm}
            functionForm={functionForm}
            data={
              isLoadingContractList || isRefetchingContractList
                ? placeholderContractList[1]
                : dataContractList
            }
          />
        )}

        {(placeholderContractList[1] === null ||
          placeholderContractList[1].length === 0) && (
          <AlertIndicator className="h-full">
            {searchKey.length > 0 && searchKey.length < 3
              ? "Search must be >= 3 letters"
              : "No contracts found"}
          </AlertIndicator>
          // <div className="flex h-full w-full flex-col place-content-center items-center">
          //   <MotionWrapper>
          //     <div className="h-12 w-12">
          //       <BadgeAlertIcon
          //         strokeWidth={1}
          //         className="h-12 w-12 text-tertiary"
          //       />
          //     </div>
          //   </MotionWrapper>

          //   <MotionWrapper delay={0.2}>
          //     <div className="mt-2 text-center font-ortica text-3xl text-tertiary">
          //       No Contracts Found
          //     </div>
          //   </MotionWrapper>
          // </div>
        )}
      </div>

      <div className="mt-0 flex w-full flex-row items-center justify-between rounded-b-xl border border-divider bg-z2 px-3 py-2">
        <div className="text-sm text-secondary">
          Page
          <SpringNumber
            defaultColor="text-secondary"
            className="mx-1 inline-block"
            numberFormatOptions={{
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }}
            previousValue={pageIndex + 1}
            currentValue={pageIndex + 1}
          />
          of{" "}
          <SpringNumber
            defaultColor="text-secondary"
            numberFormatOptions={{
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }}
            previousValue={placeholderCounts[0] > 0 ? placeholderCounts[0] : 1}
            currentValue={totalPages > 0 ? totalPages : 1}
            className="mx-1 inline-block"
          />
        </div>
        <div className="flex flex-row items-center gap-1">
          <div
            onClick={handlePrevPage}
            className={cn(
              "h-6 w-6 rounded-md border border-divider bg-white text-tertiary transition-all duration-200 ease-in-out  hover:text-secondary",
              canPrevPage
                ? "cursor-pointer drop-shadow-sm"
                : "cursor-not-allowed opacity-50"
            )}
          >
            <ChevronLeftIcon className="h-6 w-6 p-[0.15rem]" />
          </div>
          <div
            onClick={handleNextPage}
            className={cn(
              "h-6 w-6 rounded-md border border-divider bg-white text-tertiary transition-all duration-200 ease-in-out  hover:text-secondary",
              canNextPage
                ? "cursor-pointer drop-shadow-sm"
                : "cursor-not-allowed opacity-50"
            )}
          >
            <ChevronRightIcon className="h-6 w-6 p-[0.15rem]" />
          </div>
        </div>
      </div>
    </div>
  );
});
