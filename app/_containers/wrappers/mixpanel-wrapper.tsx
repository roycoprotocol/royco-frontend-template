"use client";

import { initMixpanel } from "@/utils/mixpanel-client";
import React, { useEffect } from "react";

interface MixpanelWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MixpanelWrapper = React.forwardRef<
  HTMLDivElement,
  MixpanelWrapperProps
>(({ children, ...props }, ref) => {
  useEffect(() => {
    initMixpanel(); // Initialize Mixpanel
  }, []);

  return <>{children}</>;
});
