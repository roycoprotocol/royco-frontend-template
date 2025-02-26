import React from "react";
import { cn } from "@/lib/utils";

export const PlumeLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <rect width="256" height="256" rx="128" fill="#FF3D00" />
      <path
        d="M155.46 104.708V150.65L137.424 132.465V86.5228L155.46 104.708Z"
        fill="white"
      />
      <path
        d="M105.179 155.432H150.72L132.694 137.237H87.153L105.179 155.432Z"
        fill="white"
      />
      <path
        d="M181.093 181.451V130.567L163.058 112.382V163.266L112.786 163.097L130.812 181.291L181.083 181.461"
        fill="white"
      />
      <path
        d="M64 64.0093L64 114.894L82.0352 133.079L82.0352 82.1943L132.307 82.3642L114.281 64.1698L64.0096 64"
        fill="white"
      />
      <path
        d="M185.861 191.115L175.629 180.793L180.599 175.779L190.831 186.102L192 192L185.861 191.115Z"
        fill="white"
      />
    </svg>
  );
};
