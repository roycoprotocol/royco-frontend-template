"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BadgeCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const SuccessScreen = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const router = useRouter();
  const countdownTimer = 10;

  const [countdown, setCountdown] = useState(countdownTimer);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown === 1) {
      router.push("/portfolio");
    }
  }, [countdown]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex w-full flex-col place-content-center items-center p-7",
        className
      )}
    >
      <BadgeCheckIcon
        strokeWidth={1.5}
        className="h-9 w-9 fill-success stroke-white"
      />

      <div className="mt-3 w-full text-center font-gt text-xl font-500 text-black">
        Welcome to the Royalty Royalty!
      </div>

      <div className="mt-3 w-full text-center font-gt text-base font-300 text-secondary">
        You will be redirected to your portfolio in{" "}
        <motion.span key="countdown" layout layoutId="countdown">
          {countdown}
        </motion.span>{" "}
        seconds.
      </div>
    </div>
  );
});
