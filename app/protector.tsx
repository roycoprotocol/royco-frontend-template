"use client";

import { useProtector } from "@/store";
import { Navbar } from "./_components";
import { Fragment, useEffect, useState } from "react";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { checkPassword } from "./check-password";

import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/composables";

export const Protector = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const {
    protectorKey,
    setProtectorKey,
    protectorMessage,
    setProtectorMessage,
    verified,
    setVerified,
  } = useProtector();

  const [checking, setChecking] = useState(true);

  // @ts-ignore
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setChecking(true);
      const status = await checkPassword(protectorKey);

      if (status === true) {
        localStorage.setItem("royco-protector-key", protectorKey);
        setVerified(true);
      } else {
        toast.error("Invalid password");
      }

      setChecking(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const cachedPassword = localStorage.getItem("royco-protector-key");
    if (cachedPassword) {
      (async () => {
        setChecking(true);
        const status = await checkPassword(cachedPassword);
        if (status === true) {
          setVerified(true);
        }
        setChecking(false);
      })();
    }
    setChecking(false);
  }, [setVerified]);

  if (verified) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <Fragment>
      {verified ? (
        <Fragment>
          <Navbar />
          {children}
        </Fragment>
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex h-screen w-full flex-col place-content-center items-center"
        >
          <div className="heading-3">
            {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco"
              ? "🐻 BOYCO ⛓️"
              : "Royco Protocol"}
          </div>

          <div className="body-2 mt-5 font-gt">
            <InputOTP
              className=""
              value={protectorKey}
              maxLength={
                process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" ? 27 : 7
              }
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              onChange={(e: string) => {
                setProtectorKey(e.toUpperCase());
              }}
              inputMode="text"
            >
              {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" ? (
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                  <InputOTPSlot index={6} />
                  <InputOTPSlot index={7} />
                  <InputOTPSlot index={8} />
                  <InputOTPSlot index={9} />
                  <InputOTPSlot index={10} />
                  <InputOTPSlot index={11} />
                  <InputOTPSlot index={12} />
                  <InputOTPSlot index={13} />
                  <InputOTPSlot index={14} />
                  <InputOTPSlot index={15} />
                  <InputOTPSlot index={16} />
                  <InputOTPSlot index={17} />
                  <InputOTPSlot index={18} />
                  <InputOTPSlot index={19} />
                  <InputOTPSlot index={20} />
                  <InputOTPSlot index={21} />
                  <InputOTPSlot index={22} />
                  <InputOTPSlot index={23} />
                  <InputOTPSlot index={24} />
                  <InputOTPSlot index={25} />
                  <InputOTPSlot index={26} />
                </InputOTPGroup>
              ) : (
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                  <InputOTPSlot index={6} />
                </InputOTPGroup>
              )}
            </InputOTP>
          </div>

          <Button
            type="submit"
            onClick={onSubmit}
            className="mt-5 h-7 max-w-28 text-sm"
            disabled={checking}
          >
            {checking ? <LoadingSpinner className="h-3 w-3" /> : "Unlock"}
          </Button>
        </form>
      )}

      <Toaster />
    </Fragment>
  );
};
