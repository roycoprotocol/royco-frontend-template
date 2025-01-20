import { useQuery } from "@tanstack/react-query";

export const useAuthValidate = ({
  signed_message,
  account_address,
}: {
  signed_message: string;
  account_address: string;
}) => {
  return useQuery({
    queryKey: ["sign_in_token"],
    queryFn: () =>
      fetch("/api/auth/validate", {
        method: "POST",
        body: JSON.stringify({ signed_message, account_address }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
  });
};
