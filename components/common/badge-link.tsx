import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import React, { Fragment } from "react";

const BASE_CLASSES = cn(
  "flex cursor-pointer flex-row items-center space-x-[6px] overflow-hidden rounded-full border border-divider bg-white px-2 py-1 transition-all duration-200 ease-in-out hover:bg-focus font-gt font-300 text-secondary"
);

const BaseContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "md" | "lg";
  }
>(({ className, size = "md", ...props }, ref) => {
  return (
    <Fragment>
      <ExternalLinkIcon
        strokeWidth={1.5}
        className={cn(
          "p-[0.1rem]",
          size === "md" && "h-6 w-6",
          size === "sm" && "h-5 w-5"
        )}
      />
      <div
        className={cn(
          "flex",
          size === "md" && "text-base",
          size === "sm" && "text-sm"
        )}
      >
        {props.children}
      </div>
    </Fragment>
  );
});

export const BadgeLink = ({
  target,
  href,
  text,
  className,
  size = "md",
}: {
  target: "_blank" | "_self";
  href: string;
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) => {
  if (target === "_blank") {
    return (
      <a
        href={href}
        target={target}
        rel="noopener noreferrer"
        className={cn(
          BASE_CLASSES,
          size === "sm" && "space-x-1 py-0.5 pl-1 pr-2",
          className
        )}
      >
        <BaseContent size={size}>{text}</BaseContent>
      </a>
    );
  } else {
    return (
      <Link
        href={href}
        className={cn(
          BASE_CLASSES,
          size === "sm" && "space-x-1 py-0.5 pl-1 pr-2",
          className
        )}
      >
        <BaseContent size={size}>{text}</BaseContent>
      </Link>
    );
  }
};
