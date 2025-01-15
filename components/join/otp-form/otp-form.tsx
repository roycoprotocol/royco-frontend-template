"use client";

import React from "react";
import { z } from "zod";
import { OtpFormSchema } from "./otp-form-schema";
import { useForm, UseFormReturn } from "react-hook-form";
import { RoyaltyFormSchema } from "../royalty-form/royality-form-schema";
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
import { FormInputLabel } from "@/components/composables";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import { useJoin } from "@/store/use-join";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

export const OtpForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const otpForm = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: z.infer<typeof OtpFormSchema>) => {
    console.log(data);
  };

  const { setStep } = useJoin();

  return (
    <Form {...otpForm}>
      <form
        onSubmit={otpForm.handleSubmit(onSubmit)}
        className="w-full w-full p-7"
      >
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

              <FormDescription className="mt-2">
                Please enter the one-time password sent to your
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          onClick={() => {}}
          className="mt-8 h-12 w-full rounded-lg bg-mint font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
        >
          Verify Email
        </Button>

        <Button
          type="button"
          onClick={() => {}}
          className="mt-3 h-12 w-full rounded-lg bg-tertiary font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
        >
          Resend OTP
        </Button>
      </form>
    </Form>
  );
});
