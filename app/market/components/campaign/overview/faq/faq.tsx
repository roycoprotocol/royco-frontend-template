"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideUpWrapper } from "@/components/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDownIcon } from "lucide-react";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/_components/common/custom-labels";

const faq = [
  {
    question: "What are the different types of campaigns available?",
    answer: (
      <div className="space-y-4">
        <p>We offer three main types of campaigns:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Token Holding Campaigns:</strong> Reward users based on
            their time-weighted average (TWA) balance of ERC-20 tokens.
          </li>
          <li>
            <strong>Concentrated Liquidity Campaigns:</strong> Reward liquidity
            providers (LPs) based on the fees they earn on Concentrated
            Liquidity AMM DEXes.
          </li>
          <li>
            <strong>Lend and Borrow Campaigns:</strong> Reward users for lending
            to or borrowing from supported protocols.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "What are the minimum requirements for participation?",
    answer: (
      <div className="space-y-4">
        <p>Each campaign type has specific minimum requirements:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Token Holding:</strong> Minimum token balance requirements
            vary by campaign and are clearly stated in the campaign details.
          </li>
          <li>
            <strong>Concentrated Liquidity:</strong> Minimum liquidity provision
            amount and price range requirements are specified for each campaign.
          </li>
          <li>
            <strong>Lend/Borrow:</strong> Minimum lending or borrowing amounts
            are set based on the protocol's requirements and campaign
            parameters.
          </li>
        </ul>
        <p>
          All requirements are transparently displayed in the campaign details
          before participation.
        </p>
      </div>
    ),
  },
  {
    question: "How do concentrated liquidity pools work?",
    answer: (
      <div className="space-y-4">
        <p>Concentrated liquidity pools offer several advantages:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            You can provide liquidity within a specific price range of your
            choice, allowing for more efficient capital utilization.
          </li>
          <li>
            Higher fee earnings compared to traditional liquidity pools due to
            concentrated capital in active price ranges.
          </li>
          <li>
            Rewards are based on the fees generated from your position,
            proportional to your share of the liquidity pool.
          </li>
          <li>
            You can adjust your position's price range to optimize for different
            market conditions.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "How long do I need to participate to earn rewards?",
    answer: (
      <div className="space-y-4">
        <p>Participation duration requirements vary by campaign type:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Token Holding:</strong> Rewards are calculated based on your
            time-weighted average balance, encouraging consistent participation.
          </li>
          <li>
            <strong>Concentrated Liquidity:</strong> Rewards are earned as long
            as your position remains active within the specified price range.
          </li>
          <li>
            <strong>Lend/Borrow:</strong> Rewards are typically calculated based
            on the duration of your lending or borrowing position.
          </li>
        </ul>
        <p>
          Each campaign specifies its minimum participation period and reward
          calculation methodology in its details.
        </p>
      </div>
    ),
  },
  {
    question: "How are rewards calculated and distributed?",
    answer: (
      <div className="space-y-4">
        <p>Reward calculation varies by campaign type:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Token Holding:</strong> Based on your time-weighted average
            balance and the duration of your participation.
          </li>
          <li>
            <strong>Concentrated Liquidity:</strong> Calculated based on the
            fees generated from your position and your share of the liquidity
            pool.
          </li>
          <li>
            <strong>Lend/Borrow:</strong> Determined by the amount lent/borrowed
            and the duration of your position.
          </li>
        </ul>
        <p>
          Rewards are distributed automatically according to the campaign's
          schedule and verification process. You can track your rewards in
          real-time through the campaign dashboard.
        </p>
      </div>
    ),
  },
  {
    question: "What is a time-weighted average balance?",
    answer: (
      <div className="space-y-4">
        <p>
          A time-weighted average (TWA) balance is a fair method of calculating
          rewards that considers both:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>The amount of tokens you hold</li>
          <li>The duration you hold them</li>
        </ul>
        <p>This calculation method ensures:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Fair reward distribution based on consistent participation</li>
          <li>
            Protection against manipulation through short-term token holding
          </li>
          <li>Recognition of long-term supporters of the project</li>
        </ul>
        <p>
          The TWA is calculated by taking snapshots of your balance at regular
          intervals and averaging them over the campaign period.
        </p>
      </div>
    ),
  },
];

interface FaqProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Faq = React.forwardRef<HTMLDivElement, FaqProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={cn("", className)}>
        <PrimaryLabel>FAQ</PrimaryLabel>

        <div className="mt-3">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, index) => (
              <SlideUpWrapper key={index} delay={0.5 + index * 0.1}>
                <AccordionItem
                  value={item.question}
                  className="border-b border-_divider_"
                >
                  <AccordionTrigger
                    className="py-4 text-left text-base text-_primary_ [&[data-state=open]>svg]:rotate-180"
                    suffix={
                      <ChevronDownIcon className="h-5 w-5 shrink-0 text-_secondary_ transition-transform duration-200" />
                    }
                  >
                    {item.question}
                  </AccordionTrigger>

                  <AccordionContent>
                    <SecondaryLabel className="text-base">
                      {item.answer}
                    </SecondaryLabel>
                  </AccordionContent>
                </AccordionItem>
              </SlideUpWrapper>
            ))}
          </Accordion>
        </div>
      </div>
    );
  }
);
