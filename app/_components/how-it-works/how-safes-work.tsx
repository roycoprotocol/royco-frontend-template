"use client";

import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";

import React from "react";
import { GradientText } from "@/app/vault/common/gradient-text";

export const StepDetail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    step: number;
    title: string;
    description: string;
    activeStep: number;
    onClick: () => void;
  }
>(
  (
    { className, step, title, description, activeStep, onClick, ...props },
    ref
  ) => {
    return (
      <div
        onClick={onClick}
        ref={ref}
        {...props}
        className={cn(
          "flex cursor-pointer flex-row items-start gap-3 transition-all duration-200 ease-in-out",
          step !== activeStep && "opacity-50",
          step === activeStep && "group",
          className
        )}
      >
        <SecondaryLabel className="transition-all duration-200 ease-in-out group-hover:text-_primary_">
          {step}.
        </SecondaryLabel>

        <div className="flex flex-col gap-3">
          <SecondaryLabel className="transition-all duration-200 ease-in-out group-hover:text-_primary_">
            {title}
          </SecondaryLabel>

          <TertiaryLabel className="transition-all duration-200 ease-in-out group-hover:text-_secondary_">
            {description}
          </TertiaryLabel>
        </div>
      </div>
    );
  }
);

export const HowSafesWork = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [step, setStep] = React.useState<number>(1);

  return (
    <div
      ref={ref}
      {...props}
      className={cn("grid grid-cols-2 gap-2", className)}
    >
      <div className="col-span-1"></div>

      <div className="col-span-1 flex flex-col">
        <GradientText className="font-medium">
          How Royco Safes Work
        </GradientText>

        <div className="mt-5 flex flex-col gap-5">
          <StepDetail
            onClick={() => setStep(1)}
            activeStep={step}
            step={1}
            title="Deposit in a Morpho Vault"
            description="Earn yield by depositing an asset into a vault curated by third-party risk curators. Each vault has a unique risk profile and strategy determined by the curator. Creating a vault is permissionless, so users should assess a vault's curator and risk exposure before depositing."
          />

          <StepDetail
            onClick={() => setStep(2)}
            activeStep={step}
            step={2}
            title="Assets are supplied to Morpho Markets"
            description="A Morpho Vault can only allocate deposits to Morpho Markets whitelisted by the curator. Depositors in the vault are exposed to risks related to each market, including the collateral asset, liquidation LTV, and oracles."
          />

          <StepDetail
            onClick={() => setStep(3)}
            activeStep={step}
            step={3}
            title="Earn yield from borrowers"
            description="Vaults generate a yield from over-collateralized lending. Borrowers deposit collateral and borrow assets supplied to Morpho Markets, paying interest to the vault."
          />
        </div>
      </div>
    </div>
  );
});
