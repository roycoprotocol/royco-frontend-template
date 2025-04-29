"use server";

export const checkPassword = async (password: string) => {
  const protection = process.env.PROTECTOR_PASSWORD;

  if (protection?.toLowerCase() === password.toLowerCase()) {
    return true;
  }

  return false;
};
