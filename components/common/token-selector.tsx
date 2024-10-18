import { TokenDisplayer } from "./token-displayer";
import { FallMotion } from "../animations";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

export type DisplayToken = {
  id: string;
  symbol: string;
  image: string;
};

export const TokenSelector = ({
  customKey,
  options,
  selected,
  onValueChange,
}: {
  customKey?: string;
  options: Array<DisplayToken>;
  selected: Array<DisplayToken>;
  onValueChange: (value: string) => void;
}) => {
  const [focusedToken, setFocusedToken] = useState<null | string>(null);

  return (
    <Select onValueChange={onValueChange} value={selected[0].id}>
      <SelectTrigger className="h-10 w-fit border-none">
        <div className="relative w-fit">
          <FallMotion
            height="2.5rem"
            containerClassName=""
            motionClassName="flex flex-col items-start"
            contentClassName="body-2"
          >
            <TokenDisplayer tokens={selected} symbols={true} />
          </FallMotion>
          <TokenDisplayer
            tokens={selected}
            symbols={true}
            className="h-0 pr-1 opacity-0"
          />
        </div>
      </SelectTrigger>

      <SelectContent align="end" className="min-w-40">
        <ul className="list">
          {options.map((token, index) => (
            <motion.li
              layout
              initial={false}
              key={`select-token:${customKey ?? "default"}:${token.id}:index:${index}`}
              tabIndex={0}
              className="relative w-full cursor-pointer text-center transition-colors duration-200 ease-in-out"
              onHoverStart={() => setFocusedToken(token.id)}
              onHoverEnd={() => setFocusedToken(null)}
            >
              {focusedToken === token.id ? (
                <motion.div
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    type: "spring",
                    bounce: 0,
                  }}
                  layoutId={`${customKey}:select-token:indicator`}
                  className="absolute inset-0 z-0 rounded-[0.25rem] bg-focus"
                ></motion.div>
              ) : null}
              <SelectItem
                key={`select-token:token:${token.id}:index:${index}`}
                className={cn(
                  "body-2 z-10 transition-colors duration-200 ease-in-out focus:bg-transparent",
                  focusedToken === token.id ? "text-black" : "text-primary"
                )}
                value={token.id}
              >
                <TokenDisplayer
                  className="text-inherit"
                  tokens={[token]}
                  symbols={true}
                />
              </SelectItem>
            </motion.li>
          ))}
        </ul>
      </SelectContent>
    </Select>
  );
};
