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

interface RoycoRoyaltyProps {
  open?: boolean;
}

export function RoycoRoyalty({ open = true }: RoycoRoyaltyProps) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden rounded-xl md:block">
      <Card className={cn("w-[400px] max-w-[95vw] rounded-lg")}>
        {isOpen ? (
          <>
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="pt-5">
                <CardTitle className="mb-2 flex justify-center">
                  <PrimaryLabel>Join the Royco Royalty.</PrimaryLabel>
                </CardTitle>

                <CardDescription className="flex justify-center">
                  <TertiaryLabel className="max-w-60 text-center text-primary">
                    Join 7,000+ users and get priority alpha, access, and
                    benefits on Royco.
                  </TertiaryLabel>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <hr className="mb-5" />

              <div>
                <img src="/royalty/pop-up.png" alt="Royco Royalty" />
              </div>

              <div className="mt-6">
                <a
                  href="/royalty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg bg-primary p-4"
                >
                  <SecondaryLabel className="font-medium text-white">
                    Learn More
                  </SecondaryLabel>

                  <ArrowRight className="h-4 w-4 text-white" strokeWidth={3} />
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
