"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export const FooterWrapper: React.FC = () => {
  const pathname = usePathname();
  if (pathname === "/verify") return null;

  return <Footer />;
};
