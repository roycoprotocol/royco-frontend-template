// "use client";

// import React from "react";

// import { cn } from "@/lib/utils";

// import { z } from "zod";
// import {
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { type UseFormReturn } from "react-hook-form";

// import { Input } from "@/components/ui/input";

// import { RoyaltyFormSchema } from "./royality-form-schema";
// import { FormInputLabel } from "@/components/composables";

// export const FormTelegram = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & {
//     royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
//   }
// >(({ className, royaltyForm, ...props }, ref) => {
//   return (
//     <FormField
//       control={royaltyForm.control}
//       name="telegram"
//       render={({ field }) => (
//         <FormItem className={cn("", className)}>
//           <FormInputLabel className="mb-2" label="Telegram" />

//           <FormControl>
//             <Input className="w-full" placeholder="royco_ranger" {...field} />
//           </FormControl>

//           <FormDescription className="mt-2">
//             Your telegram username. <i>Optional.</i>
//           </FormDescription>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// });
