//import crypto from "crypto";

export const isPasswordValid = (
  password: string,
  storedPassword: string,
): boolean => {
  // const hash = crypto
  //   .pbkdf2Sync(password, storedSalt, 1000, 64, "sha512")
  //   .toString("hex");

  return storedPassword === password;
};
