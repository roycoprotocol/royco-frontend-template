"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export const getVerifyUserQueryFunction = async ({
  token,
}: {
  token: string;
}) => {
  const res = await fetch(`/api/users/verify?token=${token}`);
  const data = await res.json();

  if (res.ok) {
    return data;
  }

  throw new Error(data.status);
};

export const useVerifyUser = () => {
  const params = useParams();
  const token = params.token;

  return useQuery({
    queryKey: ["verify-user", token],
    queryFn: () => getVerifyUserQueryFunction({ token: token as string }),
  });
};
