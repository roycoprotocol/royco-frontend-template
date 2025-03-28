"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";

const vault_faq = [
  {
    question: "How often are rebalances?",
    answer:
      "Vault gets rebalanced once every week. The goal of Vault keeps assets safe ans secure, without something or another. It may take a week to process a withdrawal. It may tale a wwk too start earning.",
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
      <PrimaryLabel className="mb-4 text-base">FAQ</PrimaryLabel>

      <div className="flex flex-col gap-4">
        {vault_faq.map((faq, index) => (
          <div key={index}>
            <SecondaryLabel className="mb-2 text-base text-primary">
              {faq.question}
            </SecondaryLabel>

            <SecondaryLabel className="text-base">{faq.answer}</SecondaryLabel>
          </div>
        ))}
      </div>
    </div>
  );
});
