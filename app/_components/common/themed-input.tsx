import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface CustomInputProps {
  Prefix?: React.ComponentType;
  Suffix?: React.ComponentType;
  isFocused?: boolean;
  containerClassName?: string;
  newHeight?: string;
  newLeading?: string;
}

export type CombinedInputProps = InputProps & CustomInputProps;

const ThemedInput = React.forwardRef<HTMLInputElement, CombinedInputProps>(
  (
    {
      Prefix,
      Suffix,
      className,
      containerClassName,
      isFocused,
      type,
      newHeight,
      newLeading,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "body-2 flex h-9 flex-row items-center gap-3 rounded-md bg-transparent",
          isFocused === true && "focus-within:bg-slate-100",
          containerClassName,
          newHeight
        )}
      >
        {Prefix && <Prefix />}

        <div className={cn("flex h-9 grow items-center", newHeight)}>
          {/* <span className={cn("grow leading-[20px]", newLeading)}>
            
          </span> */}
          <input
            type={type}
            className={cn(
              "w-full grow border-b border-_divider_ bg-transparent py-2 outline-none transition-colors [appearance:textfield] file:border-0 file:bg-transparent file:text-sm placeholder:text-placeholder focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>

        {Suffix && <Suffix />}
      </div>
    );
  }
);
ThemedInput.displayName = "ThemedInput";

export { ThemedInput };
