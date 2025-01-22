import React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const SignMessageInfoCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    show?: boolean;
    disconnectWallet?: () => Promise<void>;
  }
>(({ className, show = false, disconnectWallet, ...props }, ref) => {
  if (!show) return null;

  return (
    <div ref={ref} className={cn("p-3")} {...props}>
      <Dialog
        open={show}
        onOpenChange={() => {
          // do nothing
        }}
      >
        <DialogTrigger asChild className="hidden">
          Info Card Trigger
        </DialogTrigger>
        <DialogContent
          className={cn(
            "rounded-xl bg-white p-8",
            "border border-divider",
            "shadow-sm",
            className
          )}
          {...props}
        >
          <div className="flex flex-row items-center gap-2 text-xl font-semibold">
            Proof of funds
          </div>
          <div className="mt-2 text-base font-light text-secondary">
            Sign the message on your wallet to prove wallet ownership. There are
            no transfers or approvals required.
          </div>

          {/* <div className="mt-12 flex flex-row items-center gap-1 text-sm font-light text-tertiary">
            <CircleHelpIcon strokeWidth={1.5} className="h-4 w-4 shrink-0" />
            <div>Didn't get the sign message? Try one of the following:</div>
          </div>

          <div className="flex flex-row items-center gap-2">
            <Button
              type="button"
              onClick={async (e) => {
                await disconnectWallet?.();
              }}
              className="mt-2 h-12 w-full rounded-lg bg-error font-inter text-sm font-normal shadow-none hover:bg-opacity-90"
            >
              Disconnect Wallet
            </Button>
          </div> */}
        </DialogContent>
      </Dialog>
    </div>
  );
});
