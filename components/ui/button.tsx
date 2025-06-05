import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-md transition-all duration-200 ease-in-out text-base font-gt",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:opacity-95 w-full place-content-center disabled:opacity-50 disabled:cursor-not-allowed",
        destructive:
          "bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border rounded-none border-_divider_ bg-white shadow-sm hover:opacity-80 px-4 transition-all duration-200 ease-in-out text-center items-center justify-center",
        secondary:
          "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 hover:opacity-80 transition-all duration-200 ease-in-out",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
        transparent:
          "hover:bg-transparent hover:opacity-80 transition-all duration-200 ease-in-out bg-transparent disabled:bg-transparent focus:bg-transparent disabled:hover:bg-transparent",
        none: "",
      },
      size: {
        default: "py-2",
        sm: "h-8 rounded-md px-3 text-sm",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        none: "",
        fixed: "h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "outline-none focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0",
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
