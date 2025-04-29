import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";

interface CustomHorizontalTabsProps {
  tabs: {
    id: string;
    label: string;
  }[];
  activeTab: string;
  baseId: string;
  onTabChange: (id: string) => void;
  className?: string;
  textClassName?: string;
}

export const CustomHorizontalTabs: React.FC<CustomHorizontalTabsProps> = ({
  tabs,
  activeTab,
  baseId,
  onTabChange,
  className,
  textClassName,
}) => {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative z-10 flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "relative border-none bg-transparent py-4 outline-none transition-colors"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <PrimaryLabel>
              <div
                className={cn(
                  "text-base font-medium",
                  tab.id === activeTab ? "text-_primary_" : "text-_disabled_",
                  textClassName
                )}
              >
                {tab.label}
              </div>
            </PrimaryLabel>

            {tab.id === activeTab && (
              <>
                <motion.div
                  layoutId={`${baseId}-tab-underline`}
                  className="absolute bottom-0 left-0 right-0 h-1 border-b border-t border-_primary_"
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                />
              </>
            )}
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-0 h-1 border-b border-t"></div>
    </div>
  );
};
