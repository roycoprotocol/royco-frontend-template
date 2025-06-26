"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormEmail } from "./form-email";
import { FormUsername } from "./form-username";
import { FormWallets } from "./form-wallets";
import { ExpectedSpot } from "./expected-spot";
import { useJoin } from "@/store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { api } from "@/app/api/royco";
import { royaltyEmailAtom } from "@/store/royalty";
import { royaltyUsernameAtom } from "@/store/royalty";
import { useAtomValue } from "jotai";
import { connectedWalletsAtom } from "@/store/global";
import { isAlphanumeric, isEmail } from "validator";

export const RoyaltyFormPopUp = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const { step, setStep } = useJoin();

  const email = useAtomValue(royaltyEmailAtom);
  const name = useAtomValue(royaltyUsernameAtom);
  const wallets = useAtomValue(connectedWalletsAtom);

  const { openRoyaltyForm } = useJoin();

  const onSubmit = async () => {
    setSubmitLoading(true);

    try {
      if (!isEmail(email)) {
        toast.error("Invalid email address");
        return;
      }

      if (name.length < 1 || name.length > 50) {
        toast.error("Name must be between 1 and 50 characters");
        return;
      } else if (!isAlphanumeric(name)) {
        toast.error("Name must be alphanumeric: [a-zA-Z0-9]");
        return;
      }

      const signatures = wallets.map((wallet) => wallet.signature);

      if (signatures.length === 0) {
        toast.error("At least one wallet is required to join Royco Royalty.");
        return;
      }

      const response = await api
        .userControllerRegisterUser({
          email,
          name,
          signatures,
        })
        .then((res) => res.data);

      setStep("success");
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.error?.message ??
          "Failed to submit form"
      );

      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div
      ref={ref}
      className={cn("flex w-full flex-col bg-[#FBFBF8]", className)}
      {...props}
    >
      <div className="sticky top-0 border-b border-divider bg-[#FBFBF8] px-[25px] py-2 text-lg font-semibold text-black">
        Join the Royco Royalty
      </div>

      <div className="w-full !bg-white px-7 pb-8 pt-6">
        <FormEmail />

        <FormUsername className="mt-6" />

        <FormWallets className="mt-6" />

        <ExpectedSpot className="mt-6" />

        <Button
          disabled={submitLoading}
          type="submit"
          onClick={async () => {
            await onSubmit();
          }}
          className={cn(
            "mt-8 h-12 w-full rounded-lg bg-mint font-inter text-sm font-normal shadow-none hover:bg-opacity-90",
            "transition-all duration-300 ease-in-out",
            submitLoading && "border border-divider bg-focus"
          )}
        >
          {submitLoading ? <LoadingCircle className="h-4 w-4" /> : "Submit"}
        </Button>
      </div>
    </div>
  );
});
