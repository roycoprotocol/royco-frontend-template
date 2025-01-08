"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useJoin } from "@/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RoyaltyFormPopUp } from "./royalty-form-pop-up";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export const RoyaltyForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { openRoyaltyForm, setOpenRoyaltyForm } = useJoin();

  const { connectModalOpen } = useConnectModal();

  return (
    <Dialog
      open={openRoyaltyForm}
      onOpenChange={() => {
        if (connectModalOpen === true) {
          // do nothing
        } else {
          setOpenRoyaltyForm(!openRoyaltyForm);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setOpenRoyaltyForm(true);
          }}
          className="bg-mint mt-8 h-12 w-full max-w-xs rounded-lg font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
        >
          Create Account
        </Button>
      </DialogTrigger>

      {!connectModalOpen && (
        <DialogContent className="max-h-[100vh] shrink-0 !rounded-none !border-0 bg-transparent !p-3 shadow-none sm:max-w-[480px]">
          <div className="hide-scrollbar max-h-[80vh] w-full overflow-y-auto rounded-xl border border-divider bg-white shadow-none">
            <RoyaltyFormPopUp />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
});
