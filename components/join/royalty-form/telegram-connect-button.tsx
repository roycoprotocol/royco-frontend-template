"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";

declare global {
  interface Window {
    TelegramLoginWidget: any;
  }
}

window.TelegramLoginWidget = window.TelegramLoginWidget || {};

export const TelegramConnectButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    botUsername: string;
    onAuthCallback: (data: any) => void;
  }
>(({ className, botUsername, onAuthCallback, ...props }, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    window.TelegramLoginWidget = {
      dataOnauth: (user: any) => onAuthCallback(user),
    };
    script.src = "https://telegram.org/js/telegram-widget.js?4";
    script.setAttribute("data-telegram-login", "royco_verification_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)");
    script.async = true;
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }
  }, [botUsername, onAuthCallback]);

  return (
    <div className="relative h-12 w-full">
      <div className="pointer-events-none absolute inset-0 z-20 h-12 w-full">
        <Button
          type="button"
          className="pointer-events-none z-10 h-12 w-full border border-divider bg-z2 text-base text-black"
          onClick={() => {
            // do nothing
          }}
        >
          Connect Telegram
        </Button>
      </div>

      <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center">
        <div className="bg-red-500 opacity-50" ref={containerRef} />
      </div>
    </div>
  );
});
