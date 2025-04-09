"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { SlideUpWrapper } from "@/components/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const vault_faq = [
  {
    question: "How often is the Vault rebalanced?",
    answer:
      "Vault gets rebalanced at least once a week. The goal of Vault is to keep assets safe and secure, while optimizing for incentives",
  },
  {
    question: "Can the strategist rug my assets? What are the risks?",
    answer: (
      <div className="space-y-4">
        <p>
          The strategist can only call whitelisted functions (deposit, withdraw,
          claim rewards) on whitelisted markets. They cannot execute arbitrary
          transactions with vault funds.
        </p>

        <p>There are various risks when depositing into the Vault:</p>

        <ul className="list-decimal space-y-2 pl-6">
          <li>
            Smart contract risk: while the Vault is a BoringVault, with billions
            of dollars in TVL and multiple audits, smart contracts come with
            inherent code risk. In the worst case, this could result in a
            complete loss of funds.
          </li>
          <li>
            Strategist risk: The strategist can only move funds within
            whitelisted strategies. In the worst case, this could result in
            funds not being optimized perfectly.
          </li>
          <li>
            Market risk: one of the strategists’ markets gets exploited.
            Strategists employ risk mitigation techniques to minimize this risk.
            In the worst case, this would be a partial loss of funds.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "How can I claim my incentives?",
    answer:
      "Once your wallet has been connected, you can view and claim your incentives from the “Incentives” tab within the Vault page.",
  },
  {
    question: "What do I need to do to start earning rewards?",
    answer: (
      <div className="space-y-4">
        <p>Simply, deposit.</p>

        <p>
          Depositors minting or receiving vault tokens must wait until the
          following vault action before accruing rewards on their new vault
          tokens. Depositors burning or sending vault tokens will become
          ineligible for vault rewards since the last vault action proportional
          to their decreased balance.
        </p>

        <p>
          Rewards are distributed among holders of the share token with as much
          granularity as possible, though imperfections may occur.
        </p>
      </div>
    ),
  },
  {
    question: "How long until my withdrawals process?",
    answer: (
      <div className="space-y-4">
        <p>
          A withdrawal can take as long as the maximum lockup for a given
          market.
        </p>

        <p>
          Do note that withdrawal requires transferring vault tokens to the
          withdrawal queue, opting you out of the current rebalance/epoch's
          rewards. Cancelling queued withdrawals transfers vault tokens back to
          you, opting you into the following rebalance/epoch's rewards.
        </p>
      </div>
    ),
  },
  {
    question: "How are points handled?",
    answer:
      "For markets by points issuers who do not redirect points from the vault to the vault depositors, points will be held and only converted to liquid tokens for distribution to depositors after the dapp’s airdrop. Please return to this page to claim tokens after an airdrop.",
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

      <div className="mt-4">
        <Accordion type="single" collapsible className="w-full">
          {vault_faq.map((faq, index) => (
            <SlideUpWrapper key={index} delay={0.3 + index * 0.1}>
              <AccordionItem value={faq.question} className="border-b-0">
                <AccordionTrigger className="text-base text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <SecondaryLabel className="break-normal text-base">
                    {faq.answer}
                  </SecondaryLabel>
                </AccordionContent>
              </AccordionItem>
            </SlideUpWrapper>
          ))}
        </Accordion>
      </div>
    </div>
  );
});
