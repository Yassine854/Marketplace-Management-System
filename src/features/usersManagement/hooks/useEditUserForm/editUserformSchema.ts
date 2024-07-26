import * as z from "zod";

export const editUserFormSchema = z
  .object({
    roleId: z.string({ required_error: "Required" }),
    lastName: z.string().min(1, { message: "Required" }),
    firstName: z.string().min(1, { message: "Required" }),
    password: z.string().optional(),
    // .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })

  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
