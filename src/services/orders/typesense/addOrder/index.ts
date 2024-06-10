import { typesenseClient } from "@/libs/typesense";
import { Order } from "@/types/order";
import { logError } from "@/utils/logError";

export const addOrder = async (order: Order) => {
  try {
    console.log(order);
  } catch (error) {
    logError(error);
  }
};
