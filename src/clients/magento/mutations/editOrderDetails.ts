import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const editOrderDetails = async ({
  orderId,
  deliveryDate,
  items,
}: any): Promise<any> => {
  try {
    const data = {
      items: items,
      entity: {
        entity_id: orderId,
        extension_attributes: {
          delivery_date: deliveryDate,
        },
      },
    };
    await axios.magentoClient.put("orders/create", data);
  } catch (error) {
    logError(error);
    throw error;
  }
};
