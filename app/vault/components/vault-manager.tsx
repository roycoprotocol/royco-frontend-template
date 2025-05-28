"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { VaultDetails } from "./vault-details/vault-details";
import { VaultActionForm } from "./vault-action-form/action-form";
import { SlideUpWrapper } from "@/components/animations";
import { TransactionModal } from "../common/transaction-modal/transaction-modal";
import {
  TypeVaultDetailsOption,
  useVaultManager,
  VaultDetailsOptionMap,
} from "@/store/vault/use-vault-manager";
import { Overview } from "./overview/overview";
import { Positions } from "./positions/positions";
import { CustomHorizontalTabs } from "../common/custom-horizontal-tabs";

export const VaultManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { setReload, detailsOption, setDetailsOption } = useVaultManager();

  return (
    <div ref={ref} {...props} className={cn("py-8", className)}>
      <div className="flex flex-col lg:flex-row lg:gap-x-10">
        <div className="w-full lg:w-2/3">
          {/**
           * Vault Details
           */}
          <SlideUpWrapper>
            <VaultDetails />
          </SlideUpWrapper>

          {/**
           * Vault Details Tabs
           */}
          <SlideUpWrapper delay={0.1} className="mt-8">
            <CustomHorizontalTabs
              tabs={Object.values(VaultDetailsOptionMap).map((option) => ({
                id: option.value,
                label: option.label,
              }))}
              baseId="vault-details-option"
              activeTab={detailsOption}
              onTabChange={(id) =>
                setDetailsOption(id as TypeVaultDetailsOption)
              }
            />
          </SlideUpWrapper>

          {/**
           * Vault Details Content
           */}
          {(() => {
            if (detailsOption === TypeVaultDetailsOption.Overview) {
              return (
                <div className="mt-8">
                  <Overview />
                </div>
              );
            }

            if (detailsOption === TypeVaultDetailsOption.Positions) {
              return (
                <div className="mt-8">
                  <Positions />
                </div>
              );
            }
          })()}
        </div>

        {/**
         * Vault Action Form
         */}
        <div className="mt-8 w-full lg:sticky lg:top-20 lg:mt-0 lg:w-1/3 lg:self-start">
          <SlideUpWrapper>
            <VaultActionForm />
          </SlideUpWrapper>
        </div>
      </div>

      {/**
       * Transaction Modal
       */}
      <TransactionModal onSuccess={() => setReload(true)} />
    </div>
  );
});
