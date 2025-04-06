"use client";

import React from "react";
import { useAtomValue } from "jotai";

import { protectorAtom } from "@/store/protector";
import { Protector } from "../protector";

interface ProtectorProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  isProtected?: boolean;
}

export const ProtectorProvider = React.forwardRef<
  HTMLDivElement,
  ProtectorProviderProps
>(({ children, isProtected, ...props }, ref) => {
  const protect = useAtomValue(protectorAtom);

  if (isProtected || protect) {
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
