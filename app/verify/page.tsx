"use client";

import { useMemo } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();

  const url = useMemo(() => {
    const path = params.get("redirect");
    if (path) return path;

    return "/";
  }, [params]);

  const handleAuthentication = async (token: string) => {
    try {
      const response = await axios.get(
        `/api/auth/verify?turnstile_token=${token}`
      );

      if (response.status === 200) {
        router.push(url);
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={handleAuthentication}
      />
    </div>
  );
}
