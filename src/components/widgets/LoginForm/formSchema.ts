import * as z from "zod";

export const FormSchema = z.object({
  username: z.string().min(4, { message: "Please enter your username " }),
  password: z.string().min(6, { message: "Please enter your password " }),
});
