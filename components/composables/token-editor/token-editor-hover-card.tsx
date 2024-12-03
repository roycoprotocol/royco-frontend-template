import { cn } from "@/lib/utils";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { TokenEditorSchema } from "./token-editor-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";

export const TokenEditorHoverCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const TokenEditorForm = useForm<z.infer<typeof TokenEditorSchema>>({
    resolver: zodResolver(TokenEditorSchema),
  });

  const onSubmit = (data: z.infer<typeof TokenEditorSchema>) => {};

  return (
    <HoverCard>
      <HoverCardTrigger asChild></HoverCardTrigger>
      <HoverCardContent className="w-80">
        <Form {...TokenEditorForm}>
          <form onSubmit={TokenEditorForm.handleSubmit(onSubmit)}></form>
        </Form>
      </HoverCardContent>
    </HoverCard>
  );
});
