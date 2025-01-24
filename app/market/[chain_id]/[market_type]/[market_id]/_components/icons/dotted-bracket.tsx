import { SVGProps } from "react";

export function DottedBracket({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12.1396 5.84424L14.7954 8.49998L12.1396 11.1557"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.17234 5.84424L1.5166 8.49998L4.17234 11.1557"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.82812 8.5H6.83563"
        stroke="currentColor"
        strokeWidth="1.77049"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.4834 8.5H9.4909"
        stroke="currentColor"
        strokeWidth="1.77049"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
