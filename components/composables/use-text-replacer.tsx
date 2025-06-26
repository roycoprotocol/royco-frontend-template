"use client";

import { useEffect, useRef } from "react";

interface TextReplacement {
  target: string;
  replacement: string;
}

interface UseTextReplacerOptions {
  replacements: TextReplacement[];
  selectors?: string[];
  interval?: number;
  maxAttempts?: number;
}

export function useTextReplacer({
  replacements,
  selectors = ["[data-rk]", "body"],
  interval = 1000,
  maxAttempts = 10,
}: UseTextReplacerOptions) {
  const attemptsRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasProcessedRef = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const replaceText = () => {
      if (attemptsRef.current >= maxAttempts) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      attemptsRef.current++;

      let foundAny = false;

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);

        elements.forEach((element) => {
          replacements.forEach(({ target, replacement }) => {
            if (element.textContent?.includes(target)) {
              const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null
              );

              let textNode;
              while ((textNode = walker.nextNode())) {
                if (textNode.textContent?.includes(target)) {
                  textNode.textContent = textNode.textContent.replace(
                    target,
                    replacement
                  );
                  foundAny = true;
                }
              }
            }
          });
        });
      });

      if (foundAny) {
        hasProcessedRef.current = true;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    // Reset state when modal content changes
    const resetState = () => {
      hasProcessedRef.current = false;
      attemptsRef.current = 0;

      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Start new replacement cycle
      replaceText();
      if (!hasProcessedRef.current) {
        intervalRef.current = setInterval(replaceText, interval);
      }
    };

    // Set up click listener for connect buttons
    const handleClick = (event: Event) => {
      const target = event.target as Element;
      if (
        target.textContent?.includes("Connect") ||
        target.closest('[data-testid*="connect"]')
      ) {
        // Reset state when connect button is clicked
        setTimeout(resetState, 200);
      }
    };

    document.addEventListener("click", handleClick);

    // Set up MutationObserver to watch for modal changes
    observerRef.current = new MutationObserver((mutations) => {
      let shouldReset = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if this is a RainbowKit modal or contains auth text
              if (
                element.getAttribute("data-rk") ||
                element.textContent?.includes("Verify your account") ||
                element.querySelector("[data-rk]") ||
                element.querySelector('*[class*="auth"]')
              ) {
                shouldReset = true;
              }
            }
          });

          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if modal was removed
              if (element.getAttribute("data-rk")) {
                shouldReset = true;
              }
            }
          });
        }
      });

      if (shouldReset) {
        // Small delay to ensure content is fully loaded
        setTimeout(resetState, 100);
      }
    });

    // Observe the entire document for modal changes
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "data-rk"],
    });

    // Initial replacement attempt
    replaceText();
    if (!hasProcessedRef.current) {
      intervalRef.current = setInterval(replaceText, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      document.removeEventListener("click", handleClick);
    };
  }, [replacements, selectors, interval, maxAttempts]);

  return {
    isProcessed: hasProcessedRef.current,
    attempts: attemptsRef.current,
  };
}
