import * as z from "zod";

export const FormSchema = z.object({
  username: z.string().min(4, { message: "Required , at least 4 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  firstName: z.string().min(1, { message: "Required " }),
  lastName: z.string().min(1, { message: "Required " }),
  role: z.string(),
  warehouses: z.array(z.string()).nonempty(),
});
