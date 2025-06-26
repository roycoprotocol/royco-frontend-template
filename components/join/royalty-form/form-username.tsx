"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormInputLabel } from "@/components/composables";
import { useAtom } from "jotai";
import { royaltyUsernameAtom } from "@/store/royalty";

export const FormUsername = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [username, setUsername] = useAtom(royaltyUsernameAtom);

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <FormInputLabel className="mb-2" label="Nickname" />

      <Input
        placeholder="BigRoycoFan"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full"
      />

      <div className="caption mt-2 text-tertiary">This will be public.</div>
    </div>
  );
});

FormUsername.displayName = "FormUsername";
