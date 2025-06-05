"use client";

import { queryClient } from "./query";
import { Provider } from "jotai";
import { queryClientAtom } from "jotai-tanstack-query";
import { useHydrateAtoms } from "jotai/utils";
import { PropsWithChildren } from "react";

const HydrateAtoms = ({ children }: PropsWithChildren) => {
  useHydrateAtoms(new Map([[queryClientAtom, queryClient]]));
  return children;
};

const JotaiProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider>
      <HydrateAtoms>{children}</HydrateAtoms>
    </Provider>
  );
};

export default JotaiProvider;
