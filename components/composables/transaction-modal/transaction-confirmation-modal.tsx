"use client";

import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";

export const TransactionConfirmationModal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onOpenModal: (open: boolean) => void;
    onConfirm: () => void;
    warnings?: React.ReactNode;
  }
>((props, ref) => {
  const {
    className,
    children,
    isOpen,
    onOpenModal,
    onConfirm,
    warnings,
    ...otherProps
  } = props;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenModal}>
      {isOpen && (
        <DialogContent
          className={cn("sm:max-w-[500px]", className)}
          ref={ref}
          {...otherProps}
        >
          <DialogHeader>
            <DialogTitle>Confirm Offer & Action</DialogTitle>
            <DialogDescription>
              Please confirm that you have reviewed the Offer & Market Action(s)
              and want to proceed. This action cannot be undone.
            </DialogDescription>

            {warnings && (
              <div className="mt-3 rounded-sm border border-_divider_ p-4">
                <SecondaryLabel className="break-normal text-base">
                  {warnings}
                </SecondaryLabel>
              </div>
            )}
          </DialogHeader>

          <DialogClose asChild>
            <Button
              className="mt-5 h-9 text-sm"
              onClick={onConfirm}
              type="button"
            >
              <div className="h-5">Confirm, I have reviewed</div>
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button className="h-9 bg-error text-sm" type="button">
              <div className="h-5">Go back</div>
            </Button>
          </DialogClose>
        </DialogContent>
      )}
    </Dialog>
  );
});

TransactionConfirmationModal.displayName = "TransactionConfirmationModal";
