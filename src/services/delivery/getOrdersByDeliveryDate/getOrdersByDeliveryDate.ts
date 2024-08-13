import { magento } from "@/clients/magento";
import { typesense } from "@/clients/typesense";
import { logError } from "@/utils/logError";

export const getOrdersByDeliveryDate = async ({
  deliveryDate,
  storeId,
}: any): Promise<{ orders: any[]; count: number }> => {
  try {
    const orders: any = await magento.queries.getMilkRunOrdersByDate(
      deliveryDate,
    );

    if (!storeId) {
      return { orders: orders || [], count: orders?.length || 0 };
    }
    const filteredOrders = [];

    for (const order of orders) {
      //@ts-ignore
      const orderDetails = await typesense.orders.getOne(order?.order_id);

      //@ts-ignore
      if (orderDetails?.storeId === storeId) {
        filteredOrders.push(order);
      }
    }

    if (typeof orders === "string") {
      throw new Error(orders);
    }

    return { orders: filteredOrders, count: filteredOrders?.length || 0 };
  } catch (error: any) {
    logError(error);
    throw error;
  }
};
