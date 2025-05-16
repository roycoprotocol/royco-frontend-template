"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navigation } from "./navigation";

export const NavigationWrapper: React.FC = () => {
  const pathname = usePathname();
  if (pathname === "/verify") return null;

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return <Navigation />;
};
