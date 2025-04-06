"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { SlideUpWrapper } from "@/components/animations";

const vault_faq = [
  {
    question: "How often are rebalances?",
    answer:
      "Vault gets rebalanced at least once a week. The goal of Vault keeps assets safe and secure, without something or another. It may take a week to process a withdrawal. It may take a week too start earning.",
  },
  {
    question: "How do you manage the vault?",
    answer:
      "The goal of the Vault keeps assets safe and secure, without something or another.",
  },
  {
    question: "Any important timelines?",
    answer:
      "It may take a week to process a withdrawal. It may take a week to start earning.",
  },
];

export const VaultFAQ = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "rounded-2xl border border-divider bg-white p-6",
        className
      )}
    >
      <PrimaryLabel className="text-base">FAQ</PrimaryLabel>

      <div className="mt-4 flex flex-col gap-4">
        {vault_faq.map((faq, index) => (
          <SlideUpWrapper key={index} delay={0.3 + index * 0.1}>
            <div>
              <SecondaryLabel className="text-base text-primary">
                {faq.question}
              </SecondaryLabel>

              <SecondaryLabel className="mt-2 break-normal text-base">
                {faq.answer}
              </SecondaryLabel>
            </div>
          </SlideUpWrapper>
        ))}
      </div>
    </div>
  );
});
