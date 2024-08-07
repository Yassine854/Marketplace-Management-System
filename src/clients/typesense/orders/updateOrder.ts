import { typesenseClient } from "../typesenseClient";

export const updateOrder = async (order: any): Promise<any> => {
  console.log("🚀 ~ updateOrder ~ order:", order);
  typesenseClient.collections("orders").documents(order.id).update(order);
};
