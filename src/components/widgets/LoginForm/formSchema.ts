import * as z from "zod";

export const FormSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});
