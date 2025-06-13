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
    question: "How can I view the UMA Query?",
    answer: "Hello World",
  },
  {
    question: "How do you manage the vault?",
    answer: "Hello World",
  },
  {
    question: "Any important timelines?",
    answer: "Hello World",
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
