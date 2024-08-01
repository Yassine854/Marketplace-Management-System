import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";

export const getOrdersByDeliveryDate = async (
  deliveryDate: number,
): Promise<{ orders: any[]; count: number }> => {
  try {
    const orders: any[] = await magento.queries.getMilkRunOrdersByDate(
      deliveryDate,
    );

    if (typeof orders === "string") {
      throw new Error(orders);
    }

    return { orders, count: orders?.length || 0 };
  } catch (error: any) {
    logError(error);
    throw error;
  }
};
