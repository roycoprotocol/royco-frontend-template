"use client";

import React, { Fragment, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/radix/tabs";
import { CustomHorizontalTabs } from "@/app/vault/common/custom-horizontal-tabs";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import {
  CircleHelp,
  CircleHelpIcon,
  PlusIcon,
  Trash2Icon,
  TrashIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { MarkdownRenderer } from "../common/markdown-renderer";
import { GradientText } from "@/app/vault/common/gradient-text";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { safeOwnersAtom } from "@/store/safe/atoms";
import { toast } from "sonner";
import { isSolidityAddressValid, shortAddress } from "royco/utils";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/composables";
import { LoadingCircle } from "@/components/animations/loading-circle";
import { CopyButton } from "@/components/animate-ui/buttons/copy";
import { Counter } from "@/components/animate-ui/components/counter";

export const SafeModal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [step, setStep] = React.useState<"info" | "create">("create");

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [safeOwners, setSafeOwners] = useAtom(safeOwnersAtom);
  const [accountAddress, setAccountAddress] = React.useState<string>("");
  const [threshold, setThreshold] = React.useState<number>(1);

  const [addMultipleOwners, setAddMultipleOwners] =
    React.useState<boolean>(false);

  const addSafeOwner = async ({
    accountAddress,
  }: {
    accountAddress: string;
  }) => {
    setIsLoading(true);

    try {
      if (!accountAddress) throw new Error("Wallet address is required");

      const transformedAccountAddress = accountAddress.trim().toLowerCase();

      if (!isSolidityAddressValid("address", transformedAccountAddress))
        throw new Error("Invalid ethereum address");

      if (safeOwners.includes(transformedAccountAddress))
        throw new Error("Address already added");

      setSafeOwners([...safeOwners, transformedAccountAddress]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add safe owner"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeSafeOwner = (owner: string) => {
    setSafeOwners(safeOwners.filter((o) => o !== owner));
  };

  useEffect(() => {
    if (safeOwners.length === 0) {
      setThreshold(1);
    } else if (threshold > safeOwners.length) {
      setThreshold(safeOwners.length);
    }
  }, [threshold, safeOwners]);

  return (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-xl border border-_divider_ bg-_surface_ p-5 shadow-sm",
        className
      )}
      {...props}
    >
      {step === "create" && (
        <div>
          <div className="flex items-center gap-2">
            <GradientText className="text-xl font-medium">
              Create Royco Safe
            </GradientText>

            <CircleHelpIcon
              strokeWidth={1.5}
              className="size-5 text-_tertiary_"
            />
          </div>

          <SecondaryLabel className="mt-2">
            Your royco safe will be used to manage your assets across Royco.
          </SecondaryLabel>

          <div className="mt-7 flex flex-row items-start gap-5">
            <div>
              <div className="flex h-9 w-9 flex-col place-content-center items-center bg-_divider_ text-lg font-light text-_primary_">
                i
              </div>
            </div>
            <div className="flex-1">
              <form
                className=""
                onSubmit={(e) => {
                  e.preventDefault();

                  addSafeOwner({ accountAddress });
                }}
              >
                <SecondaryLabel className="font-medium">
                  Add Safe Owner
                </SecondaryLabel>

                <Input
                  className="h-9 border-b border-_divider_"
                  aria-autocomplete="none"
                  type="text"
                  autoFocus={false}
                  autoComplete="off"
                  containerClassName="border-none rounded-none border-_divider_ text-sm p-0"
                  placeholder="0x777...667"
                  value={accountAddress}
                  onChange={(e) => setAccountAddress(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSafeOwner({ accountAddress });
                    }
                  }}
                  Suffix={() => (
                    <Button
                      variant="ghost"
                      className="flex h-9 w-20 flex-col items-center justify-center rounded-none border border-none bg-_highlight_ text-sm text-white shadow-none hover:bg-_highlight_ hover:text-white"
                      onClick={() => addSafeOwner({ accountAddress })}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <LoadingCircle className="size-4 animate-spin" />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  )}
                />
              </form>

              <div className="mt-5">
                <SecondaryLabel className="font-medium">
                  Safe Owners
                </SecondaryLabel>

                <div className="mt-3 flex flex-col gap-2">
                  {safeOwners.length === 0 && (
                    <TertiaryLabel className="text-sm">
                      <TriangleAlertIcon className="mr-2 size-4" /> At least one
                      owner is required to create a safe.
                    </TertiaryLabel>
                  )}

                  {safeOwners.map((owner, index) => (
                    <div
                      key={owner}
                      className="flex flex-row items-center justify-between gap-3"
                    >
                      <div className="flex h-9 w-9 flex-row items-center justify-center gap-2 rounded-none bg-_highlight_ text-sm font-medium">
                        <span className="text-white">{index + 1}</span>
                      </div>

                      <SecondaryLabel className="flex-1 text-base">
                        {shortAddress(owner)}{" "}
                        <CopyButton
                          variant="ghost"
                          size="md"
                          content={owner}
                          className="ml-1"
                        />
                      </SecondaryLabel>

                      <Button
                        className="h-9 rounded-none border border-none bg-error shadow-none"
                        variant="outline"
                        onClick={() => removeSafeOwner(owner)}
                      >
                        <Trash2Icon strokeWidth={1.5} className="text-white" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-row items-start gap-5">
            <div className="flex h-9 w-9 flex-col place-content-center items-center bg-_divider_ text-lg font-light text-_primary_">
              ii
            </div>

            <div className="flex-1">
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-col">
                  <SecondaryLabel className="font-medium">
                    Threshold
                  </SecondaryLabel>

                  <TertiaryLabel className="mt-2">
                    The number of owners required to execute a transaction.
                  </TertiaryLabel>
                </div>

                <Counter
                  number={threshold}
                  setNumber={(value) => {
                    if (value < 1 || value > safeOwners.length) return;
                    setThreshold(value);
                  }}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <Button className="mt-7 h-10 w-full rounded-none border-none bg-_highlight_">
            Create Safe
          </Button>
        </div>
      )}
    </div>
  );
});

SafeModal.displayName = "SafeModal";
