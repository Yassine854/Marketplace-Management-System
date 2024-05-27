import { hashPassword } from "./hashPassword";

export const isPasswordValid = (
  password: string,
  storedPassword: string,
): boolean => {
  const strHash = hashPassword(password);

  return strHash === storedPassword;
};
