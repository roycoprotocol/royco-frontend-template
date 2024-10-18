"use server";

export const checkPassword = async (password: string) => {
  if (
    process.env.PROTECTOR_PASSWORD?.toLowerCase() === password.toLowerCase()
  ) {
    return true;
  }

  return false;
};
