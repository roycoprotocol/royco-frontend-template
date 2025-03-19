"use client";

import React from "react";
import { useAtomValue } from "jotai";

import { protectorAtom } from "@/store/vault/atom/protector";
import { Protector } from "../protector";

export const ProtectorProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const protect = useAtomValue(protectorAtom);

  if (protect) {
    return (
      <Protector>
        <div ref={ref} {...props}>
          {children}
        </div>
      </Protector>
    );
  } else {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }
});
