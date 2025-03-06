"use client";

import { useState } from "react";
import { X, ArrowRight, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { cn } from "@/lib/utils";

interface RateItem {
  name: string;
  type: string;
  rate: string;
  label: string;
}

export function RoycoRoyalty() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-xl bg-white p-1">
      <Card
        className={cn(
          "w-[400px] max-w-[95vw] rounded-lg",
          isOpen ? "bg-gradient-to-b from-[#f3f3f5] to-white" : "bg-[#f3f3f5]"
        )}
      >
        {isOpen ? (
          <>
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="pt-5">
                <CardTitle className="mb-2 flex justify-center">
                  <PrimaryLabel>Join the Royco Royalty.</PrimaryLabel>
                </CardTitle>

                <CardDescription className="flex justify-center">
                  <TertiaryLabel className="text-center text-secondary">
                    Capture the latest alpha relevant to your wallet by getting
                    notified when markets meet your criteria.
                  </TertiaryLabel>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <div>
                <img src="/royalty/pop-up.png" alt="Royco Royalty" />
              </div>

              <div className="mt-6">
                <a
                  href="/royalty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg bg-[#f3f3f5] p-4"
                >
                  <SecondaryLabel className="font-medium text-primary">
                    Learn More
                  </SecondaryLabel>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </>
        ) : (
          <CardHeader
            className="cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center justify-between">
              <PrimaryLabel className="text-base">
                Join the Royco Royalty.
              </PrimaryLabel>

              <ChevronUp className="h-4 w-4 rotate-180" />
            </div>
          </CardHeader>
        )}
      </Card>
    </div>
  );
}
