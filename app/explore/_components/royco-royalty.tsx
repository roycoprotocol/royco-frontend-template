"use client";

import { useState } from "react";
import { X, ArrowRight, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
    <div className="fixed bottom-4 right-4 z-50 hidden md:block">
      <Card className={cn("w-[400px] max-w-[95vw] rounded-sm")}>
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
                <CardTitle className="flex justify-center">
                  <PrimaryLabel className="text-_primary_">
                    Join the Royco Royalty.
                  </PrimaryLabel>
                </CardTitle>

                <CardDescription className="mt-2 flex justify-center">
                  <TertiaryLabel className="max-w-60 text-center text-_primary_">
                    Join 7,000+ users and get priority alpha, access, and
                    benefits on Royco.
                  </TertiaryLabel>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <hr />

              <div className="mt-5">
                <img
                  src="/royalty/pop-up.png"
                  alt="Royco Royalty"
                  className="w-full"
                />
              </div>

              <div className="mt-6">
                <a
                  href="/royalty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg bg-_primary_ p-4"
                >
                  <SecondaryLabel className="font-medium text-_surface_">
                    Learn More
                  </SecondaryLabel>

                  <ArrowRight
                    className="h-4 w-4 text-_surface_"
                    strokeWidth={3}
                  />
                </a>
              </div>
            </CardContent>
          </>
        ) : (
          <CardHeader
            className="cursor-pointer p-0 py-4 pl-6 pr-4"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center justify-between">
              <PrimaryLabel className="text-base">
                Join the Royco Royalty.
              </PrimaryLabel>

              <Button
                variant="ghost"
                size="icon"
                className="flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        )}
      </Card>
    </div>
  );
}
