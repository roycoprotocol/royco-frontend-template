"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { protectorAtom } from "@/store/protector/protector";
import toast from "react-hot-toast";
import { checkPassword } from "@/utils/check-password";
import { InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/composables";
import { InputOTP } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

interface ProtectorProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  isProtected?: boolean;
}

export const ProtectorProvider = React.forwardRef<
  HTMLDivElement,
  ProtectorProviderProps
>(({ children, isProtected, ...props }, ref) => {
  const shouldProtect = useAtomValue(protectorAtom);

  const [password, setPassword] = useState("");

  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);

  const protect = useMemo(() => {
    return (isProtected || shouldProtect) && !verified;
  }, [isProtected, shouldProtect, verified]);

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

  const handleUnlock = async (e: any) => {
    e.preventDefault();
    try {
      setChecking(true);
      const status = await checkPassword(password);

      if (status === true) {
        localStorage.setItem("royco-protector-key", password);
        setVerified(true);
      } else {
        toast.error("Invalid password");
      }

      setChecking(false);
    } catch (e) {
      console.log(e);
    }
  };

  const content = useMemo(() => {
    if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco") {
      return { label: "🐻 BOYCO ⛓️", length: 27 };
    }

    if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "plume") {
      return { label: "Plume", length: 10 };
    }

    return { label: "Royco Protocol", length: 7 };
  }, [process.env.NEXT_PUBLIC_FRONTEND_TAG]);

  if (protect) {
    return (
      <Fragment>
        <form
          onSubmit={handleUnlock}
          className="mt-40 flex w-full flex-col items-center justify-center"
        >
          <div className="font-shippori text-2xl md:text-3xl">
            {content.label}
          </div>

          <div className="mt-5 text-sm font-light md:text-base">
            <InputOTP
              value={password}
              maxLength={content.length}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              onChange={(e: string) => {
                setPassword(e.toUpperCase());
              }}
              inputMode="text"
            >
              <InputOTPGroup>
                {Array.from({ length: content.length }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            className="mt-5 h-7 max-w-28 text-sm"
            disabled={checking}
          >
            {checking ? <LoadingSpinner className="h-3 w-3" /> : "Unlock"}
          </Button>
        </form>
      </Fragment>
    );
  }

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});
