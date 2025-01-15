export const generateAuthToken = async ({ user_id }: { user_id: string }) => {
  const token = await crypto.randomBytes(32).toString("hex");
  return token;
};
