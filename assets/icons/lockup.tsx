import { cn } from "@/lib/utils";

export const LockupIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-4 w-4", className)}
    >
      <path
        d="M11.1586 4.84142L4.84142 11.1586C4.71543 11.2846 4.80466 11.5 4.98284 11.5H11.0172C11.1953 11.5 11.2846 11.2846 11.1586 11.1586L4.84142 4.84142C4.71543 4.71543 4.80466 4.5 4.98284 4.5H11.0172C11.1953 4.5 11.2846 4.71543 11.1586 4.84142Z"
        stroke="#4D4B49"
      />
      <circle cx="8" cy="8" r="7.5" stroke="#4D4B49" />
    </svg>
  );
};
