"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const subscribeFormSchema = z.object({
  email: z.string().email({
    message: "Invalid Email Address",
  }),
});

export const GetUpdatesButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const subscribeForm = useForm<z.infer<typeof subscribeFormSchema>>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof subscribeFormSchema>) => {
    window.open(
      `https://paragraph.xyz/@royco/subscribe?email=${encodeURIComponent(
        data.email
      )}&source_embed=true`,
      "_blank"
    );
  };

  return (
    <Popover>
      <PopoverTrigger>
        {/* <MotionWrapper> */}
        <Button
          className={cn(
            "flex w-fit flex-col items-center justify-center font-gt font-400 hover:opacity-100",
            "text-xs md:text-sm",
            "rounded-md md:rounded-[0.4375rem]",
            "px-3 py-1 md:px-[0.98rem] md:py-[0.45rem]",
            className
          )}
          // {...props}
        >
          <div className="h-5 md:h-5">
            <span className="leading-5 md:leading-5">Get Updates</span>
          </div>
        </Button>
        {/* </MotionWrapper> */}
      </PopoverTrigger>
      <PopoverContent className="z-[999] flex w-80 flex-col rounded-xl">
        <Form {...subscribeForm}>
          <form onSubmit={subscribeForm.handleSubmit(onSubmit)}>
            <div className="font-gt text-lg font-500 text-black">
              Sign up for Royco Updates
            </div>
            <div className="mt-2 font-gt text-base font-300 leading-tight text-secondary">
              Get alerts for new updates to Royco, new Markets and more.
            </div>

            <FormField
              control={subscribeForm.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Email"
                        containerClassName="bg-z2 mt-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* <Input
              value={subscribeForm.watch("email")}
              onChange={(e) => subscribeForm.setValue("email", e.target.value)}
              placeholder="Enter Email"
              containerClassName="bg-z2 mt-5"
            /> */}

            <Button type="submit" className="mt-2 h-9 px-0 text-base">
              Subscribe
            </Button>

            {/* <div
            onClick={() => {
              console.log("clicked");
              window.open(
                `https://paragraph.xyz/@royco/subscribe?email=${encodeURIComponent(
                  "test@gmail.com"
                )}&source_embed=true`,
                "_blank"
              );
            }}
          >
            click me
          </div> */}

            {/* <iframe
            src="https://paragraph.xyz/@royco/embed?minimal=true"
            className="mt-5 h-12 w-full"
          ></iframe> */}
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
});

export const GetUpdatesStrip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const subscribeForm = useForm<z.infer<typeof subscribeFormSchema>>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof subscribeFormSchema>) => {
    window.open(
      `https://paragraph.xyz/@royco/subscribe?email=${encodeURIComponent(
        data.email
      )}&source_embed=true`,
      "_blank"
    );
  };

  return (
    <div
      className={cn(
        "flex h-fit  flex-row items-center overflow-hidden border border-divider bg-white p-1 xl:w-[25rem]",
        "rounded-lg md:rounded-[0.5375rem]",
        className
      )}
    >
      <Input
        value={subscribeForm.watch("email")}
        onChange={(e) => subscribeForm.setValue("email", e.target.value)}
        placeholder="Enter Email"
        containerClassName="bg-z2 border-none bg-transparent h-8 grow"
        className="text-xs md:text-sm"
      />

      <Button
        onClick={() => {
          window.open(
            `https://paragraph.xyz/@royco/subscribe?email=${encodeURIComponent(
              subscribeForm.watch("email")
            )}&source_embed=true`,
            "_blank"
          );
        }}
        size="sm"
        className={cn(
          "flex w-fit flex-col items-center justify-center font-gt font-400 hover:opacity-100",
          "text-xs md:text-sm",
          "rounded-md md:rounded-[0.4375rem]",
          "px-3 py-1 md:px-[0.98rem] md:py-[0.45rem]"
          // "rounded-full"
        )}
        // {...props}
      >
        <div className="h-5 md:h-5">
          <span className="leading-5 md:leading-5">Get Updates</span>
        </div>
      </Button>
    </div>
  );
});
