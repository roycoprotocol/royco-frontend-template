"use client";

import React from "react";
import "./partners.css";
import { cn } from "@/lib/utils";
import {
  AcapitalLogo,
  AmberLogo,
  CantinaLogo,
  HashedLogo,
  ImmunefiLogo,
  NfxLogo,
  SpearbitLogo,
} from "../assets";
import { SectionSubtitle, SectionTitle } from "./composables";

const centerClasses = "flex flex-col items-center justify-center";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type: "left" | "right";
  }
>(({ className, children, type, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "w-full ",
        "px-5 md:px-12 lg:px-[10.44rem]",
        "xl:max-w-[54.2525rem]",
        // type === "left"
        //   ? " items-end xl:pl-[12.44rem] xl:pr-[4.42rem]"
        //   : " items-start xl:pl-[4.42rem] xl:pr-[12.44rem]",
        className
      )}
      {...props}
    >
      <div className={cn("flex w-full flex-col ")}>{children}</div>
    </div>
  );
});

const Grid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    columns: number;
    initial?: boolean;
  }
>(({ className, children, columns, initial, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid w-full items-center",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        initial === true ? "mt-8 md:mt-12 lg:mt-[4.17rem]" : "mt-2 lg:mt-3",
        "gap-4 lg:gap-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const Block = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    name?: string;
    type: "left" | "right";
    blockIndex: number;
    blockLink?: string;
  }
>(
  (
    { className, name, blockLink, blockIndex = 0, children, type, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className="contents">
        <a
          href={blockLink ? blockLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
          className="contentes"
        >
          <div
            className={cn(
              "col-span-1 w-full rounded-md lg:rounded-[0.3125rem]",
              "h-28 md:h-32 lg:h-[10rem]",
              "cursor-pointer border border-transparent transition-all duration-200 ease-in-out hover:border-divider hover:opacity-80 hover:drop-shadow-sm",
              centerClasses,
              type === "left" ? "bg-[#f7f7f6]" : "bg-white",
              className
            )}
          >
            {children}
          </div>
        </a>
      </div>
    );
  }
);

const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type: "left" | "right";
  }
>(({ className, type, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full shrink-0 flex-col",
        "py-20 md:py-24 lg:py-28 xl:py-[8.25rem]",
        "col-span-2 xl:col-span-1",
        type === "left" ? "items-end bg-[#FDFDFA]" : "items-start bg-[#F5F5F5]",
        className
      )}
      {...props}
    />
  );
});

const PartnerList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    labels: {
      id: string;
      name: string;
      association?: string;
      nameLink?: string;
      associationLink?: string;
    }[];
    listIndex: number;
  }
>(({ className, listIndex, children, labels, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid w-full gap-[1.25rem]",
        labels.length === 2 && "grid-cols-2",
        labels.length === 3 && "grid-cols-3",
        "mt-8 lg:mt-[3.69rem]",

        className
      )}
      {...props}
    >
      {labels.map(
        ({ id, name, association, nameLink, associationLink }, labelIndex) => {
          const BASE_KEY = `home:partners:${id}`;

          return (
            <div
              key={BASE_KEY}
              className={cn(
                "flex  flex-col items-center text-center",
                "md:gap-1 lg:gap-[0.56rem]",
                "col-span-1 w-full"
              )}
            >
              {nameLink ? (
                <a
                  href={nameLink ? nameLink : "#"}
                  className="contents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className={cn(
                      "font-light leading-[1.3125rem] text-secondary",
                      "text-sm md:text-lg lg:text-xl",
                      "underline decoration-transparent decoration-dotted underline-offset-[6px] transition-all duration-200 ease-in-out hover:text-tertiary hover:decoration-tertiary/50"
                    )}
                  >
                    {name}
                  </div>
                </a>
              ) : (
                <div
                  className={cn(
                    "font-light leading-[1.3125rem] text-secondary",
                    "text-sm md:text-lg lg:text-xl"
                  )}
                >
                  {name}
                </div>
              )}

              <div
                className={cn(
                  "font-light leading-[1.3125rem] text-primary",
                  "text-sm md:text-lg lg:text-xl"
                )}
              >
                {association}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
});

export const Partners = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("font-gt text-black", className)}>
      {/* <Container type="left">
        <Card type="left">
          <SectionTitle>Backed by giants.</SectionTitle>

          <SectionSubtitle className="xl:min-h-14 xl:w-[27.9375rem]">
            Leading institutions and individuals who believe Action Markets
            should be more efficient.
          </SectionSubtitle>

          <Grid columns={2} initial={true}>
            <Block
              name="coinbase-ventures"
              blockLink="https://www.coinbase.com/"
              blockIndex={0}
              type="left"
            >
              <div>
                <img
                  src="/home/coinbase-ventures.png"
                  className="max-h-8 object-contain contrast-[300] grayscale-0 saturate-0 sm:max-h-10 lg:max-h-12 xl:max-h-14"
                />
              </div>
            </Block>

            <Block
              name="nfx"
              blockLink="https://www.nfx.com/"
              blockIndex={1}
              type="left"
            >
              <NfxLogo className="h-20 w-auto sm:h-24 lg:h-20 xl:h-[6.1875rem]" />
            </Block>

            <Block
              name="usc-veda"
              blockLink="https://www.marshall.usc.edu/institutes-and-centers/vaneck-digital-assets-initiative"
              blockIndex={2}
              type="left"
            >
              <div className="">
                <img
                  src="/home/usc-veda.png"
                  className="mt-2 max-h-20 object-contain grayscale sm:max-h-28 lg:max-h-28 xl:max-h-32"
                />
              </div>
            </Block>

            <Block
              name="hashed"
              blockLink="https://www.hashed.com/"
              blockIndex={3}
              type="left"
            >
              <HashedLogo className="h-16 w-auto sm:h-28 lg:h-24 xl:h-[6.91669rem]" />
            </Block>

            <Block
              name="a-capital"
              blockLink="https://acapital.com/"
              blockIndex={4}
              type="left"
            >
              <AcapitalLogo className="h-8 w-auto sm:h-14 lg:h-11 xl:h-[3.0625rem]" />
            </Block>

            <Block
              name="amber"
              blockLink="https://www.ambergroup.io/"
              blockIndex={5}
              type="left"
            >
              <AmberLogo className="h-9 w-auto sm:h-16 lg:h-14 xl:h-[3.9375rem]" />
            </Block>
          </Grid>

          <PartnerList
            listIndex={5}
            labels={[
              {
                id: "smokey",
                name: "Smokey the Bear",
                association: "Berachain",
                nameLink: "https://x.com/SmokeyTheBera",
                associationLink: "https://berachain.com/",
              },
              {
                id: "dcf",
                name: "DCF God",
                association: "DCF Capital",
                nameLink: "https://x.com/dcfgod",
                associationLink: "https://www.dcfcapitalpartners.com/",
              },
            ]}
          />
        </Card>
      </Container> */}

      <Container type="right" className="flex items-center">
        <Card type="right">
          <SectionTitle className="text-center">Serious security.</SectionTitle>

          <SectionSubtitle className="self-center text-center xl:w-[27.70131rem]">
            Peace of mind supported by audits from the world's leading security
            firms.
          </SectionSubtitle>

          <Grid columns={1} initial={true}>
            <Block
              name="spearbit"
              blockLink="https://spearbit.com/"
              blockIndex={0}
              type="right"
            >
              <SpearbitLogo className="h-8 w-auto sm:h-12 lg:h-12 xl:h-[3.1rem]" />
            </Block>

            <Block
              name="cantina"
              blockLink="https://cantina.xyz/"
              blockIndex={1}
              type="right"
            >
              <CantinaLogo className="h-5 w-auto sm:h-6 lg:h-[1.5rem] xl:h-[1.575rem]" />
            </Block>

            <Block
              name="immunefi"
              blockLink="https://immunefi.com/"
              blockIndex={2}
              type="right"
            >
              <ImmunefiLogo className="xl:h-[ 3.75rem] h-8 w-auto sm:h-12 lg:h-10" />
            </Block>
          </Grid>

          <PartnerList
            listIndex={3}
            labels={[
              {
                id: "alcueca",
                name: "Alcueca",
              },
              {
                id: "0xweiss",
                name: "0xWeiss",
              },
            ]}
          />
        </Card>
      </Container>
    </div>
  );
});
