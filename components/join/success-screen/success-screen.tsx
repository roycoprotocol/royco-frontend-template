"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BadgeCheckIcon, InboxIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { useAtomValue } from "jotai";
import { royaltyEmailAtom } from "@/store/royalty";

export const SuccessScreen = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const email = useAtomValue(royaltyEmailAtom);

  // const router = useRouter();
  // const countdownTimer = 10;

  // const [countdown, setCountdown] = useState(countdownTimer);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCountdown((prev) => prev - 1);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   if (countdown === 1) {
  //     router.push("/portfolio");
  //   }
  // }, [countdown]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn("flex w-full flex-col p-5", className)}
    >
      <div className="flex flex-row items-center gap-3">
        <InboxIcon className="h-10 w-10 text-_primary_" />

        <PrimaryLabel className=" text-2xl text-_primary_">
          Check Your Inbox
        </PrimaryLabel>
      </div>

      <SecondaryLabel className="mt-5 text-_secondary_">
        We have sent a magic link to {email}. Please click the link to confirm
        your email address. It might take a few minutes for the mail to arrive.
      </SecondaryLabel>

      <SecondaryLabel className="mt-3 italic text-_secondary_">
        Please check your spam folder if you don't see the email in your inbox.
        The verification link will auto-expire in 24 hours.
      </SecondaryLabel>

      {/* <div className="mt-3 w-full text-center font-gt text-base font-300 text-secondary">
        You will be redirected to your portfolio in{" "}
        <motion.span key="countdown" layout layoutId="countdown">
          {countdown}
        </motion.span>{" "}
        seconds.
      </div> */}
    </div>
  );
});
