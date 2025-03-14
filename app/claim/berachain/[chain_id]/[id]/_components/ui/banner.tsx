import React from "react";
import { cn } from "@/lib/utils";
import { Tilt } from "@/components/motion-primitives/tilt";

export const Banner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Tilt rotationFactor={8} isRevese>
      <img
        src={`/berachain/boyco-banner.png`}
        alt={`Boyco Banner`}
        className="aspect-auto w-full rounded-2xl object-cover object-center"
      />
    </Tilt>
  );
});
