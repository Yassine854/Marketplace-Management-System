import * as z from "zod";

export const FormSchema = z
  .object({
    username: z.string().min(4, { message: "Required, at least 4 characters" }),
    // email: z
    //   .string()
    //   .email()
    //   .email({ message: "Invalid email address" })
    //   .or(z.literal("")),
    firstName: z.string().min(1, { message: "Required" }),
    lastName: z.string().min(1, { message: "Required" }),
    roleId: z.string(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
