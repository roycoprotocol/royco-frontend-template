"use client";

import React, { useEffect } from "react";
import { useJoin } from "@/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RoyaltyFormPopUp } from "./royalty-form-pop-up";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { UseFormReturn } from "react-hook-form";
import { RoyaltyFormSchema } from "./royalty-form-schema";
import { z } from "zod";
import { OtpForm } from "../otp-form";
import { SuccessScreen } from "../success-screen";
import { Card } from "@/components/ui/card";

export const RoyaltyForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  const { openRoyaltyForm, setOpenRoyaltyForm, step } = useJoin();

  return (
    <Dialog open={openRoyaltyForm} onOpenChange={setOpenRoyaltyForm}>
      <Button
        onClick={() => {
          setOpenRoyaltyForm(true);
        }}
        className="h-12 w-full max-w-xs rounded-lg bg-mint font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
      >
        Create Account
      </Button>

      <Card>
        <div className="hide-scrollbar max-h-[80vh] w-full overflow-y-auto rounded-xl border border-divider bg-white shadow-sm">
          {step === "info" && <RoyaltyFormPopUp royaltyForm={royaltyForm} />}
          {step === "otp" && <OtpForm royaltyForm={royaltyForm} />}
          {step === "success" && <SuccessScreen />}
        </div>
      </Card>

      {/* {!connectModalOpen && (
        <DialogContent className="max-h-[100vh] shrink-0 !rounded-none !border-0 bg-transparent !p-3 shadow-none !outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:max-w-[480px]">
          <DialogTitle className="hidden">Royalty Dialog</DialogTitle>

          <div className="hide-scrollbar max-h-[80vh] w-full overflow-y-auto rounded-xl border border-divider bg-white shadow-sm">
            {step === "info" && <RoyaltyFormPopUp royaltyForm={royaltyForm} />}
            {step === "otp" && <OtpForm royaltyForm={royaltyForm} />}
            {step === "success" && <SuccessScreen />}
          </div>
        </DialogContent>
      )} */}
    </Dialog>
  );
});
