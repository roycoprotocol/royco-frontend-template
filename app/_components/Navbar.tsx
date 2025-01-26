"use client";

import React from "react";
import { ActualNavbar } from "./ui";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  if (pathname === "/verify") return null;

  return <ActualNavbar />;
};
