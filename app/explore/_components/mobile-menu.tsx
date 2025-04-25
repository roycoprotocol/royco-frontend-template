"use client";

import { TableMenu } from "./table-menu";
import { Settings2Icon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import React from "react";

type MobileMenuProps = React.HTMLAttributes<HTMLDivElement> & {};

export const MobileMenu = React.forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ className }, ref) => {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <div className="rounded-xl border border-divider bg-white p-2 transition-all duration-200 ease-in-out hover:bg-focus lg:hidden">
            <Settings2Icon
              strokeWidth={1.5}
              className="aspect-square h-full text-secondary"
            />
          </div>
        </DrawerTrigger>
        <DrawerContent className="flex max-h-[80vh] flex-col items-center border bg-white focus:outline-none">
          <TableMenu className="max-h-[80vh] overflow-y-scroll rounded-none border-none pb-5" />
        </DrawerContent>
      </Drawer>
    );
  }
);
