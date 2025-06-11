"use client";

import React from "react";
import { FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormInputLabel } from "@/components/composables";
import { useAtom } from "jotai";
import { royaltyEmailAtom } from "@/store/royalty";
import { cn } from "@/lib/utils";

export const FormEmail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [email, setEmail] = useAtom(royaltyEmailAtom);

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <FormInputLabel className="mb-2" label="Email" />

      <Input
        placeholder="anon_whale@protonmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full"
      />

      <FormDescription className="mt-2">
        This is private. We'll reach out when it's your time.
      </FormDescription>
    </div>
  );
});

FormEmail.displayName = "FormEmail";

// <FormField
//   control={royaltyForm.control}
//   name="email"
//   render={({ field }) => (
//     <FormItem className={cn("", className)}>
//       <FormInputLabel className="mb-2" label="Email" />

//       <FormControl>

//       </FormControl>

//       <FormDescription className="mt-2">
//         This is private. We'll reach out when it's your time.
//       </FormDescription>
//       <FormMessage />
//     </FormItem>
//   )}
// />
