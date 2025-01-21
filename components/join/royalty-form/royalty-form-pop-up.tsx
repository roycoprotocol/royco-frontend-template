"use client";

import React from "react";
import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useWeb3Modal } from "@web3modal/wagmi/react";

import clsx from "clsx";

import { useAccount, useDisconnect } from "wagmi";
import { useSignMessage, useVerifyMessage } from "wagmi";
import { verifyMessage } from "@wagmi/core";

import { switchChain } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";

import { useSwitchChain } from "wagmi";

import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { CaretRightIcon, CaretDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { matcher } from "./matcher";
import { RoyaltyFormSchema } from "./royalty-form-schema";
import { FormEmail } from "./form-email";
import { FormUsername } from "./form-username";
import { FormWallets } from "./form-wallets";
import { ExpectedSpot } from "./expected-spot";
import { FormTelegram } from "./form-telegram";
import { useJoin } from "@/store";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/composables";

export const RoyaltyFormPopUp = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const { step, setStep, setToken } = useJoin();

  const onSubmit = async (data: z.infer<typeof RoyaltyFormSchema>) => {
    setSubmitLoading(true);

    try {
      const req = await fetch("/api/users/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await req.json();

      if (!req.ok) {
        throw new Error(res.status);
      }

      const { token } = res;

      setToken(token);
      setStep("otp");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to submit form";

      toast.error(message);

      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const { openRoyaltyForm } = useJoin();

  const { disconnectAsync } = useDisconnect();

  const disconnectWalletIfProofNotRequired = async () => {
    if (
      !openRoyaltyForm &&
      !royaltyForm
        .getValues("wallets")
        .some((wallet) => wallet.proof.length === 0)
    ) {
      await disconnectAsync();
    }
  };

  useEffect(() => {
    disconnectWalletIfProofNotRequired();
  }, [openRoyaltyForm]);

  return (
    <Form {...royaltyForm}>
      <form
        onSubmit={royaltyForm.handleSubmit(onSubmit)}
        className="flex w-full flex-col bg-[#FBFBF8]"
      >
        <div className="sticky top-0 border-b border-divider bg-[#FBFBF8] px-[25px] py-2 text-lg font-semibold text-black">
          Join the Royco Royalty
        </div>

        <div className="w-full !bg-white px-7 pb-8 pt-6">
          <FormEmail royaltyForm={royaltyForm} />

          <FormUsername className="mt-6" royaltyForm={royaltyForm} />

          {/* <FormTelegram className="mt-6" royaltyForm={royaltyForm} /> */}

          <FormWallets className="mt-6" royaltyForm={royaltyForm} />

          <ExpectedSpot className="mt-6" royaltyForm={royaltyForm} />

          <Button
            disabled={submitLoading}
            type="submit"
            onClick={() => {
              royaltyForm.handleSubmit(onSubmit)();
            }}
            className={cn(
              "mt-8 h-12 w-full rounded-lg bg-mint font-inter text-sm font-normal shadow-none hover:bg-opacity-90",
              "transition-all duration-300 ease-in-out",
              submitLoading && "border border-divider bg-focus"
            )}
          >
            {submitLoading ? <LoadingSpinner className="h-4 w-4" /> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
});
