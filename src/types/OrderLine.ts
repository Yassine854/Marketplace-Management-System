import { z } from "zod";

export const orderLineSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  kamiounOrderId: z.string(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  productPrice: z.number(),
  totalPrice: z.number(),
  sku: z.string(),
});

export type OrderLine = z.infer<typeof orderLineSchema>;
