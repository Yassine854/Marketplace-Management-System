import * as z from "zod";

export const FormSchema = z.object({
  username: z.string().min(1, { message: "Please enter your username" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  telephone: z
    .string()
    .min(1, { message: "Please enter your telephone number" }),
  address: z.string().min(1, { message: "Please enter your address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  coverageArea: z
    .string()
    .min(1, { message: "Please enter the coverage area" }),
  minimumAmount: z
    .string()
    .min(1, { message: "Please enter the minimum amount" }),
});
