"use client";

import { useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useLocalStorage } from "usehooks-ts";

export const TurnstileWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authToken, setAuthToken] = useLocalStorage("auth_token", null);

  const checkAuthToken = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify?auth_token=${token}`);

      if (response.ok) {
        /**
         * @TODO Explicity type this
         */
        // @ts-ignore
        setAuthToken(token);
      }
    } catch (err) {
      console.error(err);
      setAuthToken(null);
    }
  };

  useEffect(() => {
    if (authToken) {
      checkAuthToken(authToken);
    }
  }, [authToken]);

  if (!authToken) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={async (token: string) => {
            try {
              const response = await fetch(
                `/api/auth/verify?auth_token=${token}`
              );

              if (response.ok) {
                /**
                 * @TODO Explicity type this
                 */
                // @ts-ignore
                setAuthToken(token);
              }
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
};
