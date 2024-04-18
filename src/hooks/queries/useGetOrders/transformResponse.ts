import { Order } from "@/types/order";

export const transformResponse = (res: any) => {
  const orders: Order[] = [];
  res.forEach((element: any) => {
    const {
      entity_id,
      customer_firstname,
      customer_lastname,
      customer_id,
      subtotal,
      extension_attributes,
    }: any = element.document;
    const customerName = `${customer_firstname} ${customer_lastname}`;
    orders.push({
      id: entity_id,
      customer: { name: customerName, id: customer_id },
      total: subtotal,
      deliveryDate: extension_attributes.delivery_date,
    });
  });

  return orders;
};
