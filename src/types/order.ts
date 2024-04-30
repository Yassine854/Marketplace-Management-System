import { customerSchema } from "./customer";
import { orderLineSchema } from "./OrderLine";
import { z } from "zod";

const orderSchema = z.object({
  id: z.string(),
  customer: customerSchema,
  total: z.number(),
  deliveryDate: z.string(),
  isSelected: z.boolean(),
  lines: z.array(orderLineSchema),
});

export type Order = z.infer<typeof orderSchema>;
