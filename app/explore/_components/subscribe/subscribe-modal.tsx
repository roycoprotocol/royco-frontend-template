"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/app/api/royco";
import { useState } from "react";
import toast from "react-hot-toast";
import { ErrorAlert, LoadingSpinner } from "@/components/composables";
import confetti from "canvas-confetti";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

const subscribeFormSchema = z.object({
  email: z.string().email({
    message: "Invalid Email Address",
  }),
});

export function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const subscribeForm = useForm<z.infer<typeof subscribeFormSchema>>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const triggerConfetti = () => {
    const defaults = {
      startVelocity: 14,
      spread: 360,
      ticks: 300,
      zIndex: 9999,
      particleCount: 30,
      scalar: 0.8,
      gravity: 0.5,
      drift: 0,
      decay: 0.96,
    };

    let animationFrame: number;
    const shower = () => {
      const particleCount = 8;
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: -0.1 },
      });

      animationFrame = requestAnimationFrame(shower);

      setTimeout(() => {
        cancelAnimationFrame(animationFrame);
      }, 500);
    };

    shower();
  };

  const onSubmit = async (data: z.infer<typeof subscribeFormSchema>) => {
    try {
      setIsLoading(true);
      await api.subscribeControllerSubscribeBoyco({
        email: data.email,
      });

      triggerConfetti();

      setIsSuccess(true);

      setTimeout(() => {
        window.location.href = "https://boyco.berachain.com/";
      }, 5000);
    } catch (error) {
      const message =
        (error as any)?.response?.data?.error?.message ||
        "Something went wrong";

      toast.custom(<ErrorAlert message={message} />);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      {isOpen && (
        <DialogContent className="p-0">
          <div className="relative w-full overflow-hidden rounded-2xl bg-z0 p-3 shadow sm:p-6">
            <div className="absolute left-0 right-0 top-0">
              <img src="/subscribe/modal-bg.png" alt="modal-bg" />
            </div>

            {isSuccess ? (
              <div className="relative z-10 mt-20 flex flex-col gap-6 sm:mt-[188px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>

                <div>
                  <PrimaryLabel className="font-ortica text-[40px] font-medium leading-3 tracking-[-2%]">
                    Success!
                  </PrimaryLabel>
                  <SecondaryLabel className="mt-2 break-normal text-base font-normal">
                    You've been successfully subscribed to Royco updates.
                  </SecondaryLabel>
                </div>

                <div className="flex justify-center">
                  <SecondaryLabel className="mt-2 break-normal text-xs font-normal text-tertiary">
                    You will be redirected to the Berachain.com in 5 seconds.
                  </SecondaryLabel>
                </div>
              </div>
            ) : (
              <Form {...subscribeForm}>
                <form
                  onSubmit={subscribeForm.handleSubmit(onSubmit)}
                  className="relative z-10 mt-20 flex flex-col gap-6 sm:mt-[188px]"
                >
                  <div>
                    <PrimaryLabel className="font-ortica text-[40px] font-medium leading-3 tracking-[-2%]">
                      Get updates on Royco
                    </PrimaryLabel>

                    <SecondaryLabel className="mt-2 break-normal text-base font-normal">
                      Recieve emails about the latest updates and features on Royco. 
                    </SecondaryLabel>
                  </div>

                  <FormField
                    control={subscribeForm.control}
                    name="email"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <div>
                              <PrimaryLabel className="text-sm font-normal">
                                Email
                              </PrimaryLabel>
                              <Input
                                placeholder="yourname@example.com"
                                className="text-base font-normal"
                                containerClassName="bg-z0 px-2 h-[42px] rounded-sm mt-1"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <div className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="h-10 w-full rounded-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <LoadingSpinner className="h-4 w-4" />
                      ) : (
                        <span>Signup</span>
                      )}
                    </Button>

                    <a
                      href="https://boyco.berachain.com/"
                      target="_blank"
                      className="w-full"
                    >
                      <Button
                        type="button"
                        className="h-10 w-full place-content-center rounded-sm"
                        variant="outline"
                      >
                        Skip & Claim from Berachain.com
                      </Button>
                    </a>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
