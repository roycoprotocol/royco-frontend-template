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

interface RateItem {
  name: string;
  type: string;
  rate: string;
  label: string;
}

export function RoycoRoyalty() {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const rates: RateItem[] = [
    { name: "Morpho", type: "USDC", rate: "47%", label: "High Yield" },
    { name: "Aave Lend", type: "USDC", rate: "52%", label: "New Market" },
    { name: "USDC", type: "USDC", rate: "142%", label: "New Market" },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-[400px] max-w-[95vw]">
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
              <CardTitle className="text-center">
                Join the Royco Royalty.
              </CardTitle>
              <CardDescription className="text-center">
                Capture the latest stats relevant to your wallet by getting
                notified when markets meet your criteria.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Rates List */}
              <div className="space-y-3">
                {rates.map((item, index) => (
                  <div
                    key={index}
                    className="bg-muted flex items-center justify-between rounded-lg p-3"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {item.type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.label}</Badge>
                      <span className="font-medium">{item.rate} APR</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Learn More */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Learn More</span>
                <ArrowRight className="h-4 w-4" />
              </div>

              {/* Email Input and Submit */}
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="ashley@myfoxx.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button>Continue</Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardHeader
            className="cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center justify-between">
              <CardTitle>Join the Royco Royalty</CardTitle>
              <ChevronUp className="h-4 w-4 rotate-180" />
            </div>
          </CardHeader>
        )}
      </Card>
    </div>
  );
}
