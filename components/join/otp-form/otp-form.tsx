"use client";

import React, { useState } from "react";
import { z } from "zod";
import { OtpFormSchema } from "./otp-form-schema";
import { useForm, UseFormReturn } from "react-hook-form";
import { RoyaltyFormSchema } from "../royalty-form/royalty-form-schema";
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp";
import { InputOTPSlot } from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormInputLabel, LoadingSpinner } from "@/components/composables";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import { useJoin } from "@/store/use-join";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export const OtpForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const { token, setStep } = useJoin();
  const otpForm = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const triggerConfetti = () => {
    const defaults = {
      startVelocity: 14,
      spread: 360,
      ticks: 300,
      zIndex: 9999,
      particleCount: 30,
      scalar: 0.8,
      gravity: 0.5,
      drift: 0,
      decay: 0.96,
    };

    let animationFrame: number;
    const shower = () => {
      const particleCount = 8;
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: -0.1 },
      });

      animationFrame = requestAnimationFrame(shower);

      setTimeout(() => {
        cancelAnimationFrame(animationFrame);
      }, 500);
    };

    shower();
  };

  const onSubmit = async (data: z.infer<typeof OtpFormSchema>) => {
    setSubmitLoading(true);

    try {
      const req = await fetch("/api/users/verify", {
        method: "POST",
        body: JSON.stringify({
          token,
          otp: parseInt(data.otp),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await req.json();

      if (!req.ok) {
        throw new Error(res.status);
      }

      setStep("success");

      triggerConfetti();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit form";

      toast.error(message);

      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Form {...otpForm}>
      <form onSubmit={otpForm.handleSubmit(onSubmit)} className="w-full p-7">
        <div
          onClick={() => setStep("info")}
          className="flex w-fit cursor-pointer flex-row items-center gap-1 text-base font-normal text-secondary transition-all duration-300 ease-in-out hover:text-black"
        >
          <ChevronLeftIcon strokeWidth={1.5} className="h-5 w-5" />
          <div>Go Back</div>
        </div>

        <FormField
          control={otpForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="mt-6 flex flex-col items-center">
              <FormInputLabel size="lg" label="Verify your email address" />

              <FormControl>
                <InputOTP
                  {...field}
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  inputMode="text"
                >
                  <InputOTPGroup className="mt-2">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>

              <FormDescription className="mt-2 w-full max-w-60 text-center">
                Please enter the one-time password sent to your email address.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={submitLoading}
          type="submit"
          onClick={otpForm.handleSubmit(onSubmit)}
          className={cn(
            "mt-8 h-12 w-full rounded-lg bg-mint font-inter text-sm font-normal shadow-none hover:bg-opacity-90",
            submitLoading && "border border-divider bg-focus"
          )}
        >
          {submitLoading ? (
            <LoadingSpinner className="h-4 w-4" />
          ) : (
            "Verify Email"
          )}
        </Button>

        {/* <Button
          type="button"
          onClick={() => {}}
          className="mt-3 h-12 w-full rounded-lg bg-tertiary font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
        >
          Resend OTP
        </Button> */}
      </form>
    </Form>
  );
});
