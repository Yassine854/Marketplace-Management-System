import { customerSchema } from "./customer";
import { z } from "zod";

const orderSchema = z.object({
  id: z.string(),
  customer: customerSchema,
  total: z.number(),
  deliveryDate: z.string(),
});

export type Order = z.infer<typeof orderSchema>;
