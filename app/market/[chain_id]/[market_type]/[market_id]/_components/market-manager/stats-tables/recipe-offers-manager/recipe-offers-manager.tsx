"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TablePagination } from "../composables";
import {
  loadableRecipeOffersAtom,
  recipeOffersPageIndexAtom,
} from "@/store/market";
import { useAtom, useAtomValue } from "jotai";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { RecipeOffersTable } from "./recipe-offers-table";

export const RecipeOffersManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [page, setPage] = useAtom(recipeOffersPageIndexAtom);

  const {
    data: propsData,
    isLoading,
    isRefetching,
  } = useAtomValue(loadableRecipeOffersAtom);

  if (!propsData) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-5",
          className
        )}
      >
        <LoadingCircle />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex w-full grow flex-col divide-y divide-divider overflow-y-hidden",
        className
      )}
    >
      <ScrollArea
        className={cn(
          "relative w-full grow",
          isRefetching && "duration-5000 animate-pulse ease-in-out"
        )}
      >
        <RecipeOffersTable
          data={propsData?.data ?? []}
          isLoading={isLoading}
          isRefetching={isRefetching}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TablePagination
        page={propsData?.page}
        setPage={(page) => {
          setPage(page);
        }}
        isRefetching={isRefetching}
      />
    </div>
  );
});
