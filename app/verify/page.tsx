"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={async (token: string) => {
          try {
            const response = await fetch(
              `/api/auth/verify?turnstile_token=${token}`
            );
            const data = await response.json();

            if (data.status === "success" && data.sessionToken) {
              // Redirect back to the original page
              router.push(redirectUrl);
            }
          } catch (error) {
            console.error("Error during verification:", error);
          }
        }}
      />
    </div>
  );
}
