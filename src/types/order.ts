import { orderLineSchema } from "./OrderLine";
import { z } from "zod";

const orderSchema = z.object({
  id: z.string(),
  kamiounId: z.string(),
  state: z.string(),
  status: z.string(),
  total: z.number(),
  createdAt: z.number(),
  customerId: z.string(),
  customerFirstname: z.string(),
  customerLastname: z.string(),
  deliveryAgentId: z.string(),
  deliveryAgent: z.string(),
  deliveryDate: z.number(),
  deliveryStatus: z.string(),
  source: z.string(),
  lines: z.array(orderLineSchema),
});

export type Order = z.infer<typeof orderSchema>;
