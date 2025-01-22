import React from "react";
import { cn } from "@/lib/utils";

interface RegisterUserTemplateProps {
  username: string;
  otp: number;
}

export const RegisterUserTemplate: React.FC<
  Readonly<RegisterUserTemplateProps>
> = ({ username, otp }) => (
  <div className={cn("flex flex-col items-center justify-center")}>
    <h1>Welcome to Royco Royalty.</h1>
    <p>Your verification code is: {otp}</p>
  </div>
);
