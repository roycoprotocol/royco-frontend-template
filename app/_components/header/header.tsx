"use client";

import React, { useEffect } from "react";
import { ActualNavbar } from "../ui/actual-navbar";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  if (pathname === "/verify") return null;

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return <ActualNavbar />;
};
