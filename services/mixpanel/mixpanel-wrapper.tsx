"use client";

import Mixpanel from "./mixpanel";
import React, { useEffect } from "react";

interface MixpanelWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MixpanelWrapper = React.forwardRef<
  HTMLDivElement,
  MixpanelWrapperProps
>(({ children, ...props }, ref) => {
  useEffect(() => {
    Mixpanel.getInstance();
  }, []);

  return <>{children}</>;
});
