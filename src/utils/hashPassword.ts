// import { hash } from "bcryptjs";

// export const hashPassword = async (password: string) => {
//   const hashedPassword = await hash(password, 8);
//   return hashedPassword;
// };

// Method to set salt and hash the password for a user
import crypto from "crypto";

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
};
