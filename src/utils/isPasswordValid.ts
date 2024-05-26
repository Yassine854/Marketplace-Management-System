import crypto from "crypto";

export const isPasswordValid = (
  password: string,
  storedHash: string,
  storedSalt: string,
): boolean => {
  const hash = crypto
    .pbkdf2Sync(password, storedSalt, 1000, 64, "sha512")
    .toString("hex");

  return storedHash === hash;
};
