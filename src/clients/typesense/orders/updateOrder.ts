import { typesenseClient } from "../typesenseClient";
import { getOrderProductsNames } from "@/services/typesense/getOrderProductsNames";
import { convertIsoDateToUnixTimestamp } from "@/utils/date/convertIsoDateToUnixTimestamp";
import { logError } from "@/utils/logError";

export const updateOrder = async ({
  total,
  items,
  orderId,
  deliveryDate,
}: any): Promise<any> => {
  try {
    const productNames = getOrderProductsNames(items);
    const unixTimeStampDeliveryDate =
      convertIsoDateToUnixTimestamp(deliveryDate);

    await typesenseClient.collections("orders").documents(orderId).update({
      total,
      items,
      orderId,
      id: orderId,
      productNames,
      deliveryDate: unixTimeStampDeliveryDate,
    });
  } catch (error: any) {
    logError(error);
    throw new Error(error);
  }
};
