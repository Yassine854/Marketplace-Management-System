import { typesenseClient } from "../typesenseClient";
import { getOrderProductsNames } from "@/services/typesense/getOrderProductsNames";

export const updateOrder = async (order: any): Promise<any> => {
  typesenseClient
    .collections("orders")
    .documents(order.id)
    .update({ ...order, productsNames: getOrderProductsNames(order.items) });
};
