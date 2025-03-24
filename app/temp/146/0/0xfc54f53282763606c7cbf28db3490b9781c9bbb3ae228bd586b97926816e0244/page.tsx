"use client";

import { MarketManagerStoreProvider } from "@/store";
import { HardcodedButton } from "./hardcoded-button";
import { TransactionModal } from "@/components/composables";
import { InfoIcon } from "lucide-react";

export default function Page() {
  return (
    <MarketManagerStoreProvider>
      <div className="flex h-screen flex-col items-center justify-center p-5">
        <div className="mb-5 flex w-full max-w-xl flex-col rounded-2xl border border-divider bg-z2 p-5 text-lg drop-shadow-sm duration-200 ease-in-out hover:bg-focus">
          <div className="flex items-center gap-2">
            <InfoIcon strokeWidth={2} className="size-5 text-error" />
            <div className="font-medium text-error">IMPORTANT</div>
          </div>

          <div className="text-light mt-3 tracking-tight text-secondary">
            This market will be deprecated for a new Royco market that will
            allow depositors to earn PENDLE rewards in addition to their Royco
            rewards. If you were a depositor in this market, please connect your
            wallet and click on "Withdraw" button to withdraw your tokens.
          </div>
        </div>

        <HardcodedButton />

        <TransactionModal />
      </div>
    </MarketManagerStoreProvider>
  );
}
