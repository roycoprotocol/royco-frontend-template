import { cn } from "@/lib/utils";

export const ExternalLinkIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        d="M14 6.5L14 2.5M14 2.5H10M14 2.5L8.66667 7.83333M6.66667 3.83333H5.2C4.0799 3.83333 3.51984 3.83333 3.09202 4.05132C2.71569 4.24307 2.40973 4.54903 2.21799 4.92535C2 5.35318 2 5.91323 2 7.03333V11.3C2 12.4201 2 12.9802 2.21799 13.408C2.40973 13.7843 2.71569 14.0903 3.09202 14.282C3.51984 14.5 4.0799 14.5 5.2 14.5H9.46667C10.5868 14.5 11.1468 14.5 11.5746 14.282C11.951 14.0903 12.2569 13.7843 12.4487 13.408C12.6667 12.9802 12.6667 12.4201 12.6667 11.3V9.83333"
        stroke="#4D4B49"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
