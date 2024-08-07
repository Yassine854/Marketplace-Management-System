import { logError } from "@/utils/logError";
import { typesense } from "@/clients/typesense";

export const getOrdersByDeliveryDateTypesense = async (
  deliveryDate: number,
): Promise<{ orders: any[]; count: number }> => {
  try {
    const date = new Date(Number(deliveryDate) * 1000);

    // Set the time to the last second of the day
    date.setUTCHours(23, 59, 59, 999);

    // Get the new timestamp for the last second of the day
    const lastSecondTimestamp = Math.floor(date.getTime() / 1000);

    const res = await typesense.orders.getMany({
      filterBy: `deliveryDate:=[${deliveryDate}..${lastSecondTimestamp}]`,
    });

    return res;
  } catch (error: any) {
    logError(error);
    throw error;
  }
};
