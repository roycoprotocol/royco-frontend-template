"use client";

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
  }
>((props, ref) => {
  const { className, children, isOpen, onOpenModal, onConfirm, ...otherProps } =
    props;

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
